import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import Booking from "./models/Booking.js";

dotenv.config();

const app = express();

// ================= CORS FIX (Vercel + Local + Render) =================
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://zesty-mauve.vercel.app",
    ],
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

app.options("*", cors());

app.use(express.json());

// ================= SAFETY LOG =================
app.use((req, res, next) => {
  console.log("➡️", req.method, req.url);
  next();
});

// ================= ENV SAFETY CHECK =================
const MONGO_URI = process.env.MONGO_URI;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

// ================= EMAIL TRANSPORT (SAFE) =================
let transporter = null;

if (EMAIL_USER && EMAIL_PASS) {
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });
} else {
  console.log("⚠️ Email credentials missing (email disabled)");
}

// ================= DB CONNECT (NON-CRASHING) =================
if (MONGO_URI) {
  mongoose
    .connect(MONGO_URI)
    .then(() => console.log("MongoDB connected ✅"))
    .catch((err) =>
      console.log("MongoDB connection error (non-fatal):", err.message)
    );
} else {
  console.log("❌ MONGO_URI missing (DB not connected)");
}

// ================= CONFIG =================
const MAX_CAPACITY = 20;

// ================= ROUTES =================
app.get("/", (req, res) => {
  res.send("ZESTY backend running 🍋");
});

app.post("/book", async (req, res) => {
  try {
    const { name, email, guests, date, time } = req.body;

    const guestCount = parseInt(guests, 10);
    const cleanTime = time?.slice(0, 5);

    // ================= VALIDATION =================
    if (!name || !email || !date || !cleanTime) {
      return res.status(400).json({
        error: "Please fill in all fields",
      });
    }

    if (isNaN(guestCount) || guestCount <= 0) {
      return res.status(400).json({
        error: "Invalid guests number",
      });
    }

    // ================= SLOT CHECK =================
    const existingBookings = await Booking.find({
      date,
      time: cleanTime,
    });

    const totalGuests = existingBookings.reduce(
      (sum, b) => sum + Number(b.guests),
      0
    );

    if (totalGuests + guestCount > MAX_CAPACITY) {
      return res.status(400).json({
        error: "This time slot is fully booked. Please choose another time.",
      });
    }

    // ================= SAVE BOOKING =================
    await Booking.create({
      name,
      email,
      guests: guestCount,
      date,
      time: cleanTime,
    });

    // ================= EMAIL (SAFE) =================
    if (transporter) {
      try {
        await transporter.sendMail({
          from: `"ZESTY 🍋" <${EMAIL_USER}>`,
          to: email,
          subject: "Booking Confirmed 🍋",
          text: `Hi ${name}, your booking is confirmed for ${date} at ${cleanTime}.`,
        });
      } catch (err) {
        console.log("Email failed (ignored):", err.message);
      }
    }

    return res.status(200).json({
      message: "Booking confirmed!",
    });
  } catch (error) {
    console.error("SERVER ERROR:", error);
    return res.status(500).json({
      error: "Server error",
    });
  }
});

// ================= START SERVER =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
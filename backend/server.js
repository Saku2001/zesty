import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import Booking from "./models/Booking.js";

dotenv.config();

const app = express();

// ================= GLOBAL CORS FIX (CRITICAL) =================
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://zesty-mauve.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(null, false);
      }
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

// MUST handle preflight
app.options("*", cors());

app.use(express.json());

// ================= DEBUG (IMPORTANT FOR YOU) =================
app.use((req, res, next) => {
  console.log("➡️", req.method, req.url);
  next();
});

// ================= EMAIL =================
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

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
      return res.status(400).json({ error: "Please fill in all fields" });
    }

    if (isNaN(guestCount) || guestCount <= 0) {
      return res.status(400).json({ error: "Invalid guests value" });
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

    // ================= SAVE =================
    await Booking.create({
      name,
      email,
      guests: guestCount,
      date,
      time: cleanTime,
    });

    // ================= EMAIL (NON BLOCKING) =================
    try {
      await transporter.sendMail({
        from: `"ZESTY 🍋" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Booking Confirmed 🍋",
        text: `Hi ${name}, your booking is confirmed for ${date} at ${cleanTime}.`,
      });
    } catch (err) {
      console.log("Email error (ignored):", err.message);
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

// ================= DB (SAFE CONNECTION) =================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) => console.log("MongoDB error:", err.message));

// ================= RENDER PORT FIX =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
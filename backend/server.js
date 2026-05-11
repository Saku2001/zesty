import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import Booking from "./models/Booking.js";

dotenv.config();

const app = express();

// ================= BASIC MIDDLEWARE =================
app.use(express.json());

// ================= SAFE CORS =================
app.use(
  cors({
    origin: "*", // TEMP: remove all CORS issues during debugging
    methods: ["GET", "POST", "OPTIONS"],
  })
);

app.options("*", cors());

// ================= DEBUG STARTUP =================
console.log("🚀 Server starting...");
console.log("MONGO_URI exists:", !!process.env.MONGO_URI);
console.log("EMAIL_USER exists:", !!process.env.EMAIL_USER);

// ================= SAFE DB CONNECT =================
try {
  if (process.env.MONGO_URI) {
    mongoose
      .connect(process.env.MONGO_URI)
      .then(() => console.log("MongoDB connected ✅"))
      .catch((err) =>
        console.log("MongoDB error (non-fatal):", err.message)
      );
  } else {
    console.log("❌ MONGO_URI missing");
  }
} catch (err) {
  console.log("DB crash prevented:", err.message);
}

// ================= EMAIL (SAFE INIT) =================
let transporter = null;

try {
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    const nodemailer = await import("nodemailer");

    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
} catch (err) {
  console.log("Email setup failed (ignored)");
}

// ================= CONSTANT =================
const MAX_CAPACITY = 20;

// ================= HEALTH CHECK =================
app.get("/", (req, res) => {
  res.send("ZESTY backend running 🍋");
});

// ================= BOOKING =================
app.post("/book", async (req, res) => {
  try {
    const { name, email, guests, date, time } = req.body;

    if (!name || !email || !guests || !date || !time) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const guestCount = Number(guests);
    const cleanTime = time.slice(0, 5);

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
        error: "This time slot is fully booked",
      });
    }

    await Booking.create({
      name,
      email,
      guests: guestCount,
      date,
      time: cleanTime,
    });

    // EMAIL SAFE
    if (transporter) {
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: email,
          subject: "Booking Confirmed 🍋",
          text: `Hi ${name}, your booking is confirmed.`,
        });
      } catch (err) {
        console.log("Email failed:", err.message);
      }
    }

    return res.json({ message: "Booking confirmed" });
  } catch (err) {
    console.log("SERVER CRASH:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// ================= FORCE SAFE START =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
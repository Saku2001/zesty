import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import Booking from "./models/Booking.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// ================= ENV =================
const MONGO_URI = process.env.MONGO_URI;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

// ================= EMAIL TRANSPORT (FIXED) =================
let transporter = null;

if (EMAIL_USER && EMAIL_PASS) {
  try {
    transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587, // ✅ FIX: more stable than 465 on Render
      secure: false, // ✅ REQUIRED for port 587
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS, // MUST be Gmail App Password
      },
    });

    console.log("Email transporter ready ✅");
  } catch (err) {
    console.log("Email init failed (ignored)", err.message);
  }
} else {
  console.log("⚠️ Email credentials missing");
}

// ================= DATABASE =================
if (MONGO_URI) {
  mongoose
    .connect(MONGO_URI)
    .then(() => console.log("MongoDB connected ✅"))
    .catch((err) =>
      console.log("MongoDB error (non-fatal):", err.message)
    );
} else {
  console.log("❌ Mongo URI missing");
}

// ================= CONFIG =================
const MAX_CAPACITY = 20;

// ================= HEALTH CHECK =================
app.get("/", (req, res) => {
  res.send("ZESTY backend is running 🍋");
});

// ================= BOOKING =================
app.post("/book", async (req, res) => {
  try {
    const { name, email, guests, date, time } = req.body;

    const guestCount = Number(guests);

    // validation
    if (!name || !email || !date || !time || !guestCount) {
      return res.status(400).json({ error: "Missing fields" });
    }

    // check existing bookings
    const existingBookings = await Booking.find({ date, time });

    const totalGuests = existingBookings.reduce(
      (sum, b) => sum + Number(b.guests),
      0
    );

    // capacity check
    if (totalGuests + guestCount > MAX_CAPACITY) {
      return res.status(400).json({
        error: "This time slot is fully booked. Please choose another time.",
      });
    }

    // save booking
    await Booking.create({
      name,
      email,
      guests: guestCount,
      date,
      time,
    });

    // send email (safe)
    if (transporter) {
      try {
        await transporter.sendMail({
          from: `"ZESTY 🍋" <${EMAIL_USER}>`,
          to: email,
          subject: "Reservation Confirmed 🍋",
          text: `Hi ${name}, your booking is confirmed for ${date} at ${time}.`,
        });

        console.log("Email sent ✅");
      } catch (err) {
        console.log("EMAIL ERROR:", err.message);
      }
    }

    return res.json({ message: "Booking confirmed!" });
  } catch (error) {
    console.error("SERVER ERROR:", error);
    return res.status(500).json({ error: "Server error" });
  }
});

// ================= START SERVER =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
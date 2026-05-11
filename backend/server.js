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

// ================= SAFETY CHECK =================
const MONGO_URI = process.env.MONGO_URI;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

// ================= EMAIL (SAFE INIT) =================
let transporter = null;

if (EMAIL_USER && EMAIL_PASS) {
  try {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });
  } catch (err) {
    console.log("Email init failed (ignored)");
  }
} else {
  console.log("⚠️ Email credentials missing");
}

// ================= DB (SAFE CONNECT) =================
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

// ================= TEST ROUTE =================
app.get("/", (req, res) => {
  res.send("ZESTY backend is running 🍋");
});

// ================= BOOKING =================
app.post("/book", async (req, res) => {
  try {
    const { name, email, guests, date, time } = req.body;

    const guestCount = Number(guests);

    if (!name || !email || !date || !time) {
      return res.status(400).json({ error: "Missing fields" });
    }

    // ================= SLOT CHECK =================
    const existingBookings = await Booking.find({ date, time });

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
      time,
    });

    // ================= EMAIL (SAFE) =================
    if (transporter) {
      try {
        await transporter.sendMail({
          from: `"ZESTY 🍋" <${EMAIL_USER}>`,
          to: email,
          subject: "Reservation Confirmed 🍋",
          text: `Hi ${name}, your booking is confirmed for ${date} at ${time}.`,
        });
      } catch (err) {
        console.log("EMAIL ERROR:", err);
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
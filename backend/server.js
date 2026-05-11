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

// ================= EMAIL SETUP =================
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ================= CONFIG =================
const MAX_CAPACITY = 20;

// ================= TEST ROUTE =================
app.get("/", (req, res) => {
  res.send("ZESTY backend is running 🍋");
});

// ================= EMAIL TEST =================
app.get("/test-email", async (req, res) => {
  try {
    await transporter.sendMail({
      from: `"ZESTY 🍋" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: "Test Email",
      text: "Email working 🍋",
    });

    res.send("Test email sent!");
  } catch (err) {
    console.error("Email test failed:", err);
    res.status(500).send("Email failed");
  }
});

// ================= BOOKING ROUTE =================
app.post("/book", async (req, res) => {
  try {
    let { name, email, guests, date, time } = req.body;

    console.log("Booking received:", req.body);

    // 🔥 Normalize values
    const guestCount = parseInt(guests, 10);
    const normalizedTime = time ? time.slice(0, 5) : time;

    // ================= VALIDATION =================
    if (!name || !email || !date || !normalizedTime) {
      return res.status(400).json({
        error: "Please fill in all fields",
      });
    }

    if (isNaN(guestCount) || guestCount <= 0) {
      return res.status(400).json({
        error: "Invalid number of guests",
      });
    }

    // ================= CHECK EXISTING BOOKINGS =================
    const existingBookings = await Booking.find({
      date,
      time: normalizedTime,
    });

    const totalGuests = existingBookings.reduce(
      (sum, b) => sum + Number(b.guests),
      0
    );

    console.log("Current slot guests:", totalGuests);
    console.log("New booking guests:", guestCount);

    // ================= CAPACITY CHECK =================
    if (totalGuests + guestCount > MAX_CAPACITY) {
      return res.status(400).json({
        error: "This time slot is fully booked. Please choose another time.",
      });
    }

    // ================= SAVE BOOKING =================
    const booking = await Booking.create({
      name,
      email,
      guests: guestCount,
      date,
      time: normalizedTime,
    });

    console.log("Booking saved ✅", booking._id);

    // ================= EMAIL (SAFE) =================
    try {
      await transporter.sendMail({
        from: `"ZESTY 🍋" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Your Reservation is Confirmed 🍋",
        text: `Hello ${name},

Your booking at ZESTY is confirmed!

Guests: ${guestCount}
Date: ${date}
Time: ${normalizedTime}

See you soon 🍋`,
      });

      console.log("Email sent ✅");
    } catch (emailError) {
      console.error("Email failed (non-blocking):", emailError);
    }

    // ================= RESPONSE =================
    return res.status(200).json({
      message: "Booking confirmed!",
    });
  } catch (error) {
    console.error("BOOKING ERROR:", error);

    return res.status(500).json({
      error: "Server error",
    });
  }
});

// ================= DATABASE =================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) =>
    console.log("MongoDB connection failed:", err.message)
  );

// ================= START SERVER =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
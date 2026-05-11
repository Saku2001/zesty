import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import Booking from "./models/Booking.js";

dotenv.config();

console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS);

const app = express();

app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const MAX_CAPACITY = 20;

// ✅ TEST ROUTE
app.get("/", (req, res) => {
  res.send("ZESTY backend is running 🍋");
});

app.get("/test-email", async (req, res) => {
  try {
    await transporter.sendMail({
      from: `"ZESTY 🍋" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // send to yourself first
      subject: "Test Email from Zesty 🍋",
      text: "If you get this, email works!",
    });
    res.send("Test email sent!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Email failed");
  }
});

app.post("/book", async (req, res) => {
  try {
    const { name, email, guests, date, time } = req.body;

    console.log("Booking received:", req.body);

const guestCount = Number(guests);

// ✅ Proper validation
if (!name || !email || !date || !time || guests === "") {
  return res.status(400).json({
    error: "Please fill in all fields",
  });
}

if (isNaN(guestCount) || guestCount <= 0) {
  return res.status(400).json({
    error: "Invalid number of guests",
  });
}

    // ✅ Find existing bookings for this slot
    const existingBookings = await Booking.find({ date, time });

    // ✅ Count total guests already booked
    const totalGuests = existingBookings.reduce(
      (sum, b) => sum + Number(b.guests),
      0
    );

    console.log("Current guests in slot:", totalGuests);
    console.log("New booking guests:", guestCount);

    // ❌ Capacity exceeded
    if (totalGuests + guestCount > MAX_CAPACITY) {
      return res.status(400).json({
        error:
          "This time slot is fully booked. Please choose another time.",
      });
    }

    // ✅ Save booking
    const booking = await Booking.create({
      name,
      email,
      guests: guestCount,
      date,
      time,
    });

    console.log("Booking saved ✅", booking._id);

    // ✅ Send email safely
    try {
      await transporter.sendMail({
        from: `"ZESTY 🍋" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Your Reservation is Confirmed 🍋",
        text: `Hello ${name},

Your booking at ZESTY is confirmed!

Guests: ${guestCount}
Date: ${date}
Time: ${time}

We look forward to serving you 🍋`,
      });

      console.log("Email sent ✅");
    } catch (emailError) {
      console.error("Email failed:", emailError);
    }

    // ✅ Success response
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
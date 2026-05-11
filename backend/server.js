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

    // ⏱️ Create 1-hour window
    const existingBookings = await Booking.find({ date, time });

// total guests already booked in THIS exact slot
const totalGuests = existingBookings.reduce(
  (sum, b) => sum + Number(b.guests),
  0
);

console.log("Current guests in slot:", totalGuests);

    // ➕ Count total guests already booke



    // ❌ If capacity exceeded
    if (totalGuests + guestCount > MAX_CAPACITY) {
      return res.status(400).json({
        error: "This time slot is fully booked. Please choose another time.",
      });
    }

    // ✅ Save booking
    await Booking.create({
      name,
      email,
      guests: guestCount,
      date,
      time,
    });

    // 📧 Send email
    await transporter.sendMail({
      from: `"ZESTY 🍋" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Reservation is Confirmed 🍋",
      text: `Hello ${name}, Your booking at ZESTY is confirmed! Guests: ${guestCount} Date: ${date} Time: ${time}`,
    });

    res.status(200).json({ message: "Booking confirmed!" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});
// ✅ CONNECT DB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) => console.log("MongoDB connection failed:", err.message));

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
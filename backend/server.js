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

// ================= HEALTH CHECK =================
app.get("/", (req, res) => {
  res.send("ZESTY backend running 🍋");
});

// ================= BOOK =================
app.post("/book", async (req, res) => {
  try {
    const { name, email, guests, date, time } = req.body;

    console.log("REQ BODY:", req.body);

    const guestCount = Number(guests);
    const cleanTime = time?.slice(0, 5);

    // 🔥 CREATE FIXED SLOT KEY (IMPORTANT FIX)
    const slotKey = `${date}_${cleanTime}`;

    // ================= VALIDATION =================
    if (!name || !email || !date || !cleanTime) {
      return res.status(400).json({
        error: "Please fill in all fields",
      });
    }

    if (isNaN(guestCount) || guestCount <= 0) {
      return res.status(400).json({
        error: "Invalid number of guests",
      });
    }

    // ================= CHECK SLOT =================
    const existingBookings = await Booking.find({ slot: slotKey });

    const totalGuests = existingBookings.reduce(
      (sum, b) => sum + Number(b.guests),
      0
    );

    console.log("SLOT:", slotKey);
    console.log("TOTAL GUESTS:", totalGuests);

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
      slot: slotKey,
    });

    // ================= EMAIL (SAFE) =================
    try {
      await transporter.sendMail({
        from: `"ZESTY 🍋" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Booking Confirmed 🍋",
        text: `Hi ${name}, your booking is confirmed for ${date} at ${cleanTime}.`,
      });
    } catch (err) {
      console.log("Email error ignored:", err.message);
    }

    return res.status(200).json({
      message: "Booking confirmed!",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Server error",
    });
  }
});

// ================= DB =================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) => console.log(err.message));

// ================= START =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
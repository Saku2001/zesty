import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Booking from "./models/Booking.js";
import sgMail from "@sendgrid/mail";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// ================= SENDGRID SETUP =================
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// ================= DB =================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) => console.log("MongoDB error:", err.message));

// ================= CONFIG =================
const MAX_CAPACITY = 20;

// ================= ROUTE =================
app.post("/book", async (req, res) => {
  try {
    const { name, email, guests, date, time } = req.body;

    const guestCount = Number(guests);

    if (!name || !email || !date || !time) {
      return res.status(400).json({ error: "Missing fields" });
    }

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

    await Booking.create({
      name,
      email,
      guests: guestCount,
      date,
      time,
    });

    // ================= EMAIL (SENDGRID) =================
    const msg = {
      to: email,
      from: process.env.EMAIL_FROM,
      subject: "Your ZESTY Reservation 🍋",
      text: `Hi ${name}, your booking is confirmed for ${date} at ${time}. Guests: ${guestCount}`,
    };

    await sgMail.send(msg);

    return res.json({ message: "Booking confirmed!" });
  } catch (error) {
    console.error("SERVER ERROR:", error);
    return res.status(500).json({ error: "Server error" });
  }
});

// ================= START =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
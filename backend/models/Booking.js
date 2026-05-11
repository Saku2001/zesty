import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  name: String,
  email: String,
  guests: Number,
  slot: String, // IMPORTANT FIX
});

export default mongoose.model("Booking", bookingSchema);
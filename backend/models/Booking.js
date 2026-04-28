import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  name: String,
  email: String,
  guests: Number,
  date: String,
  time: String,
});

export default mongoose.model("Booking", bookingSchema);
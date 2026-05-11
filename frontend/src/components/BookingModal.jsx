import { useState } from "react";

export default function BookingModal({ show, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    guests: 1,
    date: "",
    time: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      guests: 1,
      date: "",
      time: "",
    });
    setError("");
    setSuccess("");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    try {
      const res = await fetch("https://zesty-afwa.onrender.com/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      console.log("STATUS:", res.status);
      console.log("DATA:", data);

      // ❌ BLOCK ALL FAILURES
      if (!res.ok) {
        setError(data.error || "Booking failed");
        return; // 🚨 STOP HERE (no close)
      }

      // ✅ ONLY SUCCESS
      setSuccess("Booking confirmed! 🍋");

      setTimeout(() => {
        resetForm();
        onClose();
      }, 1500);
    } catch (err) {
      console.error(err);
      setError("Server error");
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-[100] px-4">
      <div className="bg-white w-full max-w-md p-4 sm:p-6 rounded-lg">
        <h2 className="text-lg sm:text-xl font-bold mb-4">Book a Table 🍋</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            name="name"
            placeholder="Name"
            onChange={handleChange}
            className="p-2 border rounded w-full"
          />
          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="p-2 border rounded w-full"
          />
          <input
            name="guests"
            type="number"
            min={1}
            onChange={handleChange}
            className="p-2 border rounded w-full"
          />
          <input
            name="date"
            type="date"
            onChange={handleChange}
            className="p-2 border rounded w-full"
          />
          <input
            name="time"
            type="time"
            onChange={handleChange}
            className="p-2 border rounded w-full"
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-600 text-sm">{success}</p>}

          <div className="flex flex-col sm:flex-row gap-2 sm:justify-between mt-2">
            <button
              type="submit"
              disabled={!!success}
              className="bg-lime-400 px-4 py-2 w-full sm:w-auto transition-all disabled:opacity-50"
            >
              Confirm
            </button>

            <button
              type="button"
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="w-full sm:w-auto"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import { useState } from "react";

export default function BookingModal({ show, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    guests: "",
    date: "",
    time: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    try {
      const payload = {
        ...formData,
        guests: Number(formData.guests),
        time: formData.time?.slice(0, 5),
      };

      const res = await fetch("https://zesty-afwa.onrender.com/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      console.log("STATUS:", res.status);
      console.log("DATA:", data);

      if (!res.ok) {
        setError(data.error);
        return;
      }

      setSuccess("Booking confirmed 🍋");

      setTimeout(() => {
        setFormData({
          name: "",
          email: "",
          guests: "",
          date: "",
          time: "",
        });
        setSuccess("");
        onClose();
      }, 1200);
    } catch (err) {
      console.error(err);
      setError("Server error");
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70">
      <div className="bg-white p-5 w-full max-w-md">
        <h2 className="text-xl font-bold mb-3">Book Table 🍋</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            name="name"
            placeholder="Name"
            onChange={handleChange}
            className="border p-2"
          />
          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="border p-2"
          />
          <input
            name="guests"
            type="number"
            min="1"
            onChange={handleChange}
            className="border p-2"
          />
          <input
            name="date"
            type="date"
            onChange={handleChange}
            className="border p-2"
          />
          <input
            name="time"
            type="time"
            onChange={handleChange}
            className="border p-2"
          />

          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-600">{success}</p>}

          <button className="bg-lime-400 p-2">Confirm</button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}
"use client";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { addEvent } from "../store/features/eventsSlice";


export default function CreateEventPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    category: "Conference",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.date || !form.location) {
      alert("Please fill in all fields");
      return;
    }
    dispatch(addEvent(form));
    router.push("/myevents");
  };

  return (
    <div className="max-w-xl mx-auto bg-white shadow p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Create New Event</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="title" placeholder="Title" value={form.title} onChange={handleChange} className="border p-2 w-full rounded" />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="border p-2 w-full rounded" />
        <input type="date" name="date" value={form.date} onChange={handleChange} className="border p-2 w-full rounded" />
        <input type="text" name="location" placeholder="Location" value={form.location} onChange={handleChange} className="border p-2 w-full rounded" />
        <select name="category" value={form.category} onChange={handleChange} className="border p-2 w-full rounded">
          <option value="Conference">Conference</option>
          <option value="Workshop">Workshop</option>
          <option value="Meetup">Meetup</option>
        </select>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Create Event</button>
      </form>
    </div>
  );
}

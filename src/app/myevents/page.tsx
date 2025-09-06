"use client";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { deleteEvent, rsvpEvent, editEvent } from "../store/features/eventsSlice";
import { useState } from "react";

export default function MyEventsPage() {
  const events = useSelector((state: RootState) => state.events.events.filter((e) => e.createdByUser));
  const dispatch = useDispatch();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ title: "", description: "", date: "", location: "", category: "" });

  const startEdit = (event: any) => {
    setEditingId(event.id);
    setEditForm(event);
  };

  const handleEditChange = (e: any) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const saveEdit = () => {
    dispatch(editEvent(editForm as any));
    setEditingId(null);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">My Events</h2>
      {events.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {events.map((event) => (
            <div key={event.id} className="border rounded-lg shadow p-4 bg-white">
              {editingId === event.id ? (
                <div className="space-y-2">
                  <input type="text" name="title" value={editForm.title} onChange={handleEditChange} className="border p-1 w-full" />
                  <textarea name="description" value={editForm.description} onChange={handleEditChange} className="border p-1 w-full" />
                  <input type="date" name="date" value={editForm.date} onChange={handleEditChange} className="border p-1 w-full" />
                  <input type="text" name="location" value={editForm.location} onChange={handleEditChange} className="border p-1 w-full" />
                  <select name="category" value={editForm.category} onChange={handleEditChange} className="border p-1 w-full">
                    <option value="Conference">Conference</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Meetup">Meetup</option>
                  </select>
                  <button onClick={saveEdit} className="bg-green-600 text-white px-3 py-1 rounded">Save</button>
                </div>
              ) : (
                <>
                  <h3 className="text-lg font-semibold">{event.title}</h3>
                  <p className="text-sm">{event.date} • {event.location}</p>
                  <p className="text-sm mb-2">{event.description}</p>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">{event.category}</span>
                  <p className="text-sm mt-2">Attendees: {event.attendees}</p>
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => dispatch(rsvpEvent(event.id))} className="bg-blue-600 text-white px-2 py-1 rounded">RSVP</button>
                    <button onClick={() => startEdit(event)} className="bg-yellow-500 text-white px-2 py-1 rounded">Edit</button>
                    <button onClick={() => dispatch(deleteEvent(event.id))} className="bg-red-600 text-white px-2 py-1 rounded">Delete</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">You haven’t created any events yet.</p>
      )}
    </div>
  );
}

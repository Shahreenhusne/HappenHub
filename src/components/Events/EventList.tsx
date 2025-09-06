"use client";
import { useEffect, useState } from "react";
import SearchFilter from "./SearchFilter";
import Link from "next/link";

interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
  category: string;
}

export default function EventList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    async function fetchEvents() {
      const res = await fetch("/api/events");
      const data = await res.json();
      setEvents(data);
    }
    fetchEvents();
  }, []);

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "All" || event.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Upcoming Events</h2>

      {/* Filters */}
       <SearchFilter search={search} setSearch={setSearch}  category={category} setCategory={setCategory}/>

      {/* Event List */}
       {filteredEvents.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {filteredEvents.map((event) => (
            <Link
              href={`/events/${event.id}`}
              key={event.id}
              className="border rounded-lg shadow p-4 bg-white hover:shadow-lg transition"
            >
              <h3 className="text-lg font-semibold">{event.title}</h3>
              <p className="text-sm text-gray-600">{event.date}</p>
              <p className="text-sm">{event.location}</p>
              <span className="text-xs mt-2 inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded">
                {event.category}
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No events found.</p>
      )}
    </div>
  );
}

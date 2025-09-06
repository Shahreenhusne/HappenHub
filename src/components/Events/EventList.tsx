"use client";
import { useEffect, useState } from "react";
import SearchFilter from "./SearchFilter";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store/store"; 
import { fetchEvents } from "../../app/store/features/eventsSlice";

export default function EventList() {
  const dispatch = useDispatch<AppDispatch>();

  // ✅ Read state directly from Redux
  const { events, loading, error } = useSelector(
    (state: RootState) => state.events
  );

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    // ✅ Dispatch thunk instead of manual fetch
    dispatch(fetchEvents());
  }, [dispatch]);

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory = category === "All" || event.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Upcoming Events</h2>

      {/* Filters */}
      <SearchFilter
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
      />

      {/* Loading / Error */}
      {loading && <p>Loading events...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Event List */}
      {filteredEvents.length >= 1 ? (
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
        !loading && <p className="text-gray-500">No events found.</p>
      )}
    </div>
  );
}

import Link from "next/link";
import { headers } from "next/headers";

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
}


export default async function EventDetailsPage({ params }: { params: { id: string } }) {
   const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/events`, {
    cache: "no-store",
  });
  const events: Event[] = await res.json();
  const event = events.find((e) => e.id.toString() === params.id);

  if (!event) {
    return <p className="text-red-500">Event not found.</p>;
  }
  return (
    <div className="max-w-2xl mx-auto bg-white shadow p-6 rounded-lg">
      <h2 className="text-3xl font-bold mb-4">{event.title}</h2>
      <p className="text-gray-600 mb-2">{event.date} • {event.location}</p>
      <span className="text-sm inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded mb-4">
        {event.category}
      </span>
      <p className="text-gray-800 mb-6">{event.description}</p>

      <Link href="/" className="text-blue-600 hover:underline">
        ← Back to Events
      </Link>
    </div>
  );
}

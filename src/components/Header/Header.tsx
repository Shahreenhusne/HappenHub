"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Create Event", path: "/create" },
    { name: "My Events", path: "/myevents" },
  ];

  return (
    <header className="bg-blue-400 text-white shadow-md">
      <nav className="container mx-auto flex justify-between items-center p-4">
        <h1 className="text-xl font-bold">Event Manager</h1>
        <ul className="flex gap-6">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                href={item.path}
                className={`hover:underline ${
                  pathname === item.path ? "font-semibold underline" : ""
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

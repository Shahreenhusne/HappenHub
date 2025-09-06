
 🎉 Mini Event Management System

A simple event management web app built with **Next.js**, **TypeScript**, and **Tailwind CSS**.
Users can view upcoming events, create new ones, filter and search through events, and manage their own created events.

---

 🚀 Features

Home Page (Event List)**

  * Displays all upcoming events with title, date, and location.
  * Search bar to filter events by title.
  * Category filter (Conference, Workshop, Meetup).

Event Details Page**

  * Dynamic route: `/events/[id]`.
  * Shows full event details (title, description, date, location, category).

Create Event Page**

  * Form to add a new event (title, description, date, location, category).
  * Events are stored in **local state/localStorage**.
  * Redirects to **My Events** after creation.

My Events Page**

  * Displays events created by the current user.
  * Option to **delete events**.

---



## 🛠️ Tech Stack

Framework: [Next.js](https://nextjs.org/) (with SSR & CSR)
Language: TypeScript
Styling: Tailwind CSS
State Management: React local state / localStorage
Routing: Next.js dynamic routes

---

⚙️ Getting Started

1. Clone the repo

```bash
git clone https://github.com/your-username/event-management-system.git
cd event-management-system
```

 2. Install dependencies

```bash
npm install
# or
yarn install
```

 3. Run the development server

```bash
npm run dev
# or
yarn dev
```

The app will be running at [http://localhost:3000](http://localhost:3000).

---




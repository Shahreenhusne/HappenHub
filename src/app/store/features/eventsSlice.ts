// store/eventsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  attendees: number;
  createdByUser?: boolean;
}

interface EventsState {
  events: Event[];
  loading: boolean;
  error: string | null;
  lastApiId: number; // ✅ track last API id
}

export const loadFromLocalStorage = (): Event[] => {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem("events");
  return data ? JSON.parse(data) : [];
};

const saveToLocalStorage = (events: Event[]) => {
  if (typeof window !== "undefined") {
    // Save ONLY user-created events
    const userEvents = events.filter((e) => e.createdByUser);
    localStorage.setItem("events", JSON.stringify(userEvents));
  }
};

export const fetchEvents = createAsyncThunk<Event[]>(
  "events/fetchEvents",
  async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/events`,
      { cache: "no-store" }
    );

    if (!res.ok) throw new Error("Failed to fetch events");

    const data = await res.json();
    return data;
  }
);

const initialState: EventsState = {
  events: loadFromLocalStorage(),
  loading: false,
  error: null,
  lastApiId: 0, // ✅ initialize
};

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    addEvent: (
      state,
      action: PayloadAction<Omit<Event, "id" | "attendees">>
    ) => {
      // ✅ new id should be after the last API id
      const newId = state.lastApiId
        ? state.lastApiId + state.events.filter((e) => e.createdByUser).length + 1
        : 1;

      const newEvent: Event = {
        ...action.payload,
        id: newId,
        attendees: 0,
        createdByUser: true,
      };

      state.events.push(newEvent);
      saveToLocalStorage(state.events);
    },
    deleteEvent: (state, action: PayloadAction<number>) => {
      state.events = state.events.filter((event) => event.id !== action.payload);
      saveToLocalStorage(state.events);
    },
    editEvent: (state, action: PayloadAction<Event>) => {
      const index = state.events.findIndex((e) => e.id === action.payload.id);
      if (index !== -1) {
        state.events[index] = action.payload;
        saveToLocalStorage(state.events);
      }
    },
    rsvpEvent: (state, action: PayloadAction<number>) => {
      const event = state.events.find((e) => e.id === action.payload);
      if (event) {
        event.attendees += 1;
        saveToLocalStorage(state.events);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;

        // ✅ Extract API events
        const apiEvents = action.payload;
        const localEvents = loadFromLocalStorage();

        // ✅ find last API id
        const lastApiId = apiEvents.length
          ? Math.max(...apiEvents.map((e) => e.id))
          : 0;

        state.lastApiId = lastApiId;

        // ✅ Merge API + local
        state.events = [...apiEvents, ...localEvents];

        // ✅ Save only user-created events to localStorage
        saveToLocalStorage(state.events);
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      });
  },
});

export const { addEvent, deleteEvent, editEvent, rsvpEvent } =
  eventsSlice.actions;
export default eventsSlice.reducer;

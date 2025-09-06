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
}


const loadFromLocalStorage = (): Event[] => {
  if (typeof window === "undefined") return []; // ✅ avoid SSR crash
  const data = localStorage.getItem("events");
  return data ? JSON.parse(data) : [];
};

const saveToLocalStorage = (events: Event[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("events", JSON.stringify(events));
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
    return data; // or data.events depending on API shape
  }
);


const initialState: EventsState = {
  events: loadFromLocalStorage(), // ✅ preload from localStorage
  loading: false,
  error: null,
};

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    addEvent: (state, action: PayloadAction<Omit<Event, "id" | "attendees">>) => {
      const newEvent: Event = {
        ...action.payload,
        id: state.events.length ? state.events[state.events.length - 1].id + 1 : 1,
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

        // ✅ Merge API events + user-created events from localStorage
        const localEvents = loadFromLocalStorage();
        state.events = [...action.payload, ...localEvents];

        saveToLocalStorage(state.events); // ✅ sync back
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      });
  },
});

export const { addEvent, deleteEvent, editEvent, rsvpEvent } = eventsSlice.actions;
export default eventsSlice.reducer;

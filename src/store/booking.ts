import { create } from "zustand";
import type { Flight } from "@/lib/mockData";

export type Passenger = { firstName: string; lastName: string; email: string };

type BookingState = {
  flight: Flight | null;
  selectedSeats: string[];
  passenger: Passenger | null;
  setFlight: (f: Flight | null) => void;
  toggleSeat: (id: string) => void;
  setPassenger: (p: Passenger) => void;
  reset: () => void;
};

export const useBooking = create<BookingState>((set) => ({
  flight: null,
  selectedSeats: [],
  passenger: null,
  setFlight: (flight) => set({ flight, selectedSeats: [] }),
  toggleSeat: (id) =>
    set((s) => ({
      selectedSeats: s.selectedSeats.includes(id)
        ? s.selectedSeats.filter((x) => x !== id)
        : [...s.selectedSeats, id],
    })),
  setPassenger: (passenger) => set({ passenger }),
  reset: () => set({ flight: null, selectedSeats: [], passenger: null }),
}));

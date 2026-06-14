import { create } from "zustand";
import type { Flight } from "@/lib/types";

export type Passenger = { firstName: string; lastName: string; email: string };
export type SeatClass = "Economy" | "Premium" | "Business";

type BookingState = {
  flight: Flight | null;
  selectedSeats: string[];
  seatClass: SeatClass | null;        // ← added
  passenger: Passenger | null;
  setFlight: (f: Flight | null) => void;
  toggleSeat: (id: string, cls: SeatClass) => void;  // ← cls param added
  setSeatClass: (cls: SeatClass) => void;             // ← added
  setPassenger: (p: Passenger) => void;
  reset: () => void;
};

export const useBooking = create<BookingState>((set) => ({
  flight: null,
  selectedSeats: [],
  seatClass: null,                    // ← added
  passenger: null,

  setFlight: (flight) => set({ flight, selectedSeats: [], seatClass: null }),

  // Now toggleSeat also updates seatClass from the clicked seat
  toggleSeat: (id, cls) =>
    set((s) => ({
      selectedSeats: s.selectedSeats.includes(id)
        ? s.selectedSeats.filter((x) => x !== id)
        : [...s.selectedSeats, id],
      seatClass: cls,                 // ← set class from the seat clicked
    })),

  setSeatClass: (cls) => set({ seatClass: cls }),

  setPassenger: (passenger) => set({ passenger }),

  reset: () => set({ flight: null, selectedSeats: [], seatClass: null, passenger: null }),
}));
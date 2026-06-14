import { create } from "zustand";
import { bookingApi } from "@/lib/api";

export type BookingRecord = {
  b_id: number;
  ref:string,
  b_date: string;
  status: string;
  seat_id: number;
  user_id: number;
};

type BookingsState = {
  bookings: BookingRecord[];
  currentBooking: BookingRecord | null;
  loading: boolean;
  error: string | null;

  fetchAllBookings: () => Promise<void>;
  fetchBookingById: (id: number) => Promise<void>;
  setCurrentBooking: (booking: BookingRecord | null) => void;
  clearError: () => void;
};

export const useBookings = create<BookingsState>((set) => ({
  bookings: [],
  currentBooking: null,
  loading: false,
  error: null,

  async fetchAllBookings() {
    set({ loading: true, error: null });
    try {
      const res = await bookingApi.list();
      set({ bookings: res.data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  async fetchBookingById(id) {
    set({ loading: true, error: null });
    try {
      const res = await bookingApi.get(String(id));
      set({ currentBooking: res.data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  setCurrentBooking(booking) {
    set({ currentBooking: booking });
  },

  clearError() {
    set({ error: null });
  },
}));

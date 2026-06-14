import { create } from "zustand";
import { adminApi } from "@/lib/api";

export type Flight = {
  f_id: number;
  airline_id: number;
  departure_time: string;
  arrival_time: string;
  total_seats: number;
  status: string;
};

export type Airline = {
  air_id: number;
  air_name: string;
  model_name: string;
  country: string;
};

export type Airport = {
  airp_id: number;
  airport_name: string;
  city: string;
  country: string;
};

export type Booking = {
  b_id: number;
  b_date: string;
  status: string;
  seat_id: number;
  user_id: number;
};

export type Payment = {
  pay_id: number;
  payment_status: string;
  amount: number;
  booking_id: number;
  pay_time: string;
};

type AdminState = {
  flights: Flight[];
  airlines: Airline[];
  airports: Airport[];
  bookings: Booking[];
  payments: Payment[];
  loading: boolean;
  error: string | null;

  // Flights
  fetchFlights: () => Promise<void>;
  createFlight: (data: unknown) => Promise<Flight>;
  updateFlight: (id: number, data: unknown) => Promise<Flight>;
  deleteFlight: (id: number) => Promise<void>;

  // Airlines
  fetchAirlines: () => Promise<void>;
  createAirline: (data: unknown) => Promise<Airline>;
  updateAirline: (id: number, data: unknown) => Promise<Airline>;
  deleteAirline: (id: number) => Promise<void>;

  // Airports
  fetchAirports: () => Promise<void>;
  createAirport: (data: unknown) => Promise<Airport>;
  updateAirport: (id: number, data: unknown) => Promise<Airport>;
  deleteAirport: (id: number) => Promise<void>;

  // Bookings
  fetchAllBookings: () => Promise<void>;
  updateBooking: (id: number, data: unknown) => Promise<Booking>;

  // Payments
  fetchAllPayments: () => Promise<void>;

  clearError: () => void;
};

export const useAdmin = create<AdminState>((set) => ({
  flights: [],
  airlines: [],
  airports: [],
  bookings: [],
  payments: [],
  loading: false,
  error: null,

  // Flights
  async fetchFlights() {
    set({ loading: true, error: null });
    try {
      const res = await adminApi.flights();
      set({ flights: res.data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  async createFlight(data) {
    set({ loading: true, error: null });
    try {
      const res = await adminApi.createFlight(data);
      set((state) => ({
        flights: [...state.flights, res.data],
        loading: false,
      }));
      return res.data;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  async updateFlight(id, data) {
    set({ loading: true, error: null });
    try {
      const res = await adminApi.updateFlight(id, data);
      set((state) => ({
        flights: state.flights.map((f) => (f.f_id === id ? res.data : f)),
        loading: false,
      }));
      return res.data;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  async deleteFlight(id) {
    set({ loading: true, error: null });
    try {
      await adminApi.deleteFlight(id);
      set((state) => ({
        flights: state.flights.filter((f) => f.f_id !== id),
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Airlines
  async fetchAirlines() {
    set({ loading: true, error: null });
    try {
      const res = await adminApi.airlines();
      set({ airlines: res.data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  async createAirline(data) {
    set({ loading: true, error: null });
    try {
      const res = await adminApi.createAirline(data);
      set((state) => ({
        airlines: [...state.airlines, res.data],
        loading: false,
      }));
      return res.data;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  async updateAirline(id, data) {
    set({ loading: true, error: null });
    try {
      const res = await adminApi.updateAirline(id, data);
      set((state) => ({
        airlines: state.airlines.map((a) => (a.air_id === id ? res.data : a)),
        loading: false,
      }));
      return res.data;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  async deleteAirline(id) {
    set({ loading: true, error: null });
    try {
      await adminApi.deleteAirline(id);
      set((state) => ({
        airlines: state.airlines.filter((a) => a.air_id !== id),
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Airports
  async fetchAirports() {
    set({ loading: true, error: null });
    try {
      const res = await adminApi.airports();
      set({ airports: res.data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  async createAirport(data) {
    set({ loading: true, error: null });
    try {
      const res = await adminApi.createAirport(data);
      set((state) => ({
        airports: [...state.airports, res.data],
        loading: false,
      }));
      return res.data;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  async updateAirport(id, data) {
    set({ loading: true, error: null });
    try {
      const res = await adminApi.updateAirport(id, data);
      set((state) => ({
        airports: state.airports.map((a) => (a.airp_id === id ? res.data : a)),
        loading: false,
      }));
      return res.data;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  async deleteAirport(id) {
    set({ loading: true, error: null });
    try {
      await adminApi.deleteAirport(id);
      set((state) => ({
        airports: state.airports.filter((a) => a.airp_id !== id),
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Bookings
  async fetchAllBookings() {
    set({ loading: true, error: null });
    try {
      const res = await adminApi.allBookings();
      set({ bookings: res.data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  async updateBooking(id, data) {
    set({ loading: true, error: null });
    try {
      const res = await adminApi.updateBooking(id, data);
      set((state) => ({
        bookings: state.bookings.map((b) => (b.b_id === id ? res.data : b)),
        loading: false,
      }));
      return res.data;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Payments
  async fetchAllPayments() {
    set({ loading: true, error: null });
    try {
      const res = await adminApi.allPayments();
      set({ payments: res.data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  clearError() {
    set({ error: null });
  },
}));

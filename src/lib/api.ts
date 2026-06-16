import axios from "axios";

// FastAPI backend base URL (no /api/v1 prefix on these routers).
// Override in dev by setting VITE_API_BASE in your environment.
export const API_BASE =
  (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_API_BASE) ||
  "https://airline-reservation-system.fastapicloud.dev/";

export const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("skyline_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
// ───────────── Admin ─────────────
export const adminApi = {
  // Flights
  flights: () => api.get("/flights/all"),
  createFlight: (data: unknown) => api.post("/flights/create", data),
  updateFlight: (id: number, data: unknown) => api.put(`/flights/update/${id}`, data),
  deleteFlight: (id: number) => api.delete(`/flights/dletete/${id}`), // typo preserved to match server

  // Airlines
  airlines: () => api.get("/airline/all"),
  createAirline: (data: unknown) => api.post("/airline/create", data),
  updateAirline: (id: number, data: unknown) => api.put(`/airline/update/${id}`, data),
  deleteAirline: (id: number) => api.delete(`/airline/delete/${id}`),

  // Airports
  airports: () => api.get("/airport/all"),
  createAirport: (data: unknown) => api.post("/airport/create", data),
  updateAirport: (id: number, data: unknown) => api.put(`/airport/update/${id}`, data),
  deleteAirport: (id: number) => api.delete(`/airport/delete/${id}`),

  // Bookings
  allBookings: () => api.get("/bookings/"),
  updateBooking: (id: number, data: unknown) => api.put(`/bookings/${id}`, data),

  // Payments
  allPayments: () => api.get("/payments/"),
};

// ───────────── Users / Auth ─────────────
export const authApi = {
  register: (data: { username: string; email: string; password: string; [k: string]: unknown }) =>
    api.post("/Users/register", data),
  login: (data: { email: string; password: string }) => api.post("/Users/login", data),
  isAuth: () => api.get("/Users/is_auth"),
};

// ───────────── Airlines ─────────────
export const airlineApi = {
  create: (data: unknown) => api.post("/airline/create", data),
  list: () => api.get("/airline/all"),
  get: (id: string | number) => api.get(`/airline/${id}`),
  searchByName: (name: string) => api.get(`/airline/search/${encodeURIComponent(name)}`),
  update: (id: string | number, data: unknown) => api.put(`/airline/update/${id}`, data),
  remove: (id: string | number) => api.delete(`/airline/delete/${id}`),
};

// ───────────── Airports ─────────────
export const airportApi = {
  create: (data: unknown) => api.post("/airport/create", data),
  byName: (name: string) => api.get(`/airport/name/${encodeURIComponent(name)}`),
  list: () => api.get("/airport/all"),
  get: (id: string | number) => api.get(`/airport/id/${id}`),
  update: (id: string | number, data: unknown) => api.put(`/airport/update/${id}`, data),
  remove: (id: string | number) => api.delete(`/airport/delete/${id}`),
};

// ───────────── Flights ─────────────
export const flightApi = {
  create: (data: unknown) => api.post("/flights/create", data),
  list: () => api.get("/flights/all"),
  get: (id: string | number) => api.get(`/flights/id/${id}`),
  update: (id: string | number, data: unknown) => api.put(`/flights/update/${id}`, data),
  // Backend route is /flights/dletete/{id} (typo preserved to match server).
  remove: (id: string | number) => api.delete(`/flights/dletete/${id}`),
  // Client-side search helper over /flights/all
  search: async (params: Record<string, string>) => {
    const res = await api.get("/flights/all");
    return { ...res, data: res.data, params };
  },
};

// ───────────── Bookings ─────────────
export const bookingApi = {
  create: (data: unknown) => api.post("/bookings/create", data),
  list: () => api.get("/bookings/"),
  get: (id: string | number) => api.get(`/bookings/${id}`),
  update: (id: string | number, data: unknown) => api.put(`/bookings/${id}`, data),
  remove: (id: string | number) => api.delete(`/bookings/${id}`),
};

// ───────────── Seats ─────────────
export const seatApi = {
  create: (data: unknown) => api.post("/seats/create", data),
  list: () => api.get("/seats/"),
  get: (id: string | number) => api.get(`/seats/${id}`),
  update: (id: string | number, data: unknown) => api.put(`/seats/${id}`, data),
  remove: (id: string | number) => api.delete(`/seats/${id}`),
  // Backwards-compat helper used by SeatSelector — filter all seats by flight on the client.
  forFlight: async (flightId: string | number) => {
    const res = await api.get("/seats/");
    const data = Array.isArray(res.data)
      ? res.data.filter((s: any) => String(s.flight_id ?? s.flightId) === String(flightId))
      : res.data;
    return { ...res, data };
  },
};

// ───────────── Payments ─────────────
export const paymentApi = {
  list: () => api.get("/payments/"),
  create: (data: unknown) => api.post("/payments/", data),
  get: (paymentId: string | number) => api.get(`/payments/${paymentId}`),
  update: (paymentId: string | number, data: unknown) => api.put(`/payments/${paymentId}`, data),
  process: (paymentId: string | number) => api.post(`/payments/${paymentId}/process`),
  cancel: (paymentId: string | number) => api.post(`/payments/${paymentId}/cancel`),
  forBooking: (bookingId: string | number) => api.get(`/payments/booking/${bookingId}`),
};

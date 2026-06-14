import axios from "axios";

export const API_BASE =
  (import.meta as any).env?.VITE_API_BASE ?? "http://localhost:8000";

export const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
  timeout: 5000, // 5s timeout to prevent SSR from hanging
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("skyline_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth - User router uses /Users prefix with /login endpoint
export const authApi = {
  register: (data: { user_name: string; email: string; password: string }) =>
    api.post("/Users/register", data),
  login: (data: { email: string; password: string }) => api.post("/Users/login", data),
  me: () => api.get("/Users/is_auth"),
};

// Users
export const userApi = {
  profile: () => api.get("/Users/is_auth"),
  bookings: () => api.get("/bookings"),
};

// Flights
export const flightApi = {
  // backend exposes /flights/all for list and /flights/id/{id} for details
  list: () => api.get("/flights/all"),
  search: (params: Record<string, string>) => api.get("/flights/search/flights", { params }),
  get: (id: string) => api.get(`/flights/id/${id}`),
  create: (data: unknown) => api.post("/flights/create", data),
  update: (id: number, data: unknown) => api.put(`/flights/update/${id}`, data),
  delete: (id: number) => api.delete(`/flights/delete/${id}`),
};

// Bookings
export const bookingApi = {
  create: (data: unknown) => api.post("/bookings/create", data),
  list: () => api.get("/bookings"),
  get: (id: string) => api.get(`/bookings/${id}`),
  update: (id: number, data: unknown) => api.put(`/bookings/${id}`, data),
  delete: (id: number) => api.delete(`/bookings/${id}`),
};

// Payments
export const paymentApi = {
  create: (data: { booking_id: number; amount: number }) => api.post("/payments", data),
  list: () => api.get("/payments"),
  get: (id: number) => api.get(`/payments/${id}`),
  update: (id: number, data: { payment_status?: string; amount?: number }) =>
    api.put(`/payments/${id}`, data),
  process: (id: number) => api.post(`/payments/${id}/process`),
  cancel: (id: number) => api.post(`/payments/${id}/cancel`),
  getByBooking: (bookingId: number) => api.get(`/payments/booking/${bookingId}`),
};

// Seats
export const seatApi = {
  forFlight: (flightId: string) => api.get(`/seats/flight/${flightId}`),
};

// Admin endpoints
export const adminApi = {
  // Flights
  flights: () => api.get("/flights/all"),
  createFlight: (data: unknown) => api.post("/flights/create", data),
  updateFlight: (id: number, data: unknown) => api.put(`/flights/update/${id}`, data),
  deleteFlight: (id: number) => api.delete(`/flights/delete/${id}`),
  
  
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
  allBookings: () => api.get("/bookings"),
  getBooking: (id: number) => api.get(`/bookings/${id}`),
  updateBooking: (id: number, data: unknown) => api.put(`/bookings/${id}`, data),
  
  // Payments
  allPayments: () => api.get("/payments"),
};

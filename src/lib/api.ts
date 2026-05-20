import axios from "axios";

export const API_BASE = "http://localhost:8000/api/v1";

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

// Auth
export const authApi = {
  register: (data: { username: string; email: string; password: string }) =>
    api.post("/auth/register", data),
  login: (data: { email: string; password: string }) => api.post("/auth/login", data),
  me: () => api.get("/auth/me"),
};

// Users
export const userApi = {
  profile: () => api.get("/users/profile"),
  bookings: () => api.get("/users/bookings"),
};

// Flights
export const flightApi = {
  list: () => api.get("/flights"),
  search: (params: Record<string, string>) => api.get("/flights/search", { params }),
  get: (id: string) => api.get(`/flights/${id}`),
};

// Bookings
export const bookingApi = {
  create: (data: unknown) => api.post("/bookings", data),
  get: (id: string) => api.get(`/bookings/${id}`),
};

// Payments
export const paymentApi = {
  create: (data: unknown) => api.post("/payments", data),
};

// Seats
export const seatApi = {
  forFlight: (flightId: string) => api.get(`/seats/flight/${flightId}`),
};

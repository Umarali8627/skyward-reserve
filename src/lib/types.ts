export type Airport = {
  id: number;
  code: string;
  name: string;
  city: string;
  country: string;
};

export type Airline = {
  id?: number;
  code: string;
  name: string;
  color: string;
};

export type Flight = {
  id: string;
  airline: Airline;
  flightNumber: string;
  from: Airport;
  to: Airport;
  departure: string;
  arrival: string;
  durationMin: number;
  price: number;
  seatClass: "economy" | "business" | "premium";
  seatsLeft: number;
  status: "on-time" | "delayed" | "boarding" | "cancelled" | "pending";
};

export type Airport = { code: string; city: string; name: string; country: string };
export type Airline = { code: string; name: string; color: string };
export type Flight = {
  id: string;
  airline: Airline;
  flightNumber: string;
  from: Airport;
  to: Airport;
  departure: string; // ISO
  arrival: string; // ISO
  durationMin: number;
  price: number;
  seatClass: "economy" | "business" | "premium";
  seatsLeft: number;
  status: "on-time" | "delayed" | "boarding" | "cancelled";
};

export const airports: Airport[] = [
  { code: "DXB", city: "Dubai", name: "Dubai International", country: "UAE" },
  { code: "DOH", city: "Doha", name: "Hamad International", country: "Qatar" },
  { code: "LHR", city: "London", name: "Heathrow", country: "UK" },
  { code: "JFK", city: "New York", name: "John F. Kennedy", country: "USA" },
  { code: "SIN", city: "Singapore", name: "Changi", country: "Singapore" },
  { code: "IST", city: "Istanbul", name: "Istanbul Airport", country: "Turkey" },
  { code: "CDG", city: "Paris", name: "Charles de Gaulle", country: "France" },
  { code: "HND", city: "Tokyo", name: "Haneda", country: "Japan" },
  { code: "SYD", city: "Sydney", name: "Kingsford Smith", country: "Australia" },
  { code: "KHI", city: "Karachi", name: "Jinnah International", country: "Pakistan" },
];

export const airlines: Airline[] = [
  { code: "SK", name: "SkyLine Air", color: "#6d5cff" },
  { code: "EK", name: "Emirates", color: "#d71920" },
  { code: "QR", name: "Qatar Airways", color: "#5c0632" },
  { code: "TK", name: "Turkish Airlines", color: "#c8102e" },
  { code: "SQ", name: "Singapore Airlines", color: "#1e3a8a" },
];

const iso = (d: Date) => d.toISOString();
const addH = (base: Date, h: number) => new Date(base.getTime() + h * 3600 * 1000);

function gen(): Flight[] {
  const out: Flight[] = [];
  const today = new Date();
  today.setHours(7, 30, 0, 0);
  const routes: Array<[string, string, number, number]> = [
    ["DXB", "LHR", 7, 650],
    ["DOH", "JFK", 14, 1290],
    ["LHR", "JFK", 8, 780],
    ["SIN", "SYD", 8, 540],
    ["IST", "CDG", 4, 320],
    ["HND", "SIN", 7, 480],
    ["KHI", "DXB", 2, 220],
    ["CDG", "DXB", 7, 690],
    ["JFK", "LHR", 7, 720],
    ["DXB", "SIN", 7, 590],
  ];
  routes.forEach(([f, t, dur, basePrice], i) => {
    airlines.slice(0, 4).forEach((al, j) => {
      const dep = addH(today, i * 2 + j);
      out.push({
        id: `${al.code}-${f}-${t}-${i}${j}`,
        airline: al,
        flightNumber: `${al.code}${100 + i * 10 + j}`,
        from: airports.find(a => a.code === f)!,
        to: airports.find(a => a.code === t)!,
        departure: iso(dep),
        arrival: iso(addH(dep, dur)),
        durationMin: dur * 60 + (j * 15),
        price: basePrice + j * 80,
        seatClass: j === 0 ? "business" : j === 1 ? "premium" : "economy",
        seatsLeft: 12 + ((i * j) % 30),
        status: (["on-time", "boarding", "delayed", "on-time"] as const)[j],
      });
    });
  });
  return out;
}

export const flights: Flight[] = gen();

export const popularDestinations = [
  { city: "Dubai", code: "DXB", price: 650, image: "linear-gradient(135deg,#f59e0b,#ef4444)" },
  { city: "London", code: "LHR", price: 780, image: "linear-gradient(135deg,#3b82f6,#6366f1)" },
  { city: "Tokyo", code: "HND", price: 920, image: "linear-gradient(135deg,#ec4899,#8b5cf6)" },
  { city: "Singapore", code: "SIN", price: 540, image: "linear-gradient(135deg,#10b981,#06b6d4)" },
  { city: "Paris", code: "CDG", price: 690, image: "linear-gradient(135deg,#a855f7,#ec4899)" },
  { city: "New York", code: "JFK", price: 850, image: "linear-gradient(135deg,#0ea5e9,#22d3ee)" },
];

export const testimonials = [
  { name: "Aisha Khan", role: "Frequent Flyer", text: "The smoothest booking experience I've had. Beautiful UI and lightning fast.", rating: 5 },
  { name: "Daniel Lee", role: "Business Traveler", text: "Premium feel end-to-end. The seat selector alone is worth switching for.", rating: 5 },
  { name: "Maria Garcia", role: "Travel Blogger", text: "SkyLine redefines what an airline app can look like. Stunning.", rating: 5 },
];

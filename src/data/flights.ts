import bali from "@/assets/destinations/bali.jpg";
import dubai from "@/assets/destinations/dubai.jpg";
import santorini from "@/assets/destinations/santorini.jpg";
import switzerland from "@/assets/destinations/switzerland.jpg";

export interface Flight {
  id: string;
  airline: string;
  airlineLogo: string;
  flightNumber: string;
  from: string;
  fromCode: string;
  to: string;
  toCode: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: number;
  stopCity?: string;
  price: number;
  originalPrice?: number;
  fareType: string;
  baggage: string;
  meal: boolean;
  refundable: boolean;
  badges: string[];
  aircraft: string;
  seatMap: SeatRow[];
  reviews: Review[];
}

export interface SeatRow {
  row: number;
  seats: Seat[];
}

export interface Seat {
  id: string;
  type: "window" | "middle" | "aisle";
  available: boolean;
  price: number;
  category: "standard" | "extra-legroom" | "premium";
}

export interface Review {
  name: string;
  avatar: string;
  rating: number;
  date: string;
  text: string;
}

const generateSeatMap = (): SeatRow[] => {
  const rows: SeatRow[] = [];
  for (let r = 1; r <= 30; r++) {
    const cols = ["A", "B", "C", "D", "E", "F"];
    rows.push({
      row: r,
      seats: cols.map((c) => ({
        id: `${r}${c}`,
        type: c === "A" || c === "F" ? "window" : c === "C" || c === "D" ? "aisle" : "middle",
        available: Math.random() > 0.3,
        price: r <= 5 ? 800 : r <= 12 ? 400 : 0,
        category: r <= 5 ? "premium" : r <= 12 ? "extra-legroom" : "standard",
      })),
    });
  }
  return rows;
};

const commonReviews: Review[] = [
  { name: "Rahul M.", avatar: "RM", rating: 4, date: "2 weeks ago", text: "Smooth flight, on-time departure. Crew was helpful." },
  { name: "Priya S.", avatar: "PS", rating: 5, date: "1 month ago", text: "Excellent service and comfortable seats. Would fly again." },
  { name: "Amit K.", avatar: "AK", rating: 3, date: "3 weeks ago", text: "Decent experience but food could be better." },
];

export const flights: Flight[] = [
  {
    id: "fl-1",
    airline: "IndiGo",
    airlineLogo: "6E",
    flightNumber: "6E-2341",
    from: "New Delhi",
    fromCode: "DEL",
    to: "Bali",
    toCode: "DPS",
    departureTime: "06:30",
    arrivalTime: "15:45",
    duration: "9h 15m",
    stops: 1,
    stopCity: "Singapore",
    price: 18499,
    originalPrice: 24999,
    fareType: "Economy Saver",
    baggage: "15kg check-in + 7kg cabin",
    meal: true,
    refundable: false,
    badges: ["Best Price", "Most Booked"],
    aircraft: "Airbus A320neo",
    seatMap: generateSeatMap(),
    reviews: commonReviews,
  },
  {
    id: "fl-2",
    airline: "Air India",
    airlineLogo: "AI",
    flightNumber: "AI-882",
    from: "New Delhi",
    fromCode: "DEL",
    to: "Dubai",
    toCode: "DXB",
    departureTime: "02:15",
    arrivalTime: "04:30",
    duration: "3h 45m",
    stops: 0,
    price: 12999,
    originalPrice: 16500,
    fareType: "Economy Flex",
    baggage: "25kg check-in + 7kg cabin",
    meal: true,
    refundable: true,
    badges: ["Non-stop", "Free Cancellation"],
    aircraft: "Boeing 787 Dreamliner",
    seatMap: generateSeatMap(),
    reviews: commonReviews,
  },
  {
    id: "fl-3",
    airline: "Emirates",
    airlineLogo: "EK",
    flightNumber: "EK-511",
    from: "Mumbai",
    fromCode: "BOM",
    to: "Santorini",
    toCode: "JTR",
    departureTime: "22:00",
    arrivalTime: "09:30",
    duration: "11h 30m",
    stops: 1,
    stopCity: "Dubai",
    price: 42999,
    originalPrice: 55000,
    fareType: "Economy Plus",
    baggage: "30kg check-in + 7kg cabin",
    meal: true,
    refundable: true,
    badges: ["Premium Carrier", "Top Rated"],
    aircraft: "Airbus A380",
    seatMap: generateSeatMap(),
    reviews: commonReviews,
  },
  {
    id: "fl-4",
    airline: "Vistara",
    airlineLogo: "UK",
    flightNumber: "UK-995",
    from: "Bangalore",
    fromCode: "BLR",
    to: "Swiss Alps",
    toCode: "ZRH",
    departureTime: "11:00",
    arrivalTime: "19:15",
    duration: "10h 15m",
    stops: 1,
    stopCity: "Delhi",
    price: 38999,
    originalPrice: 48000,
    fareType: "Economy Premium",
    baggage: "25kg check-in + 7kg cabin",
    meal: true,
    refundable: false,
    badges: ["Limited Seats"],
    aircraft: "Boeing 787-9",
    seatMap: generateSeatMap(),
    reviews: commonReviews,
  },
  {
    id: "fl-5",
    airline: "SpiceJet",
    airlineLogo: "SG",
    flightNumber: "SG-8121",
    from: "Delhi",
    fromCode: "DEL",
    to: "Goa",
    toCode: "GOI",
    departureTime: "07:00",
    arrivalTime: "09:30",
    duration: "2h 30m",
    stops: 0,
    price: 3499,
    originalPrice: 5999,
    fareType: "Economy Lite",
    baggage: "15kg check-in",
    meal: false,
    refundable: false,
    badges: ["Best Price", "42% OFF"],
    aircraft: "Boeing 737 MAX",
    seatMap: generateSeatMap(),
    reviews: commonReviews,
  },
];

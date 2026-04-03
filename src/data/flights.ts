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
  { name: "Rahul M.", avatar: "RM", rating: 4, date: "2 weeks ago", text: "Smooth flight, on-time departure from Delhi. Crew was helpful." },
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
    to: "Goa",
    toCode: "GOI",
    departureTime: "06:30",
    arrivalTime: "09:00",
    duration: "2h 30m",
    stops: 0,
    price: 3499,
    originalPrice: 5999,
    fareType: "Economy Saver",
    baggage: "15kg check-in + 7kg cabin",
    meal: false,
    refundable: false,
    badges: ["Best Price", "42% OFF"],
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
    to: "Mumbai",
    toCode: "BOM",
    departureTime: "07:15",
    arrivalTime: "09:30",
    duration: "2h 15m",
    stops: 0,
    price: 4299,
    originalPrice: 6500,
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
    airline: "Vistara",
    airlineLogo: "UK",
    flightNumber: "UK-835",
    from: "Mumbai",
    fromCode: "BOM",
    to: "Srinagar",
    toCode: "SXR",
    departureTime: "08:00",
    arrivalTime: "10:45",
    duration: "2h 45m",
    stops: 0,
    price: 5999,
    originalPrice: 8999,
    fareType: "Economy Plus",
    baggage: "25kg check-in + 7kg cabin",
    meal: true,
    refundable: true,
    badges: ["Premium Carrier", "Top Rated"],
    aircraft: "Airbus A320neo",
    seatMap: generateSeatMap(),
    reviews: commonReviews,
  },
  {
    id: "fl-4",
    airline: "SpiceJet",
    airlineLogo: "SG",
    flightNumber: "SG-8121",
    from: "Bangalore",
    fromCode: "BLR",
    to: "Kochi",
    toCode: "COK",
    departureTime: "11:00",
    arrivalTime: "12:15",
    duration: "1h 15m",
    stops: 0,
    price: 2499,
    originalPrice: 3999,
    fareType: "Economy Lite",
    baggage: "15kg check-in",
    meal: false,
    refundable: false,
    badges: ["Best Price", "Shortest Route"],
    aircraft: "Boeing 737 MAX",
    seatMap: generateSeatMap(),
    reviews: commonReviews,
  },
  {
    id: "fl-5",
    airline: "IndiGo",
    airlineLogo: "6E",
    flightNumber: "6E-6789",
    from: "Delhi",
    fromCode: "DEL",
    to: "Jaipur",
    toCode: "JAI",
    departureTime: "14:00",
    arrivalTime: "15:05",
    duration: "1h 05m",
    stops: 0,
    price: 1999,
    originalPrice: 3499,
    fareType: "Economy Saver",
    baggage: "15kg check-in",
    meal: false,
    refundable: false,
    badges: ["Best Price", "43% OFF"],
    aircraft: "ATR 72",
    seatMap: generateSeatMap(),
    reviews: commonReviews,
  },
  {
    id: "fl-6",
    airline: "Air India",
    airlineLogo: "AI",
    flightNumber: "AI-443",
    from: "Chennai",
    fromCode: "MAA",
    to: "Port Blair",
    toCode: "IXZ",
    departureTime: "05:30",
    arrivalTime: "07:50",
    duration: "2h 20m",
    stops: 0,
    price: 6999,
    originalPrice: 9999,
    fareType: "Economy Flex",
    baggage: "25kg check-in + 7kg cabin",
    meal: true,
    refundable: true,
    badges: ["Island Route", "30% OFF"],
    aircraft: "Airbus A320",
    seatMap: generateSeatMap(),
    reviews: commonReviews,
  },
];

export interface Train {
  id: string;
  name: string;
  number: string;
  from: string;
  fromCode: string;
  to: string;
  toCode: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  day: string;
  classes: TrainClass[];
  badges: string[];
  distance: string;
  pantry: boolean;
  reviews: { name: string; avatar: string; rating: number; date: string; text: string }[];
}

export interface TrainClass {
  id: string;
  name: string;
  code: string;
  price: number;
  available: number;
  total: number;
}

export const trains: Train[] = [
  {
    id: "tr-1",
    name: "Rajdhani Express",
    number: "12952",
    from: "New Delhi",
    fromCode: "NDLS",
    to: "Mumbai Central",
    toCode: "MMCT",
    departureTime: "16:55",
    arrivalTime: "08:35",
    duration: "15h 40m",
    day: "Daily",
    distance: "1,384 km",
    pantry: true,
    classes: [
      { id: "1A", name: "First AC", code: "1A", price: 4835, available: 8, total: 24 },
      { id: "2A", name: "Second AC", code: "2A", price: 2855, available: 24, total: 72 },
      { id: "3A", name: "Third AC", code: "3A", price: 1985, available: 42, total: 120 },
    ],
    badges: ["Superfast", "Pantry Car"],
    reviews: [
      { name: "Suresh P.", avatar: "SP", rating: 4, date: "1 week ago", text: "Comfortable journey with good food. On-time arrival at Mumbai Central." },
    ],
  },
  {
    id: "tr-2",
    name: "Shatabdi Express",
    number: "12002",
    from: "New Delhi",
    fromCode: "NDLS",
    to: "Bhopal Junction",
    toCode: "BPL",
    departureTime: "06:15",
    arrivalTime: "14:30",
    duration: "8h 15m",
    day: "Daily except Sun",
    distance: "707 km",
    pantry: true,
    classes: [
      { id: "CC", name: "AC Chair Car", code: "CC", price: 1180, available: 56, total: 180 },
      { id: "EC", name: "Executive Chair", code: "EC", price: 2275, available: 12, total: 36 },
    ],
    badges: ["Day Train", "Meals Included"],
    reviews: [
      { name: "Kavita R.", avatar: "KR", rating: 5, date: "3 days ago", text: "Best day train in India! Clean coaches and excellent catering service." },
    ],
  },
  {
    id: "tr-3",
    name: "Duronto Express",
    number: "12213",
    from: "Mumbai Central",
    fromCode: "MMCT",
    to: "New Delhi",
    toCode: "NDLS",
    departureTime: "23:00",
    arrivalTime: "16:10",
    duration: "17h 10m",
    day: "Mon, Thu, Sat",
    distance: "1,384 km",
    pantry: true,
    classes: [
      { id: "1A", name: "First AC", code: "1A", price: 5200, available: 4, total: 18 },
      { id: "2A", name: "Second AC", code: "2A", price: 3100, available: 16, total: 54 },
      { id: "3A", name: "Third AC", code: "3A", price: 2200, available: 30, total: 96 },
      { id: "SL", name: "Sleeper", code: "SL", price: 850, available: 120, total: 300 },
    ],
    badges: ["Non-stop", "Premium"],
    reviews: [
      { name: "Deepak V.", avatar: "DV", rating: 4, date: "2 weeks ago", text: "Non-stop service is great. Saves a lot of time between Mumbai and Delhi." },
    ],
  },
  {
    id: "tr-4",
    name: "Vande Bharat Express",
    number: "22436",
    from: "New Delhi",
    fromCode: "NDLS",
    to: "Varanasi Junction",
    toCode: "BSB",
    departureTime: "06:00",
    arrivalTime: "14:00",
    duration: "8h 00m",
    day: "Daily except Fri",
    distance: "759 km",
    pantry: true,
    classes: [
      { id: "CC", name: "AC Chair Car", code: "CC", price: 1760, available: 72, total: 240 },
      { id: "EC", name: "Executive Chair", code: "EC", price: 3310, available: 18, total: 48 },
    ],
    badges: ["Semi High Speed", "India's Pride"],
    reviews: [
      { name: "Ankit M.", avatar: "AM", rating: 5, date: "1 week ago", text: "World-class Indian train! Super clean, fast, and comfortable. Proud of Indian Railways." },
    ],
  },
  {
    id: "tr-5",
    name: "Kerala Express",
    number: "12625",
    from: "New Delhi",
    fromCode: "NDLS",
    to: "Trivandrum Central",
    toCode: "TVC",
    departureTime: "11:25",
    arrivalTime: "19:45",
    duration: "44h 20m",
    day: "Daily",
    distance: "3,054 km",
    pantry: true,
    classes: [
      { id: "2A", name: "Second AC", code: "2A", price: 3850, available: 18, total: 54 },
      { id: "3A", name: "Third AC", code: "3A", price: 2650, available: 45, total: 120 },
      { id: "SL", name: "Sleeper", code: "SL", price: 980, available: 200, total: 400 },
    ],
    badges: ["Longest Route", "Popular"],
    reviews: [
      { name: "Meera N.", avatar: "MN", rating: 4, date: "1 month ago", text: "Long journey but comfortable. The scenic views through Western Ghats are worth it." },
    ],
  },
];

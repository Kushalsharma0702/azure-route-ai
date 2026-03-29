import bali from "@/assets/destinations/bali.jpg";
import santorini from "@/assets/destinations/santorini.jpg";
import switzerland from "@/assets/destinations/switzerland.jpg";
import maldives from "@/assets/destinations/maldives.jpg";
import india from "@/assets/destinations/india.jpg";
import dubai from "@/assets/destinations/dubai.jpg";

export const trendingDeals = [
  {
    id: 1,
    destination: "Bali, Indonesia",
    image: bali,
    price: "₹32,999",
    originalPrice: "₹47,999",
    discount: "30% OFF",
    urgency: "Only 3 left!",
    rating: 4.8,
    duration: "5N/6D",
  },
  {
    id: 2,
    destination: "Santorini, Greece",
    image: santorini,
    price: "₹89,999",
    originalPrice: "₹1,19,999",
    discount: "25% OFF",
    urgency: "Selling fast!",
    rating: 4.9,
    duration: "6N/7D",
  },
  {
    id: 3,
    destination: "Swiss Alps",
    image: switzerland,
    price: "₹1,12,999",
    originalPrice: "₹1,49,999",
    discount: "24% OFF",
    urgency: "Limited seats",
    rating: 4.9,
    duration: "7N/8D",
  },
  {
    id: 4,
    destination: "Maldives",
    image: maldives,
    price: "₹54,999",
    originalPrice: "₹74,999",
    discount: "27% OFF",
    urgency: "Only 5 left!",
    rating: 4.7,
    duration: "4N/5D",
  },
  {
    id: 5,
    destination: "Taj Mahal, India",
    image: india,
    price: "₹8,999",
    originalPrice: "₹12,999",
    discount: "31% OFF",
    urgency: "Weekend deal",
    rating: 4.6,
    duration: "2N/3D",
  },
  {
    id: 6,
    destination: "Dubai, UAE",
    image: dubai,
    price: "₹45,999",
    originalPrice: "₹59,999",
    discount: "23% OFF",
    urgency: "Trending!",
    rating: 4.8,
    duration: "5N/6D",
  },
];

export const packageCategories = [
  { id: 1, title: "Weekend Getaways", icon: "🏖️", count: 42, color: "from-blue-500/10 to-cyan-500/10" },
  { id: 2, title: "Honeymoon Specials", icon: "💑", count: 28, color: "from-pink-500/10 to-rose-500/10" },
  { id: 3, title: "Family Trips", icon: "👨‍👩‍👧‍👦", count: 35, color: "from-amber-500/10 to-orange-500/10" },
  { id: 4, title: "Adventure Tours", icon: "🏔️", count: 19, color: "from-emerald-500/10 to-teal-500/10" },
];

export const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    role: "Solo Traveler",
    text: "The AI planner saved me hours of research. My Bali trip was perfectly organized — every hotel, activity, and transfer was spot on!",
    rating: 5,
    avatar: "PS",
  },
  {
    id: 2,
    name: "Rahul Mehta",
    role: "Family Vacation",
    text: "Booked a complete family package to Switzerland. The budget optimizer helped us save ₹15,000 without compromising on quality.",
    rating: 5,
    avatar: "RM",
  },
  {
    id: 3,
    name: "Ananya Patel",
    role: "Honeymoon Trip",
    text: "One-click booking for our Maldives honeymoon was magical. Everything from flights to candlelight dinner was pre-arranged!",
    rating: 5,
    avatar: "AP",
  },
];

export const sampleItinerary = [
  { day: 1, title: "Arrival & Beach Chill", activities: ["Airport pickup", "Resort check-in", "Sunset beach walk", "Welcome dinner"] },
  { day: 2, title: "Temple & Culture Day", activities: ["Uluwatu Temple visit", "Traditional dance show", "Local cuisine tour", "Spa session"] },
  { day: 3, title: "Adventure & Exploration", activities: ["Sunrise trekking", "Rice terrace visit", "Waterfall exploration", "Cooking class"] },
];

export const searchResults = [
  {
    id: 1,
    name: "The Grand Bali Resort & Spa",
    image: bali,
    price: "₹4,999",
    pricePerNight: true,
    rating: 4.8,
    reviews: 2340,
    features: ["Free WiFi", "Pool", "Spa", "Breakfast"],
    location: "Seminyak, Bali",
  },
  {
    id: 2,
    name: "Santorini Blue Dome Suites",
    image: santorini,
    price: "₹12,499",
    pricePerNight: true,
    rating: 4.9,
    reviews: 1892,
    features: ["Sea View", "Pool", "Restaurant", "Airport Transfer"],
    location: "Oia, Santorini",
  },
  {
    id: 3,
    name: "Alpine Chalet Switzerland",
    image: switzerland,
    price: "₹15,999",
    pricePerNight: true,
    rating: 4.7,
    reviews: 956,
    features: ["Mountain View", "Ski Access", "Fireplace", "Breakfast"],
    location: "Interlaken, Switzerland",
  },
  {
    id: 4,
    name: "Maldives Water Villa",
    image: maldives,
    price: "₹18,999",
    pricePerNight: true,
    rating: 4.9,
    reviews: 3120,
    features: ["Overwater", "Private Pool", "All Inclusive", "Snorkeling"],
    location: "Male Atoll, Maldives",
  },
];

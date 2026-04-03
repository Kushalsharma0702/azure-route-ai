import goa from "@/assets/destinations/goa.jpg";
import jaipur from "@/assets/destinations/jaipur.jpg";
import kashmir from "@/assets/destinations/kashmir.jpg";
import kerala from "@/assets/destinations/kerala.jpg";
import manali from "@/assets/destinations/manali.jpg";
import udaipur from "@/assets/destinations/udaipur.jpg";
import varanasi from "@/assets/destinations/varanasi.jpg";
import andaman from "@/assets/destinations/andaman.jpg";
import rishikesh from "@/assets/destinations/rishikesh.jpg";

export const trendingDeals = [
  {
    id: 1,
    destination: "Goa, India",
    image: goa,
    price: "₹8,999",
    originalPrice: "₹14,999",
    discount: "40% OFF",
    urgency: "Only 3 left!",
    rating: 4.8,
    duration: "3N/4D",
  },
  {
    id: 2,
    destination: "Kashmir, India",
    image: kashmir,
    price: "₹18,999",
    originalPrice: "₹27,999",
    discount: "32% OFF",
    urgency: "Selling fast!",
    rating: 4.9,
    duration: "5N/6D",
  },
  {
    id: 3,
    destination: "Kerala Backwaters",
    image: kerala,
    price: "₹12,999",
    originalPrice: "₹18,999",
    discount: "31% OFF",
    urgency: "Weekend deal",
    rating: 4.7,
    duration: "4N/5D",
  },
  {
    id: 4,
    destination: "Manali, Himachal",
    image: manali,
    price: "₹9,499",
    originalPrice: "₹15,999",
    discount: "41% OFF",
    urgency: "Only 5 left!",
    rating: 4.6,
    duration: "4N/5D",
  },
  {
    id: 5,
    destination: "Jaipur, Rajasthan",
    image: jaipur,
    price: "₹7,499",
    originalPrice: "₹11,999",
    discount: "37% OFF",
    urgency: "Trending!",
    rating: 4.7,
    duration: "2N/3D",
  },
  {
    id: 6,
    destination: "Andaman Islands",
    image: andaman,
    price: "₹22,999",
    originalPrice: "₹32,999",
    discount: "30% OFF",
    urgency: "Limited seats",
    rating: 4.9,
    duration: "5N/6D",
  },
];

export const packageCategories = [
  { id: 1, title: "Weekend Getaways", icon: "", count: 42, color: " " },
  { id: 2, title: "Honeymoon Specials", icon: "", count: 28, color: " " },
  { id: 3, title: "Family Trips", icon: "", count: 35, color: " " },
  { id: 4, title: "Adventure Tours", icon: "", count: 19, color: " " },
];

export const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    role: "Solo Traveler from Delhi",
    text: "The AI planner saved me hours of research. My Kashmir trip was perfectly organized — every hotel, shikara ride, and transfer was spot on! Saved ₹8,000 compared to other platforms.",
    rating: 5,
    avatar: "PS",
  },
  {
    id: 2,
    name: "Rahul Mehta",
    role: "Family Vacation from Mumbai",
    text: "Booked a complete family package to Kerala. The budget optimizer helped us save ₹15,000 without compromising on quality. Kids loved the houseboat experience!",
    rating: 5,
    avatar: "RM",
  },
  {
    id: 3,
    name: "Ananya Patel",
    role: "Honeymoon Trip from Bangalore",
    text: "One-click booking for our Udaipur honeymoon was magical. Everything from flights to lake-view candlelight dinner was pre-arranged! Truly hassle-free.",
    rating: 5,
    avatar: "AP",
  },
];

export const sampleItinerary = [
  { day: 1, title: "Arrival in Jaipur", activities: ["Airport pickup at JAI", "Hotel check-in at Rambagh Palace", "Visit Hawa Mahal at sunset", "Traditional Rajasthani dinner"] },
  { day: 2, title: "Forts & Palaces", activities: ["Amer Fort & elephant ride", "City Palace tour", "Jantar Mantar visit", "Bazaar shopping at Johari Bazaar"] },
  { day: 3, title: "Culture & Departure", activities: ["Nahargarh Fort sunrise", "Block printing workshop", "Lunch at Chokhi Dhani", "Airport transfer"] },
];

export const searchResults = [
  {
    id: 1,
    name: "The Oberoi Udaivilas",
    image: udaipur,
    price: "₹9,999",
    pricePerNight: true,
    rating: 4.8,
    reviews: 4200,
    features: ["Lake View", "Pool", "Spa", "Fine Dining"],
    location: "Udaipur, Rajasthan",
  },
  {
    id: 2,
    name: "Taj Lake Palace",
    image: udaipur,
    price: "₹14,999",
    pricePerNight: true,
    rating: 4.9,
    reviews: 3892,
    features: ["Heritage", "Pool", "Restaurant", "Boat Transfer"],
    location: "Udaipur, Rajasthan",
  },
  {
    id: 3,
    name: "Wildflower Hall, Shimla",
    image: manali,
    price: "₹12,999",
    pricePerNight: true,
    rating: 4.7,
    reviews: 1856,
    features: ["Mountain View", "Spa", "Trekking", "Breakfast"],
    location: "Shimla, Himachal Pradesh",
  },
  {
    id: 4,
    name: "Kumarakom Lake Resort",
    image: kerala,
    price: "₹8,999",
    pricePerNight: true,
    rating: 4.8,
    reviews: 2120,
    features: ["Backwater View", "Pool", "Ayurvedic Spa", "Houseboat"],
    location: "Kumarakom, Kerala",
  },
];

import bali from "@/assets/destinations/bali.jpg";
import dubai from "@/assets/destinations/dubai.jpg";
import santorini from "@/assets/destinations/santorini.jpg";
import switzerland from "@/assets/destinations/switzerland.jpg";
import maldives from "@/assets/destinations/maldives.jpg";
import india from "@/assets/destinations/india.jpg";

export interface Package {
  id: string;
  title: string;
  destination: string;
  image: string;
  images: string[];
  duration: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  inclusions: string[];
  exclusions: string[];
  itinerary: { day: number; title: string; activities: string[] }[];
  badges: string[];
  category: string;
  description: string;
  highlights: string[];
  addOns: AddOn[];
  policies: { cancellation: string; payment: string };
}

export interface AddOn {
  id: string;
  name: string;
  description: string;
  price: number;
  selected?: boolean;
}

export const packages: Package[] = [
  {
    id: "pk-1",
    title: "Blissful Bali Escape",
    destination: "Bali, Indonesia",
    image: bali,
    images: [bali, maldives, santorini],
    duration: "5N/6D",
    price: 32999,
    originalPrice: 47999,
    rating: 4.8,
    reviews: 1240,
    inclusions: ["Return Flights", "5-Star Resort", "Breakfast & Dinner", "Airport Transfers", "Sightseeing", "Water Sports"],
    exclusions: ["Visa Fee", "Travel Insurance", "Personal Expenses", "Lunch"],
    itinerary: [
      { day: 1, title: "Arrival & Beach", activities: ["Airport pickup", "Resort check-in", "Beach walk", "Welcome dinner"] },
      { day: 2, title: "Temples & Culture", activities: ["Uluwatu Temple", "Kecak dance show", "Seafood dinner"] },
      { day: 3, title: "Adventure Day", activities: ["Mt. Batur sunrise trek", "White water rafting", "Spa evening"] },
      { day: 4, title: "Island Tour", activities: ["Nusa Penida tour", "Snorkeling", "Beach club"] },
      { day: 5, title: "Leisure", activities: ["Rice terrace visit", "Shopping in Seminyak", "Farewell dinner"] },
      { day: 6, title: "Departure", activities: ["Breakfast", "Airport transfer"] },
    ],
    badges: ["30% OFF", "Best Seller"],
    category: "Honeymoon",
    description: "Experience the magic of Bali with our carefully curated 6-day escape. From ancient temples to pristine beaches, adventure sports to luxury spa treatments.",
    highlights: ["Private infinity pool villa", "Sunrise trek at Mount Batur", "Authentic Balinese cooking class", "Underwater temple snorkeling"],
    addOns: [
      { id: "ao1", name: "Spa Package", description: "3 premium spa sessions", price: 4999 },
      { id: "ao2", name: "Photography Tour", description: "Professional travel photographer for a day", price: 7999 },
      { id: "ao3", name: "Adventure Bundle", description: "Parasailing + jet ski + banana boat", price: 5999 },
    ],
    policies: { cancellation: "Full refund if cancelled 15 days before departure", payment: "25% advance, rest 7 days before travel" },
  },
  {
    id: "pk-2",
    title: "Romantic Santorini Getaway",
    destination: "Santorini, Greece",
    image: santorini,
    images: [santorini, dubai, bali],
    duration: "6N/7D",
    price: 89999,
    originalPrice: 119999,
    rating: 4.9,
    reviews: 890,
    inclusions: ["Return Flights", "Caldera View Hotel", "Daily Breakfast", "Sunset Cruise", "Wine Tasting", "Airport Transfers"],
    exclusions: ["Visa Fee", "Travel Insurance", "Meals not mentioned"],
    itinerary: [
      { day: 1, title: "Arrival in Santorini", activities: ["Airport transfer", "Hotel check-in", "Oia sunset walk"] },
      { day: 2, title: "Caldera Exploration", activities: ["Caldera hike", "Hot springs visit", "Sunset dinner"] },
      { day: 3, title: "Wine & Culture", activities: ["Wine tasting tour", "Ancient Akrotiri ruins", "Greek cooking class"] },
      { day: 4, title: "Sailing Day", activities: ["Full-day catamaran cruise", "Snorkeling", "BBQ on board"] },
      { day: 5, title: "Beach Hopping", activities: ["Red Beach", "Black Beach", "Perissa Beach Club"] },
      { day: 6, title: "Leisure", activities: ["Spa day", "Shopping in Fira", "Farewell dinner at Ammoudi Bay"] },
      { day: 7, title: "Departure", activities: ["Breakfast", "Airport transfer"] },
    ],
    badges: ["25% OFF", "Premium"],
    category: "Honeymoon",
    description: "The perfect romantic escape to the world's most iconic island destination. Blue domes, stunning sunsets, and Mediterranean cuisine.",
    highlights: ["Private caldera-view suite", "Sunset catamaran cruise", "Exclusive wine tasting experience", "Couples spa treatment"],
    addOns: [
      { id: "ao1", name: "Helicopter Tour", description: "30-min helicopter ride over the caldera", price: 19999 },
      { id: "ao2", name: "Private Chef Dinner", description: "5-course meal at your villa", price: 12999 },
    ],
    policies: { cancellation: "50% refund if cancelled 20 days before departure", payment: "30% advance, rest 10 days before travel" },
  },
  {
    id: "pk-3",
    title: "Swiss Alps Adventure",
    destination: "Swiss Alps, Switzerland",
    image: switzerland,
    images: [switzerland, india, dubai],
    duration: "7N/8D",
    price: 112999,
    originalPrice: 149999,
    rating: 4.9,
    reviews: 620,
    inclusions: ["Return Flights", "4-Star Chalet", "Swiss Travel Pass", "Daily Breakfast", "Jungfraujoch Tour", "Lake Cruise"],
    exclusions: ["Visa Fee", "Travel Insurance", "Lunch & Dinner"],
    itinerary: [
      { day: 1, title: "Arrival in Zurich", activities: ["Airport transfer", "City walking tour"] },
      { day: 2, title: "Lucerne Day", activities: ["Lake Lucerne cruise", "Chapel Bridge", "Mt. Pilatus"] },
      { day: 3, title: "Interlaken", activities: ["Transfer to Interlaken", "Paragliding", "Lake Brienz"] },
      { day: 4, title: "Jungfraujoch", activities: ["Top of Europe excursion", "Ice Palace", "Sphinx Observatory"] },
      { day: 5, title: "Grindelwald", activities: ["First Cliff Walk", "Gondola rides", "Alpine meadow hike"] },
      { day: 6, title: "Bern & Cheese", activities: ["Capital city tour", "Emmental cheese factory", "Bears Park"] },
      { day: 7, title: "Leisure", activities: ["Shopping", "Optional activities", "Farewell fondue dinner"] },
      { day: 8, title: "Departure", activities: ["Breakfast", "Airport transfer"] },
    ],
    badges: ["24% OFF", "Adventure Pick"],
    category: "Adventure",
    description: "Explore the breathtaking Swiss Alps with our comprehensive 8-day tour covering Zurich, Lucerne, Interlaken, and the famous Jungfraujoch.",
    highlights: ["Jungfraujoch - Top of Europe", "Paragliding over Interlaken", "Swiss Travel Pass included", "Authentic Swiss fondue experience"],
    addOns: [
      { id: "ao1", name: "Ski Equipment", description: "Full ski gear rental for 3 days", price: 8999 },
      { id: "ao2", name: "Glacier Express", description: "Scenic train journey", price: 14999 },
    ],
    policies: { cancellation: "Full refund if cancelled 30 days before departure", payment: "20% advance" },
  },
  {
    id: "pk-4",
    title: "Golden Triangle India",
    destination: "Delhi-Agra-Jaipur, India",
    image: india,
    images: [india, bali, dubai],
    duration: "4N/5D",
    price: 14999,
    originalPrice: 21999,
    rating: 4.6,
    reviews: 2800,
    inclusions: ["AC Transport", "4-Star Hotels", "Daily Breakfast", "Monument Entry", "Guide"],
    exclusions: ["Flights", "Lunch & Dinner", "Camera Fees"],
    itinerary: [
      { day: 1, title: "Delhi Exploration", activities: ["India Gate", "Qutub Minar", "Humayun's Tomb"] },
      { day: 2, title: "Agra", activities: ["Sunrise Taj Mahal", "Agra Fort", "Mehtab Bagh"] },
      { day: 3, title: "Jaipur Transfer", activities: ["Fatehpur Sikri", "Transfer to Jaipur"] },
      { day: 4, title: "Pink City", activities: ["Amer Fort", "City Palace", "Hawa Mahal", "Bazaar shopping"] },
      { day: 5, title: "Return", activities: ["Breakfast", "Transfer to Delhi"] },
    ],
    badges: ["32% OFF", "Family Friendly"],
    category: "Family",
    description: "Discover India's rich heritage through the Golden Triangle circuit covering Delhi, Agra, and Jaipur.",
    highlights: ["Sunrise at Taj Mahal", "Elephant ride at Amer Fort", "Heritage walking tours", "Authentic Rajasthani cuisine"],
    addOns: [
      { id: "ao1", name: "Hot Air Balloon", description: "Balloon ride over Jaipur", price: 6999 },
    ],
    policies: { cancellation: "Full refund if cancelled 7 days before departure", payment: "Full payment at booking" },
  },
  {
    id: "pk-5",
    title: "Dubai Dazzle",
    destination: "Dubai, UAE",
    image: dubai,
    images: [dubai, maldives, bali],
    duration: "5N/6D",
    price: 45999,
    originalPrice: 59999,
    rating: 4.8,
    reviews: 1650,
    inclusions: ["Return Flights", "5-Star Hotel", "Breakfast", "Desert Safari", "Dhow Cruise", "City Tour"],
    exclusions: ["Visa Fee", "Travel Insurance", "Shopping"],
    itinerary: [
      { day: 1, title: "Arrival", activities: ["Airport transfer", "Marina walk", "Welcome dinner"] },
      { day: 2, title: "City Tour", activities: ["Burj Khalifa", "Dubai Mall", "Dubai Fountain show"] },
      { day: 3, title: "Desert Adventure", activities: ["Desert safari", "Camel ride", "BBQ dinner", "Belly dance show"] },
      { day: 4, title: "Modern Dubai", activities: ["Palm Jumeirah", "Aquaventure", "Atlantis"] },
      { day: 5, title: "Cultural Dubai", activities: ["Old Dubai", "Gold Souk", "Spice Souk", "Dhow cruise dinner"] },
      { day: 6, title: "Departure", activities: ["Shopping at Dubai Mall", "Airport transfer"] },
    ],
    badges: ["23% OFF", "Trending"],
    category: "Weekend",
    description: "Experience the glamour and adventure of Dubai — from soaring skyscrapers to golden desert dunes.",
    highlights: ["Burj Khalifa observation deck", "Premium desert safari with BBQ", "Atlantis Aquaventure access", "Dubai Marina yacht cruise"],
    addOns: [
      { id: "ao1", name: "Skydiving", description: "Tandem skydive over Palm Jumeirah", price: 18999 },
      { id: "ao2", name: "Yacht Cruise", description: "Private yacht for 3 hours", price: 12999 },
    ],
    policies: { cancellation: "50% refund if cancelled 10 days before departure", payment: "25% advance" },
  },
];

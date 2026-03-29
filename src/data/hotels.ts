import bali from "@/assets/destinations/bali.jpg";
import dubai from "@/assets/destinations/dubai.jpg";
import santorini from "@/assets/destinations/santorini.jpg";
import switzerland from "@/assets/destinations/switzerland.jpg";
import maldives from "@/assets/destinations/maldives.jpg";
import india from "@/assets/destinations/india.jpg";

export interface Hotel {
  id: string;
  name: string;
  image: string;
  images: string[];
  location: string;
  city: string;
  rating: number;
  reviews: number;
  price: number;
  originalPrice?: number;
  amenities: string[];
  badges: string[];
  description: string;
  policies: { checkIn: string; checkOut: string; cancellation: string };
  rooms: Room[];
  guestReviews: GuestReview[];
  coordinates: { lat: number; lng: number };
}

export interface Room {
  id: string;
  name: string;
  price: number;
  capacity: number;
  beds: string;
  size: string;
  amenities: string[];
  available: boolean;
}

export interface GuestReview {
  name: string;
  avatar: string;
  rating: number;
  date: string;
  text: string;
  stayType: string;
}

export const hotels: Hotel[] = [
  {
    id: "ht-1",
    name: "The Grand Bali Resort & Spa",
    image: bali,
    images: [bali, maldives, santorini],
    location: "Seminyak, Bali",
    city: "Bali",
    rating: 4.8,
    reviews: 2340,
    price: 4999,
    originalPrice: 7999,
    amenities: ["Free WiFi", "Pool", "Spa", "Breakfast", "Gym", "Bar"],
    badges: ["Best Seller", "Free Cancellation"],
    description: "Nestled along the pristine shores of Seminyak, The Grand Bali Resort offers an unparalleled blend of luxury, comfort, and Balinese charm. Every room features ocean views, private balconies, and world-class amenities.",
    policies: { checkIn: "2:00 PM", checkOut: "11:00 AM", cancellation: "Free cancellation up to 24 hours before check-in" },
    rooms: [
      { id: "r1", name: "Deluxe Ocean View", price: 4999, capacity: 2, beds: "1 King Bed", size: "35 sqm", amenities: ["Ocean View", "Balcony", "Mini Bar"], available: true },
      { id: "r2", name: "Premium Suite", price: 8999, capacity: 3, beds: "1 King + 1 Single", size: "55 sqm", amenities: ["Ocean View", "Living Area", "Jacuzzi", "Butler Service"], available: true },
      { id: "r3", name: "Villa with Pool", price: 14999, capacity: 4, beds: "2 King Beds", size: "90 sqm", amenities: ["Private Pool", "Garden", "Kitchen", "Dining Area"], available: false },
    ],
    guestReviews: [
      { name: "Ananya P.", avatar: "AP", rating: 5, date: "1 week ago", text: "Absolutely stunning resort! The infinity pool overlooking the ocean was magical.", stayType: "Couple" },
      { name: "Rahul S.", avatar: "RS", rating: 4, date: "2 weeks ago", text: "Great property with excellent staff. Breakfast buffet was incredible.", stayType: "Family" },
    ],
    coordinates: { lat: -8.6895, lng: 115.1681 },
  },
  {
    id: "ht-2",
    name: "Santorini Blue Dome Suites",
    image: santorini,
    images: [santorini, bali, dubai],
    location: "Oia, Santorini",
    city: "Santorini",
    rating: 4.9,
    reviews: 1892,
    price: 12499,
    originalPrice: 16999,
    amenities: ["Sea View", "Pool", "Restaurant", "Airport Transfer", "Spa"],
    badges: ["Top Rated", "Limited Availability"],
    description: "Perched on the caldera cliffs of Oia, Blue Dome Suites offers breathtaking views of the Aegean Sea and iconic sunsets. Each suite is individually designed with traditional Cycladic architecture.",
    policies: { checkIn: "3:00 PM", checkOut: "12:00 PM", cancellation: "Free cancellation up to 48 hours before check-in" },
    rooms: [
      { id: "r1", name: "Caldera View Room", price: 12499, capacity: 2, beds: "1 Queen Bed", size: "30 sqm", amenities: ["Caldera View", "Terrace"], available: true },
      { id: "r2", name: "Honeymoon Suite", price: 18999, capacity: 2, beds: "1 King Bed", size: "50 sqm", amenities: ["Private Pool", "Sunset View", "Champagne"], available: true },
    ],
    guestReviews: [
      { name: "Meera D.", avatar: "MD", rating: 5, date: "3 days ago", text: "Dream honeymoon destination. The sunset views are unreal!", stayType: "Couple" },
    ],
    coordinates: { lat: 36.4618, lng: 25.3753 },
  },
  {
    id: "ht-3",
    name: "Alpine Chalet Switzerland",
    image: switzerland,
    images: [switzerland, india, dubai],
    location: "Interlaken, Switzerland",
    city: "Switzerland",
    rating: 4.7,
    reviews: 956,
    price: 15999,
    originalPrice: 21000,
    amenities: ["Mountain View", "Ski Access", "Fireplace", "Breakfast", "Sauna"],
    badges: ["Ski-in/Ski-out"],
    description: "A charming alpine chalet in the heart of Interlaken with panoramic views of the Jungfrau mountain range. Perfect for winter sports and summer hiking.",
    policies: { checkIn: "2:00 PM", checkOut: "10:00 AM", cancellation: "Non-refundable" },
    rooms: [
      { id: "r1", name: "Mountain View Room", price: 15999, capacity: 2, beds: "1 King Bed", size: "28 sqm", amenities: ["Mountain View", "Fireplace"], available: true },
      { id: "r2", name: "Family Chalet", price: 24999, capacity: 5, beds: "2 King + 1 Bunk", size: "75 sqm", amenities: ["Kitchen", "Living Room", "Balcony"], available: true },
    ],
    guestReviews: [
      { name: "Vikram T.", avatar: "VT", rating: 5, date: "1 month ago", text: "Perfect ski trip! The chalet was cozy and the views breathtaking.", stayType: "Friends" },
    ],
    coordinates: { lat: 46.6863, lng: 7.8632 },
  },
  {
    id: "ht-4",
    name: "Maldives Water Villa",
    image: maldives,
    images: [maldives, bali, santorini],
    location: "Male Atoll, Maldives",
    city: "Maldives",
    rating: 4.9,
    reviews: 3120,
    price: 18999,
    originalPrice: 28000,
    amenities: ["Overwater", "Private Pool", "All Inclusive", "Snorkeling", "Spa"],
    badges: ["Best Value", "All Inclusive"],
    description: "Experience the ultimate in luxury with our overwater villas in the Maldives. Crystal-clear waters, private infinity pools, and all-inclusive dining.",
    policies: { checkIn: "2:00 PM", checkOut: "12:00 PM", cancellation: "Free cancellation up to 72 hours before check-in" },
    rooms: [
      { id: "r1", name: "Beach Villa", price: 18999, capacity: 2, beds: "1 King Bed", size: "60 sqm", amenities: ["Beach Access", "Outdoor Shower"], available: true },
      { id: "r2", name: "Overwater Villa", price: 32999, capacity: 2, beds: "1 King Bed", size: "80 sqm", amenities: ["Glass Floor", "Private Pool", "Sunset Deck"], available: true },
    ],
    guestReviews: [
      { name: "Sneha R.", avatar: "SR", rating: 5, date: "5 days ago", text: "Paradise on earth! The overwater villa with glass floor was a dream.", stayType: "Honeymoon" },
    ],
    coordinates: { lat: 4.1755, lng: 73.5093 },
  },
  {
    id: "ht-5",
    name: "The Oberoi Udaivilas",
    image: india,
    images: [india, dubai, bali],
    location: "Udaipur, India",
    city: "India",
    rating: 4.8,
    reviews: 4200,
    price: 9999,
    originalPrice: 14999,
    amenities: ["Lake View", "Pool", "Spa", "Fine Dining", "Heritage"],
    badges: ["Heritage Property", "33% OFF"],
    description: "A luxurious heritage hotel on the banks of Lake Pichola, offering royal Rajasthani hospitality with modern comforts.",
    policies: { checkIn: "2:00 PM", checkOut: "12:00 PM", cancellation: "Free cancellation up to 24 hours before check-in" },
    rooms: [
      { id: "r1", name: "Premier Lake View", price: 9999, capacity: 2, beds: "1 King Bed", size: "42 sqm", amenities: ["Lake View", "Balcony"], available: true },
    ],
    guestReviews: [
      { name: "Kavita J.", avatar: "KJ", rating: 5, date: "2 weeks ago", text: "Royal treatment from start to finish. The sunset views over the lake were magical.", stayType: "Anniversary" },
    ],
    coordinates: { lat: 24.5764, lng: 73.6838 },
  },
];

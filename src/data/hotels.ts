import goa from "@/assets/destinations/goa.jpg";
import jaipur from "@/assets/destinations/jaipur.jpg";
import kashmir from "@/assets/destinations/kashmir.jpg";
import kerala from "@/assets/destinations/kerala.jpg";
import manali from "@/assets/destinations/manali.jpg";
import udaipur from "@/assets/destinations/udaipur.jpg";
import varanasi from "@/assets/destinations/varanasi.jpg";
import andaman from "@/assets/destinations/andaman.jpg";
import rishikesh from "@/assets/destinations/rishikesh.jpg";

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
    name: "The Oberoi Udaivilas",
    image: udaipur,
    images: [udaipur, jaipur, kerala],
    location: "Udaipur, Rajasthan",
    city: "Udaipur",
    rating: 4.9,
    reviews: 4200,
    price: 9999,
    originalPrice: 14999,
    amenities: ["Lake View", "Pool", "Spa", "Fine Dining", "Heritage", "Gym"],
    badges: ["Heritage Property", "33% OFF"],
    description: "A luxurious heritage hotel on the banks of Lake Pichola, offering royal Rajasthani hospitality with modern comforts. Every room overlooks the serene lake with traditional Mewar architecture.",
    policies: { checkIn: "2:00 PM", checkOut: "12:00 PM", cancellation: "Free cancellation up to 24 hours before check-in" },
    rooms: [
      { id: "r1", name: "Premier Lake View", price: 9999, capacity: 2, beds: "1 King Bed", size: "42 sqm", amenities: ["Lake View", "Balcony", "Mini Bar"], available: true },
      { id: "r2", name: "Luxury Suite", price: 18999, capacity: 3, beds: "1 King + 1 Single", size: "65 sqm", amenities: ["Lake View", "Living Area", "Private Pool"], available: true },
      { id: "r3", name: "Kohinoor Suite", price: 35999, capacity: 4, beds: "2 King Beds", size: "120 sqm", amenities: ["Panoramic View", "Private Garden", "Butler Service", "Jacuzzi"], available: false },
    ],
    guestReviews: [
      { name: "Kavita J.", avatar: "KJ", rating: 5, date: "2 weeks ago", text: "Royal treatment from start to finish. The sunset views over Lake Pichola were magical. Best hotel in India!", stayType: "Anniversary" },
      { name: "Arjun M.", avatar: "AM", rating: 5, date: "1 month ago", text: "World-class service and stunning architecture. The spa was incredible.", stayType: "Honeymoon" },
    ],
    coordinates: { lat: 24.5764, lng: 73.6838 },
  },
  {
    id: "ht-2",
    name: "Taj Lake Palace",
    image: udaipur,
    images: [udaipur, jaipur, varanasi],
    location: "Lake Pichola, Udaipur",
    city: "Udaipur",
    rating: 4.9,
    reviews: 3892,
    price: 14999,
    originalPrice: 22999,
    amenities: ["Floating Palace", "Pool", "Restaurant", "Boat Transfer", "Spa", "Heritage"],
    badges: ["Top Rated", "Iconic Property"],
    description: "A stunning white marble palace floating on Lake Pichola, offering an unmatched romantic experience. Built in 1746, it's one of the most iconic hotels in the world.",
    policies: { checkIn: "3:00 PM", checkOut: "12:00 PM", cancellation: "Free cancellation up to 48 hours before check-in" },
    rooms: [
      { id: "r1", name: "Luxury Room", price: 14999, capacity: 2, beds: "1 Queen Bed", size: "35 sqm", amenities: ["Lake View", "Marble Bath"], available: true },
      { id: "r2", name: "Grand Royal Suite", price: 28999, capacity: 2, beds: "1 King Bed", size: "70 sqm", amenities: ["Private Terrace", "Lake View", "Butler"], available: true },
    ],
    guestReviews: [
      { name: "Meera D.", avatar: "MD", rating: 5, date: "3 days ago", text: "Arriving by boat to a floating palace was surreal. Unforgettable honeymoon!", stayType: "Couple" },
    ],
    coordinates: { lat: 24.5726, lng: 73.6808 },
  },
  {
    id: "ht-3",
    name: "Wildflower Hall, Shimla",
    image: manali,
    images: [manali, kashmir, rishikesh],
    location: "Shimla, Himachal Pradesh",
    city: "Shimla",
    rating: 4.7,
    reviews: 1856,
    price: 12999,
    originalPrice: 19000,
    amenities: ["Mountain View", "Spa", "Trekking", "Breakfast", "Indoor Pool", "Fireplace"],
    badges: ["Mountain Retreat"],
    description: "Perched at 8,250 feet in the Himalayan foothills, this former residence of Lord Kitchener offers spectacular mountain views and world-class amenities.",
    policies: { checkIn: "2:00 PM", checkOut: "11:00 AM", cancellation: "Non-refundable" },
    rooms: [
      { id: "r1", name: "Deluxe Valley View", price: 12999, capacity: 2, beds: "1 King Bed", size: "38 sqm", amenities: ["Valley View", "Fireplace"], available: true },
      { id: "r2", name: "Lord Kitchener Suite", price: 25999, capacity: 4, beds: "2 King Beds", size: "85 sqm", amenities: ["Panoramic View", "Living Room", "Balcony"], available: true },
    ],
    guestReviews: [
      { name: "Vikram T.", avatar: "VT", rating: 5, date: "1 month ago", text: "The mountain views are breathtaking. Perfect winter getaway with crackling fireplace.", stayType: "Family" },
    ],
    coordinates: { lat: 31.1048, lng: 77.1734 },
  },
  {
    id: "ht-4",
    name: "Kumarakom Lake Resort",
    image: kerala,
    images: [kerala, goa, andaman],
    location: "Kumarakom, Kerala",
    city: "Kerala",
    rating: 4.8,
    reviews: 2120,
    price: 8999,
    originalPrice: 13999,
    amenities: ["Backwater View", "Pool", "Ayurvedic Spa", "Houseboat", "Yoga", "Restaurant"],
    badges: ["Best Value", "Ayurvedic Retreat"],
    description: "Set on the banks of Vembanad Lake, this heritage resort offers authentic Kerala experiences including Ayurvedic treatments, houseboat cruises, and traditional cuisine.",
    policies: { checkIn: "2:00 PM", checkOut: "12:00 PM", cancellation: "Free cancellation up to 72 hours before check-in" },
    rooms: [
      { id: "r1", name: "Heritage Pavilion", price: 8999, capacity: 2, beds: "1 King Bed", size: "50 sqm", amenities: ["Lake View", "Private Garden"], available: true },
      { id: "r2", name: "Presidential Suite", price: 22999, capacity: 4, beds: "2 King Beds", size: "120 sqm", amenities: ["Private Pool", "Lake View", "Kitchen", "Dining"], available: true },
    ],
    guestReviews: [
      { name: "Sneha R.", avatar: "SR", rating: 5, date: "5 days ago", text: "The Ayurvedic spa changed my life! Waking up to backwater views every morning was heavenly.", stayType: "Wellness" },
    ],
    coordinates: { lat: 9.5916, lng: 76.4298 },
  },
  {
    id: "ht-5",
    name: "The Leela Palace Goa",
    image: goa,
    images: [goa, andaman, kerala],
    location: "South Goa, India",
    city: "Goa",
    rating: 4.8,
    reviews: 3560,
    price: 7999,
    originalPrice: 11999,
    amenities: ["Beach Access", "Pool", "Spa", "Golf", "Fine Dining", "Kids Club"],
    badges: ["Beach Resort", "Family Friendly"],
    description: "A luxury beach resort in South Goa with pristine private beach, championship golf course, and world-class dining experiences.",
    policies: { checkIn: "2:00 PM", checkOut: "12:00 PM", cancellation: "Free cancellation up to 24 hours before check-in" },
    rooms: [
      { id: "r1", name: "Lagoon Terrace", price: 7999, capacity: 2, beds: "1 King Bed", size: "40 sqm", amenities: ["Lagoon View", "Terrace"], available: true },
    ],
    guestReviews: [
      { name: "Priya K.", avatar: "PK", rating: 5, date: "1 week ago", text: "Best beach resort in Goa. The private beach was pristine and uncrowded.", stayType: "Family" },
    ],
    coordinates: { lat: 15.2993, lng: 73.8958 },
  },
];

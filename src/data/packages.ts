import goa from "@/assets/destinations/goa.jpg";
import jaipur from "@/assets/destinations/jaipur.jpg";
import kashmir from "@/assets/destinations/kashmir.jpg";
import kerala from "@/assets/destinations/kerala.jpg";
import manali from "@/assets/destinations/manali.jpg";
import udaipur from "@/assets/destinations/udaipur.jpg";
import andaman from "@/assets/destinations/andaman.jpg";
import rishikesh from "@/assets/destinations/rishikesh.jpg";
import varanasi from "@/assets/destinations/varanasi.jpg";

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
    title: "Royal Rajasthan Circuit",
    destination: "Jaipur-Jodhpur-Udaipur, Rajasthan",
    image: jaipur,
    images: [jaipur, udaipur, varanasi],
    duration: "6N/7D",
    price: 24999,
    originalPrice: 39999,
    rating: 4.9,
    reviews: 2840,
    inclusions: ["AC Transport", "4-Star Heritage Hotels", "Daily Breakfast & Dinner", "All Monument Entry", "English Guide", "Airport Transfers"],
    exclusions: ["Flights", "Lunch", "Camera Fees", "Personal Expenses"],
    itinerary: [
      { day: 1, title: "Arrival in Jaipur", activities: ["Airport pickup", "Hotel check-in", "Hawa Mahal visit", "Welcome Rajasthani dinner"] },
      { day: 2, title: "Jaipur Exploration", activities: ["Amer Fort with elephant ride", "City Palace", "Jantar Mantar", "Johari Bazaar shopping"] },
      { day: 3, title: "Jaipur to Jodhpur", activities: ["Drive to Jodhpur", "Mehrangarh Fort", "Jaswant Thada", "Blue City walk"] },
      { day: 4, title: "Jodhpur & Travel", activities: ["Umaid Bhawan Palace", "Spice markets", "Drive to Udaipur via Ranakpur"] },
      { day: 5, title: "Udaipur - City of Lakes", activities: ["City Palace", "Jagdish Temple", "Lake Pichola boat ride", "Sunset at Monsoon Palace"] },
      { day: 6, title: "Udaipur Heritage", activities: ["Saheliyon ki Bari", "Vintage car museum", "Farewell dinner at lake-view restaurant"] },
      { day: 7, title: "Departure", activities: ["Breakfast", "Souvenir shopping", "Airport transfer"] },
    ],
    badges: ["37% OFF", "Best Seller"],
    category: "Family",
    description: "Discover the royal heritage of Rajasthan through the magnificent cities of Jaipur, Jodhpur, and Udaipur. Experience forts, palaces, and the warmth of Rajasthani hospitality.",
    highlights: ["Elephant ride at Amer Fort", "Boat ride on Lake Pichola", "Heritage hotel stays", "Authentic Rajasthani cuisine"],
    addOns: [
      { id: "ao1", name: "Hot Air Balloon", description: "Balloon ride over Jaipur at sunrise", price: 6999 },
      { id: "ao2", name: "Desert Safari", description: "Camel safari with dinner in Jodhpur", price: 3999 },
      { id: "ao3", name: "Photography Tour", description: "Professional travel photographer for a day", price: 4999 },
    ],
    policies: { cancellation: "Full refund if cancelled 15 days before departure", payment: "25% advance, rest 7 days before travel" },
  },
  {
    id: "pk-2",
    title: "Kashmir Paradise",
    destination: "Srinagar-Gulmarg-Pahalgam, Kashmir",
    image: kashmir,
    images: [kashmir, manali, rishikesh],
    duration: "5N/6D",
    price: 18999,
    originalPrice: 27999,
    rating: 4.8,
    reviews: 1890,
    inclusions: ["Return Flights (Delhi)", "Houseboat Stay", "Hotel Stays", "Daily Breakfast & Dinner", "Shikara Ride", "All Transfers"],
    exclusions: ["Gondola Tickets", "Pony Rides", "Personal Expenses"],
    itinerary: [
      { day: 1, title: "Arrival in Srinagar", activities: ["Airport pickup", "Houseboat check-in on Dal Lake", "Shikara ride at sunset", "Kashmiri Wazwan dinner"] },
      { day: 2, title: "Mughal Gardens", activities: ["Nishat Bagh", "Shalimar Bagh", "Chashme Shahi", "Local market visit"] },
      { day: 3, title: "Gulmarg Excursion", activities: ["Drive to Gulmarg", "Gondola ride (Phase 1)", "Snow activities", "Return to Srinagar"] },
      { day: 4, title: "Pahalgam Day", activities: ["Drive to Pahalgam", "Betaab Valley", "Aru Valley", "Pine forest walk"] },
      { day: 5, title: "Srinagar Leisure", activities: ["Floating market on Dal Lake", "Handicraft shopping", "Farewell dinner"] },
      { day: 6, title: "Departure", activities: ["Breakfast", "Airport transfer"] },
    ],
    badges: ["32% OFF", "Most Popular"],
    category: "Honeymoon",
    description: "Experience heaven on earth with our Kashmir package. Stay on a houseboat on Dal Lake, explore meadows of Gulmarg, and discover the valleys of Pahalgam.",
    highlights: ["Houseboat stay on Dal Lake", "Shikara ride at sunset", "Gondola cable car at Gulmarg", "Betaab Valley exploration"],
    addOns: [
      { id: "ao1", name: "Skiing Package", description: "Full skiing gear + instructor for 1 day", price: 5999 },
      { id: "ao2", name: "Pahalgam Pony Ride", description: "Pony ride through valleys", price: 1999 },
    ],
    policies: { cancellation: "50% refund if cancelled 10 days before departure", payment: "30% advance, rest 7 days before travel" },
  },
  {
    id: "pk-3",
    title: "Kerala Backwater Bliss",
    destination: "Kochi-Munnar-Alleppey, Kerala",
    image: kerala,
    images: [kerala, goa, andaman],
    duration: "5N/6D",
    price: 16999,
    originalPrice: 24999,
    rating: 4.7,
    reviews: 2340,
    inclusions: ["AC Transport", "3-Star Hotels", "1 Night Houseboat", "Daily Breakfast", "Ayurvedic Massage", "Spice Garden Tour"],
    exclusions: ["Flights", "Lunch & Dinner", "Entry Fees"],
    itinerary: [
      { day: 1, title: "Arrival in Kochi", activities: ["Airport pickup", "Fort Kochi walk", "Chinese fishing nets", "Kathakali dance show"] },
      { day: 2, title: "Drive to Munnar", activities: ["Scenic drive through plantations", "Tea museum visit", "Mattupetty Dam"] },
      { day: 3, title: "Munnar Exploration", activities: ["Eravikulam National Park", "Tea plantation trek", "Spice garden visit"] },
      { day: 4, title: "Alleppey Backwaters", activities: ["Drive to Alleppey", "Houseboat check-in", "Backwater cruise", "Kerala seafood dinner on boat"] },
      { day: 5, title: "Beach & Leisure", activities: ["Alleppey beach", "Ayurvedic spa session", "Coir making demo", "Farewell dinner"] },
      { day: 6, title: "Departure", activities: ["Breakfast", "Kochi airport transfer"] },
    ],
    badges: ["32% OFF", "Nature Escape"],
    category: "Family",
    description: "Explore God's Own Country — from the misty hills of Munnar to the serene backwaters of Alleppey. A perfect blend of nature, culture, and relaxation.",
    highlights: ["Overnight houseboat on backwaters", "Tea plantation trek in Munnar", "Authentic Ayurvedic massage", "Kathakali dance performance"],
    addOns: [
      { id: "ao1", name: "Cooking Class", description: "Traditional Kerala cooking class", price: 1999 },
      { id: "ao2", name: "Wildlife Safari", description: "Periyar Wildlife Sanctuary trip", price: 3999 },
    ],
    policies: { cancellation: "Full refund if cancelled 10 days before departure", payment: "Full payment at booking" },
  },
  {
    id: "pk-4",
    title: "Goa Beach Carnival",
    destination: "North & South Goa",
    image: goa,
    images: [goa, andaman, kerala],
    duration: "3N/4D",
    price: 8999,
    originalPrice: 14999,
    rating: 4.6,
    reviews: 4200,
    inclusions: ["3-Star Beach Resort", "Daily Breakfast", "North Goa Tour", "South Goa Tour", "Cruise Dinner"],
    exclusions: ["Flights", "Lunch", "Water Sports", "Personal Expenses"],
    itinerary: [
      { day: 1, title: "Arrival & Beach", activities: ["Airport pickup", "Resort check-in", "Baga Beach sunset", "Tito's Lane nightlife"] },
      { day: 2, title: "North Goa", activities: ["Aguada Fort", "Anjuna Flea Market", "Chapora Fort", "Beach shack dinner"] },
      { day: 3, title: "South Goa", activities: ["Basilica of Bom Jesus", "Palolem Beach", "Spice plantation visit", "Dinner cruise on Mandovi"] },
      { day: 4, title: "Departure", activities: ["Breakfast", "Souvenir shopping", "Airport transfer"] },
    ],
    badges: ["40% OFF", "Weekend Pick"],
    category: "Weekend",
    description: "The ultimate Goa beach holiday — sun, sand, and soul. Explore historic forts, vibrant nightlife, pristine beaches, and delicious Goan cuisine.",
    highlights: ["Sunset at Chapora Fort", "Cruise dinner on Mandovi River", "Spice plantation tour", "Flea market shopping"],
    addOns: [
      { id: "ao1", name: "Water Sports", description: "Parasailing + jet ski + banana boat", price: 2999 },
      { id: "ao2", name: "Dudhsagar Falls", description: "Day trip to Dudhsagar waterfall", price: 3499 },
    ],
    policies: { cancellation: "Full refund if cancelled 5 days before departure", payment: "Full payment at booking" },
  },
  {
    id: "pk-5",
    title: "Spiritual Varanasi & Rishikesh",
    destination: "Varanasi-Rishikesh, UP & Uttarakhand",
    image: varanasi,
    images: [varanasi, rishikesh, jaipur],
    duration: "4N/5D",
    price: 12999,
    originalPrice: 18999,
    rating: 4.7,
    reviews: 1560,
    inclusions: ["Train Tickets (AC)", "3-Star Hotels", "Daily Breakfast", "Ganga Aarti", "Boat Ride", "All Transfers"],
    exclusions: ["Flights", "Lunch & Dinner", "Adventure Activities"],
    itinerary: [
      { day: 1, title: "Arrival in Varanasi", activities: ["Station pickup", "Hotel check-in", "Evening Ganga Aarti at Dashashwamedh"] },
      { day: 2, title: "Sacred Varanasi", activities: ["Sunrise boat ride on Ganges", "Kashi Vishwanath Temple", "Sarnath Buddhist site", "Silk weaving factory"] },
      { day: 3, title: "Travel to Rishikesh", activities: ["Morning train to Haridwar", "Transfer to Rishikesh", "Laxman Jhula walk", "Ganga Aarti at Triveni Ghat"] },
      { day: 4, title: "Adventure Rishikesh", activities: ["Yoga session at ashram", "Beatles Ashram visit", "Café hopping", "White water rafting"] },
      { day: 5, title: "Departure", activities: ["Sunrise yoga", "Breakfast", "Dehradun airport transfer"] },
    ],
    badges: ["32% OFF", "Spiritual Journey"],
    category: "Adventure",
    description: "A soulful journey through India's spiritual heartland — from the ancient ghats of Varanasi to the yoga capital Rishikesh.",
    highlights: ["Sunrise boat ride on Ganges", "Ganga Aarti ceremony", "Yoga at authentic ashram", "White water rafting in Rishikesh"],
    addOns: [
      { id: "ao1", name: "Bungee Jumping", description: "India's highest bungee at Rishikesh", price: 3999 },
      { id: "ao2", name: "Camping", description: "Overnight riverside camping", price: 2499 },
    ],
    policies: { cancellation: "Full refund if cancelled 7 days before departure", payment: "Full payment at booking" },
  },
  {
    id: "pk-6",
    title: "Andaman Island Explorer",
    destination: "Port Blair-Havelock-Neil, Andaman",
    image: andaman,
    images: [andaman, goa, kerala],
    duration: "5N/6D",
    price: 28999,
    originalPrice: 42999,
    rating: 4.8,
    reviews: 980,
    inclusions: ["Return Flights (Delhi)", "Beach Resort", "Ferry Tickets", "Snorkeling", "Scuba Diving Intro", "All Transfers"],
    exclusions: ["Lunch & Dinner", "Water Sports (Extra)", "Personal Expenses"],
    itinerary: [
      { day: 1, title: "Arrival in Port Blair", activities: ["Airport pickup", "Cellular Jail visit", "Light & Sound show"] },
      { day: 2, title: "Havelock Island", activities: ["Ferry to Havelock", "Radhanagar Beach (Asia's best)", "Sunset at beach"] },
      { day: 3, title: "Water Adventures", activities: ["Snorkeling at Elephant Beach", "Scuba diving introduction", "Beach leisure"] },
      { day: 4, title: "Neil Island", activities: ["Ferry to Neil", "Natural Rock Bridge", "Laxmanpur Beach sunset", "Snorkeling"] },
      { day: 5, title: "Return to Port Blair", activities: ["Ferry back", "Corbyn's Cove Beach", "Shopping", "Seafood dinner"] },
      { day: 6, title: "Departure", activities: ["Breakfast", "Airport transfer"] },
    ],
    badges: ["33% OFF", "Island Paradise"],
    category: "Adventure",
    description: "Discover India's hidden tropical paradise — turquoise waters, pristine beaches, and incredible marine life in the Andaman Islands.",
    highlights: ["Radhanagar Beach - Asia's best", "Scuba diving in coral reefs", "Cellular Jail heritage visit", "Island hopping by ferry"],
    addOns: [
      { id: "ao1", name: "Sea Walking", description: "Walk on the ocean floor", price: 4999 },
      { id: "ao2", name: "Glass Bottom Boat", description: "See coral without getting wet", price: 1999 },
    ],
    policies: { cancellation: "50% refund if cancelled 15 days before departure", payment: "30% advance, rest 10 days before travel" },
  },
  {
    id: "pk-6",
    title: "Mathura & Vrindavan Spiritual Journey",
    destination: "Mathura-Vrindavan-Gokul-Nandgaon-Ramanriti",
    image: varanasi,
    images: [
      varanasi,
      "https://images.unsplash.com/photo-1599567894871-90b85d841e4f?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1599567893197-37f33ad3abc9?w=800&h=600&fit=crop"
    ],
    duration: "5N/6D",
    price: 12999,
    originalPrice: 18999,
    rating: 4.8,
    reviews: 1540,
    inclusions: ["AC Transport", "3-Star Hotels", "Daily Breakfast & Dinner", "Temple Entry Fees", "Local Hindi/English Guide", "All Transfers"],
    exclusions: ["Flights", "Lunch", "Photography Permits", "Personal Expenses"],
    itinerary: [
      { day: 1, title: "Arrival in Mathura", activities: ["Train/Bus station pickup", "Hotel check-in", "Krishna Janmasthan Temple visit", "Ghat exploration at evening aarti", "Local street food dinner"] },
      { day: 2, title: "Mathura & Gokul", activities: ["Banke Bihari Temple", "Dwarkadhish Temple", "Drive to Gokul", "Govardhan Hill circumambulation (Parikrama)", "Nanda Sarovar visit", "Dinner with local family"] },
      { day: 3, title: "Vrindavan Divine", activities: ["Banke Bihari Temple (early morning)", "Radha Raman Temple", "ISKCON Temple", "Govind Dev Ji Temple", "Radha Kund & Shyam Kund", "Kirtan at evening"] },
      { day: 4, title: "Nandgaon & Ramanriti", activities: ["Drive to Nandgaon", "Nand Bhawan (Krishna's childhood home)", "Local market exploration", "Ramanriti village visit", "Radhavallabh Temple", "Traditional Rajasthani evening meal"] },
      { day: 5, title: "Spiritual Immersion", activities: ["Sunrise meditation & yoga at temple", "Brahma Kund visit", "Local village walk & cultural exchange", "Sufi evening at Taj Mahal nearby (Agra - 60km)", "Traditional Krishna Leela drama or music session"] },
      { day: 6, title: "Departure", activities: ["Breakfast", "Last-minute temple darshan", "Station/airport transfer"] },
    ],
    badges: ["31% OFF", "Spiritual Tour"],
    category: "Pilgrimage",
    description: "Embark on a sacred journey through the divine lands of Krishna. Visit the holy sites of Mathura, Vrindavan, Gokul, Nandgaon, and Ramanriti — walk in the footsteps of Lord Krishna with spiritual guides and devotional experiences.",
    highlights: ["Krishna Janmasthan Temple in Mathura", "Vrindavan temple circuit with local guide", "Govardhan Hill Parikrama (circumambulation)", "Early morning aartis and kirtans", "Village stays with local families"],
    addOns: [
      { id: "ao1", name: "Taj Mahal Day Trip", description: "Full day guided tour to Taj Mahal from Mathura", price: 3999 },
      { id: "ao2", name: "Spiritual Yoga Session", description: "5-day morning yoga & meditation program", price: 2999 },
      { id: "ao3", name: "Traditional Cooking Class", description: "Learn to make Krishna's favorite sweets (Kheer, Laddu)", price: 1999 },
    ],
    policies: { cancellation: "Full refund if cancelled 10 days before departure", payment: "25% advance, rest 7 days before travel" },
  },
];


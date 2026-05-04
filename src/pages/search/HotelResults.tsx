import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, MapPin, Filter, X, Building, Bed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { hotel as hotelApi } from "@/services/api";

/**
 * HotelResults — reads from GET /api/v1/hotel/rooms
 * This is the SAME table Hotel-CRM writes to (hotel_rooms).
 * When admin adds a room in Hotel-CRM, it instantly appears here.
 */

interface ApiRoom {
  id: number;
  name: string;
  type: string;
  price: number;
  available: boolean;
  amenities: string[];
  image_url: string | null;
  description: string | null;
  capacity: number;
  beds: string;
  size: string;
  hotel_id: number | null;
  created_at: string;
}

const HotelResults = () => {
  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState<ApiRoom[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState("price");
  const [maxPrice, setMaxPrice] = useState(25000);
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    hotelApi
      .rooms(false) // GET /api/v1/hotel/rooms — same table Hotel-CRM writes to
      .then((data) => {
        setRooms(data.rooms || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch rooms:", err);
        setError("Failed to load rooms from server");
        setLoading(false);
      });
  }, []);

  const filtered = rooms
    .filter((r) => r.price <= maxPrice && (!showAvailableOnly || r.available))
    .sort((a, b) =>
      sortBy === "price" ? a.price - b.price : sortBy === "name" ? a.name.localeCompare(b.name) : 0,
    );

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20 pb-16">
          <div className="bg-card border-b border-border">
            <div className="container py-4 flex flex-wrap items-center gap-4 justify-between">
              <div className="flex items-center gap-2 text-sm">
                <Building className="w-4 h-4 text-primary" />
                <span className="font-semibold">Available Rooms</span>
                <span className="text-muted-foreground">• {rooms.filter((r) => r.available).length} available</span>
              </div>
              <Button variant="outline" size="sm" className="rounded-xl text-xs">
                Modify Search
              </Button>
            </div>
          </div>

          <div className="container mt-6">
            {error && (
              <div className="mb-4 p-4 rounded-xl bg-destructive/10 text-destructive text-sm">
                {error}
              </div>
            )}

            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">
                {loading ? "Loading…" : `${filtered.length} rooms found`}
              </h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setFilterOpen(!filterOpen)}
                  className="md:hidden flex items-center gap-1 text-sm font-medium text-primary"
                >
                  <Filter className="w-4 h-4" /> Filters
                </button>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-sm border border-border rounded-lg px-3 py-2 bg-card"
                >
                  <option value="price">Price: Low to High</option>
                  <option value="name">Name: A-Z</option>
                </select>
              </div>
            </div>

            <div className="flex gap-6">
              {/* Filter sidebar */}
              <aside
                className={`${filterOpen ? "fixed inset-0 z-50 bg-background p-6 overflow-y-auto" : "hidden"} md:block md:relative md:w-64 flex-shrink-0`}
              >
                <div className="flex items-center justify-between md:hidden mb-4">
                  <h3 className="font-bold">Filters</h3>
                  <button onClick={() => setFilterOpen(false)}>
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="bg-card rounded-2xl shadow-card border border-border/50 p-5 space-y-6">
                  <div>
                    <h4 className="text-sm font-semibold mb-3">Price per Night</h4>
                    <input
                      type="range"
                      min={500}
                      max={35000}
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>₹500</span>
                      <span className="font-semibold text-foreground">
                        ₹{maxPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold mb-3">Availability</h4>
                    <button
                      onClick={() => setShowAvailableOnly(!showAvailableOnly)}
                      className={`block w-full text-left px-3 py-2 rounded-lg text-sm mb-1 transition-colors ${
                        showAvailableOnly
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      {showAvailableOnly ? "✓ Available Only" : "Show All"}
                    </button>
                  </div>
                </div>
              </aside>

              {/* Room cards */}
              <div className="flex-1 space-y-4">
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-card rounded-2xl shadow-card border border-border/50 p-4 flex gap-4"
                    >
                      <Skeleton className="w-48 h-36 rounded-xl flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-48" />
                        <Skeleton className="h-3 w-32" />
                        <Skeleton className="h-3 w-64" />
                        <Skeleton className="h-6 w-24 mt-4" />
                      </div>
                    </div>
                  ))
                ) : filtered.length === 0 ? (
                  <div className="bg-card rounded-2xl shadow-card border border-border/50 p-12 text-center">
                    <Building className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                    <h3 className="font-bold mb-1">No rooms found</h3>
                    <p className="text-sm text-muted-foreground">
                      {rooms.length === 0
                        ? "No rooms added yet. Add rooms from the Hotel-CRM admin panel."
                        : "Try adjusting your filters"}
                    </p>
                  </div>
                ) : (
                  filtered.map((room, i) => (
                    <motion.div
                      key={room.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        to={`/hotels/${room.id}`}
                        className="block bg-card rounded-2xl shadow-card border border-border/50 overflow-hidden hover:shadow-card-hover transition-all glow-card"
                      >
                        <div className="flex flex-col sm:flex-row">
                          <div className="sm:w-56 h-44 sm:h-auto flex-shrink-0 relative bg-muted">
                            {room.image_url ? (
                              <img
                                src={room.image_url}
                                alt={room.name}
                                loading="lazy"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                                <Bed className="w-8 h-8 text-primary/30" />
                              </div>
                            )}
                            <span className="absolute top-3 left-3 text-xs px-2 py-1 rounded-full bg-primary text-primary-foreground font-medium">
                              {room.type}
                            </span>
                            {!room.available && (
                              <span className="absolute top-3 right-3 text-xs px-2 py-1 rounded-full bg-destructive text-destructive-foreground font-medium">
                                Sold Out
                              </span>
                            )}
                          </div>
                          <div className="p-5 flex-1 flex flex-col justify-between">
                            <div>
                              <h3 className="font-bold text-base mb-1">{room.name}</h3>
                              <p className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                                <Bed className="w-3 h-3" /> {room.beds || "1 King Bed"} • {room.size || "30 sqm"} • Up to {room.capacity || 2} guests
                              </p>
                              {room.description && (
                                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{room.description}</p>
                              )}
                              <div className="flex flex-wrap gap-1.5">
                                {(room.amenities || []).slice(0, 5).map((a) => (
                                  <span
                                    key={a}
                                    className="text-xs px-2 py-0.5 rounded-md bg-muted text-muted-foreground"
                                  >
                                    {a}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="flex items-end justify-between mt-4">
                              <div>
                                <span className="text-xl font-extrabold text-primary">
                                  ₹{room.price.toLocaleString()}
                                </span>
                                <span className="text-xs text-muted-foreground ml-1">/ night</span>
                              </div>
                              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                room.available
                                  ? "bg-success/10 text-success"
                                  : "bg-destructive/10 text-destructive"
                              }`}>
                                {room.available ? "Available" : "Sold Out"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default HotelResults;

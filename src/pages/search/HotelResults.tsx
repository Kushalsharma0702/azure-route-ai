import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, MapPin, Filter, X, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { hotels } from "@/data/hotels";

const HotelResults = () => {
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState("price");
  const [maxPrice, setMaxPrice] = useState(25000);
  const [minRating, setMinRating] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(t);
  }, []);

  const filtered = hotels
    .filter((h) => h.price <= maxPrice && h.rating >= minRating)
    .sort((a, b) => (sortBy === "price" ? a.price - b.price : sortBy === "rating" ? b.rating - a.rating : 0));

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20 pb-16">
          <div className="bg-card border-b border-border">
            <div className="container py-4 flex flex-wrap items-center gap-4 justify-between">
              <div className="flex items-center gap-2 text-sm">
                <Building className="w-4 h-4 text-primary" />
                <span className="font-semibold">Hotels in Bali</span>
                <span className="text-muted-foreground">• 2 Guests • 1 Room</span>
              </div>
              <Button variant="outline" size="sm" className="rounded-xl text-xs">Modify Search</Button>
            </div>
          </div>

          <div className="container mt-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">{filtered.length} hotels found</h2>
              <div className="flex items-center gap-3">
                <button onClick={() => setFilterOpen(!filterOpen)} className="md:hidden flex items-center gap-1 text-sm font-medium text-primary">
                  <Filter className="w-4 h-4" /> Filters
                </button>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="text-sm border border-border rounded-lg px-3 py-2 bg-card">
                  <option value="price">Price: Low to High</option>
                  <option value="rating">Rating: High to Low</option>
                </select>
              </div>
            </div>

            <div className="flex gap-6">
              <aside className={`${filterOpen ? "fixed inset-0 z-50 bg-background p-6 overflow-y-auto" : "hidden"} md:block md:relative md:w-64 flex-shrink-0`}>
                <div className="flex items-center justify-between md:hidden mb-4">
                  <h3 className="font-bold">Filters</h3>
                  <button onClick={() => setFilterOpen(false)}><X className="w-5 h-5" /></button>
                </div>
                <div className="bg-card rounded-2xl shadow-card border border-border/50 p-5 space-y-6">
                  <div>
                    <h4 className="text-sm font-semibold mb-3">Price per Night</h4>
                    <input type="range" min={2000} max={35000} value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full accent-primary" />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>₹2,000</span>
                      <span className="font-semibold text-foreground">₹{maxPrice.toLocaleString()}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold mb-3">Rating</h4>
                    {[0, 4, 4.5, 4.8].map((r) => (
                      <button key={r} onClick={() => setMinRating(r)} className={`block w-full text-left px-3 py-2 rounded-lg text-sm mb-1 transition-colors ${minRating === r ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted"}`}>
                        {r === 0 ? "All" : `${r}+ `}
                      </button>
                    ))}
                  </div>
                </div>
              </aside>

              <div className="flex-1 space-y-4">
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="bg-card rounded-2xl shadow-card border border-border/50 p-4 flex gap-4">
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
                    <h3 className="font-bold mb-1">No hotels found</h3>
                    <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
                  </div>
                ) : (
                  filtered.map((hotel, i) => (
                    <motion.div key={hotel.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                      <Link to={`/hotels/${hotel.id}`} className="block bg-card rounded-2xl shadow-card border border-border/50 overflow-hidden hover:shadow-card-hover transition-all glow-card">
                        <div className="flex flex-col sm:flex-row">
                          <div className="sm:w-56 h-44 sm:h-auto flex-shrink-0 relative">
                            <img src={hotel.image} alt={hotel.name} loading="lazy" className="w-full h-full object-cover" />
                            {hotel.badges[0] && (
                              <span className="absolute top-3 left-3 text-xs px-2 py-1 rounded-full bg-primary text-primary-foreground font-medium">{hotel.badges[0]}</span>
                            )}
                          </div>
                          <div className="p-5 flex-1 flex flex-col justify-between">
                            <div>
                              <h3 className="font-bold text-base mb-1">{hotel.name}</h3>
                              <p className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                                <MapPin className="w-3 h-3" /> {hotel.location}
                              </p>
                              <div className="flex items-center gap-2 mb-3">
                                <div className="flex items-center gap-1 text-xs bg-success/10 text-success px-2 py-0.5 rounded-full font-medium">
                                  <Star className="w-3 h-3 fill-current" /> {hotel.rating}
                                </div>
                                <span className="text-xs text-muted-foreground">{hotel.reviews.toLocaleString()} reviews</span>
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                {hotel.amenities.slice(0, 4).map((a) => (
                                  <span key={a} className="text-xs px-2 py-0.5 rounded-md bg-muted text-muted-foreground">{a}</span>
                                ))}
                              </div>
                            </div>
                            <div className="flex items-end justify-between mt-4">
                              <div>
                                <span className="text-xl font-extrabold text-primary">₹{hotel.price.toLocaleString()}</span>
                                <span className="text-xs text-muted-foreground ml-1">/ night</span>
                                {hotel.originalPrice && (
                                  <div className="text-xs text-muted-foreground line-through">₹{hotel.originalPrice.toLocaleString()}</div>
                                )}
                              </div>
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

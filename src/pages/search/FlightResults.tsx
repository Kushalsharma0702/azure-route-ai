import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, ArrowRight, Filter, X, ChevronDown, Plane } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { flights } from "@/data/flights";

const FlightResults = () => {
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState("price");
  const [maxPrice, setMaxPrice] = useState(50000);
  const [stopsFilter, setStopsFilter] = useState<number | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(t);
  }, []);

  const filtered = flights
    .filter((f) => f.price <= maxPrice)
    .filter((f) => stopsFilter === null || f.stops === stopsFilter)
    .sort((a, b) => (sortBy === "price" ? a.price - b.price : sortBy === "duration" ? a.duration.localeCompare(b.duration) : 0));

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20 pb-16">
          {/* Search summary */}
          <div className="bg-card border-b border-border">
            <div className="container py-4 flex flex-wrap items-center gap-4 justify-between">
              <div className="flex items-center gap-2 text-sm">
                <Plane className="w-4 h-4 text-primary" />
                <span className="font-semibold">Delhi → Bali</span>
                <span className="text-muted-foreground">• 1 Adult • Economy</span>
              </div>
              <Button variant="outline" size="sm" className="rounded-xl text-xs">
                Modify Search
              </Button>
            </div>
          </div>

          <div className="container mt-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">{filtered.length} flights found</h2>
              <div className="flex items-center gap-3">
                <button onClick={() => setFilterOpen(!filterOpen)} className="md:hidden flex items-center gap-1 text-sm font-medium text-primary">
                  <Filter className="w-4 h-4" /> Filters
                </button>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="text-sm border border-border rounded-lg px-3 py-2 bg-card">
                  <option value="price">Price: Low to High</option>
                  <option value="duration">Duration</option>
                  <option value="departure">Departure</option>
                </select>
              </div>
            </div>

            <div className="flex gap-6">
              {/* Filters sidebar */}
              <motion.aside
                initial={false}
                animate={{ width: filterOpen || window.innerWidth >= 768 ? "auto" : 0 }}
                className={`${filterOpen ? "fixed inset-0 z-50 bg-background p-6 overflow-y-auto" : "hidden"} md:block md:relative md:w-64 flex-shrink-0`}
              >
                <div className="flex items-center justify-between md:hidden mb-4">
                  <h3 className="font-bold">Filters</h3>
                  <button onClick={() => setFilterOpen(false)}><X className="w-5 h-5" /></button>
                </div>
                <div className="bg-card rounded-2xl shadow-card border border-border/50 p-5 space-y-6">
                  <div>
                    <h4 className="text-sm font-semibold mb-3">Price Range</h4>
                    <input type="range" min={3000} max={50000} value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full accent-primary" />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>₹3,000</span>
                      <span className="font-semibold text-foreground">₹{maxPrice.toLocaleString()}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold mb-3">Stops</h4>
                    {[null, 0, 1, 2].map((s) => (
                      <button key={String(s)} onClick={() => setStopsFilter(s)} className={`block w-full text-left px-3 py-2 rounded-lg text-sm mb-1 transition-colors ${stopsFilter === s ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted"}`}>
                        {s === null ? "Any" : s === 0 ? "Non-stop" : `${s} stop${s > 1 ? "s" : ""}`}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.aside>

              {/* Results */}
              <div className="flex-1 space-y-4">
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="bg-card rounded-2xl shadow-card border border-border/50 p-6">
                      <div className="flex items-center gap-4">
                        <Skeleton className="w-12 h-12 rounded-xl" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-48" />
                        </div>
                        <Skeleton className="h-8 w-24" />
                      </div>
                    </div>
                  ))
                ) : filtered.length === 0 ? (
                  <div className="bg-card rounded-2xl shadow-card border border-border/50 p-12 text-center">
                    <Plane className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                    <h3 className="font-bold mb-1">No flights found</h3>
                    <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
                  </div>
                ) : (
                  filtered.map((flight, i) => (
                    <motion.div
                      key={flight.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link to={`/flights/${flight.id}`} className="block bg-card rounded-2xl shadow-card border border-border/50 p-5 hover:shadow-card-hover transition-all glow-card">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                          <div className="flex items-center gap-3 sm:w-32">
                            <div className="w-10 h-10 rounded-xl bg-card flex items-center justify-center font-bold text-sm text-primary">
                              {flight.airlineLogo}
                            </div>
                            <div>
                              <div className="font-semibold text-sm">{flight.airline}</div>
                              <div className="text-xs text-muted-foreground">{flight.flightNumber}</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 flex-1">
                            <div className="text-center">
                              <div className="text-lg font-bold">{flight.departureTime}</div>
                              <div className="text-xs text-muted-foreground">{flight.fromCode}</div>
                            </div>
                            <div className="flex-1 flex flex-col items-center">
                              <div className="text-xs text-muted-foreground">{flight.duration}</div>
                              <div className="w-full h-px bg-border relative my-1">
                                <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-center">
                                  <ArrowRight className="w-3 h-3 text-muted-foreground" />
                                </div>
                              </div>
                              <div className="text-xs text-muted-foreground">{flight.stops === 0 ? "Non-stop" : `${flight.stops} stop${flight.stops > 1 ? "s" : ""}`}{flight.stopCity ? ` via ${flight.stopCity}` : ""}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold">{flight.arrivalTime}</div>
                              <div className="text-xs text-muted-foreground">{flight.toCode}</div>
                            </div>
                          </div>

                          <div className="flex sm:flex-col items-center sm:items-end gap-2 sm:w-32">
                            <div className="text-xl font-extrabold text-primary">₹{flight.price.toLocaleString()}</div>
                            {flight.originalPrice && (
                              <div className="text-xs text-muted-foreground line-through">₹{flight.originalPrice.toLocaleString()}</div>
                            )}
                          </div>
                        </div>

                        {flight.badges.length > 0 && (
                          <div className="flex gap-2 mt-3 pt-3 border-t border-border/50">
                            {flight.badges.map((b) => (
                              <span key={b} className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{b}</span>
                            ))}
                            {flight.refundable && <span className="text-xs px-2 py-0.5 rounded-full bg-success/10 text-success font-medium">Free Cancellation</span>}
                          </div>
                        )}
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

export default FlightResults;

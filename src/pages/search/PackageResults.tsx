import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, MapPin, Clock, Filter, X, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { packages } from "@/data/packages";

const PackageResults = () => {
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("price");
  const [filterOpen, setFilterOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(t);
  }, []);

  const filtered = packages
    .filter((p) => !categoryFilter || p.category === categoryFilter)
    .sort((a, b) => (sortBy === "price" ? a.price - b.price : sortBy === "rating" ? b.rating - a.rating : 0));

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20 pb-16">
          <div className="bg-card border-b border-border">
            <div className="container py-4 flex flex-wrap items-center gap-4 justify-between">
              <div className="flex items-center gap-2 text-sm">
                <Package className="w-4 h-4 text-primary" />
                <span className="font-semibold">Holiday Packages</span>
                <span className="text-muted-foreground">• All Destinations</span>
              </div>
              <Button variant="outline" size="sm" className="rounded-xl text-xs">Modify Search</Button>
            </div>
          </div>

          <div className="container mt-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">{filtered.length} packages found</h2>
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
                    <h4 className="text-sm font-semibold mb-3">Category</h4>
                    {[null, "Honeymoon", "Adventure", "Family", "Weekend"].map((c) => (
                      <button key={String(c)} onClick={() => setCategoryFilter(c)} className={`block w-full text-left px-3 py-2 rounded-lg text-sm mb-1 transition-colors ${categoryFilter === c ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted"}`}>
                        {c ?? "All Categories"}
                      </button>
                    ))}
                  </div>
                </div>
              </aside>

              <div className="flex-1 grid gap-4 sm:grid-cols-2">
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="bg-card rounded-2xl shadow-card border border-border/50 overflow-hidden">
                      <Skeleton className="h-48 w-full" />
                      <div className="p-4 space-y-2">
                        <Skeleton className="h-5 w-48" />
                        <Skeleton className="h-3 w-32" />
                        <Skeleton className="h-6 w-24 mt-4" />
                      </div>
                    </div>
                  ))
                ) : (
                  filtered.map((pkg, i) => (
                    <motion.div key={pkg.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                      <Link to={`/packages/${pkg.id}`} className="block bg-card rounded-2xl shadow-card border border-border/50 overflow-hidden hover:shadow-card-hover transition-all glow-card h-full">
                        <div className="h-48 relative">
                          <img src={pkg.image} alt={pkg.title} loading="lazy" className="w-full h-full object-cover" />
                          <div className="absolute top-3 left-3 flex gap-2">
                            {pkg.badges.map((b) => (
                              <span key={b} className="text-xs px-2 py-1 rounded-full bg-primary text-primary-foreground font-medium">{b}</span>
                            ))}
                          </div>
                          <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-foreground/70 backdrop-blur-sm text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                            <Clock className="w-3 h-3" /> {pkg.duration}
                          </div>
                        </div>
                        <div className="p-5">
                          <h3 className="font-bold text-sm mb-1">{pkg.title}</h3>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mb-3">
                            <MapPin className="w-3 h-3" /> {pkg.destination}
                          </p>
                          <div className="flex flex-wrap gap-1 mb-3">
                            {pkg.inclusions.slice(0, 3).map((inc) => (
                              <span key={inc} className="text-xs px-2 py-0.5 rounded-md bg-muted text-muted-foreground">{inc}</span>
                            ))}
                          </div>
                          <div className="flex items-end justify-between">
                            <div>
                              <span className="text-lg font-extrabold text-primary">₹{pkg.price.toLocaleString()}</span>
                              {pkg.originalPrice && (
                                <span className="text-xs text-muted-foreground line-through ml-2">₹{pkg.originalPrice.toLocaleString()}</span>
                              )}
                              <div className="text-xs text-muted-foreground">per person</div>
                            </div>
                            <div className="flex items-center gap-1 text-xs">
                              <Star className="w-3 h-3 fill-warning text-warning" /> {pkg.rating}
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

export default PackageResults;

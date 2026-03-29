import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, ArrowRight, Filter, X, Train as TrainIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { trains } from "@/data/trains";

const TrainResults = () => {
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("departure");
  const [filterOpen, setFilterOpen] = useState(false);
  const [classFilter, setClassFilter] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(t);
  }, []);

  const filtered = trains
    .filter((tr) => !classFilter || tr.classes.some((c) => c.code === classFilter))
    .sort((a, b) => (sortBy === "departure" ? a.departureTime.localeCompare(b.departureTime) : sortBy === "duration" ? a.duration.localeCompare(b.duration) : 0));

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20 pb-16">
          <div className="bg-card border-b border-border">
            <div className="container py-4 flex flex-wrap items-center gap-4 justify-between">
              <div className="flex items-center gap-2 text-sm">
                <TrainIcon className="w-4 h-4 text-primary" />
                <span className="font-semibold">Delhi → Mumbai</span>
                <span className="text-muted-foreground">• 1 Passenger</span>
              </div>
              <Button variant="outline" size="sm" className="rounded-xl text-xs">Modify Search</Button>
            </div>
          </div>

          <div className="container mt-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">{filtered.length} trains found</h2>
              <div className="flex items-center gap-3">
                <button onClick={() => setFilterOpen(!filterOpen)} className="md:hidden flex items-center gap-1 text-sm font-medium text-primary">
                  <Filter className="w-4 h-4" /> Filters
                </button>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="text-sm border border-border rounded-lg px-3 py-2 bg-card">
                  <option value="departure">Departure Time</option>
                  <option value="duration">Duration</option>
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
                    <h4 className="text-sm font-semibold mb-3">Travel Class</h4>
                    {[null, "1A", "2A", "3A", "SL", "CC", "EC"].map((c) => (
                      <button key={String(c)} onClick={() => setClassFilter(c)} className={`block w-full text-left px-3 py-2 rounded-lg text-sm mb-1 transition-colors ${classFilter === c ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted"}`}>
                        {c === null ? "All Classes" : c}
                      </button>
                    ))}
                  </div>
                </div>
              </aside>

              <div className="flex-1 space-y-4">
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="bg-card rounded-2xl shadow-card border border-border/50 p-6">
                      <Skeleton className="h-5 w-48 mb-3" />
                      <Skeleton className="h-4 w-64 mb-2" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  ))
                ) : (
                  filtered.map((train, i) => (
                    <motion.div key={train.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                      <Link to={`/trains/${train.id}`} className="block bg-card rounded-2xl shadow-card border border-border/50 p-5 hover:shadow-card-hover transition-all glow-card">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-bold text-sm">{train.name}</h3>
                              <span className="text-xs text-muted-foreground">#{train.number}</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-center">
                                <div className="text-lg font-bold">{train.departureTime}</div>
                                <div className="text-xs text-muted-foreground">{train.fromCode}</div>
                              </div>
                              <div className="flex-1 flex flex-col items-center">
                                <div className="text-xs text-muted-foreground">{train.duration}</div>
                                <div className="w-full h-px bg-border relative my-1">
                                  <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-center">
                                    <ArrowRight className="w-3 h-3 text-muted-foreground" />
                                  </div>
                                </div>
                                <div className="text-xs text-muted-foreground">{train.distance}</div>
                              </div>
                              <div className="text-center">
                                <div className="text-lg font-bold">{train.arrivalTime}</div>
                                <div className="text-xs text-muted-foreground">{train.toCode}</div>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 sm:flex-col sm:items-end">
                            {train.classes.slice(0, 3).map((c) => (
                              <div key={c.code} className="flex items-center gap-2 text-xs">
                                <span className="font-medium">{c.code}</span>
                                <span className="font-bold text-primary">₹{c.price.toLocaleString()}</span>
                                <span className={`${c.available > 0 ? "text-success" : "text-destructive"}`}>
                                  {c.available > 0 ? `${c.available} avl` : "WL"}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                        {train.badges.length > 0 && (
                          <div className="flex gap-2 mt-3 pt-3 border-t border-border/50">
                            {train.badges.map((b) => (
                              <span key={b} className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{b}</span>
                            ))}
                            <span className="text-xs text-muted-foreground">{train.day}</span>
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

export default TrainResults;

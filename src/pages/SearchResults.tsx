import { useState } from "react";
import { motion } from "framer-motion";
import { Star, MapPin, Wifi, Waves, UtensilsCrossed, Car, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { searchResults } from "@/data/mockData";

const featureIcons: Record<string, any> = {
  "Free WiFi": Wifi,
  "Pool": Waves,
  "Restaurant": UtensilsCrossed,
  "Airport Transfer": Car,
};

const SearchResults = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 20000]);
  const [minRating, setMinRating] = useState(0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold">Search Results</h1>
              <p className="text-muted-foreground text-sm mt-1">{searchResults.length} properties found</p>
            </div>
            <Button
              variant="outline"
              className="md:hidden rounded-xl"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" /> Filters
            </Button>
          </div>

          <div className="flex gap-8">
            {/* Filters sidebar */}
            <div className={`${showFilters ? "fixed inset-0 z-50 bg-background p-6 overflow-auto" : "hidden"} md:block md:relative md:w-64 md:flex-shrink-0`}>
              {showFilters && (
                <button onClick={() => setShowFilters(false)} className="md:hidden absolute top-4 right-4">
                  <X className="w-5 h-5" />
                </button>
              )}
              <div className="bg-card rounded-2xl shadow-card border border-border/50 p-6 sticky top-24">
                <h3 className="font-bold mb-5">Filters</h3>

                <div className="mb-6">
                  <label className="text-sm font-medium mb-3 block">Price Range</label>
                  <input
                    type="range"
                    min={0}
                    max={20000}
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    className="w-full accent-primary"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>₹0</span>
                    <span>₹{priceRange[1].toLocaleString()}/night</span>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="text-sm font-medium mb-3 block">Minimum Rating</label>
                  <div className="flex gap-2">
                    {[3, 3.5, 4, 4.5].map((r) => (
                      <button
                        key={r}
                        onClick={() => setMinRating(r)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                          minRating === r ? "bg-primary/10 text-primary border-primary/30" : "bg-muted/50 text-muted-foreground border-border"
                        }`}
                      >
                        {r}+★
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-3 block">Amenities</label>
                  <div className="space-y-2">
                    {["Free WiFi", "Pool", "Spa", "Breakfast", "Gym"].map((a) => (
                      <label key={a} className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                        <input type="checkbox" className="rounded accent-primary" />
                        {a}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="flex-1 space-y-4">
              {searchResults.map((result, i) => (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-card rounded-2xl shadow-card border border-border/50 overflow-hidden flex flex-col md:flex-row hover:shadow-card-hover transition-shadow"
                >
                  <div className="md:w-72 h-48 md:h-auto flex-shrink-0">
                    <img src={result.image} alt={result.name} loading="lazy" className="w-full h-full object-cover" />
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-lg">{result.name}</h3>
                        <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-primary/10 text-primary text-sm font-medium">
                          <Star className="w-3.5 h-3.5 fill-primary" />
                          {result.rating}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mb-3">
                        <MapPin className="w-3.5 h-3.5" /> {result.location}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {result.features.map((f) => (
                          <span key={f} className="text-xs px-2.5 py-1 rounded-lg bg-muted text-muted-foreground">
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xl font-extrabold text-primary">{result.price}</span>
                        <span className="text-xs text-muted-foreground ml-1">/ night</span>
                        <div className="text-xs text-muted-foreground">{result.reviews.toLocaleString()} reviews</div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" className="rounded-xl text-sm">View Details</Button>
                        <Button className="rounded-xl gradient-cta text-primary-foreground border-0 text-sm hover:opacity-90 transition-opacity">
                          Book Now
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SearchResults;

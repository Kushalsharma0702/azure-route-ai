import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, MapPin, Wifi, Waves, UtensilsCrossed, Car, Shield, Clock, ChevronLeft, Heart, Share2, Check, X as XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { searchResults } from "@/data/mockData";

const amenityIcons: Record<string, any> = {
  "Free WiFi": Wifi,
  "Pool": Waves,
  "Restaurant": UtensilsCrossed,
  "Airport Transfer": Car,
  "Sea View": Star,
  "Ski Access": Star,
  "Mountain View": Star,
  "Overwater": Waves,
  "Private Pool": Waves,
  "All Inclusive": Check,
  "Snorkeling": Waves,
  "Spa": Waves,
  "Breakfast": UtensilsCrossed,
  "Fireplace": Star,
};

const reviews = [
  { name: "Sarah K.", rating: 5, text: "Absolutely incredible experience! The staff was so welcoming and the views were breathtaking. Will definitely come back.", date: "2 weeks ago" },
  { name: "Arjun M.", rating: 4, text: "Great location and beautiful property. Food could have been slightly better but overall a wonderful stay.", date: "1 month ago" },
  { name: "Emily C.", rating: 5, text: "One of the best trips of my life. The AI-suggested itinerary was perfect and the booking was seamless.", date: "3 weeks ago" },
];

const Detail = () => {
  const { id } = useParams();
  const result = searchResults.find((r) => r.id === Number(id));

  if (!result) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-16 container text-center">
          <h1 className="text-2xl font-bold mb-4">Property not found</h1>
          <Link to="/search"><Button variant="outline">Back to Search</Button></Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageTransition>
        <div className="pt-24 pb-16">
          <div className="container max-w-5xl">
            {/* Back button */}
            <Link to="/search" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
              <ChevronLeft className="w-4 h-4" /> Back to results
            </Link>

            {/* Image gallery */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl overflow-hidden mb-8 relative group"
            >
              <img src={result.image} alt={result.name} className="w-full h-64 md:h-96 object-cover" />
              <div className="absolute top-4 right-4 flex gap-2">
                <button className="w-10 h-10 rounded-xl glass flex items-center justify-center hover:scale-105 transition-transform">
                  <Heart className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 rounded-xl glass flex items-center justify-center hover:scale-105 transition-transform">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main content */}
              <div className="lg:col-span-2 space-y-8">
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                  <div className="flex items-start justify-between mb-2">
                    <h1 className="text-2xl md:text-3xl font-extrabold">{result.name}</h1>
                    <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-primary/10 text-primary font-semibold">
                      <Star className="w-4 h-4 fill-primary" /> {result.rating}
                    </div>
                  </div>
                  <p className="text-muted-foreground flex items-center gap-1 mb-4">
                    <MapPin className="w-4 h-4" /> {result.location}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Experience luxury and comfort at {result.name}. Nestled in the heart of {result.location}, this stunning property offers world-class amenities, breathtaking views, and exceptional service that will make your stay unforgettable. Whether you're traveling for leisure or adventure, every detail has been crafted to exceed your expectations.
                  </p>
                </motion.div>

                {/* Amenities */}
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <h2 className="text-lg font-bold mb-4">Amenities</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {result.features.map((f) => {
                      const Icon = amenityIcons[f] || Check;
                      return (
                        <div key={f} className="flex items-center gap-2 px-4 py-3 rounded-xl bg-muted/50 border border-border/30 text-sm">
                          <Icon className="w-4 h-4 text-primary" /> {f}
                        </div>
                      );
                    })}
                    {["24h Front Desk", "Room Service", "Air Conditioning", "Parking", "Laundry"].map((a) => (
                      <div key={a} className="flex items-center gap-2 px-4 py-3 rounded-xl bg-muted/50 border border-border/30 text-sm">
                        <Check className="w-4 h-4 text-primary" /> {a}
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Cancellation */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-success/5 border border-success/20 rounded-2xl p-5"
                >
                  <h3 className="font-bold flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-success" /> Cancellation Policy
                  </h3>
                  <p className="text-sm text-muted-foreground">Free cancellation until 48 hours before check-in. After that, the first night is non-refundable. No-show fee applies.</p>
                </motion.div>

                {/* Reviews */}
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                  <h2 className="text-lg font-bold mb-4">Guest Reviews ({result.reviews.toLocaleString()})</h2>
                  <div className="space-y-4">
                    {reviews.map((r, i) => (
                      <div key={i} className="bg-card rounded-2xl border border-border/50 p-5">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-9 h-9 rounded-full gradient-cta flex items-center justify-center text-primary-foreground text-xs font-bold">
                              {r.name.split(" ").map(n => n[0]).join("")}
                            </div>
                            <div>
                              <span className="font-semibold text-sm">{r.name}</span>
                              <div className="flex gap-0.5">
                                {Array.from({ length: r.rating }).map((_, j) => (
                                  <Star key={j} className="w-3 h-3 fill-warning text-warning" />
                                ))}
                              </div>
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {r.date}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{r.text}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Booking sidebar */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-1"
              >
                <div className="bg-card rounded-2xl shadow-card border border-border/50 p-6 sticky top-24">
                  <div className="text-center mb-4">
                    <span className="text-3xl font-extrabold text-primary">{result.price}</span>
                    <span className="text-sm text-muted-foreground"> / night</span>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1 block">Check-in</label>
                      <input type="date" className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1 block">Check-out</label>
                      <input type="date" className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1 block">Guests</label>
                      <select className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                        <option>1 Guest</option>
                        <option>2 Guests</option>
                        <option>3 Guests</option>
                        <option>4 Guests</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm mb-4 border-t border-border pt-4">
                    <div className="flex justify-between"><span className="text-muted-foreground">{result.price} × 4 nights</span><span>₹{(parseInt(result.price.replace(/[₹,]/g, "")) * 4).toLocaleString()}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Service fee</span><span>₹1,500</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Taxes</span><span>₹2,000</span></div>
                    <div className="flex justify-between font-bold text-base border-t border-border pt-2">
                      <span>Total</span>
                      <span className="text-primary">₹{(parseInt(result.price.replace(/[₹,]/g, "")) * 4 + 3500).toLocaleString()}</span>
                    </div>
                  </div>

                  <Link to="/booking">
                    <Button className="w-full h-12 gradient-cta text-primary-foreground border-0 rounded-xl font-semibold shadow-lg hover:opacity-90 transition-opacity">
                      Book Now
                    </Button>
                  </Link>
                  <p className="text-xs text-center text-muted-foreground mt-2">You won't be charged yet</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </PageTransition>
      <Footer />
    </div>
  );
};

export default Detail;

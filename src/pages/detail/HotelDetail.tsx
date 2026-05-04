/**
 * HotelDetail — shows a single room from GET /api/v1/hotel/rooms/{id}
 * 
 * Uses the SAME hotel_rooms table that Hotel-CRM writes to.
 * When admin adds/updates a room in Hotel-CRM, it instantly reflects here.
 */
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ChevronRight, Star, MapPin, Wifi, Car, UtensilsCrossed, Dumbbell,
  Waves, Wine, Shield, Building, Loader2, Bed, Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { hotel as hotelApi, feedback } from "@/services/api";

const amenityIcons: Record<string, any> = {
  "Free WiFi": Wifi, WiFi: Wifi, Pool: Waves, Spa: Waves, Gym: Dumbbell, Bar: Wine,
  Restaurant: UtensilsCrossed, Breakfast: UtensilsCrossed, "Airport Transfer": Car,
  "Sea View": MapPin, "Mountain View": MapPin, "Lake View": MapPin,
  Fireplace: Shield, AC: Shield,
};

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
}

interface RealityScore {
  hotel_id: number;
  total_reviews: number;
  avg_overall: number | null;
  avg_cleanliness: number | null;
  avg_service: number | null;
  avg_amenities: number | null;
  recommend_pct: number | null;
}

interface WeatherAlert {
  type: string; icon: string; title: string; message: string;
}

const HotelDetail = () => {
  const { id } = useParams();
  const [room, setRoom] = useState<ApiRoom | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nights, setNights] = useState(1);
  const [realityScore, setRealityScore] = useState<RealityScore | null>(null);
  const [weatherAlerts, setWeatherAlerts] = useState<WeatherAlert[]>([]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    hotelApi
      .room(Number(id))
      .then((data) => {
        setRoom(data);
        setLoading(false);
        // Fetch reality score
        feedback.score(data.hotel_id || Number(id)).then(setRealityScore).catch(() => {});
        // Fetch weather alerts for destination
        if (data.name) {
          const dest = data.name.split(/[-–,]/)[0].trim();
          fetch(`http://localhost:8000/api/v1/weather/alerts?destination=${encodeURIComponent(dest)}`)
            .then(r => r.json()).then(d => setWeatherAlerts(d.alerts || [])).catch(() => {});
        }
      })
      .catch((err) => {
        setError(err.message || "Room not found");
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background">
          <Navbar />
          <div className="pt-20 pb-16">
            <div className="container max-w-5xl space-y-6 mt-8">
              <Skeleton className="h-72 rounded-2xl" />
              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4">
                  <Skeleton className="h-8 w-64" />
                  <Skeleton className="h-4 w-96" />
                  <Skeleton className="h-32 rounded-xl" />
                </div>
                <Skeleton className="h-64 rounded-2xl" />
              </div>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  if (error || !room) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background">
          <Navbar />
          <div className="pt-20 pb-16">
            <div className="container max-w-5xl text-center mt-16">
              <Building className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">Room Not Found</h2>
              <p className="text-muted-foreground mb-4">{error || "This room doesn't exist."}</p>
              <Link to="/search/hotels">
                <Button className="rounded-xl">Browse Rooms</Button>
              </Link>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  const taxes = Math.round(room.price * nights * 0.18);
  const total = room.price * nights + taxes;

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20 pb-16">
          {/* Breadcrumb */}
          <div className="container max-w-5xl">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Link to="/" className="hover:text-primary">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <Link to="/search/hotels" className="hover:text-primary">Rooms</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-foreground font-medium">{room.name}</span>
            </div>
          </div>

          {/* Hero image */}
          <div className="container max-w-5xl mb-8">
            <div className="h-72 md:h-96 rounded-2xl overflow-hidden bg-muted relative">
              {room.image_url ? (
                <img src={room.image_url} alt={room.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                  <Bed className="w-20 h-20 text-primary/20" />
                </div>
              )}
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-bold shadow-lg">
                  {room.type}
                </span>
                <span className={`px-3 py-1.5 rounded-lg text-sm font-bold shadow-lg ${
                  room.available
                    ? "bg-success text-success-foreground"
                    : "bg-destructive text-destructive-foreground"
                }`}>
                  {room.available ? "Available" : "Sold Out"}
                </span>
              </div>
            </div>
          </div>

          <div className="container max-w-5xl">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Left: Room details */}
              <div className="md:col-span-2 space-y-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <h1 className="text-2xl md:text-3xl font-extrabold mb-2">{room.name}</h1>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Bed className="w-4 h-4" /> {room.beds || "1 King Bed"}</span>
                    <span>•</span>
                    <span>{room.size || "30 sqm"}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Users className="w-4 h-4" /> Up to {room.capacity || 2} guests</span>
                  </div>
                </motion.div>

                {room.description && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <div className="bg-card rounded-2xl shadow-card border border-border/50 p-6">
                      <h2 className="font-bold text-lg mb-3">About This Room</h2>
                      <p className="text-muted-foreground leading-relaxed">{room.description}</p>
                    </div>
                  </motion.div>
                )}

                {/* Amenities */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <div className="bg-card rounded-2xl shadow-card border border-border/50 p-6">
                    <h2 className="font-bold text-lg mb-4">Room Amenities</h2>
                    {(room.amenities || []).length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {room.amenities.map((a) => {
                          const Icon = amenityIcons[a] || Shield;
                          return (
                            <div key={a} className="flex items-center gap-2 p-2.5 rounded-xl bg-muted/50">
                              <Icon className="w-4 h-4 text-primary" />
                              <span className="text-sm">{a}</span>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No amenities listed.</p>
                    )}
                  </div>
                </motion.div>

                {/* Policies */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                  <div className="bg-card rounded-2xl shadow-card border border-border/50 p-6">
                    <h2 className="font-bold text-lg mb-3">Policies</h2>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between py-2 border-b border-border/50">
                        <span className="text-muted-foreground">Check-in</span>
                        <span className="font-medium">2:00 PM</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-border/50">
                        <span className="text-muted-foreground">Check-out</span>
                        <span className="font-medium">12:00 PM</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-muted-foreground">Cancellation</span>
                        <span className="font-medium">Free cancellation up to 24 hours before check-in</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Right: Booking sidebar */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <div className="bg-card rounded-2xl shadow-card border border-border/50 p-6 sticky top-24 space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-extrabold text-primary">₹{room.price.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">per night</div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Nights</label>
                    <select
                      value={nights}
                      onChange={(e) => setNights(Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl bg-muted/50 border border-border text-sm"
                    >
                      {[1, 2, 3, 4, 5, 7, 10, 14].map((n) => (
                        <option key={n} value={n}>{n} night{n > 1 ? "s" : ""}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{nights} night{nights > 1 ? "s" : ""} × ₹{room.price.toLocaleString()}</span>
                      <span>₹{(room.price * nights).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Taxes & Fees</span>
                      <span>₹{taxes.toLocaleString()}</span>
                    </div>
                    <div className="border-t border-border pt-2 flex justify-between font-bold">
                      <span>Total</span>
                      <span className="text-primary">₹{total.toLocaleString()}</span>
                    </div>
                  </div>

                  <Link to={`/book/hotel/${room.id}/step/1`}>
                    <Button
                      disabled={!room.available}
                      className="w-full bg-primary text-primary-foreground rounded-xl h-12 text-base font-bold border-0 hover:opacity-90 shadow-lg mt-2"
                    >
                      {room.available ? "Book Now" : "Sold Out"}
                    </Button>
                  </Link>

                  {/* Live Reality Score */}
                  {realityScore && realityScore.total_reviews > 0 && (
                    <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-extrabold text-lg shadow-md ${
                          (realityScore.avg_overall || 0) >= 8 ? 'bg-emerald-500' :
                          (realityScore.avg_overall || 0) >= 6 ? 'bg-amber-500' :
                          (realityScore.avg_overall || 0) >= 4 ? 'bg-orange-500' : 'bg-red-500'
                        }`}>
                          {realityScore.avg_overall}
                        </div>
                        <div>
                          <div className="text-sm font-bold">Reality Score</div>
                          <div className="text-xs text-muted-foreground">{realityScore.total_reviews} verified reviews</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs mt-2">
                        {realityScore.avg_cleanliness && <div className="text-center p-1.5 rounded-lg bg-white/70"><div className="font-bold">{realityScore.avg_cleanliness}</div><div className="text-muted-foreground">Clean</div></div>}
                        {realityScore.avg_service && <div className="text-center p-1.5 rounded-lg bg-white/70"><div className="font-bold">{realityScore.avg_service}</div><div className="text-muted-foreground">Service</div></div>}
                        {realityScore.avg_amenities && <div className="text-center p-1.5 rounded-lg bg-white/70"><div className="font-bold">{realityScore.avg_amenities}</div><div className="text-muted-foreground">Amenities</div></div>}
                      </div>
                      {realityScore.recommend_pct !== null && (
                        <div className="text-xs text-center mt-2 text-muted-foreground">👍 {realityScore.recommend_pct}% recommend</div>
                      )}
                    </div>
                  )}

                  {/* Weather Alerts */}
                  {weatherAlerts.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">🌤️ Travel Alerts</h4>
                      {weatherAlerts.slice(0, 3).map((alert, i) => (
                        <div key={i} className={`p-3 rounded-xl text-xs border ${
                          alert.type === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-800' :
                          alert.type === 'info' ? 'bg-blue-50 border-blue-200 text-blue-800' :
                          'bg-emerald-50 border-emerald-200 text-emerald-800'
                        }`}>
                          <span className="font-bold">{alert.icon} {alert.title}</span>
                          <p className="mt-0.5 opacity-80">{alert.message}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default HotelDetail;

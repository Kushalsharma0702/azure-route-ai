/**
 * TrendingDeals — Featured rooms on the homepage.
 * Reads from GET /api/v1/hotel/rooms — same table Hotel-CRM writes to.
 */
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, ArrowRight, Building, Loader2, Bed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { hotel as hotelApi } from "@/services/api";

interface ApiRoom {
  id: number;
  name: string;
  type: string;
  price: number;
  available: boolean;
  amenities: string[];
  image_url: string | null;
  beds: string;
  size: string;
  capacity: number;
}

const TrendingDeals = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<ApiRoom[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    hotelApi
      .rooms(true) // available only
      .then((data) => {
        setRooms((data.rooms || []).slice(0, 6));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-24" id="deals">
        <div className="container">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  if (rooms.length === 0) return null;

  return (
    <section className="py-24" id="deals">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12"
        >
          <div>
            <span className="text-sm font-medium text-primary mb-2 block">🔥 Trending Now</span>
            <h2 className="text-3xl md:text-4xl font-extrabold">Featured Rooms</h2>
            <p className="text-muted-foreground mt-2">Handpicked rooms with the best amenities — book before they're full!</p>
          </div>
          <Link to="/search/hotels">
            <Button variant="outline" className="mt-4 md:mt-0 rounded-xl">
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room, i) => (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group bg-card rounded-2xl shadow-card border border-border/50 overflow-hidden hover:shadow-card-hover transition-all duration-300"
            >
              <div className="relative overflow-hidden h-52 bg-muted">
                {room.image_url ? (
                  <img
                    src={room.image_url}
                    alt={room.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                    <Bed className="w-12 h-12 text-primary/30" />
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-lg bg-primary text-primary-foreground text-xs font-bold shadow-lg">
                    {room.type}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="px-2 py-1 rounded-lg bg-card/90 backdrop-blur-sm text-xs font-medium">
                    {room.beds}
                  </span>
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-bold mb-1">{room.name}</h3>
                <p className="text-xs text-muted-foreground mb-3">{room.size} • Up to {room.capacity} guests</p>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-xl font-extrabold text-primary">₹{room.price.toLocaleString()}</span>
                  <span className="text-xs text-muted-foreground">/ night</span>
                </div>
                <Button
                  onClick={() => navigate(`/hotels/${room.id}`)}
                  className="w-full rounded-xl bg-primary text-primary-foreground border-0 hover:opacity-90 transition-opacity"
                >
                  View Details
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingDeals;

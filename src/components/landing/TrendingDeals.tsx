import { motion } from "framer-motion";
import { Star, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trendingDeals } from "@/data/mockData";
import { Link, useNavigate } from "react-router-dom";

const TrendingDeals = () => {
  const navigate = useNavigate();
  
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
            <span className="text-sm font-medium text-primary mb-2 block"> Trending Now</span>
            <h2 className="text-3xl md:text-4xl font-extrabold">Top Travel Deals</h2>
            <p className="text-muted-foreground mt-2">Handpicked deals with the best prices — grab them before they're gone!</p>
          </div>
          <Link to="/search">
            <Button variant="outline" className="mt-4 md:mt-0 rounded-xl">
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingDeals.map((deal, i) => (
            <motion.div
              key={deal.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group bg-card rounded-2xl shadow-card border border-border/50 overflow-hidden hover:shadow-card-hover transition-all duration-300"
            >
              <div className="relative overflow-hidden h-52">
                <img
                  src={deal.image}
                  alt={deal.destination}
                  loading="lazy"
                  width={640}
                  height={800}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-destructive text-destructive-foreground text-xs font-bold shadow-lg">
                    {deal.discount}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3">
                  <span className="px-2.5 py-1 rounded-lg bg-foreground/80 backdrop-blur-sm text-primary-foreground text-xs font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {deal.urgency}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="px-2 py-1 rounded-lg bg-card/90 backdrop-blur-sm text-xs font-medium">
                    {deal.duration}
                  </span>
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold">{deal.destination}</h3>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="w-4 h-4 fill-warning text-warning" />
                    <span className="font-medium">{deal.rating}</span>
                  </div>
                </div>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-xl font-extrabold text-primary">{deal.price}</span>
                  <span className="text-sm text-muted-foreground line-through">{deal.originalPrice}</span>
                  <span className="text-xs text-muted-foreground">/ person</span>
                </div>
                <Button 
                  onClick={() => navigate(`/search/packages?dest=${encodeURIComponent(deal.destination)}`)}
                  className="w-full rounded-xl bg-primary text-primary-foreground text-primary-foreground border-0 hover:opacity-90 transition-opacity"
                >
                  Book Now
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

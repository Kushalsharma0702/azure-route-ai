import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, Train as TrainIcon, Clock, ArrowRight, Star, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { trains } from "@/data/trains";

const TrainDetail = () => {
  const { id } = useParams();
  const train = trains.find((t) => t.id === id) || trains[0];

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20 pb-16">
          <div className="bg-card border-b border-border">
            <div className="container py-3 flex items-center gap-2 text-xs text-muted-foreground">
              <Link to="/" className="hover:text-foreground">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <Link to="/search/trains" className="hover:text-foreground">Trains</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-foreground font-medium">{train.name}</span>
            </div>
          </div>

          <div className="container mt-8">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl shadow-card border border-border/50 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-14 h-14 rounded-xl gradient-cta flex items-center justify-center">
                      <TrainIcon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h1 className="text-xl font-extrabold">{train.name}</h1>
                      <p className="text-sm text-muted-foreground">#{train.number} • {train.day} • {train.distance}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-extrabold">{train.departureTime}</div>
                      <div className="text-sm text-muted-foreground">{train.from}</div>
                      <div className="text-xs text-muted-foreground">{train.fromCode}</div>
                    </div>
                    <div className="flex-1 flex flex-col items-center">
                      <div className="text-sm font-medium text-muted-foreground">{train.duration}</div>
                      <div className="w-full h-px bg-border relative my-2">
                        <ArrowRight className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-extrabold">{train.arrivalTime}</div>
                      <div className="text-sm text-muted-foreground">{train.to}</div>
                      <div className="text-xs text-muted-foreground">{train.toCode}</div>
                    </div>
                  </div>
                </motion.div>

                {/* Classes */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card rounded-2xl shadow-card border border-border/50 p-6">
                  <h2 className="font-bold text-lg mb-4">Available Classes</h2>
                  <div className="space-y-3">
                    {train.classes.map((cls) => (
                      <div key={cls.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/30">
                        <div>
                          <div className="font-semibold text-sm">{cls.name} ({cls.code})</div>
                          <div className={`text-xs mt-1 ${cls.available > 0 ? "text-success" : "text-destructive"}`}>
                            {cls.available > 0 ? `${cls.available} seats available` : "Waitlisted"}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-extrabold text-primary text-lg">₹{cls.price.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">per person</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Amenities */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card rounded-2xl shadow-card border border-border/50 p-6">
                  <h2 className="font-bold text-lg mb-4">Train Info</h2>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-muted/50 flex items-start gap-2">
                      <Clock className="w-4 h-4 text-primary mt-0.5" />
                      <div><div className="text-xs text-muted-foreground">Duration</div><div className="text-sm font-medium">{train.duration}</div></div>
                    </div>
                    <div className="p-3 rounded-xl bg-muted/50 flex items-start gap-2">
                      <UtensilsCrossed className="w-4 h-4 text-primary mt-0.5" />
                      <div><div className="text-xs text-muted-foreground">Pantry</div><div className="text-sm font-medium">{train.pantry ? "Available" : "Not Available"}</div></div>
                    </div>
                  </div>
                </motion.div>

                {/* Reviews */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-card rounded-2xl shadow-card border border-border/50 p-6">
                  <h2 className="font-bold text-lg mb-4">Reviews</h2>
                  {train.reviews.map((r, i) => (
                    <div key={i} className="flex gap-3 p-3 rounded-xl bg-muted/30">
                      <div className="w-10 h-10 rounded-full gradient-cta flex items-center justify-center text-primary-foreground text-xs font-bold flex-shrink-0">{r.avatar}</div>
                      <div>
                        <div className="flex items-center gap-2"><span className="font-semibold text-sm">{r.name}</span></div>
                        <div className="flex items-center gap-0.5 my-1">{Array.from({ length: r.rating }).map((_, j) => <Star key={j} className="w-3 h-3 fill-warning text-warning" />)}</div>
                        <p className="text-sm text-muted-foreground">{r.text}</p>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </div>

              <div>
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-card rounded-2xl shadow-card border border-border/50 p-6 sticky top-24">
                  <h3 className="font-bold mb-4">Book This Train</h3>
                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex justify-between"><span className="text-muted-foreground">Lowest fare</span><span className="font-bold text-primary text-lg">₹{Math.min(...train.classes.map((c) => c.price)).toLocaleString()}</span></div>
                  </div>
                  <Link to={`/book/train/${train.id}/step/1`}>
                    <Button className="w-full h-12 gradient-cta text-primary-foreground border-0 rounded-xl font-semibold shadow-lg hover:opacity-90 transition-opacity">
                      Book Now
                    </Button>
                  </Link>
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {train.badges.map((b) => (
                      <span key={b} className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{b}</span>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default TrainDetail;

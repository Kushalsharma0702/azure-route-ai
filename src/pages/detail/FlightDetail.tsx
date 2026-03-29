import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, Plane, Clock, Briefcase, UtensilsCrossed, Shield, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { flights } from "@/data/flights";

const FlightDetail = () => {
  const { id } = useParams();
  const flight = flights.find((f) => f.id === id) || flights[0];

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20 pb-16">
          {/* Breadcrumb */}
          <div className="bg-card border-b border-border">
            <div className="container py-3 flex items-center gap-2 text-xs text-muted-foreground">
              <Link to="/" className="hover:text-foreground">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <Link to="/search/flights" className="hover:text-foreground">Flights</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-foreground font-medium">{flight.airline} {flight.flightNumber}</span>
            </div>
          </div>

          <div className="container mt-8">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                {/* Flight hero */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl shadow-card border border-border/50 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-14 h-14 rounded-xl gradient-card flex items-center justify-center font-bold text-lg text-primary">{flight.airlineLogo}</div>
                    <div>
                      <h1 className="text-xl font-extrabold">{flight.airline}</h1>
                      <p className="text-sm text-muted-foreground">{flight.flightNumber} • {flight.aircraft}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-extrabold">{flight.departureTime}</div>
                      <div className="text-sm text-muted-foreground">{flight.from}</div>
                      <div className="text-xs text-muted-foreground">{flight.fromCode}</div>
                    </div>
                    <div className="flex-1 flex flex-col items-center">
                      <div className="text-sm font-medium text-muted-foreground">{flight.duration}</div>
                      <div className="w-full h-px bg-border relative my-2">
                        <Plane className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                      </div>
                      <div className="text-xs text-muted-foreground">{flight.stops === 0 ? "Non-stop" : `${flight.stops} stop via ${flight.stopCity}`}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-extrabold">{flight.arrivalTime}</div>
                      <div className="text-sm text-muted-foreground">{flight.to}</div>
                      <div className="text-xs text-muted-foreground">{flight.toCode}</div>
                    </div>
                  </div>
                </motion.div>

                {/* Details */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card rounded-2xl shadow-card border border-border/50 p-6">
                  <h2 className="font-bold text-lg mb-4">Flight Details</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { icon: Clock, label: "Duration", value: flight.duration },
                      { icon: Briefcase, label: "Baggage", value: flight.baggage },
                      { icon: UtensilsCrossed, label: "Meal", value: flight.meal ? "Included" : "Not Included" },
                      { icon: Shield, label: "Cancellation", value: flight.refundable ? "Free" : "Non-refundable" },
                    ].map((item) => (
                      <div key={item.label} className="flex items-start gap-3 p-3 rounded-xl bg-muted/50">
                        <item.icon className="w-4 h-4 text-primary mt-0.5" />
                        <div>
                          <div className="text-xs text-muted-foreground">{item.label}</div>
                          <div className="text-sm font-medium">{item.value}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Cancellation Policy */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card rounded-2xl shadow-card border border-border/50 p-6">
                  <h2 className="font-bold text-lg mb-4">Cancellation Policy</h2>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div className="flex justify-between p-3 bg-muted/50 rounded-xl">
                      <span>Before 24 hours</span>
                      <span className="font-medium text-foreground">{flight.refundable ? "Full refund" : "₹3,000 fee"}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-muted/50 rounded-xl">
                      <span>Within 24 hours</span>
                      <span className="font-medium text-foreground">{flight.refundable ? "₹1,500 fee" : "Non-refundable"}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-muted/50 rounded-xl">
                      <span>No-show</span>
                      <span className="font-medium text-foreground">Non-refundable</span>
                    </div>
                  </div>
                </motion.div>

                {/* Reviews */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-card rounded-2xl shadow-card border border-border/50 p-6">
                  <h2 className="font-bold text-lg mb-4">Traveler Reviews</h2>
                  <div className="space-y-4">
                    {flight.reviews.map((review, i) => (
                      <div key={i} className="flex gap-3 p-3 rounded-xl bg-muted/30">
                        <div className="w-10 h-10 rounded-full gradient-cta flex items-center justify-center text-primary-foreground text-xs font-bold flex-shrink-0">{review.avatar}</div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm">{review.name}</span>
                            <div className="flex items-center gap-0.5">{Array.from({ length: review.rating }).map((_, j) => <Star key={j} className="w-3 h-3 fill-warning text-warning" />)}</div>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{review.text}</p>
                          <span className="text-xs text-muted-foreground">{review.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Sticky sidebar */}
              <div>
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-card rounded-2xl shadow-card border border-border/50 p-6 sticky top-24">
                  <h3 className="font-bold mb-4">Price Summary</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Base Fare</span>
                      <span>₹{flight.price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Taxes & Fees</span>
                      <span>₹{Math.round(flight.price * 0.12).toLocaleString()}</span>
                    </div>
                    <div className="border-t border-border pt-3 flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span className="text-primary">₹{Math.round(flight.price * 1.12).toLocaleString()}</span>
                    </div>
                  </div>
                  {flight.originalPrice && (
                    <div className="mt-3 p-2 rounded-lg bg-success/10 text-success text-xs font-medium text-center">
                      You save ₹{(flight.originalPrice - flight.price).toLocaleString()}!
                    </div>
                  )}
                  <Link to={`/book/flight/${flight.id}/step/1`}>
                    <Button className="w-full mt-4 h-12 gradient-cta text-primary-foreground border-0 rounded-xl font-semibold shadow-lg hover:opacity-90 transition-opacity">
                      Book Now
                    </Button>
                  </Link>
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {flight.badges.map((b) => (
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

export default FlightDetail;

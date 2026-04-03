import { motion } from "framer-motion";
import { MapPin, Plane, Building, Ticket, DollarSign, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import jaipur from "@/assets/destinations/jaipur.jpg";
import udaipur from "@/assets/destinations/udaipur.jpg";

const itinerary = [
  { day: 1, title: "Arrival in Jaipur", activities: ["Airport pickup at JAI", "Check-in at Rambagh Palace Heritage Hotel", "Visit Hawa Mahal at sunset", "Traditional Rajasthani thali dinner at LMB"] },
  { day: 2, title: "Forts & Heritage", activities: ["Amer Fort with elephant ride", "City Palace museum tour", "Jantar Mantar observatory", "Shopping at Johari Bazaar", "Evening at Nahargarh Fort"] },
  { day: 3, title: "Jaipur to Udaipur", activities: ["Drive via Ajmer & Pushkar", "Lunch at Pushkar Lake", "Arrive in Udaipur", "Lake Pichola evening stroll"] },
  { day: 4, title: "Udaipur - City of Lakes", activities: ["City Palace morning tour", "Jagdish Temple", "Boat ride on Lake Pichola", "Sunset at Monsoon Palace", "Rooftop dinner with lake view"] },
  { day: 5, title: "Departure", activities: ["Saheliyon ki Bari gardens", "Souvenir shopping", "Airport transfer to UDR"] },
];

const budgetBreakdown = [
  { category: "Travel", amount: 8000, percent: 32, color: "bg-primary" },
  { category: "Stay", amount: 10000, percent: 40, color: "bg-secondary" },
  { category: "Activities", amount: 4500, percent: 18, color: "bg-accent" },
  { category: "Food & Others", amount: 2500, percent: 10, color: "bg-muted-foreground" },
];

const TripPlanner = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              ✨ AI-Generated Itinerary
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold mb-2">5 Days in Rajasthan — Jaipur & Udaipur</h1>
            <p className="text-muted-foreground">Cultural mood • ₹25,000 budget • 2 travelers • From Delhi</p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {itinerary.map((day, i) => (
                <motion.div
                  key={day.day}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-card rounded-2xl shadow-card border border-border/50 p-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl gradient-cta flex items-center justify-center">
                      <span className="text-primary-foreground font-bold">D{day.day}</span>
                    </div>
                    <div>
                      <h3 className="font-bold">{day.title}</h3>
                      <p className="text-xs text-muted-foreground">{day.activities.length} activities</p>
                    </div>
                  </div>
                  <div className="space-y-2 ml-2">
                    {day.activities.map((act, j) => (
                      <motion.div
                        key={j}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.1 + j * 0.05 }}
                        className="flex items-center gap-3 text-sm"
                      >
                        <div className="w-2 h-2 rounded-full bg-primary/40" />
                        <span className="text-muted-foreground">{act}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-card rounded-2xl shadow-card border border-border/50 p-6 sticky top-24"
              >
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <IndianRupee className="w-4 h-4 text-primary" /> Budget Breakdown
                </h3>
                <div className="flex rounded-full overflow-hidden h-3 mb-4">
                  {budgetBreakdown.map((b) => (
                    <div key={b.category} className={`${b.color} h-full`} style={{ width: `${b.percent}%` }} />
                  ))}
                </div>
                <div className="space-y-3">
                  {budgetBreakdown.map((b) => (
                    <div key={b.category} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-sm ${b.color}`} />
                        <span className="text-muted-foreground">{b.category}</span>
                      </div>
                      <span className="font-semibold">₹{b.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border mt-4 pt-4 flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-primary">₹25,000</span>
                </div>

                <Link to="/book/package/pk-1/step/1">
                  <Button className="w-full mt-6 h-12 gradient-cta text-primary-foreground border-0 rounded-xl font-semibold shadow-lg hover:opacity-90 transition-opacity">
                    Book Entire Trip @ ₹25,000
                  </Button>
                </Link>
                <p className="text-xs text-center text-muted-foreground mt-2">Includes transport, stay & activities</p>
              </motion.div>

              <div className="bg-card rounded-2xl shadow-card border border-border/50 p-6">
                <h3 className="font-bold mb-4">Suggested Bookings</h3>
                <div className="space-y-3">
                  {[
                    { icon: Plane, label: "IndiGo 6E-6789", detail: "DEL → JAI • ₹1,999" },
                    { icon: Building, label: "Rambagh Palace Heritage", detail: "2 nights • ₹6,000" },
                    { icon: Building, label: "The Oberoi Udaivilas", detail: "2 nights • ₹9,999" },
                    { icon: Ticket, label: "Heritage Activity Pass", detail: "All monuments • ₹2,500" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                      <item.icon className="w-4 h-4 text-primary" />
                      <div className="flex-1">
                        <div className="text-sm font-medium">{item.label}</div>
                        <div className="text-xs text-muted-foreground">{item.detail}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TripPlanner;

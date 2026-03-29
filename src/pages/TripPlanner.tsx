import { motion } from "framer-motion";
import { MapPin, Plane, Building, Ticket, DollarSign, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const itinerary = [
  { day: 1, title: "Arrival in Bali", activities: ["Airport pickup & transfer", "Resort check-in at Seminyak", "Welcome drink & orientation", "Sunset at Tanah Lot Temple", "Seafood dinner by the beach"] },
  { day: 2, title: "Culture & Temples", activities: ["Breakfast at resort", "Visit Tirta Empul Temple", "Rice terrace walk in Tegallalang", "Traditional Balinese lunch", "Ubud Monkey Forest", "Evening spa treatment"] },
  { day: 3, title: "Adventure Day", activities: ["Sunrise trek to Mt. Batur", "White water rafting", "Lunch at riverside restaurant", "Waterfall exploration", "Traditional dance show"] },
  { day: 4, title: "Beach & Leisure", activities: ["Morning yoga session", "Nusa Penida island tour", "Snorkeling at Crystal Bay", "Beach club afternoon", "Farewell dinner at Jimbaran"] },
  { day: 5, title: "Departure", activities: ["Breakfast", "Souvenir shopping", "Airport transfer", "Departure"] },
];

const budgetBreakdown = [
  { category: "Travel", amount: 18000, percent: 36, color: "bg-blue-500" },
  { category: "Stay", amount: 20000, percent: 40, color: "bg-indigo-500" },
  { category: "Activities", amount: 8000, percent: 16, color: "bg-violet-500" },
  { category: "Food & Others", amount: 4000, percent: 8, color: "bg-purple-500" },
];

const TripPlanner = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container max-w-5xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              ✨ AI-Generated Itinerary
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold mb-2">5 Days in Bali, Indonesia</h1>
            <p className="text-muted-foreground">Chill mood • ₹50,000 budget • 2 travelers</p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Itinerary */}
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
                      <div key={j} className="flex items-center gap-3 text-sm">
                        <div className="w-2 h-2 rounded-full bg-primary/40" />
                        <span className="text-muted-foreground">{act}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Budget breakdown */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-card rounded-2xl shadow-card border border-border/50 p-6 sticky top-24"
              >
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-primary" /> Budget Breakdown
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
                  <span className="text-primary">₹50,000</span>
                </div>

                <Button className="w-full mt-6 h-12 gradient-cta text-primary-foreground border-0 rounded-xl font-semibold shadow-lg hover:opacity-90 transition-opacity">
                  Book Entire Trip @ ₹50,000
                </Button>
                <p className="text-xs text-center text-muted-foreground mt-2">Includes flights, stay & activities</p>
              </motion.div>

              {/* Suggested */}
              <div className="bg-card rounded-2xl shadow-card border border-border/50 p-6">
                <h3 className="font-bold mb-4">Suggested</h3>
                <div className="space-y-3">
                  {[
                    { icon: Plane, label: "IndiGo 6E-234", detail: "DEL → DPS • ₹18,000" },
                    { icon: Building, label: "The Seminyak Resort", detail: "4 nights • ₹20,000" },
                    { icon: Ticket, label: "Activity Pass", detail: "All activities • ₹8,000" },
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

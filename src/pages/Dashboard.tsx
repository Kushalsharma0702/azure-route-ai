import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Calendar, Bookmark, Bell, Clock, ChevronRight, Plane, Train } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import jaipur from "@/assets/destinations/jaipur.jpg";
import kashmir from "@/assets/destinations/kashmir.jpg";
import goa from "@/assets/destinations/goa.jpg";
import kerala from "@/assets/destinations/kerala.jpg";

const tabs = ["My Trips", "Saved", "Bookings", "Alerts"];

const myTrips = [
  { id: 1, destination: "Jaipur, Rajasthan", date: "Apr 15-19, 2026", status: "Upcoming", image: jaipur, price: "₹25,000", type: "Package" },
  { id: 2, destination: "Kashmir, India", date: "Jun 20-26, 2026", status: "Planned", image: kashmir, price: "₹18,999", type: "Package" },
  { id: 3, destination: "Goa, India", date: "Jan 10-14, 2026", status: "Completed", image: goa, price: "₹8,999", type: "Flight + Hotel" },
];

const savedTrips = [
  { id: 1, destination: "Kerala Backwaters", image: kerala, price: "₹16,999" },
  { id: 2, destination: "Goa Beach Carnival", image: goa, price: "₹8,999" },
];

const bookingHistory = [
  { id: "BK-2026-001", destination: "Goa", date: "Jan 10, 2026", amount: "₹8,999", status: "Confirmed", type: "Flight" },
  { id: "BK-2026-002", destination: "Manali", date: "Dec 22, 2025", amount: "₹12,499", status: "Completed", type: "Package" },
  { id: "BK-2025-089", destination: "Varanasi", date: "Nov 5, 2025", amount: "₹3,200", status: "Completed", type: "Train" },
];

const priceAlerts = [
  { id: 1, route: "Delhi → Goa Flights", current: "₹3,499", target: "₹2,999", status: "Tracking" },
  { id: 2, route: "Mumbai → Jaipur Trains", current: "₹1,200", target: "₹999", status: "Tracking" },
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("My Trips");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-2xl md:text-3xl font-extrabold">Welcome back, Traveler! 🙏</h1>
            <p className="text-muted-foreground mt-1">Manage your trips, bookings, and price alerts across India</p>
          </motion.div>

          <div className="flex gap-1 mb-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === tab
                    ? "gradient-cta text-primary-foreground shadow-lg"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === "My Trips" && (
            <div className="space-y-4">
              {myTrips.map((trip, i) => (
                <motion.div
                  key={trip.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-card rounded-2xl shadow-card border border-border/50 overflow-hidden flex flex-col sm:flex-row hover:shadow-card-hover transition-shadow"
                >
                  <div className="sm:w-48 h-36 sm:h-auto flex-shrink-0">
                    <img src={trip.image} alt={trip.destination} loading="lazy" className="w-full h-full object-cover" />
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold">{trip.destination}</h3>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          trip.status === "Upcoming" ? "bg-success/10 text-success"
                          : trip.status === "Completed" ? "bg-muted text-muted-foreground"
                          : "bg-primary/10 text-primary"
                        }`}>
                          {trip.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> {trip.date}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{trip.type}</p>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <span className="font-bold text-primary">{trip.price}</span>
                      <Button variant="outline" size="sm" className="rounded-xl text-xs">
                        View Details <ChevronRight className="w-3 h-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === "Saved" && (
            <div className="grid sm:grid-cols-2 gap-4">
              {savedTrips.map((trip, i) => (
                <motion.div key={trip.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                  <div className="bg-card rounded-2xl shadow-card border border-border/50 overflow-hidden hover:shadow-card-hover transition-shadow">
                    <div className="h-40">
                      <img src={trip.image} alt={trip.destination} loading="lazy" className="w-full h-full object-cover" />
                    </div>
                    <div className="p-4 flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-sm">{trip.destination}</h3>
                        <span className="text-primary font-bold text-sm">{trip.price}</span>
                      </div>
                      <Bookmark className="w-5 h-5 fill-primary text-primary" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === "Bookings" && (
            <div className="space-y-3">
              {bookingHistory.map((booking, i) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-card rounded-2xl shadow-card border border-border/50 p-5 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      {booking.type === "Flight" ? <Plane className="w-5 h-5 text-primary" /> : booking.type === "Train" ? <Train className="w-5 h-5 text-primary" /> : <MapPin className="w-5 h-5 text-primary" />}
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{booking.destination}</div>
                      <div className="text-xs text-muted-foreground">{booking.id} • {booking.date}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-sm">{booking.amount}</div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${booking.status === "Confirmed" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
                      {booking.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === "Alerts" && (
            <div className="space-y-3">
              {priceAlerts.map((alert, i) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-card rounded-2xl shadow-card border border-border/50 p-5 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <Bell className="w-5 h-5 text-primary" />
                    <div>
                      <div className="font-semibold text-sm">{alert.route}</div>
                      <div className="text-xs text-muted-foreground">Current: {alert.current} • Target: {alert.target}</div>
                    </div>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-accent/20 text-foreground font-medium">{alert.status}</span>
                </motion.div>
              ))}
              <div className="bg-card rounded-2xl shadow-card border border-border/50 p-6 text-center mt-4">
                <p className="text-sm text-muted-foreground">Set price alerts and get notified when fares drop for your favourite Indian routes.</p>
                <Button variant="outline" size="sm" className="mt-3 rounded-xl">+ Add New Alert</Button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;

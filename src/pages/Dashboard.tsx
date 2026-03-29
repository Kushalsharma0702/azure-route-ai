import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Calendar, Bookmark, Bell, Clock, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import bali from "@/assets/destinations/bali.jpg";
import santorini from "@/assets/destinations/santorini.jpg";
import maldives from "@/assets/destinations/maldives.jpg";

const tabs = ["My Trips", "Saved", "Bookings", "Alerts"];

const myTrips = [
  { id: 1, destination: "Bali, Indonesia", date: "Mar 15-19, 2026", status: "Upcoming", image: bali, price: "₹50,000" },
  { id: 2, destination: "Santorini, Greece", date: "Jun 20-26, 2026", status: "Planned", image: santorini, price: "₹89,999" },
];

const savedTrips = [
  { id: 1, destination: "Maldives", image: maldives, price: "₹54,999" },
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
            <h1 className="text-2xl md:text-3xl font-extrabold">Welcome back, Traveler! 👋</h1>
            <p className="text-muted-foreground mt-1">Manage your trips, bookings, and alerts</p>
          </motion.div>

          {/* Tabs */}
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

          {/* My Trips */}
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
                          trip.status === "Upcoming"
                            ? "bg-success/10 text-success"
                            : "bg-primary/10 text-primary"
                        }`}>
                          {trip.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> {trip.date}
                      </p>
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
              {savedTrips.map((trip) => (
                <div key={trip.id} className="bg-card rounded-2xl shadow-card border border-border/50 overflow-hidden">
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
              ))}
            </div>
          )}

          {activeTab === "Bookings" && (
            <div className="bg-card rounded-2xl shadow-card border border-border/50 p-8 text-center">
              <Clock className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <h3 className="font-bold mb-1">No Active Bookings</h3>
              <p className="text-sm text-muted-foreground">Your confirmed bookings will appear here.</p>
            </div>
          )}

          {activeTab === "Alerts" && (
            <div className="bg-card rounded-2xl shadow-card border border-border/50 p-8 text-center">
              <Bell className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <h3 className="font-bold mb-1">No Price Alerts</h3>
              <p className="text-sm text-muted-foreground">Set price alerts and get notified when fares drop.</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;

/**
 * Dashboard — user's dashboard showing rooms and bookings.
 * Both read from the hotel_rooms/hotel_bookings tables — same as Hotel-CRM.
 */
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Bell, Bed, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { bookings as bookingsApi, hotel as hotelApi } from "@/services/api";

const tabs = ["Rooms", "Bookings", "Alerts"];

interface ApiRoom {
  id: number;
  name: string;
  type: string;
  price: number;
  available: boolean;
  amenities: string[];
  beds: string;
  size: string;
  capacity: number;
}

interface ApiBooking {
  id: string;
  guest: string;
  guest_email: string;
  room: string;
  checkIn: string;
  checkOut: string;
  status: string;
  payment: string;
  amount: number;
}

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("Rooms");
  const [roomList, setRoomList] = useState<ApiRoom[]>([]);
  const [bookingList, setBookingList] = useState<ApiBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      hotelApi.rooms(false).catch(() => ({ rooms: [] })),
      bookingsApi.list().catch(() => ({ bookings: [] })),
    ]).then(([roomsData, bookingsData]) => {
      setRoomList(roomsData.rooms || []);
      setBookingList(bookingsData.bookings || []);
      setLoading(false);
    });
  }, []);

  const priceAlerts = [
    { id: 1, route: "Delhi → Goa Flights", current: "₹3,499", target: "₹2,999", status: "Tracking" },
    { id: 2, route: "Mumbai → Jaipur Trains", current: "₹1,200", target: "₹999", status: "Tracking" },
  ];

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
            <h1 className="text-2xl md:text-3xl font-extrabold">Welcome back, Traveler! </h1>
            <p className="text-muted-foreground mt-1">Browse rooms, view bookings, and set price alerts</p>
          </motion.div>

          <div className="flex gap-1 mb-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === tab
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {activeTab === "Rooms" && (
                <div className="space-y-4">
                  {roomList.length === 0 ? (
                    <div className="bg-card rounded-2xl shadow-card border border-border/50 p-12 text-center">
                      <Bed className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                      <h3 className="font-bold mb-1">No rooms available</h3>
                      <p className="text-sm text-muted-foreground">Rooms will appear here once added by the admin.</p>
                    </div>
                  ) : (
                    roomList.map((room, i) => (
                      <motion.div
                        key={room.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                      >
                        <Link
                          to={`/hotels/${room.id}`}
                          className="block bg-card rounded-2xl shadow-card border border-border/50 overflow-hidden hover:shadow-card-hover transition-shadow p-5"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <Bed className="w-6 h-6 text-primary" />
                              </div>
                              <div>
                                <h3 className="font-bold">{room.name}</h3>
                                <p className="text-sm text-muted-foreground mt-0.5">
                                  {room.type} • {room.beds} • {room.size}
                                </p>
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                  {(room.amenities || []).slice(0, 4).map((a) => (
                                    <span key={a} className="text-xs px-2 py-0.5 rounded-md bg-muted text-muted-foreground">{a}</span>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-lg font-extrabold text-primary">₹{room.price.toLocaleString()}</span>
                              <span className="text-xs text-muted-foreground block">/ night</span>
                              <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${
                                room.available
                                  ? "bg-success/10 text-success"
                                  : "bg-destructive/10 text-destructive"
                              }`}>
                                {room.available ? "Available" : "Sold Out"}
                              </span>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))
                  )}
                </div>
              )}

              {activeTab === "Bookings" && (
                <div className="space-y-3">
                  {bookingList.length === 0 ? (
                    <div className="bg-card rounded-2xl shadow-card border border-border/50 p-12 text-center">
                      <Calendar className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                      <h3 className="font-bold mb-1">No bookings yet</h3>
                      <p className="text-sm text-muted-foreground">Your bookings will appear here.</p>
                    </div>
                  ) : (
                    bookingList.map((booking, i) => (
                      <motion.div
                        key={booking.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="bg-card rounded-2xl shadow-card border border-border/50 p-5 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Bed className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-semibold text-sm">{booking.room}</div>
                            <div className="text-xs text-muted-foreground">{booking.id} • {booking.guest}</div>
                            <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                              <Calendar className="w-3 h-3" /> {booking.checkIn} → {booking.checkOut}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-sm">₹{booking.amount.toLocaleString()}</div>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            booking.status === "Confirmed" ? "bg-success/10 text-success"
                            : booking.status === "Pending" ? "bg-warning/10 text-warning"
                            : "bg-muted text-muted-foreground"
                          }`}>
                            {booking.status}
                          </span>
                          <div className={`text-xs mt-0.5 ${booking.payment === "Paid" ? "text-success" : "text-warning"}`}>
                            {booking.payment}
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
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
                    <p className="text-sm text-muted-foreground">Set price alerts and get notified when fares drop.</p>
                    <Button variant="outline" size="sm" className="mt-3 rounded-xl">+ Add New Alert</Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;

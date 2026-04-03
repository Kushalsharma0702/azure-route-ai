import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, Star, MapPin, Wifi, Car, UtensilsCrossed, Dumbbell, Waves, Wine, Shield, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { hotels } from "@/data/hotels";
import { useState } from "react";

const amenityIcons: Record<string, any> = {
  "Free WiFi": Wifi, Pool: Waves, Spa: Waves, Gym: Dumbbell, Bar: Wine, Restaurant: UtensilsCrossed,
  Breakfast: UtensilsCrossed, "Airport Transfer": Car, "Sea View": MapPin, "Mountain View": MapPin,
  "Lake View": MapPin, "Ski Access": MapPin, Fireplace: Shield, "Fine Dining": UtensilsCrossed,
  Heritage: Shield, Overwater: Waves, "Private Pool": Waves, "All Inclusive": Star, Snorkeling: Waves, Sauna: Waves,
};

const HotelDetail = () => {
  const { id } = useParams();
  const hotel = hotels.find((h) => h.id === id) || hotels[0];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const totalImages = hotel.images.length;

  const goToPrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? totalImages - 1 : prev - 1));
  };

  const goToNextImage = () => {
    setCurrentImageIndex((prev) => (prev === totalImages - 1 ? 0 : prev + 1));
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20 pb-16">
          <div className="bg-card border-b border-border">
            <div className="container py-3 flex items-center gap-2 text-xs text-muted-foreground">
              <Link to="/" className="hover:text-foreground">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <Link to="/search/hotels" className="hover:text-foreground">Hotels</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-foreground font-medium">{hotel.name}</span>
            </div>
          </div>

          <div className="container mt-8">
            {/* Gallery Carousel */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
              <div className="relative h-96 rounded-2xl overflow-hidden bg-muted">
                <img 
                  src={hotel.images[currentImageIndex]} 
                  alt={hotel.name} 
                  className="w-full h-full object-cover transition-all duration-300"
                />
                {totalImages > 1 && (
                  <>
                    <button
                      onClick={goToPrevImage}
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-black p-2 rounded-full transition-all duration-200 shadow-lg z-10"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={goToNextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-black p-2 rounded-full transition-all duration-200 shadow-lg z-10"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                      {hotel.images.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentImageIndex(i)}
                          className={`h-2 rounded-full transition-all duration-200 ${
                            i === currentImageIndex ? 'bg-primary w-6' : 'bg-white/50 hover:bg-white w-2'
                          }`}
                          aria-label={`Go to image ${i + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="flex items-start justify-between mb-2">
                    <h1 className="text-2xl font-extrabold">{hotel.name}</h1>
                    <div className="flex items-center gap-1 bg-success/10 text-success px-2 py-1 rounded-full text-sm font-medium">
                      <Star className="w-3.5 h-3.5 fill-current" /> {hotel.rating}
                    </div>
                  </div>
                  <p className="text-muted-foreground flex items-center gap-1 text-sm mb-4">
                    <MapPin className="w-4 h-4" /> {hotel.location} • {hotel.reviews.toLocaleString()} reviews
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{hotel.description}</p>
                </motion.div>

                {/* Amenities */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card rounded-2xl shadow-card border border-border/50 p-6">
                  <h2 className="font-bold text-lg mb-4">Amenities</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {hotel.amenities.map((a) => {
                      const Icon = amenityIcons[a] || Star;
                      return (
                        <div key={a} className="flex items-center gap-2 p-3 rounded-xl bg-muted/50 text-sm">
                          <Icon className="w-4 h-4 text-primary" />
                          <span>{a}</span>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>

                {/* Rooms */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card rounded-2xl shadow-card border border-border/50 p-6">
                  <h2 className="font-bold text-lg mb-4">Available Rooms</h2>
                  <div className="space-y-3">
                    {hotel.rooms.map((room) => (
                      <div key={room.id} className={`p-4 rounded-xl border ${room.available ? "border-border/50 bg-muted/30" : "border-destructive/20 bg-destructive/5 opacity-60"}`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-sm">{room.name}</h3>
                            <p className="text-xs text-muted-foreground">{room.beds} • {room.size} • Up to {room.capacity} guests</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {room.amenities.map((a) => (
                                <span key={a} className="text-xs px-2 py-0.5 rounded bg-primary/5 text-primary">{a}</span>
                              ))}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-extrabold text-primary">₹{room.price.toLocaleString()}</div>
                            <div className="text-xs text-muted-foreground">/night</div>
                            {!room.available && <span className="text-xs text-destructive font-medium">Sold Out</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Policies */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="bg-card rounded-2xl shadow-card border border-border/50 p-6">
                  <h2 className="font-bold text-lg mb-4">Hotel Policies</h2>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between p-3 bg-muted/50 rounded-xl">
                      <span className="text-muted-foreground">Check-in</span>
                      <span className="font-medium">{hotel.policies.checkIn}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-muted/50 rounded-xl">
                      <span className="text-muted-foreground">Check-out</span>
                      <span className="font-medium">{hotel.policies.checkOut}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-muted/50 rounded-xl">
                      <span className="text-muted-foreground">Cancellation</span>
                      <span className="font-medium">{hotel.policies.cancellation}</span>
                    </div>
                  </div>
                </motion.div>

                {/* Reviews */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-card rounded-2xl shadow-card border border-border/50 p-6">
                  <h2 className="font-bold text-lg mb-4">Guest Reviews</h2>
                  <div className="space-y-4">
                    {hotel.guestReviews.map((review, i) => (
                      <div key={i} className="flex gap-3 p-3 rounded-xl bg-muted/30">
                        <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-primary-foreground text-xs font-bold flex-shrink-0">{review.avatar}</div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm">{review.name}</span>
                            <span className="text-xs text-muted-foreground">{review.stayType}</span>
                          </div>
                          <div className="flex items-center gap-0.5 my-1">{Array.from({ length: review.rating }).map((_, j) => <Star key={j} className="w-3 h-3 fill-warning text-warning" />)}</div>
                          <p className="text-sm text-muted-foreground">{review.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Sticky sidebar */}
              <div>
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-card rounded-2xl shadow-card border border-border/50 p-6 sticky top-24">
                  <div className="text-center mb-4">
                    <div className="text-3xl font-extrabold text-primary">₹{hotel.price.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">per night</div>
                    {hotel.originalPrice && (
                      <div className="text-sm text-muted-foreground line-through">₹{hotel.originalPrice.toLocaleString()}</div>
                    )}
                  </div>
                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex justify-between"><span className="text-muted-foreground">1 night × ₹{hotel.price.toLocaleString()}</span><span>₹{hotel.price.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Taxes & Fees</span><span>₹{Math.round(hotel.price * 0.18).toLocaleString()}</span></div>
                    <div className="border-t border-border pt-2 flex justify-between font-bold">
                      <span>Total</span>
                      <span className="text-primary">₹{Math.round(hotel.price * 1.18).toLocaleString()}</span>
                    </div>
                  </div>
                  <Link to={`/book/hotel/${hotel.id}/step/1`}>
                    <Button className="w-full h-12 bg-primary text-primary-foreground text-primary-foreground border-0 rounded-xl font-semibold shadow-lg hover:opacity-90 transition-opacity">
                      Book Now
                    </Button>
                  </Link>
                  <div className="flex gap-2 mt-3 flex-wrap justify-center">
                    {hotel.badges.map((b) => (
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

export default HotelDetail;

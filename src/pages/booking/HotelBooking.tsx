import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, CreditCard, Loader2, Users, Bed } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import PageTransition from "@/components/PageTransition";
import StepProgress from "@/components/StepProgress";
import { hotels } from "@/data/hotels";

const HotelBooking = () => {
  const { id, step } = useParams();
  const navigate = useNavigate();
  const currentStep = Number(step) || 1;
  const hotel = hotels.find((h) => h.id === id) || hotels[0];

  const [guests, setGuests] = useState([{ name: "", email: "", phone: "" }]);
  const [selectedRoom, setSelectedRoom] = useState(hotel.rooms[0]?.id || "");
  const [nights, setNights] = useState(2);
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [processing, setProcessing] = useState(false);

  const steps = ["Guest Details", "Room Selection", "Review & Pay"];
  const room = hotel.rooms.find((r) => r.id === selectedRoom) || hotel.rooms[0];
  const basePrice = room.price * nights;
  const taxes = Math.round(basePrice * 0.18);
  const total = basePrice + taxes;
  const discount = couponApplied ? Math.round(total * 0.1) : 0;

  const goNext = () => {
    if (currentStep === 1 && !guests[0].name.trim()) return;
    navigate(`/book/hotel/${id}/step/${currentStep + 1}`);
  };
  const goBack = () => { if (currentStep > 1) navigate(`/book/hotel/${id}/step/${currentStep - 1}`); };
  const handlePay = () => { setProcessing(true); setTimeout(() => navigate("/confirmation"), 2500); };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20 pb-16">
          <div className="container max-w-4xl">
            <StepProgress steps={steps} currentStep={currentStep} />

            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h2 className="text-xl font-extrabold mb-6">Guest Details</h2>
                  {guests.map((g, i) => (
                    <div key={i} className="bg-card rounded-2xl shadow-card border border-border/50 p-6 mb-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-sm">Guest {i + 1}</h3>
                        {i > 0 && <button onClick={() => setGuests((p) => p.filter((_, j) => j !== i))} className="text-destructive text-xs flex items-center gap-1"><Trash2 className="w-3 h-3" /> Remove</button>}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {(["name", "email", "phone"] as const).map((f) => (
                          <div key={f}>
                            <label className="text-xs font-medium text-muted-foreground mb-1 block capitalize">{f === "name" ? "Full Name" : f}</label>
                            <input value={g[f]} onChange={(e) => setGuests((p) => p.map((gg, j) => j === i ? { ...gg, [f]: e.target.value } : gg))} className="w-full px-3 py-2.5 rounded-xl bg-muted/50 border border-border text-sm" />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  <button onClick={() => setGuests((p) => [...p, { name: "", email: "", phone: "" }])} className="flex items-center gap-2 text-sm text-primary font-medium hover:underline"><Plus className="w-4 h-4" /> Add Guest</button>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h2 className="text-xl font-extrabold mb-6">Select Room</h2>
                  <div className="space-y-3">
                    {hotel.rooms.map((r) => (
                      <button key={r.id} disabled={!r.available} onClick={() => setSelectedRoom(r.id)} className={`w-full text-left p-5 rounded-2xl border transition-all ${selectedRoom === r.id ? "border-primary bg-primary/5 shadow-card-hover" : r.available ? "border-border/50 bg-card hover:border-primary/30" : "border-border/30 bg-muted/30 opacity-50 cursor-not-allowed"}`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-sm flex items-center gap-2"><Bed className="w-4 h-4 text-primary" /> {r.name}</h3>
                            <p className="text-xs text-muted-foreground mt-1">{r.beds} • {r.size}</p>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1"><Users className="w-3 h-3" /> Up to {r.capacity} guests</div>
                            <div className="flex flex-wrap gap-1 mt-2">{r.amenities.map((a) => <span key={a} className="text-xs px-2 py-0.5 rounded bg-primary/5 text-primary">{a}</span>)}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-extrabold text-primary">₹{r.price.toLocaleString()}</div>
                            <div className="text-xs text-muted-foreground">/night</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="mt-4">
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Number of Nights</label>
                    <select value={nights} onChange={(e) => setNights(Number(e.target.value))} className="px-3 py-2.5 rounded-xl bg-muted/50 border border-border text-sm">
                      {[1, 2, 3, 4, 5, 7, 10, 14].map((n) => <option key={n} value={n}>{n} night{n > 1 ? "s" : ""}</option>)}
                    </select>
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h2 className="text-xl font-extrabold mb-6">Review & Payment</h2>
                  <div className="space-y-4">
                    <div className="bg-card rounded-2xl shadow-card border border-border/50 p-6">
                      <h3 className="font-bold text-sm mb-2">{hotel.name}</h3>
                      <p className="text-sm text-muted-foreground">{room.name} • {nights} night{nights > 1 ? "s" : ""}</p>
                      <p className="text-sm text-muted-foreground">{guests.length} guest{guests.length > 1 ? "s" : ""}: {guests.map((g) => g.name).join(", ")}</p>
                    </div>

                    <div className="bg-card rounded-2xl shadow-card border border-border/50 p-6">
                      <h3 className="font-bold text-sm mb-3">Coupon Code</h3>
                      <div className="flex gap-2">
                        <input value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder="Enter coupon" className="flex-1 px-3 py-2.5 rounded-xl bg-muted/50 border border-border text-sm" />
                        <Button variant="outline" size="sm" className="rounded-xl" onClick={() => { if (coupon.trim()) setCouponApplied(true); }}>Apply</Button>
                      </div>
                      {couponApplied && <p className="text-xs text-success mt-2">10% discount applied!</p>}
                    </div>

                    <div className="bg-card rounded-2xl shadow-card border border-border/50 p-6">
                      <h3 className="font-bold text-sm mb-3">Price Breakdown</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span className="text-muted-foreground">₹{room.price.toLocaleString()} × {nights} nights</span><span>₹{basePrice.toLocaleString()}</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Taxes (18%)</span><span>₹{taxes.toLocaleString()}</span></div>
                        {couponApplied && <div className="flex justify-between text-success"><span>Discount</span><span>-₹{discount.toLocaleString()}</span></div>}
                        <div className="border-t border-border pt-2 flex justify-between font-bold text-lg"><span>Total</span><span className="text-primary">₹{(total - discount).toLocaleString()}</span></div>
                      </div>
                    </div>

                    <div className="bg-card rounded-2xl shadow-card border border-border/50 p-6">
                      <h3 className="font-bold text-sm mb-3">Payment Method</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {["Credit Card", "Debit Card", "UPI", "Net Banking"].map((m) => (
                          <button key={m} className="p-3 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 text-sm font-medium transition-all flex items-center gap-2"><CreditCard className="w-4 h-4 text-primary" /> {m}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex justify-between mt-8">
              <Button variant="outline" onClick={goBack} disabled={currentStep === 1} className="rounded-xl">Back</Button>
              {currentStep < 3 ? (
                <Button onClick={goNext} className="bg-primary text-primary-foreground text-primary-foreground border-0 rounded-xl shadow-lg hover:opacity-90">Continue</Button>
              ) : (
                <Button onClick={handlePay} disabled={processing} className="bg-primary text-primary-foreground text-primary-foreground border-0 rounded-xl shadow-lg hover:opacity-90 min-w-[160px]">
                  {processing ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Processing...</> : `Pay ₹${(total - discount).toLocaleString()}`}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default HotelBooking;

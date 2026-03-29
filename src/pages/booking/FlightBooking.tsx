import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Plus, Trash2, Check, CreditCard, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import PageTransition from "@/components/PageTransition";
import StepProgress from "@/components/StepProgress";
import { flights } from "@/data/flights";

interface Traveler {
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  dob: string;
}

const emptyTraveler: Traveler = { title: "Mr", firstName: "", lastName: "", email: "", phone: "", gender: "Male", dob: "" };

const FlightBooking = () => {
  const { id, step } = useParams();
  const navigate = useNavigate();
  const currentStep = Number(step) || 1;
  const flight = flights.find((f) => f.id === id) || flights[0];

  const [travelers, setTravelers] = useState<Traveler[]>([{ ...emptyTraveler }]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState(false);

  const steps = ["Travelers", "Seat Selection", "Review & Pay"];
  const totalPrice = Math.round(flight.price * 1.12 * travelers.length);
  const discount = couponApplied ? Math.round(totalPrice * 0.1) : 0;

  const validateStep1 = () => {
    const errs: Record<string, string> = {};
    travelers.forEach((t, i) => {
      if (!t.firstName.trim()) errs[`${i}-firstName`] = "Required";
      if (!t.lastName.trim()) errs[`${i}-lastName`] = "Required";
      if (!t.email.trim() || !/\S+@\S+\.\S+/.test(t.email)) errs[`${i}-email`] = "Valid email required";
      if (!t.phone.trim() || t.phone.length < 10) errs[`${i}-phone`] = "Valid phone required";
      if (!t.dob) errs[`${i}-dob`] = "Required";
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const goNext = () => {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && selectedSeats.length < travelers.length) return;
    navigate(`/book/flight/${id}/step/${currentStep + 1}`);
  };

  const goBack = () => {
    if (currentStep > 1) navigate(`/book/flight/${id}/step/${currentStep - 1}`);
  };

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => navigate("/confirmation"), 2500);
  };

  const updateTraveler = (index: number, field: keyof Traveler, value: string) => {
    setTravelers((prev) => prev.map((t, i) => (i === index ? { ...t, [field]: value } : t)));
  };

  const toggleSeat = (seatId: string) => {
    setSelectedSeats((prev) => prev.includes(seatId) ? prev.filter((s) => s !== seatId) : prev.length < travelers.length ? [...prev, seatId] : prev);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20 pb-16">
          <div className="container max-w-4xl">
            <StepProgress steps={steps} currentStep={currentStep} />

            <AnimatePresence mode="wait">
              {/* Step 1: Travelers */}
              {currentStep === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h2 className="text-xl font-extrabold mb-6">Traveler Details</h2>
                  {travelers.map((t, i) => (
                    <div key={i} className="bg-card rounded-2xl shadow-card border border-border/50 p-6 mb-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-sm">Traveler {i + 1}</h3>
                        {i > 0 && (
                          <button onClick={() => setTravelers((prev) => prev.filter((_, j) => j !== i))} className="text-destructive text-xs flex items-center gap-1">
                            <Trash2 className="w-3 h-3" /> Remove
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <div>
                          <label className="text-xs font-medium text-muted-foreground mb-1 block">Title</label>
                          <select value={t.title} onChange={(e) => updateTraveler(i, "title", e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-muted/50 border border-border text-sm">
                            <option>Mr</option><option>Mrs</option><option>Ms</option>
                          </select>
                        </div>
                        {(["firstName", "lastName", "email", "phone", "dob"] as const).map((field) => (
                          <div key={field}>
                            <label className="text-xs font-medium text-muted-foreground mb-1 block capitalize">{field === "dob" ? "Date of Birth" : field.replace(/([A-Z])/g, " $1")}</label>
                            <input
                              type={field === "email" ? "email" : field === "phone" ? "tel" : field === "dob" ? "date" : "text"}
                              value={t[field]}
                              onChange={(e) => updateTraveler(i, field, e.target.value)}
                              className={`w-full px-3 py-2.5 rounded-xl bg-muted/50 border text-sm ${errors[`${i}-${field}`] ? "border-destructive" : "border-border"}`}
                            />
                            {errors[`${i}-${field}`] && <span className="text-xs text-destructive mt-0.5 block">{errors[`${i}-${field}`]}</span>}
                          </div>
                        ))}
                        <div>
                          <label className="text-xs font-medium text-muted-foreground mb-1 block">Gender</label>
                          <select value={t.gender} onChange={(e) => updateTraveler(i, "gender", e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-muted/50 border border-border text-sm">
                            <option>Male</option><option>Female</option><option>Other</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button onClick={() => setTravelers((prev) => [...prev, { ...emptyTraveler }])} className="flex items-center gap-2 text-sm text-primary font-medium hover:underline">
                    <Plus className="w-4 h-4" /> Add Another Traveler
                  </button>
                </motion.div>
              )}

              {/* Step 2: Seat Selection */}
              {currentStep === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h2 className="text-xl font-extrabold mb-2">Select Your Seats</h2>
                  <p className="text-sm text-muted-foreground mb-6">Select {travelers.length} seat{travelers.length > 1 ? "s" : ""} • {selectedSeats.length}/{travelers.length} selected</p>
                  <div className="bg-card rounded-2xl shadow-card border border-border/50 p-6 overflow-x-auto">
                    <div className="flex justify-center gap-4 mb-4 text-xs">
                      <span className="flex items-center gap-1"><span className="w-4 h-4 rounded bg-muted border border-border" /> Available</span>
                      <span className="flex items-center gap-1"><span className="w-4 h-4 rounded bg-primary" /> Selected</span>
                      <span className="flex items-center gap-1"><span className="w-4 h-4 rounded bg-muted-foreground/30" /> Booked</span>
                      <span className="flex items-center gap-1"><span className="w-4 h-4 rounded bg-accent/30" /> Extra Legroom</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 min-w-[300px]">
                      <div className="flex gap-1 mb-2 text-xs text-muted-foreground">
                        <span className="w-8 text-center">A</span><span className="w-8 text-center">B</span><span className="w-8 text-center">C</span>
                        <span className="w-4" />
                        <span className="w-8 text-center">D</span><span className="w-8 text-center">E</span><span className="w-8 text-center">F</span>
                      </div>
                      {flight.seatMap.slice(0, 20).map((row) => (
                        <div key={row.row} className="flex items-center gap-1">
                          {row.seats.slice(0, 3).map((seat) => (
                            <button
                              key={seat.id}
                              disabled={!seat.available}
                              onClick={() => toggleSeat(seat.id)}
                              className={`w-8 h-8 rounded text-xs font-medium transition-all ${
                                !seat.available ? "bg-muted-foreground/20 cursor-not-allowed" :
                                selectedSeats.includes(seat.id) ? "bg-primary text-primary-foreground scale-110" :
                                seat.category === "extra-legroom" ? "bg-accent/20 hover:bg-accent/40 border border-accent/30" :
                                seat.category === "premium" ? "bg-warning/10 hover:bg-warning/20 border border-warning/30" :
                                "bg-muted hover:bg-muted-foreground/10 border border-border"
                              }`}
                            >
                              {row.row}
                            </button>
                          ))}
                          <span className="w-4 text-center text-xs text-muted-foreground">{row.row}</span>
                          {row.seats.slice(3).map((seat) => (
                            <button
                              key={seat.id}
                              disabled={!seat.available}
                              onClick={() => toggleSeat(seat.id)}
                              className={`w-8 h-8 rounded text-xs font-medium transition-all ${
                                !seat.available ? "bg-muted-foreground/20 cursor-not-allowed" :
                                selectedSeats.includes(seat.id) ? "bg-primary text-primary-foreground scale-110" :
                                seat.category === "extra-legroom" ? "bg-accent/20 hover:bg-accent/40 border border-accent/30" :
                                seat.category === "premium" ? "bg-warning/10 hover:bg-warning/20 border border-warning/30" :
                                "bg-muted hover:bg-muted-foreground/10 border border-border"
                              }`}
                            >
                              {row.row}
                            </button>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Review & Pay */}
              {currentStep === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h2 className="text-xl font-extrabold mb-6">Review & Payment</h2>
                  <div className="space-y-4">
                    <div className="bg-card rounded-2xl shadow-card border border-border/50 p-6">
                      <h3 className="font-bold text-sm mb-3">Flight Summary</h3>
                      <div className="text-sm space-y-1 text-muted-foreground">
                        <p>{flight.airline} {flight.flightNumber}</p>
                        <p>{flight.from} → {flight.to} • {flight.departureTime} - {flight.arrivalTime}</p>
                        <p>Seats: {selectedSeats.join(", ") || "Not selected"}</p>
                      </div>
                    </div>

                    <div className="bg-card rounded-2xl shadow-card border border-border/50 p-6">
                      <h3 className="font-bold text-sm mb-3">Travelers</h3>
                      {travelers.map((t, i) => (
                        <div key={i} className="text-sm text-muted-foreground py-1">{t.title} {t.firstName} {t.lastName} • {t.email}</div>
                      ))}
                    </div>

                    <div className="bg-card rounded-2xl shadow-card border border-border/50 p-6">
                      <h3 className="font-bold text-sm mb-3">Coupon Code</h3>
                      <div className="flex gap-2">
                        <input value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder="Enter coupon" className="flex-1 px-3 py-2.5 rounded-xl bg-muted/50 border border-border text-sm" />
                        <Button variant="outline" size="sm" className="rounded-xl" onClick={() => { if (coupon.trim()) setCouponApplied(true); }}>Apply</Button>
                      </div>
                      {couponApplied && <p className="text-xs text-success mt-2">Coupon applied! 10% discount</p>}
                    </div>

                    <div className="bg-card rounded-2xl shadow-card border border-border/50 p-6">
                      <h3 className="font-bold text-sm mb-3">Price Breakdown</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span className="text-muted-foreground">Base Fare × {travelers.length}</span><span>₹{(flight.price * travelers.length).toLocaleString()}</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Taxes & Fees</span><span>₹{Math.round(flight.price * 0.12 * travelers.length).toLocaleString()}</span></div>
                        {couponApplied && <div className="flex justify-between text-success"><span>Coupon Discount</span><span>-₹{discount.toLocaleString()}</span></div>}
                        <div className="border-t border-border pt-2 flex justify-between font-bold text-lg">
                          <span>Total</span>
                          <span className="text-primary">₹{(totalPrice - discount).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-card rounded-2xl shadow-card border border-border/50 p-6">
                      <h3 className="font-bold text-sm mb-3">Payment Method</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {["Credit Card", "Debit Card", "UPI", "Net Banking"].map((m) => (
                          <button key={m} className="p-3 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 text-sm font-medium transition-all flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-primary" /> {m}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <input type="checkbox" className="rounded" />
                      <span>I agree to the <Link to="/terms" className="text-primary underline">terms and conditions</Link></span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <Button variant="outline" onClick={goBack} disabled={currentStep === 1} className="rounded-xl">
                Back
              </Button>
              {currentStep < 3 ? (
                <Button onClick={goNext} className="gradient-cta text-primary-foreground border-0 rounded-xl shadow-lg hover:opacity-90 transition-opacity">
                  Continue
                </Button>
              ) : (
                <Button onClick={handlePay} disabled={processing} className="gradient-cta text-primary-foreground border-0 rounded-xl shadow-lg hover:opacity-90 transition-opacity min-w-[160px]">
                  {processing ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Processing...</> : `Pay ₹${(totalPrice - discount).toLocaleString()}`}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default FlightBooking;

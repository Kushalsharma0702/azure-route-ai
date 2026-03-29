import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Tag, CreditCard, Plane, Building, Ticket, User, Plus, Trash2, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import StepProgress from "@/components/StepProgress";

const steps = ["Travelers", "Room", "Review", "Payment"];

interface Traveler {
  name: string;
  email: string;
  phone: string;
  gender: string;
  age: string;
}

const emptyTraveler: Traveler = { name: "", email: "", phone: "", gender: "", age: "" };

const Booking = () => {
  const [step, setStep] = useState(0);
  const [travelers, setTravelers] = useState<Traveler[]>([{ ...emptyTraveler }]);
  const [selectedRoom, setSelectedRoom] = useState(0);
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const basePrice = 50000;
  const discount = couponApplied ? 5000 : 0;
  const total = basePrice - discount;

  const addTraveler = () => setTravelers([...travelers, { ...emptyTraveler }]);
  const removeTraveler = (i: number) => setTravelers(travelers.filter((_, idx) => idx !== i));
  const updateTraveler = (i: number, field: keyof Traveler, value: string) => {
    const updated = [...travelers];
    updated[i] = { ...updated[i], [field]: value };
    setTravelers(updated);
  };

  const rooms = [
    { name: "Deluxe Room", price: "₹4,500/night", desc: "King bed, garden view, 32 sqm" },
    { name: "Premium Suite", price: "₹7,200/night", desc: "King bed, ocean view, 52 sqm, balcony" },
    { name: "Presidential Suite", price: "₹12,000/night", desc: "2 rooms, private pool, 85 sqm" },
  ];

  const next = () => setStep((s) => Math.min(s + 1, 3));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const handlePay = () => {
    setIsSubmitting(true);
    setTimeout(() => setIsSubmitting(false), 2500);
  };

  const inputClass = "w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition";

  const slideVariants = {
    enter: { opacity: 0, x: 30 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageTransition>
        <div className="pt-24 pb-16">
          <div className="container max-w-4xl">
            <StepProgress steps={steps} currentStep={step} />

            <AnimatePresence mode="wait">
              {/* Step 1: Travelers */}
              {step === 0 && (
                <motion.div key="step0" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                  <h2 className="text-xl font-extrabold mb-6">Traveler Details</h2>
                  <div className="space-y-4">
                    {travelers.map((t, i) => (
                      <div key={i} className="bg-card rounded-2xl shadow-card border border-border/50 p-6">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="font-bold text-sm flex items-center gap-2"><User className="w-4 h-4 text-primary" /> Traveler {i + 1}</h3>
                          {travelers.length > 1 && (
                            <button onClick={() => removeTraveler(i)} className="text-destructive hover:bg-destructive/10 p-1.5 rounded-lg transition">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1 block">Full Name</label>
                            <input value={t.name} onChange={(e) => updateTraveler(i, "name", e.target.value)} className={inputClass} placeholder="John Doe" />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1 block">Email</label>
                            <input value={t.email} onChange={(e) => updateTraveler(i, "email", e.target.value)} className={inputClass} placeholder="john@email.com" type="email" />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1 block">Phone</label>
                            <input value={t.phone} onChange={(e) => updateTraveler(i, "phone", e.target.value)} className={inputClass} placeholder="+91 98765 43210" />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-xs font-medium text-muted-foreground mb-1 block">Gender</label>
                              <select value={t.gender} onChange={(e) => updateTraveler(i, "gender", e.target.value)} className={inputClass}>
                                <option value="">Select</option>
                                <option>Male</option>
                                <option>Female</option>
                                <option>Other</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-xs font-medium text-muted-foreground mb-1 block">Age</label>
                              <input value={t.age} onChange={(e) => updateTraveler(i, "age", e.target.value)} className={inputClass} placeholder="28" type="number" />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" onClick={addTraveler} className="rounded-xl">
                      <Plus className="w-4 h-4 mr-2" /> Add Traveler
                    </Button>
                  </div>
                  <div className="flex justify-end mt-6">
                    <Button onClick={next} className="gradient-cta text-primary-foreground border-0 rounded-xl px-8 hover:opacity-90 transition-opacity">Continue</Button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Room */}
              {step === 1 && (
                <motion.div key="step1" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                  <h2 className="text-xl font-extrabold mb-6">Select Your Room</h2>
                  <div className="space-y-3">
                    {rooms.map((room, i) => (
                      <motion.button
                        key={room.name}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => setSelectedRoom(i)}
                        className={`w-full text-left bg-card rounded-2xl border p-5 transition-all ${
                          selectedRoom === i ? "border-primary shadow-card-hover ring-2 ring-primary/20" : "border-border/50 shadow-card hover:shadow-card-hover"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-bold">{room.name}</h3>
                            <p className="text-sm text-muted-foreground">{room.desc}</p>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-primary">{room.price}</span>
                            {selectedRoom === i && <Check className="w-5 h-5 text-primary ml-auto mt-1" />}
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                  <div className="flex justify-between mt-6">
                    <Button variant="outline" onClick={back} className="rounded-xl">Back</Button>
                    <Button onClick={next} className="gradient-cta text-primary-foreground border-0 rounded-xl px-8 hover:opacity-90 transition-opacity">Continue</Button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Review */}
              {step === 2 && (
                <motion.div key="step2" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                  <h2 className="text-xl font-extrabold mb-6">Review Booking</h2>
                  <div className="grid lg:grid-cols-5 gap-8">
                    <div className="lg:col-span-3 space-y-4">
                      <div className="bg-card rounded-2xl shadow-card border border-border/50 p-6">
                        <h3 className="font-bold mb-4">Trip Summary</h3>
                        <div className="space-y-3">
                          {[
                            { icon: Plane, label: "IndiGo 6E-234", detail: "DEL → DPS • Mar 15", price: "₹18,000" },
                            { icon: Building, label: rooms[selectedRoom].name, detail: "4 nights • Mar 15-19", price: rooms[selectedRoom].price },
                            { icon: Ticket, label: "Activity Package", detail: "5 activities included", price: "₹8,000" },
                          ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/30">
                              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                <item.icon className="w-5 h-5 text-primary" />
                              </div>
                              <div className="flex-1">
                                <div className="text-sm font-medium">{item.label}</div>
                                <div className="text-xs text-muted-foreground">{item.detail}</div>
                              </div>
                              <span className="font-semibold text-sm">{item.price}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="bg-card rounded-2xl shadow-card border border-border/50 p-6">
                        <h3 className="font-bold mb-3">Travelers</h3>
                        {travelers.map((t, i) => (
                          <div key={i} className="text-sm py-2 border-b border-border/30 last:border-0">
                            <span className="font-medium">{t.name || `Traveler ${i + 1}`}</span>
                            <span className="text-muted-foreground ml-2">{t.email}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="lg:col-span-2">
                      <div className="bg-card rounded-2xl shadow-card border border-border/50 p-6 sticky top-24">
                        <h3 className="font-bold mb-4">Price Breakdown</h3>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between"><span className="text-muted-foreground">Flights</span><span>₹18,000</span></div>
                          <div className="flex justify-between"><span className="text-muted-foreground">Hotels</span><span>₹20,000</span></div>
                          <div className="flex justify-between"><span className="text-muted-foreground">Activities</span><span>₹8,000</span></div>
                          <div className="flex justify-between"><span className="text-muted-foreground">Taxes & Fees</span><span>₹4,000</span></div>
                          {couponApplied && <div className="flex justify-between text-success"><span>Coupon</span><span>-₹5,000</span></div>}
                        </div>
                        <div className="my-4">
                          <label className="text-sm font-medium mb-2 block">Apply Coupon</label>
                          <div className="flex gap-2">
                            <div className="relative flex-1">
                              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                              <input value={coupon} onChange={(e) => setCoupon(e.target.value)} className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Enter code" />
                            </div>
                            <Button variant="outline" className="rounded-xl" onClick={() => setCouponApplied(true)}>Apply</Button>
                          </div>
                        </div>
                        <div className="border-t border-border pt-4 flex justify-between font-bold text-lg">
                          <span>Total</span>
                          <span className="text-primary">₹{total.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between mt-6">
                    <Button variant="outline" onClick={back} className="rounded-xl">Back</Button>
                    <Button onClick={next} className="gradient-cta text-primary-foreground border-0 rounded-xl px-8 hover:opacity-90 transition-opacity">Proceed to Pay</Button>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Payment */}
              {step === 3 && (
                <motion.div key="step3" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                  <h2 className="text-xl font-extrabold mb-6">Payment</h2>
                  <div className="max-w-lg mx-auto">
                    <div className="bg-card rounded-2xl shadow-card border border-border/50 p-6 space-y-4">
                      <h3 className="font-bold mb-2">Select Payment Method</h3>
                      {["Credit / Debit Card", "UPI", "Net Banking", "Wallet"].map((method, i) => (
                        <label key={method} className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${i === 0 ? "border-primary bg-primary/5 ring-2 ring-primary/20" : "border-border/50 hover:bg-muted/30"}`}>
                          <input type="radio" name="payment" defaultChecked={i === 0} className="accent-primary" />
                          <span className="text-sm font-medium">{method}</span>
                        </label>
                      ))}

                      <div className="pt-4 space-y-3">
                        <div>
                          <label className="text-xs font-medium text-muted-foreground mb-1 block">Card Number</label>
                          <input className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="4242 4242 4242 4242" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1 block">Expiry</label>
                            <input className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="MM/YY" />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1 block">CVV</label>
                            <input className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="***" type="password" />
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-border pt-4 flex justify-between font-bold text-lg">
                        <span>Pay</span>
                        <span className="text-primary">₹{total.toLocaleString()}</span>
                      </div>

                      <Button
                        onClick={handlePay}
                        disabled={isSubmitting}
                        className="w-full h-12 gradient-cta text-primary-foreground border-0 rounded-xl font-semibold shadow-lg hover:opacity-90 transition-opacity disabled:opacity-60"
                      >
                        {isSubmitting ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <><CreditCard className="w-4 h-4 mr-2" /> Pay ₹{total.toLocaleString()}</>
                        )}
                      </Button>

                      <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        256-bit SSL encrypted • Secure payment
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-start mt-6">
                    <Button variant="outline" onClick={back} className="rounded-xl">Back</Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </PageTransition>
      <Footer />
    </div>
  );
};

export default Booking;

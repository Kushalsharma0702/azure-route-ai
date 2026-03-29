import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, CreditCard, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import PageTransition from "@/components/PageTransition";
import StepProgress from "@/components/StepProgress";
import { trains } from "@/data/trains";

const TrainBooking = () => {
  const { id, step } = useParams();
  const navigate = useNavigate();
  const currentStep = Number(step) || 1;
  const train = trains.find((t) => t.id === id) || trains[0];

  const [passengers, setPassengers] = useState([{ name: "", age: "", gender: "Male", berth: "No Preference" }]);
  const [selectedClass, setSelectedClass] = useState(train.classes[0]?.id || "");
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [processing, setProcessing] = useState(false);

  const steps = ["Passengers", "Coach Selection", "Review & Pay"];
  const cls = train.classes.find((c) => c.id === selectedClass) || train.classes[0];
  const total = cls.price * passengers.length;
  const discount = couponApplied ? Math.round(total * 0.05) : 0;

  const goNext = () => {
    if (currentStep === 1 && !passengers[0].name.trim()) return;
    navigate(`/book/train/${id}/step/${currentStep + 1}`);
  };
  const goBack = () => { if (currentStep > 1) navigate(`/book/train/${id}/step/${currentStep - 1}`); };
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
                  <h2 className="text-xl font-extrabold mb-6">Passenger Details</h2>
                  {passengers.map((p, i) => (
                    <div key={i} className="bg-card rounded-2xl shadow-card border border-border/50 p-6 mb-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-sm">Passenger {i + 1}</h3>
                        {i > 0 && <button onClick={() => setPassengers((pr) => pr.filter((_, j) => j !== i))} className="text-destructive text-xs flex items-center gap-1"><Trash2 className="w-3 h-3" /> Remove</button>}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="col-span-2">
                          <label className="text-xs font-medium text-muted-foreground mb-1 block">Full Name</label>
                          <input value={p.name} onChange={(e) => setPassengers((pr) => pr.map((pp, j) => j === i ? { ...pp, name: e.target.value } : pp))} className="w-full px-3 py-2.5 rounded-xl bg-muted/50 border border-border text-sm" />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-muted-foreground mb-1 block">Age</label>
                          <input type="number" value={p.age} onChange={(e) => setPassengers((pr) => pr.map((pp, j) => j === i ? { ...pp, age: e.target.value } : pp))} className="w-full px-3 py-2.5 rounded-xl bg-muted/50 border border-border text-sm" />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-muted-foreground mb-1 block">Gender</label>
                          <select value={p.gender} onChange={(e) => setPassengers((pr) => pr.map((pp, j) => j === i ? { ...pp, gender: e.target.value } : pp))} className="w-full px-3 py-2.5 rounded-xl bg-muted/50 border border-border text-sm">
                            <option>Male</option><option>Female</option><option>Other</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button onClick={() => setPassengers((p) => [...p, { name: "", age: "", gender: "Male", berth: "No Preference" }])} className="flex items-center gap-2 text-sm text-primary font-medium hover:underline"><Plus className="w-4 h-4" /> Add Passenger</button>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h2 className="text-xl font-extrabold mb-6">Select Class & Berth</h2>
                  <div className="space-y-3 mb-6">
                    {train.classes.map((c) => (
                      <button key={c.id} onClick={() => setSelectedClass(c.id)} className={`w-full text-left p-5 rounded-2xl border transition-all ${selectedClass === c.id ? "border-primary bg-primary/5 shadow-card-hover" : "border-border/50 bg-card hover:border-primary/30"}`}>
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-bold text-sm">{c.name} ({c.code})</h3>
                            <p className={`text-xs mt-1 ${c.available > 0 ? "text-success" : "text-destructive"}`}>{c.available > 0 ? `${c.available} available` : "Waitlisted"}</p>
                          </div>
                          <div className="text-lg font-extrabold text-primary">₹{c.price.toLocaleString()}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                  <h3 className="font-bold text-sm mb-3">Berth Preference</h3>
                  {passengers.map((p, i) => (
                    <div key={i} className="flex items-center gap-3 mb-2 text-sm">
                      <span className="text-muted-foreground w-24">{p.name || `Passenger ${i + 1}`}</span>
                      <select value={p.berth} onChange={(e) => setPassengers((pr) => pr.map((pp, j) => j === i ? { ...pp, berth: e.target.value } : pp))} className="px-3 py-2 rounded-xl bg-muted/50 border border-border text-sm">
                        <option>No Preference</option><option>Lower</option><option>Middle</option><option>Upper</option><option>Side Lower</option><option>Side Upper</option>
                      </select>
                    </div>
                  ))}
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h2 className="text-xl font-extrabold mb-6">Review & Payment</h2>
                  <div className="space-y-4">
                    <div className="bg-card rounded-2xl shadow-card border border-border/50 p-6">
                      <h3 className="font-bold text-sm mb-2">{train.name} #{train.number}</h3>
                      <p className="text-sm text-muted-foreground">{train.from} → {train.to} • {cls.name}</p>
                      {passengers.map((p, i) => <p key={i} className="text-sm text-muted-foreground">{p.name}, {p.age}y, {p.gender} — {p.berth}</p>)}
                    </div>

                    <div className="bg-card rounded-2xl shadow-card border border-border/50 p-6">
                      <h3 className="font-bold text-sm mb-3">Coupon</h3>
                      <div className="flex gap-2">
                        <input value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder="Enter coupon" className="flex-1 px-3 py-2.5 rounded-xl bg-muted/50 border border-border text-sm" />
                        <Button variant="outline" size="sm" className="rounded-xl" onClick={() => { if (coupon.trim()) setCouponApplied(true); }}>Apply</Button>
                      </div>
                      {couponApplied && <p className="text-xs text-success mt-2">5% discount applied!</p>}
                    </div>

                    <div className="bg-card rounded-2xl shadow-card border border-border/50 p-6">
                      <h3 className="font-bold text-sm mb-3">Price</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span className="text-muted-foreground">₹{cls.price.toLocaleString()} × {passengers.length}</span><span>₹{total.toLocaleString()}</span></div>
                        {couponApplied && <div className="flex justify-between text-success"><span>Discount</span><span>-₹{discount.toLocaleString()}</span></div>}
                        <div className="border-t border-border pt-2 flex justify-between font-bold text-lg"><span>Total</span><span className="text-primary">₹{(total - discount).toLocaleString()}</span></div>
                      </div>
                    </div>

                    <div className="bg-card rounded-2xl shadow-card border border-border/50 p-6">
                      <h3 className="font-bold text-sm mb-3">Payment</h3>
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
                <Button onClick={goNext} className="gradient-cta text-primary-foreground border-0 rounded-xl shadow-lg hover:opacity-90">Continue</Button>
              ) : (
                <Button onClick={handlePay} disabled={processing} className="gradient-cta text-primary-foreground border-0 rounded-xl shadow-lg hover:opacity-90 min-w-[160px]">
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

export default TrainBooking;

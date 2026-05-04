import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, CreditCard, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import PageTransition from "@/components/PageTransition";
import StepProgress from "@/components/StepProgress";
import { packages } from "@/data/packages";
import { packages as packagesApi } from "@/services/api";

const PackageBooking = () => {
  const { id, step } = useParams();
  const navigate = useNavigate();
  const currentStep = Number(step) || 1;
  const pkg = packages.find((p) => p.id === id) || packages[0];

  const [travelers, setTravelers] = useState([{ name: "", email: "", phone: "", dob: "" }]);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [processing, setProcessing] = useState(false);

  const steps = ["Travelers", "Add-ons", "Review & Pay"];
  const addOnTotal = pkg.addOns.filter((a) => selectedAddOns.includes(a.id)).reduce((sum, a) => sum + a.price, 0);
  const baseTotal = pkg.price * travelers.length + addOnTotal;
  const taxes = Math.round(baseTotal * 0.05);
  const total = baseTotal + taxes;
  const discount = couponApplied ? Math.round(total * 0.1) : 0;

  const goNext = () => {
    if (currentStep === 1 && !travelers[0].name.trim()) return;
    navigate(`/book/package/${id}/step/${currentStep + 1}`);
  };
  const goBack = () => { if (currentStep > 1) navigate(`/book/package/${id}/step/${currentStep - 1}`); };
  const handlePay = async () => {
    setProcessing(true);
    try {
      const travelDate = new Date();
      travelDate.setDate(travelDate.getDate() + 14);

      await packagesApi.book({
        package_title: pkg.title,
        package_destination: pkg.destination,
        package_duration: pkg.duration,
        package_category: pkg.category,
        guest_name: travelers[0].name,
        guest_email: travelers[0].email || undefined,
        guest_phone: travelers[0].phone || undefined,
        travelers_count: travelers.length,
        travelers: travelers.map(t => ({ name: t.name, email: t.email, phone: t.phone, dob: t.dob })),
        itinerary: pkg.itinerary,
        inclusions: pkg.inclusions,
        exclusions: pkg.exclusions,
        add_ons: pkg.addOns.filter(a => selectedAddOns.includes(a.id)).map(a => ({ name: a.name, price: a.price })),
        travel_date: travelDate.toISOString().split('T')[0],
        status: "Confirmed",
        payment_status: "Paid",
        amount: total - discount,
      });

      navigate("/confirmation");
    } catch (err) {
      console.error("Package booking failed:", err);
      setProcessing(false);
      alert("Booking failed. Please try again.");
    }
  };

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
                  <h2 className="text-xl font-extrabold mb-6">Traveler Details</h2>
                  {travelers.map((t, i) => (
                    <div key={i} className="bg-card rounded-2xl shadow-card border border-border/50 p-6 mb-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-sm">Traveler {i + 1}</h3>
                        {i > 0 && <button onClick={() => setTravelers((p) => p.filter((_, j) => j !== i))} className="text-destructive text-xs flex items-center gap-1"><Trash2 className="w-3 h-3" /> Remove</button>}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {(["name", "email", "phone", "dob"] as const).map((f) => (
                          <div key={f}>
                            <label className="text-xs font-medium text-muted-foreground mb-1 block capitalize">{f === "dob" ? "Date of Birth" : f === "name" ? "Full Name" : f}</label>
                            <input type={f === "email" ? "email" : f === "phone" ? "tel" : f === "dob" ? "date" : "text"} value={t[f]} onChange={(e) => setTravelers((p) => p.map((tt, j) => j === i ? { ...tt, [f]: e.target.value } : tt))} className="w-full px-3 py-2.5 rounded-xl bg-muted/50 border border-border text-sm" />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  <button onClick={() => setTravelers((p) => [...p, { name: "", email: "", phone: "", dob: "" }])} className="flex items-center gap-2 text-sm text-primary font-medium hover:underline"><Plus className="w-4 h-4" /> Add Traveler</button>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h2 className="text-xl font-extrabold mb-6">Customize Your Trip</h2>
                  <p className="text-sm text-muted-foreground mb-4">Add extras to make your trip even more special</p>
                  <div className="space-y-3">
                    {pkg.addOns.map((addon) => (
                      <button key={addon.id} onClick={() => setSelectedAddOns((p) => p.includes(addon.id) ? p.filter((a) => a !== addon.id) : [...p, addon.id])} className={`w-full text-left p-5 rounded-2xl border transition-all ${selectedAddOns.includes(addon.id) ? "border-primary bg-primary/5 shadow-card-hover" : "border-border/50 bg-card hover:border-primary/30"}`}>
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-bold text-sm flex items-center gap-2">
                              {selectedAddOns.includes(addon.id) && <Check className="w-4 h-4 text-primary" />}
                              {addon.name}
                            </h3>
                            <p className="text-xs text-muted-foreground mt-1">{addon.description}</p>
                          </div>
                          <div className="text-lg font-extrabold text-primary">+₹{addon.price.toLocaleString()}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h2 className="text-xl font-extrabold mb-6">Review & Payment</h2>
                  <div className="space-y-4">
                    <div className="bg-card rounded-2xl shadow-card border border-border/50 p-6">
                      <h3 className="font-bold text-sm mb-2">{pkg.title}</h3>
                      <p className="text-sm text-muted-foreground">{pkg.destination} • {pkg.duration}</p>
                      {travelers.map((t, i) => <p key={i} className="text-sm text-muted-foreground">{t.name} • {t.email}</p>)}
                      {selectedAddOns.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {pkg.addOns.filter((a) => selectedAddOns.includes(a.id)).map((a) => (
                            <span key={a.id} className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">{a.name}</span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="bg-card rounded-2xl shadow-card border border-border/50 p-6">
                      <h3 className="font-bold text-sm mb-3">Coupon</h3>
                      <div className="flex gap-2">
                        <input value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder="Enter coupon" className="flex-1 px-3 py-2.5 rounded-xl bg-muted/50 border border-border text-sm" />
                        <Button variant="outline" size="sm" className="rounded-xl" onClick={() => { if (coupon.trim()) setCouponApplied(true); }}>Apply</Button>
                      </div>
                      {couponApplied && <p className="text-xs text-success mt-2">10% discount applied!</p>}
                    </div>

                    <div className="bg-card rounded-2xl shadow-card border border-border/50 p-6">
                      <h3 className="font-bold text-sm mb-3">Price</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span className="text-muted-foreground">Package × {travelers.length}</span><span>₹{(pkg.price * travelers.length).toLocaleString()}</span></div>
                        {addOnTotal > 0 && <div className="flex justify-between"><span className="text-muted-foreground">Add-ons</span><span>₹{addOnTotal.toLocaleString()}</span></div>}
                        <div className="flex justify-between"><span className="text-muted-foreground">Taxes (5%)</span><span>₹{taxes.toLocaleString()}</span></div>
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

export default PackageBooking;

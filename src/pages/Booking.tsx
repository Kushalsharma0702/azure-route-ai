import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Tag, CreditCard, Plane, Building, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Booking = () => {
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);

  const basePrice = 50000;
  const discount = couponApplied ? 5000 : 0;
  const total = basePrice - discount;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container max-w-4xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-3xl font-extrabold mb-8"
          >
            Complete Your Booking
          </motion.h1>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Booking form */}
            <div className="lg:col-span-3 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-2xl shadow-card border border-border/50 p-6"
              >
                <h3 className="font-bold mb-4">Trip Summary</h3>
                <div className="space-y-3">
                  {[
                    { icon: Plane, label: "IndiGo 6E-234", detail: "DEL → DPS • Mar 15", price: "₹18,000" },
                    { icon: Building, label: "The Seminyak Resort", detail: "4 nights • Mar 15-19", price: "₹20,000" },
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
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-card rounded-2xl shadow-card border border-border/50 p-6"
              >
                <h3 className="font-bold mb-4">Traveler Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-1 block">First Name</label>
                    <input className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="John" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-1 block">Last Name</label>
                    <input className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Doe" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-1 block">Email</label>
                    <input className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="john@email.com" type="email" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-1 block">Phone</label>
                    <input className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="+91 98765 43210" />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Price summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2"
            >
              <div className="bg-card rounded-2xl shadow-card border border-border/50 p-6 sticky top-24">
                <h3 className="font-bold mb-4">Price Breakdown</h3>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Flights</span><span>₹18,000</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Hotels</span><span>₹20,000</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Activities</span><span>₹8,000</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Taxes & Fees</span><span>₹4,000</span></div>
                  {couponApplied && (
                    <div className="flex justify-between text-success">
                      <span>Coupon Discount</span><span>-₹5,000</span>
                    </div>
                  )}
                </div>

                <div className="my-4">
                  <label className="text-sm font-medium mb-2 block">Apply Coupon</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        value={coupon}
                        onChange={(e) => setCoupon(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                        placeholder="Enter code"
                      />
                    </div>
                    <Button
                      variant="outline"
                      className="rounded-xl"
                      onClick={() => setCouponApplied(true)}
                    >
                      Apply
                    </Button>
                  </div>
                </div>

                <div className="border-t border-border pt-4 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">₹{total.toLocaleString()}</span>
                </div>

                <Button className="w-full mt-4 h-12 gradient-cta text-primary-foreground border-0 rounded-xl font-semibold shadow-lg hover:opacity-90 transition-opacity">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Pay ₹{total.toLocaleString()}
                </Button>

                <div className="flex items-center justify-center gap-1 mt-3 text-xs text-muted-foreground">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Secure payment powered by Stripe
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Booking;

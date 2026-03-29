import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Download, Printer, Home, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import PageTransition from "@/components/PageTransition";

const Confirmation = () => {
  const bookingRef = `TRP-${Date.now().toString(36).toUpperCase()}`;

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-16">
          <div className="container max-w-lg text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}>
              <CheckCircle className="w-20 h-20 text-success mx-auto mb-6" />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <h1 className="text-3xl font-extrabold mb-2">Booking Confirmed! 🎉</h1>
              <p className="text-muted-foreground mb-6">Your trip has been booked successfully</p>
              <div className="bg-card rounded-2xl shadow-card border border-border/50 p-6 mb-6">
                <div className="text-xs text-muted-foreground mb-1">Booking Reference</div>
                <div className="text-2xl font-extrabold text-primary tracking-wider">{bookingRef}</div>
                <p className="text-xs text-muted-foreground mt-3">Confirmation sent to your email & phone</p>
              </div>
              <div className="flex gap-3 justify-center mb-8">
                <Button variant="outline" size="sm" className="rounded-xl"><Download className="w-4 h-4 mr-1" /> Download</Button>
                <Button variant="outline" size="sm" className="rounded-xl"><Printer className="w-4 h-4 mr-1" /> Print</Button>
              </div>
              <div className="flex gap-3 justify-center">
                <Link to="/"><Button variant="outline" className="rounded-xl"><Home className="w-4 h-4 mr-1" /> Home</Button></Link>
                <Link to="/dashboard"><Button className="gradient-cta text-primary-foreground border-0 rounded-xl shadow-lg hover:opacity-90"><LayoutDashboard className="w-4 h-4 mr-1" /> My Trips</Button></Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Confirmation;

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HelpCircle, MessageSquare, Phone, Mail, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";

const Support = () => (
  <PageTransition>
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="text-3xl font-extrabold mb-2">How can we help?</h1>
            <p className="text-muted-foreground">Get in touch with our support team</p>
          </motion.div>
          <div className="grid sm:grid-cols-3 gap-4 mb-12">
            {[
              { icon: Phone, title: "Call Us", desc: "+91 98765 43210", sub: "24/7 support" },
              { icon: Mail, title: "Email", desc: "support@routeaura.com", sub: "Response within 2 hours" },
              { icon: MessageSquare, title: "Live Chat", desc: "Chat with us", sub: "Available now" },
            ].map((item) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl shadow-card border border-border/50 p-6 text-center">
                <item.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-bold text-sm">{item.title}</h3>
                <p className="text-sm text-primary font-medium">{item.desc}</p>
                <p className="text-xs text-muted-foreground">{item.sub}</p>
              </motion.div>
            ))}
          </div>
          <div className="bg-card rounded-2xl shadow-card border border-border/50 p-6">
            <h2 className="font-bold text-lg mb-4">Frequently Asked Questions</h2>
            {["How do I cancel my booking?", "How to modify travel dates?", "What is the refund policy?", "How to use coupon codes?"].map((q) => (
              <div key={q} className="flex items-center justify-between p-3 border-b border-border/30 last:border-0">
                <span className="text-sm">{q}</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  </PageTransition>
);

export default Support;

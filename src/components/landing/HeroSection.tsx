import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Plane, Building, Train, Package, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";

const tabs = [
  { id: "flights", label: "Flights", icon: Plane },
  { id: "hotels", label: "Hotels", icon: Building },
  { id: "trains", label: "Trains", icon: Train },
  { id: "packages", label: "Packages", icon: Package },
  { id: "ai", label: "Plan Trip", icon: Sparkles },
];

const HeroSection = () => {
  const [activeTab, setActiveTab] = useState("flights");

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-16">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="" className="w-full h-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/70 via-foreground/50 to-background" />
      </div>

      <div className="container relative z-10 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-10"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30 mb-6"
          >
            <Sparkles className="w-4 h-4 text-primary-foreground" />
            <span className="text-sm font-medium text-primary-foreground">AI-Powered Travel Planning</span>
          </motion.div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-4">
            <span className="text-primary-foreground">Plan Your Trip in</span>
            <br />
            <span className="text-primary-foreground">Seconds with AI 🚀</span>
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto text-primary-foreground/80">
            Flights, Hotels, Packages — all in one place. Let our AI craft your perfect journey.
          </p>
        </motion.div>

        {/* Search Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="glass rounded-2xl shadow-hero p-1">
            {/* Tabs */}
            <div className="flex overflow-x-auto gap-1 p-1 mb-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? "gradient-cta text-primary-foreground shadow-lg"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search Fields */}
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="md:col-span-1">
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">From</label>
                  <input
                    type="text"
                    placeholder="Delhi (DEL)"
                    className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
                  />
                </div>
                <div className="md:col-span-1">
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">To</label>
                  <input
                    type="text"
                    placeholder="Bali, Indonesia"
                    className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
                  />
                </div>
                <div className="md:col-span-1">
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
                  />
                </div>
                <div className="md:col-span-1 flex items-end">
                  <Button className="w-full h-12 gradient-cta text-primary-foreground border-0 rounded-xl text-sm font-semibold shadow-lg hover:opacity-90 transition-opacity">
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-wrap justify-center gap-8 mt-10"
        >
          {[
            { value: "50K+", label: "Happy Travelers" },
            { value: "200+", label: "Destinations" },
            { value: "4.9★", label: "User Rating" },
            { value: "24/7", label: "AI Support" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-bold text-primary-foreground">{stat.value}</div>
              <div className="text-sm text-primary-foreground/60">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const thoughts = [
  "Dreaming of your next adventure...",
  "Packing your virtual bags...",
  "Finding the best routes for you...",
  "Exploring hidden destinations...",
  "Creating memories, one journey at a time...",
  "Your adventure awaits...",
  "Let's make this trip unforgettable...",
  "Discovering new horizons...",
  "Ready to explore the world?",
  "Your journey starts here...",
];

const RouteAuraLoader = () => {
  const [currentThought, setCurrentThought] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentThought((prev) => (prev + 1) % thoughts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gradient-to-br from-background via-background/95 to-background z-[9999] flex items-center justify-center"
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
          className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10"
          style={{ backgroundSize: "200% 200%" }}
        />
      </div>

      <div className="relative z-10 text-center space-y-8">
        {/* Vehicle SVGs Container */}
        <div className="flex justify-center items-center gap-6 mb-8">
          {/* Animated Plane */}
          <motion.div
            animate={{ x: [0, 10, 0], y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-6xl"
          >
            ✈️
          </motion.div>

          {/* Animated Bus */}
          <motion.div
            animate={{ x: [0, -10, 0], y: [0, 5, 0] }}
            transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
            className="text-6xl"
          >
            🚌
          </motion.div>

          {/* Animated Car */}
          <motion.div
            animate={{ x: [0, 15, 0], y: [0, -3, 0] }}
            transition={{ duration: 3, repeat: Infinity, delay: 1 }}
            className="text-6xl"
          >
            🚗
          </motion.div>
        </div>

        {/* Animated dots */}
        <div className="flex justify-center gap-2 items-center h-8">
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
            className="w-3 h-3 rounded-full bg-primary"
          />
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
            className="w-3 h-3 rounded-full bg-primary"
          />
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
            className="w-3 h-3 rounded-full bg-primary"
          />
        </div>

        {/* Thought text with animation */}
        <motion.div
          key={currentThought}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="mt-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-primary">
            RouteAura
          </h2>
          <motion.p
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-lg md:text-xl text-muted-foreground mt-4 font-light"
          >
            {thoughts[currentThought]}
          </motion.p>
        </motion.div>

        {/* RouteAura tagline */}
        <motion.p
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="text-xs md:text-sm text-muted-foreground/70 mt-8"
        >
          ✨ Explore India With Confidence ✨
        </motion.p>
      </div>
    </motion.div>
  );
};

export default RouteAuraLoader;

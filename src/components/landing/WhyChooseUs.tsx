import { motion } from "framer-motion";
import { Sparkles, ShieldCheck, Zap, Headphones } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Planning",
    description: "Our AI analyzes thousands of Indian destinations to create your perfect trip in seconds.",
  },
  {
    icon: ShieldCheck,
    title: "Best Price Guarantee",
    description: "We compare prices across 200+ Indian travel providers to ensure the lowest rates.",
  },
  {
    icon: Zap,
    title: "One-Click Booking",
    description: "Book flights, hotels, trains and activities across India in a single click.",
  },
  {
    icon: Headphones,
    title: "24/7 AI Concierge",
    description: "Your personal Indian travel assistant available round the clock for any trip changes.",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-24">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold mb-3">Why Indian Travelers Love Us</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Everything you need for a seamless Indian travel experience, powered by cutting-edge AI.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {features.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-card rounded-2xl shadow-card border border-border/50 p-6 text-center hover:shadow-card-hover transition-all"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4">
                <feat.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="font-bold mb-2">{feat.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feat.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;

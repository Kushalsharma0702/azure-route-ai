import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { testimonials } from "@/data/mockData";

const Testimonials = () => {
  return (
    <section className="py-24 bg-card">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold mb-3">What Travelers Say</h2>
          <p className="text-muted-foreground">Real experiences from real travelers</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-background rounded-2xl shadow-card border border-border/50 p-6 relative"
            >
              <Quote className="w-8 h-8 text-primary/15 absolute top-4 right-4" />
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-primary-foreground font-bold text-sm">
                  {t.avatar}
                </div>
                <div>
                  <div className="font-semibold text-sm">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-warning text-warning" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{t.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

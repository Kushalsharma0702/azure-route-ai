import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { packageCategories } from "@/data/mockData";

const PackageCategories = () => {
  return (
    <section className="py-24 bg-card">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold mb-3">Holiday Packages</h2>
          <p className="text-muted-foreground">Curated travel packages for every kind of traveler</p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {packageCategories.map((cat, i) => (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className={`bg-gradient-to-br ${cat.color} rounded-2xl p-6 text-center border border-border/30 hover:shadow-card-hover transition-shadow`}
            >
              <div className="text-4xl mb-3">{cat.icon}</div>
              <h3 className="font-bold text-sm mb-1">{cat.title}</h3>
              <p className="text-xs text-muted-foreground">{cat.count} packages</p>
              <div className="mt-3 inline-flex items-center text-xs font-medium text-primary">
                Explore <ArrowRight className="w-3 h-3 ml-1" />
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PackageCategories;

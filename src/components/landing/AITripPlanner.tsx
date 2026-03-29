import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, MapPin, Wallet, Calendar, Heart, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sampleItinerary } from "@/data/mockData";

const moods = [
  { id: "chill", label: "🏖️ Chill", color: "bg-blue-500/10 text-blue-700 border-blue-200" },
  { id: "adventure", label: "🏔️ Adventure", color: "bg-emerald-500/10 text-emerald-700 border-emerald-200" },
  { id: "romantic", label: "💕 Romantic", color: "bg-pink-500/10 text-pink-700 border-pink-200" },
  { id: "cultural", label: "🏛️ Cultural", color: "bg-amber-500/10 text-amber-700 border-amber-200" },
];

const AITripPlanner = () => {
  const [selectedMood, setSelectedMood] = useState("chill");
  const [showItinerary, setShowItinerary] = useState(false);

  return (
    <section className="py-24 bg-card" id="ai-planner">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" /> AI Trip Planner
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4">
            Let AI Plan Your <span className="text-gradient">Perfect Trip</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Tell us your preferences and our AI will create a personalized day-by-day itinerary in seconds.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 items-start max-w-5xl mx-auto">
          {/* Input Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-background rounded-2xl shadow-card p-8 border border-border/50"
          >
            <div className="space-y-5">
              <div>
                <label className="text-sm font-medium flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-primary" /> Destination
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bali, Paris, Tokyo..."
                  className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium flex items-center gap-2 mb-2">
                    <Wallet className="w-4 h-4 text-primary" /> Budget
                  </label>
                  <input
                    type="text"
                    placeholder="₹50,000"
                    className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-primary" /> Days
                  </label>
                  <input
                    type="number"
                    placeholder="5"
                    className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium flex items-center gap-2 mb-2">
                  <Heart className="w-4 h-4 text-primary" /> Travel Mood
                </label>
                <div className="flex flex-wrap gap-2">
                  {moods.map((mood) => (
                    <button
                      key={mood.id}
                      onClick={() => setSelectedMood(mood.id)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                        selectedMood === mood.id
                          ? mood.color + " ring-2 ring-primary/20"
                          : "bg-muted/30 text-muted-foreground border-border hover:bg-muted"
                      }`}
                    >
                      {mood.label}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={() => setShowItinerary(true)}
                className="w-full h-12 gradient-cta text-primary-foreground border-0 rounded-xl font-semibold shadow-lg hover:opacity-90 transition-opacity"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Generate My Trip
              </Button>
            </div>
          </motion.div>

          {/* Sample Itinerary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <div className="text-sm font-medium text-muted-foreground mb-2">Sample AI-Generated Itinerary</div>
            {sampleItinerary.map((day, i) => (
              <motion.div
                key={day.day}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-background rounded-2xl shadow-card border border-border/50 p-5 hover:shadow-card-hover transition-shadow"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl gradient-cta flex items-center justify-center text-primary-foreground font-bold text-sm">
                    D{day.day}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">{day.title}</h4>
                    <p className="text-xs text-muted-foreground">{day.activities.length} activities planned</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {day.activities.map((activity) => (
                    <span
                      key={activity}
                      className="text-xs px-3 py-1.5 bg-muted rounded-lg text-muted-foreground"
                    >
                      {activity}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}

            <Button variant="outline" className="w-full rounded-xl">
              View Full Itinerary <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AITripPlanner;

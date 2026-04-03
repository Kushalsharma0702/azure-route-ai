import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, MapPin, Wallet, Calendar, Heart, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const moods = [
  { id: "chill", label: " Chill", color: "bg-secondary/20 text-foreground border-secondary" },
  { id: "adventure", label: " Adventure", color: "bg-success/10 text-foreground border-success/30" },
  { id: "romantic", label: " Romantic", color: "bg-primary/10 text-foreground border-primary/30" },
  { id: "cultural", label: " Cultural", color: "bg-accent/20 text-foreground border-accent" },
];

const sampleItinerary = [
  { day: 1, title: "Arrival in Jaipur", activities: ["Airport pickup", "Check-in at Rambagh Palace", "Hawa Mahal sunset visit", "Traditional Rajasthani thali dinner"] },
  { day: 2, title: "Forts & Heritage", activities: ["Amer Fort elephant ride", "City Palace tour", "Jantar Mantar", "Shopping at Johari Bazaar"] },
  { day: 3, title: "Culture & Departure", activities: ["Nahargarh Fort sunrise", "Block printing workshop", "Chokhi Dhani experience", "Airport transfer"] },
];

const AITripPlanner = () => {
  const [selectedMood, setSelectedMood] = useState("chill");
  const [generating, setGenerating] = useState(false);
  const [showItinerary, setShowItinerary] = useState(false);
  const navigate = useNavigate();

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setShowItinerary(true);
    }, 2000);
  };

  return (
    <section className="py-24 bg-card" id="ai-planner">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" /> AI Trip Planner
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4">
            Let AI Plan Your <span className="text-primary">Perfect Indian Trip</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Tell us your preferences and our AI creates a personalized day-by-day itinerary across India in seconds.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 items-start max-w-5xl mx-auto">
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
                  placeholder="e.g. Jaipur, Goa, Kashmir..."
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
                    placeholder="₹25,000"
                    className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-primary" /> Days
                  </label>
                  <input
                    type="number"
                    placeholder="3"
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
                onClick={handleGenerate}
                disabled={generating}
                className="w-full h-12 bg-primary text-primary-foreground text-primary-foreground border-0 rounded-xl font-semibold shadow-lg hover:opacity-90 transition-opacity"
              >
                {generating ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating Itinerary...</>
                ) : (
                  <><Sparkles className="w-4 h-4 mr-2" /> Generate My Trip</>
                )}
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <div className="text-sm font-medium text-muted-foreground mb-2">
              {showItinerary ? " Your AI-Generated Itinerary" : "Sample AI-Generated Itinerary"}
            </div>
            <AnimatePresence mode="wait">
              {sampleItinerary.map((day, i) => (
                <motion.div
                  key={day.day}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: showItinerary ? i * 0.2 : i * 0.1 }}
                  className="bg-background rounded-2xl shadow-card border border-border/50 p-5 hover:shadow-card-hover transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center text-primary-foreground font-bold text-sm">
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
            </AnimatePresence>

            <Button variant="outline" className="w-full rounded-xl" onClick={() => navigate("/trip-planner")}>
              View Full Itinerary <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AITripPlanner;

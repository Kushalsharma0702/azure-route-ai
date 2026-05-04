import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Settings, Save, MapPin, Heart, Compass, Mountain, Palmtree, Tent, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { auth } from "@/services/api";
import Navbar from "@/components/Navbar";

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  // Traveler DNA state
  const [dna, setDna] = useState({
    mood: "Adventure",
    preferredTerrain: "Mountains",
    priority: "Thrill",
    tripsDone: 0
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userData = await auth.me();
        setUser(userData);
        if (userData.preferences && Object.keys(userData.preferences).length > 0) {
          setDna(prev => ({ ...prev, ...userData.preferences }));
        }
      } catch (err: any) {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSaveDNA = async () => {
    setSaving(true);
    try {
      await auth.updatePreferences(dna);
      toast.success("Traveler DNA saved successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to save DNA");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center pt-24"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>;

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      <div className="pt-32 px-4 md:px-8 max-w-5xl mx-auto pb-20">
        <h1 className="text-3xl font-extrabold tracking-tight mb-8">My Account</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Profile Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-3xl border border-border/50 shadow-sm p-6 text-center">
              <div className="w-24 h-24 rounded-full bg-primary/10 border-4 border-white shadow-lg mx-auto flex items-center justify-center mb-4">
                <span className="text-4xl font-black text-primary">{user?.name?.charAt(0) || <User />}</span>
              </div>
              <h2 className="text-xl font-bold">{user?.name || "Traveler"}</h2>
              <p className="text-muted-foreground text-sm mb-6">{user?.email}</p>
              
              <div className="flex items-center justify-center gap-2 text-sm bg-muted/50 rounded-xl py-3 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>Explorer of India</span>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-border/50 shadow-sm p-6 mt-6">
              <h3 className="font-bold flex items-center gap-2 mb-4"><Settings className="w-4 h-4" /> Account Settings</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start rounded-xl h-12">Edit Profile</Button>
                <Button variant="outline" className="w-full justify-start rounded-xl h-12">Security</Button>
                <Button variant="outline" className="w-full justify-start rounded-xl h-12 text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20">Delete Account</Button>
              </div>
            </div>
          </motion.div>

          {/* Traveler DNA */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-3xl border border-border/50 shadow-sm p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Sparkles className="w-32 h-32" />
              </div>
              
              <h2 className="text-2xl font-extrabold mb-2 flex items-center gap-2">
                <Compass className="w-6 h-6 text-primary" />
                Your Traveler DNA
              </h2>
              <p className="text-muted-foreground mb-8 max-w-md">Customize your travel preferences to help RouteAura AI generate perfectly tailored trips for you.</p>

              <div className="space-y-8 relative z-10">
                {/* Terrain */}
                <div>
                  <label className="text-sm font-bold block mb-3 text-foreground/80">Preferred Terrain</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: "Mountains", icon: Mountain },
                      { id: "Beach", icon: Palmtree },
                      { id: "Plains", icon: Tent }
                    ].map(terrain => (
                      <button
                        key={terrain.id}
                        onClick={() => setDna({ ...dna, preferredTerrain: terrain.id })}
                        className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${dna.preferredTerrain === terrain.id ? "border-primary bg-primary/5 text-primary" : "border-border/50 hover:border-primary/30"}`}
                      >
                        <terrain.icon className="w-6 h-6" />
                        <span className="text-sm font-semibold">{terrain.id}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Travel Mood */}
                <div>
                  <label className="text-sm font-bold block mb-3 text-foreground/80">Typical Travel Mood</label>
                  <div className="flex flex-wrap gap-3">
                    {["Relaxed", "Adventure", "Spiritual", "Cultural", "Party", "Nature"].map(mood => (
                      <button
                        key={mood}
                        onClick={() => setDna({ ...dna, mood })}
                        className={`px-5 py-2.5 rounded-xl border-2 font-medium text-sm transition-all ${dna.mood === mood ? "border-primary bg-primary text-white shadow-glow" : "border-border/50 hover:border-primary/30"}`}
                      >
                        {mood}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Priority */}
                <div>
                  <label className="text-sm font-bold block mb-3 text-foreground/80">Top Priority</label>
                  <div className="flex flex-wrap gap-3">
                    {["Thrill & Adrenaline", "Ultimate Comfort", "Budget Friendly", "Luxury", "Local Experience"].map(priority => (
                      <button
                        key={priority}
                        onClick={() => setDna({ ...dna, priority })}
                        className={`px-5 py-2.5 rounded-xl border-2 font-medium text-sm transition-all ${dna.priority === priority ? "border-primary bg-primary text-white shadow-glow" : "border-border/50 hover:border-primary/30"}`}
                      >
                        {priority}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div>
                  <label className="text-sm font-bold block mb-3 text-foreground/80">Trips Completed with Us</label>
                  <div className="bg-muted/50 rounded-xl p-4 flex items-center justify-between border border-border/50">
                    <span className="font-semibold">{dna.tripsDone} Trips</span>
                    <Heart className="w-5 h-5 text-rose-500 fill-rose-500/20" />
                  </div>
                </div>

                <div className="pt-4 border-t border-border/50 flex justify-end">
                  <Button onClick={handleSaveDNA} disabled={saving} className="bg-primary hover:bg-primary/90 text-white rounded-xl h-12 px-8 font-semibold shadow-glow">
                    {saving ? "Saving..." : <><Save className="w-4 h-4 mr-2" /> Save DNA Profile</>}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

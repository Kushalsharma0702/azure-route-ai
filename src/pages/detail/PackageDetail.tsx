import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Star, MapPin, Clock, Check, X as XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import api from "@/services/api";

const PackageDetail = () => {
  const { id } = useParams();
  const [pkg, setPkg] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const res = await api.request(`/api/v1/package-inventory/${id}`);
        setPkg(res);
      } catch (e) {
        console.error("Failed to fetch package:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchPackage();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>;
  if (!pkg) return <div className="min-h-screen flex items-center justify-center"><p>Package not found.</p></div>;

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20 pb-16">
          <div className="bg-card border-b border-border">
            <div className="container py-3 flex items-center gap-2 text-xs text-muted-foreground">
              <Link to="/" className="hover:text-foreground">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <Link to="/search/packages" className="hover:text-foreground">Packages</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-foreground font-medium">{pkg.title}</span>
            </div>
          </div>

          <div className="container mt-8">
            {/* Gallery */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-[1.7fr_1fr] gap-3 mb-8">
              <div className="h-72 md:h-[420px] rounded-2xl overflow-hidden relative">
                <img src={(pkg.images && pkg.images[0]) || pkg.image} alt={pkg.title} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                  {(pkg.badges || []).map((b: string) => (
                    <span key={b} className="text-xs px-3 py-1 rounded-full bg-primary text-primary-foreground font-medium shadow-sm">{b}</span>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 lg:h-[420px]">
                {(pkg.images || []).slice(1, 3).map((img: string, i: number) => (
                  <div key={i} className="h-40 md:h-full lg:flex-1 rounded-2xl overflow-hidden">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <h1 className="text-2xl font-extrabold mb-1">{pkg.title}</h1>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {pkg.destination}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {pkg.duration}</span>
                    <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-warning text-warning" /> {pkg.rating}</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{pkg.description}</p>
                </motion.div>

                {/* Highlights */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card rounded-2xl shadow-card border border-border/50 p-6">
                  <h2 className="font-bold text-lg mb-4"> Highlights</h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {(pkg.highlights || []).map((h: string) => (
                      <div key={h} className="flex items-center gap-2 text-sm p-3 rounded-xl bg-primary/5">
                        <Check className="w-4 h-4 text-primary flex-shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Itinerary */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-card rounded-2xl shadow-card border border-border/50 p-6">
                  <h2 className="font-bold text-lg mb-4">Day-wise Itinerary</h2>
                  <div className="space-y-4">
                    {(pkg.itinerary || []).map((day: any) => (
                      <div key={day.day} className="flex gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm flex-shrink-0">D{day.day}</div>
                        <div>
                          <h3 className="font-semibold text-sm">{day.title}</h3>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {(day.activities || []).map((a: string) => (
                              <span key={a} className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">{a}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Inclusions / Exclusions */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-card rounded-2xl shadow-card border border-border/50 p-6">
                    <h2 className="font-bold text-lg mb-4 text-success">Inclusions</h2>
                    <div className="space-y-2">
                      {(pkg.inclusions || []).map((inc: string) => (
                        <div key={inc} className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-success" /><span>{inc}</span></div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-card rounded-2xl shadow-card border border-border/50 p-6">
                    <h2 className="font-bold text-lg mb-4 text-destructive">Exclusions</h2>
                    <div className="space-y-2">
                      {(pkg.exclusions || []).map((exc: string) => (
                        <div key={exc} className="flex items-center gap-2 text-sm"><XIcon className="w-4 h-4 text-destructive" /><span>{exc}</span></div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Policies */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="bg-card rounded-2xl shadow-card border border-border/50 p-6">
                  <h2 className="font-bold text-lg mb-4">Booking Policies</h2>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between p-3 bg-muted/50 rounded-xl">
                      <span className="text-muted-foreground">Cancellation</span>
                      <span className="font-medium">{pkg.policies?.cancellation || 'Contact for details'}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-muted/50 rounded-xl">
                      <span className="text-muted-foreground">Payment</span>
                      <span className="font-medium">{pkg.policies?.payment || 'Contact for details'}</span>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Sticky sidebar */}
              <div>
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-card rounded-2xl shadow-card border border-border/50 p-6 sticky top-24">
                  <div className="text-center mb-4">
                    <div className="text-3xl font-extrabold text-primary">₹{pkg.price.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">per person</div>
                    {pkg.originalPrice && (
                      <div className="text-sm text-muted-foreground line-through">₹{pkg.originalPrice.toLocaleString()}</div>
                    )}
                  </div>
                  {pkg.originalPrice && (
                    <div className="mb-4 p-2 rounded-lg bg-success/10 text-success text-xs font-medium text-center">
                      You save ₹{(pkg.originalPrice - pkg.price).toLocaleString()} per person!
                    </div>
                  )}
                  <Link to={`/book/package/${pkg.id}/step/1`}>
                    <Button className="w-full h-12 bg-primary text-primary-foreground text-primary-foreground border-0 rounded-xl font-semibold shadow-lg hover:opacity-90 transition-opacity">
                      Book This Package
                    </Button>
                  </Link>
                  <div className="mt-4 space-y-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1"><Clock className="w-3 h-3" /> {pkg.duration}</div>
                    <div className="flex items-center gap-1"><Star className="w-3 h-3" /> {(pkg.reviews || 0).toLocaleString()} reviews</div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default PackageDetail;

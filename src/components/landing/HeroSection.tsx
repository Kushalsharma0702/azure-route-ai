import { useState, type ComponentType } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CalendarDays, Search, Flag, ShieldCheck, Briefcase, Building, Train } from "lucide-react";
import { Button } from "@/components/ui/button";

type BookingType = "travel" | "hotel" | "package" | "train";

const bookingOptions: { id: BookingType; label: string; icon: ComponentType<{ className?: string }> }[] = [
  { id: "travel", label: "Travel Booking", icon: Briefcase },
  { id: "hotel", label: "Hotel Booking", icon: Building },
  { id: "package", label: "Packages", icon: ShieldCheck },
  { id: "train", label: "Train Booking", icon: Train },
];

const HeroSection = () => {
  const navigate = useNavigate();
  const [bookingType, setBookingType] = useState<BookingType>("travel");
  const [country, setCountry] = useState("India");
  const [visaType, setVisaType] = useState("Tourist");
  const [travelDate, setTravelDate] = useState("");

  const handleSearch = () => {
    const routeMap: Record<BookingType, string> = {
      travel: "/search/flights",
      hotel: "/search/hotels",
      package: "/search/packages",
      train: "/search/trains",
    };

    navigate(routeMap[bookingType], {
      state: {
        country,
        visaType,
        travelDate,
      },
    });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1595815771614-ade9d652a65d?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Snowy mountain landscape"
          width={1920}
          height={1080}
          loading="eager"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/25" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/35" />
      </div>

      <div className="container relative z-10 py-20 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-4 leading-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.55)]">
            Explore India <br /> With Confidence
          </h1>
          <p className="text-lg md:text-xl text-white/90 font-medium max-w-2xl drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]">
            Book flights, hotels, trains, and packages in one place.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="w-full max-w-4xl"
        >
          <div className="glass-effect rounded-3xl p-3 md:p-4 space-y-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {bookingOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setBookingType(option.id)}
                  className={`h-11 rounded-xl px-3 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
                    bookingType === option.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-white/70 text-foreground hover:bg-white"
                  }`}
                >
                  <option.icon className="w-4 h-4" />
                  {option.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="bg-white rounded-xl h-14 px-4 flex items-center gap-3">
                <Flag className="w-4 h-4 text-muted-foreground" />
                <div className="flex-1">
                  <label className="text-[10px] uppercase font-bold text-muted-foreground block">Country</label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full text-sm font-semibold text-foreground bg-transparent focus:outline-none"
                  >
                    <option>India</option>
                    <option>Switzerland</option>
                    <option>UAE</option>
                    <option>Thailand</option>
                  </select>
                </div>
              </div>

              <div className="bg-white rounded-xl h-14 px-4 flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-muted-foreground" />
                <div className="flex-1">
                  <label className="text-[10px] uppercase font-bold text-muted-foreground block">Visa Type</label>
                  <select
                    value={visaType}
                    onChange={(e) => setVisaType(e.target.value)}
                    className="w-full text-sm font-semibold text-foreground bg-transparent focus:outline-none"
                  >
                    <option>Tourist</option>
                    <option>Business</option>
                    <option>Student</option>
                  </select>
                </div>
              </div>

              <div className="bg-white rounded-xl h-14 px-4 flex items-center gap-3">
                <CalendarDays className="w-4 h-4 text-muted-foreground" />
                <div className="flex-1">
                  <label className="text-[10px] uppercase font-bold text-muted-foreground block">Date</label>
                  <input
                    type="date"
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    className="w-full text-sm font-semibold text-foreground bg-transparent focus:outline-none"
                  />
                </div>
              </div>

              <Button
                onClick={handleSearch}
                className="h-14 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              >
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Soft gradient fade at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
};

export default HeroSection;

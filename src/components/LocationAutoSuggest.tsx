import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin } from "lucide-react";

const allLocations = [
  { city: "Delhi", code: "DEL", country: "India", type: "city" },
  { city: "Delhi NCR", code: "DEL", country: "India", type: "region" },
  { city: "New Delhi", code: "DEL", country: "India", type: "city" },
  { city: "Mumbai", code: "BOM", country: "India", type: "city" },
  { city: "Bangalore", code: "BLR", country: "India", type: "city" },
  { city: "Bali", code: "DPS", country: "Indonesia", type: "city" },
  { city: "Bangkok", code: "BKK", country: "Thailand", type: "city" },
  { city: "Dubai", code: "DXB", country: "UAE", type: "city" },
  { city: "Singapore", code: "SIN", country: "Singapore", type: "city" },
  { city: "Paris", code: "CDG", country: "France", type: "city" },
  { city: "London", code: "LHR", country: "United Kingdom", type: "city" },
  { city: "Tokyo", code: "NRT", country: "Japan", type: "city" },
  { city: "Maldives", code: "MLE", country: "Maldives", type: "city" },
  { city: "Santorini", code: "JTR", country: "Greece", type: "city" },
  { city: "Switzerland", code: "ZRH", country: "Switzerland", type: "country" },
  { city: "Goa", code: "GOI", country: "India", type: "city" },
  { city: "Jaipur", code: "JAI", country: "India", type: "city" },
  { city: "Chennai", code: "MAA", country: "India", type: "city" },
  { city: "Kolkata", code: "CCU", country: "India", type: "city" },
  { city: "Hyderabad", code: "HYD", country: "India", type: "city" },
];

interface Props {
  placeholder?: string;
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
}

const LocationAutoSuggest = ({ placeholder = "Search city or airport...", label, value: externalValue, onChange }: Props) => {
  const [query, setQuery] = useState(externalValue || "");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = query.length > 0
    ? allLocations.filter(
        (l) =>
          l.city.toLowerCase().includes(query.toLowerCase()) ||
          l.code.toLowerCase().includes(query.toLowerCase()) ||
          l.country.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 6)
    : [];

  const selectLocation = useCallback((loc: typeof allLocations[0]) => {
    const val = `${loc.city} (${loc.code})`;
    setQuery(val);
    setIsOpen(false);
    setActiveIndex(-1);
    onChange?.(val);
  }, [onChange]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || filtered.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : filtered.length - 1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      selectLocation(filtered[activeIndex]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const highlightMatch = (text: string) => {
    if (!query) return text;
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}
        <span className="text-primary font-semibold">{text.slice(idx, idx + query.length)}</span>
        {text.slice(idx + query.length)}
      </>
    );
  };

  return (
    <div ref={wrapperRef} className="relative">
      {label && <label className="text-xs font-medium text-muted-foreground mb-1 block">{label}</label>}
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(e.target.value.length > 0);
            setActiveIndex(-1);
            onChange?.(e.target.value);
          }}
          onFocus={() => query.length > 0 && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-9 pr-4 py-3 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
        />
      </div>

      <AnimatePresence>
        {isOpen && filtered.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 top-full mt-1 w-full bg-card rounded-xl shadow-card-hover border border-border/50 overflow-hidden"
          >
            {filtered.map((loc, i) => (
              <button
                key={`${loc.city}-${loc.code}`}
                onClick={() => selectLocation(loc)}
                onMouseEnter={() => setActiveIndex(i)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left text-sm transition-colors ${
                  activeIndex === i ? "bg-primary/5" : "hover:bg-muted/50"
                }`}
              >
                <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{highlightMatch(loc.city)}</div>
                  <div className="text-xs text-muted-foreground">{loc.country} • {loc.code}</div>
                </div>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">{loc.type}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LocationAutoSuggest;

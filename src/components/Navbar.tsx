import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Plane, User, ChevronDown, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Travel Booking", path: "/search/flights" },
  { label: "Hotel Booking", path: "/search/hotels" },
  { label: "Packages", path: "/search/packages" },
  { label: "Support", path: "/support" },
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("routeaura_user");
    localStorage.removeItem("authToken");
    setDropdownOpen(false);
    navigate("/login");
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-6 left-0 right-0 z-50 px-4 md:px-8"
    >
      <div className="glass-effect rounded-full bg-white/75 backdrop-blur-2xl border border-white/60 shadow-xl px-3 md:px-6 py-3 flex items-center justify-between w-full max-w-7xl mx-auto">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-lg md:text-2xl text-primary tracking-tight flex-shrink-0">
          <Plane className="w-4 md:w-5 h-4 md:h-5" />
          <span className="hidden sm:inline">RouteAura</span>
        </Link>

        {/* Links - Desktop */}
        <div className="hidden lg:flex items-center gap-3 xl:gap-6 flex-1 justify-center px-2 xl:px-4">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-xs xl:text-sm font-semibold flex items-center gap-1 transition-colors whitespace-nowrap ${
                location.pathname === link.path || (link.path === '/' && location.pathname === '')
                  ? "text-primary"
                  : "text-foreground/80 hover:text-foreground"
              }`}
            >
              {location.pathname === link.path && <span className="w-1 h-1 rounded-full bg-primary inline-block" />}
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition"
        >
          {mobileMenuOpen ? (
            <X className="w-4 h-4 text-foreground" />
          ) : (
            <Menu className="w-4 h-4 text-foreground" />
          )}
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-1 md:gap-1.5 px-2 md:px-3 py-1.5 rounded-full border border-border/40 bg-white/70 hover:bg-white transition cursor-pointer flex-shrink-0 text-foreground shadow-sm"
          >
            <div className="w-4 md:w-5 h-4 md:h-5 rounded-full border border-primary text-primary flex items-center justify-center bg-transparent">
              <User className="w-2.5 md:w-3 h-2.5 md:h-3" />
            </div>
            <span className="text-xs md:text-sm font-medium hidden sm:inline text-foreground">Hi, John</span>
            <ChevronDown className={`w-3 md:w-3.5 h-3 md:h-3.5 text-foreground/70 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
          </button>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full right-0 mt-2 w-52 glass-effect rounded-2xl border border-border/40 overflow-hidden shadow-xl bg-white/90"
              >
                <button
                  onClick={() => { setDropdownOpen(false); navigate("/login"); }}
                  className="w-full px-4 py-2 text-sm text-foreground hover:bg-white/10 flex items-center gap-2 transition"
                >
                  Sign in
                </button>
                <button
                  onClick={() => { setDropdownOpen(false); navigate("/signup"); }}
                  className="w-full px-4 py-2 text-sm text-foreground hover:bg-white/10 flex items-center gap-2 transition"
                >
                  Sign up
                </button>
                <div className="border-t border-border/40" />
                <button
                  onClick={() => setDropdownOpen(false)}
                  className="w-full px-4 py-2 text-sm text-foreground hover:bg-white/10 flex items-center gap-2 transition"
                >
                  <User className="w-4 h-4" />
                  Profile
                </button>
                <button
                  onClick={() => setDropdownOpen(false)}
                  className="w-full px-4 py-2 text-sm text-foreground hover:bg-white/10 flex items-center gap-2 transition"
                >
                  <span>⚙️</span>
                  Settings
                </button>
                <div className="border-t border-border/40" />
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-sm text-destructive hover:bg-destructive/10 flex items-center gap-2 transition font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden glass-effect rounded-2xl mt-3 p-4 space-y-2 bg-white/90"
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.path || (link.path === '/' && location.pathname === '')
                    ? "text-primary bg-white/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/10"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;

import { Plane, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-foreground text-primary-foreground/80 py-16">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">
                <Plane className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-extrabold text-lg text-primary-foreground">RouteAura</span>
            </div>
            <p className="text-sm text-primary-foreground/60 leading-relaxed">
              AI-powered Indian travel planning that makes your dream vacations across India a reality. From Kashmir to Kanyakumari.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-primary-foreground mb-4 text-sm">Explore India</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/60">
              <li><Link to="/search/flights" className="hover:text-primary-foreground transition-colors">Domestic Flights</Link></li>
              <li><Link to="/search/hotels" className="hover:text-primary-foreground transition-colors">Hotels & Resorts</Link></li>
              <li><Link to="/search/trains" className="hover:text-primary-foreground transition-colors">Indian Railways</Link></li>
              <li><Link to="/search/packages" className="hover:text-primary-foreground transition-colors">Holiday Packages</Link></li>
              <li><Link to="/trip-planner" className="hover:text-primary-foreground transition-colors">AI Trip Planner</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-primary-foreground mb-4 text-sm">Company</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/60">
              <li><a href="#" className="hover:text-primary-foreground transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Press</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-primary-foreground mb-4 text-sm">Contact</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/60">
              <li className="flex items-center gap-2"><Mail className="w-4 h-4" /> hello@routeaura.com</li>
              <li className="flex items-center gap-2"><Phone className="w-4 h-4" /> +91 98765 43210</li>
              <li className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Mumbai, Maharashtra</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-primary-foreground/40">© 2026 RouteAura India. All rights reserved.</p>
          <div className="flex gap-4 text-xs text-primary-foreground/40">
            <Link to="/privacy" className="hover:text-primary-foreground/60">Privacy</Link>
            <Link to="/terms" className="hover:text-primary-foreground/60">Terms</Link>
            <Link to="/support" className="hover:text-primary-foreground/60">Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

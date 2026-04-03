import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";

const Terms = () => (
  <PageTransition>
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container max-w-3xl prose prose-sm">
          <h1 className="text-3xl font-extrabold mb-6">Terms & Conditions</h1>
          {[
            { t: "1. Acceptance of Terms", p: "By accessing RouteAura, you agree to be bound by these Terms of Service and all applicable laws." },
            { t: "2. Booking Policy", p: "All bookings are subject to availability. Prices may change without prior notice until confirmed." },
            { t: "3. Cancellation & Refunds", p: "Cancellation policies vary by product. Please review the specific cancellation terms before booking." },
            { t: "4. User Responsibilities", p: "Users must provide accurate information. False information may result in booking cancellation." },
            { t: "5. Limitation of Liability", p: "RouteAura acts as an intermediary and is not liable for services provided by third-party suppliers." },
          ].map((s) => (
            <div key={s.t} className="mb-6">
              <h2 className="text-lg font-bold mb-2">{s.t}</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">{s.p}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  </PageTransition>
);

export default Terms;

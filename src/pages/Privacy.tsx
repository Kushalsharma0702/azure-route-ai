import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";

const Privacy = () => (
  <PageTransition>
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container max-w-3xl prose prose-sm">
          <h1 className="text-3xl font-extrabold mb-6">Privacy Policy</h1>
          {[
            { t: "Information We Collect", p: "We collect personal information you provide during booking including name, email, phone, and payment details." },
            { t: "How We Use Your Data", p: "Your data is used to process bookings, send confirmations, and improve our services. We never sell your personal data." },
            { t: "Data Security", p: "We use industry-standard encryption and security measures to protect your personal information." },
            { t: "Cookies", p: "We use cookies to enhance your browsing experience and analyze site traffic." },
            { t: "Your Rights", p: "You have the right to access, modify, or delete your personal data at any time by contacting our support team." },
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

export default Privacy;

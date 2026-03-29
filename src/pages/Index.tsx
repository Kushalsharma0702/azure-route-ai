import Navbar from "@/components/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import AITripPlanner from "@/components/landing/AITripPlanner";
import TrendingDeals from "@/components/landing/TrendingDeals";
import PackageCategories from "@/components/landing/PackageCategories";
import WhyChooseUs from "@/components/landing/WhyChooseUs";
import Testimonials from "@/components/landing/Testimonials";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <TrendingDeals />
      <AITripPlanner />
      <PackageCategories />
      <WhyChooseUs />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Index;

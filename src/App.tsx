import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnimatePresence } from "framer-motion";
import FloatingBlobs from "@/components/FloatingBlobs";
import RouteAuraLoader from "@/components/RouteAuraLoader";
import { Suspense } from "react";
import Index from "./pages/Index";
import SearchResults from "./pages/SearchResults";
import TripPlanner from "./pages/TripPlanner";
import Booking from "./pages/Booking";
import Dashboard from "./pages/Dashboard";
import Detail from "./pages/Detail";
import NotFound from "./pages/NotFound";
import FlightResults from "./pages/search/FlightResults";
import HotelResults from "./pages/search/HotelResults";
import TrainResults from "./pages/search/TrainResults";
import PackageResults from "./pages/search/PackageResults";
import FlightDetail from "./pages/detail/FlightDetail";
import HotelDetail from "./pages/detail/HotelDetail";
import TrainDetail from "./pages/detail/TrainDetail";
import PackageDetail from "./pages/detail/PackageDetail";
import FlightBooking from "./pages/booking/FlightBooking";
import HotelBooking from "./pages/booking/HotelBooking";
import TrainBooking from "./pages/booking/TrainBooking";
import PackageBooking from "./pages/booking/PackageBooking";
import Confirmation from "./pages/Confirmation";
import Support from "./pages/Support";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CopilotPage from "./pages/CopilotPage";
import LiveStatusPage from "./pages/LiveStatusPage";
import VoiceAssistant from "./pages/VoiceAssistant";
import HiddenGems from "./pages/HiddenGems";

import { ProtectedRoute } from "./components/ProtectedRoute";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <>
      <AnimatePresence mode="wait">
        <Suspense key={location.pathname} fallback={<RouteAuraLoader />}>
          <Routes location={location} key={location.pathname}>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/support" element={<Support />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/search" element={<SearchResults />} />
              <Route path="/search/flights" element={<FlightResults />} />
              <Route path="/search/hotels" element={<HotelResults />} />
              <Route path="/search/trains" element={<TrainResults />} />
              <Route path="/search/packages" element={<PackageResults />} />
              <Route path="/flights/:id" element={<FlightDetail />} />
              <Route path="/hotels/:id" element={<HotelDetail />} />
              <Route path="/trains/:id" element={<TrainDetail />} />
              <Route path="/packages/:id" element={<PackageDetail />} />
              <Route path="/detail/:id" element={<Detail />} />
              <Route path="/book/flight/:id/step/:step" element={<FlightBooking />} />
              <Route path="/book/hotel/:id/step/:step" element={<HotelBooking />} />
              <Route path="/book/train/:id/step/:step" element={<TrainBooking />} />
              <Route path="/book/package/:id/step/:step" element={<PackageBooking />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/confirmation" element={<Confirmation />} />
              <Route path="/trip-planner" element={<TripPlanner />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/copilot" element={<CopilotPage />} />
              <Route path="/live-status" element={<LiveStatusPage />} />
              <Route path="/live-reality" element={<LiveStatusPage />} />
              <Route path="/voice-assistant" element={<VoiceAssistant />} />
              <Route path="/hidden-gems" element={<HiddenGems />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </AnimatePresence>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <FloatingBlobs />
        <AnimatedRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

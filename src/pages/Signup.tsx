import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plane, Mail, Lock, User, Eye, EyeOff, ArrowRight, Phone, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { auth } from "@/services/api";
import heroBg from "@/assets/hero-bg.jpg";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error("Please fill all required fields");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    try {
      const res = await auth.signup({ email, password, name, phone: phone || undefined });
      setOtpSent(true);
      if (res && res.otp) {
        toast.success(`Development Mode OTP: ${res.otp}`, { duration: 20000 });
      } else {
        toast.success("OTP sent to your email! Check the backend console.");
      }
    } catch (err: any) {
      toast.error(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      toast.error("Please enter the 6-digit OTP");
      return;
    }
    setLoading(true);
    try {
      const result = await auth.verifyOtp(email, otp);
      toast.success("Account verified! Welcome to RouteAura");
      navigate("/");
    } catch (err: any) {
      toast.error(err.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      const res = await auth.resendOtp(email);
      if (res && res.otp) {
        toast.success(`Development Mode OTP: ${res.otp}`, { duration: 20000 });
      } else {
        toast.success("OTP resent! Check the backend console.");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to resend OTP");
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:block lg:w-1/2 relative">
        <img src={heroBg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-muted/30" />
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="text-primary-foreground max-w-md">
            <h2 className="text-4xl font-extrabold mb-4">Start Your Journey</h2>
            <p className="text-primary-foreground/80 text-lg">Join 50,000+ Indian travelers who plan smarter trips with AI. Get personalized recommendations, best prices, and one-click bookings.</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-8 overflow-y-auto bg-background">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md py-8 sm:py-12"
        >
          <Link to="/" className="flex items-center gap-2 font-bold text-xl mb-8">
            <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">
              <Plane className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-primary font-extrabold text-2xl">RouteAura</span>
          </Link>

          {!otpSent ? (
            <>
              <h1 className="text-2xl font-extrabold mb-1">Create your account</h1>
              <p className="text-muted-foreground mb-8">Start planning your dream Indian vacation</p>

              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Rahul Sharma" className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Email *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Password * (min 8 chars)</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a password" className="w-full pl-10 pr-10 py-3 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2">
                      {showPassword ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
                    </button>
                  </div>
                </div>

                <Button type="submit" disabled={loading} className="w-full h-12 bg-primary text-primary-foreground border-0 rounded-xl font-semibold shadow-lg hover:opacity-90 transition-opacity">
                  {loading ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full" />
                  ) : (
                    <>Create Account <ArrowRight className="w-4 h-4 ml-2" /></>
                  )}
                </Button>
              </form>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <h1 className="text-2xl font-extrabold">Verify your email</h1>
                  <p className="text-muted-foreground text-sm">We sent a 6-digit OTP to <strong>{email}</strong></p>
                </div>
              </div>
              <p className="text-xs text-amber-600 bg-amber-50 dark:bg-amber-950/30 rounded-lg p-3 mb-6 mt-4">
                💡 Check the <strong>backend terminal</strong> for the OTP code (printed to console in dev mode)
              </p>

              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Enter OTP</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    maxLength={6}
                    className="w-full text-center text-2xl tracking-[0.5em] font-mono py-4 rounded-xl bg-muted/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
                  />
                </div>

                <Button type="submit" disabled={loading || otp.length !== 6} className="w-full h-12 bg-primary text-primary-foreground border-0 rounded-xl font-semibold shadow-lg hover:opacity-90 transition-opacity">
                  {loading ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full" />
                  ) : (
                    <>Verify & Continue <ArrowRight className="w-4 h-4 ml-2" /></>
                  )}
                </Button>

                <button type="button" onClick={handleResendOtp} className="w-full text-sm text-primary hover:underline">
                  Didn't receive OTP? Resend
                </button>
              </form>
            </>
          )}

          <p className="text-sm text-muted-foreground text-center mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-semibold hover:underline">Sign In</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;

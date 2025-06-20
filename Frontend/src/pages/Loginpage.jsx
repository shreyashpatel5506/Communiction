import React, { useState } from 'react';
import { useAuth } from '../StoreValues/useAuth.Store';
import { MessageSquare, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import AuthImagePattern from '../components/AuthImagePattern';

const Loginpage = () => {
  const { sendOtp, verifyOtp, login } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    otp: ""
  });

  const validateEmail = () => {
    if (!formData.email.trim()) {
      toast.error("Email is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Invalid email format");
      return false;
    }
    return true;
  };

  const validateOtp = () => {
    if (!formData.otp.trim()) {
      toast.error("OTP is required");
      return false;
    }
    return true;
  };

  const validatePassword = () => {
    if (!formData.password.trim()) {
      toast.error("Password is required");
      return false;
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  // Step 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!validateEmail()) return;

    setLoading(true);
    try {
      const success = await sendOtp(formData.email);
      if (success) {
        setStep(2);
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!validateOtp()) return;

    setLoading(true);
    try {
      const isValid = await verifyOtp(formData.email, formData.otp);
      if (isValid) {

        setStep(3);
      } else {
        toast.error("Invalid OTP");
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  // Step 3: Login
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validatePassword()) return;

    setLoading(true);
    try {
      await login(formData.email, formData.password);

      navigate('/');
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  return (
    <div className='min-h-screen grid lg:grid-cols-2'>
      {/* Left side */}
      <AuthImagePattern
        title="Welcome back"
        subtitle="Securely login to your account with OTP verification"
      />

      {/* Right side */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <MessageSquare className="size-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Login</h1>
              <p className="text-base-content/60">Secure access to your account</p>
            </div>
          </div>

          {/* Steps UI */}
          <ul className="steps w-full">
            <li className={step >= 1 ? "step step-primary" : "step"}>Send OTP</li>
            <li className={step >= 2 ? "step step-primary" : "step"}>Verify OTP</li>
            <li className={step === 3 ? "step step-primary" : "step"}>Login</li>
          </ul>

          {/* Step 1: Send OTP */}
          {step === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div className="form-control">
                <label className="label"><span className="label-text font-medium">Email</span></label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <Mail className="h-5 w-5" />
                  </span>
                  <input
                    type="email"
                    className="input input-bordered w-full pl-10"
                    placeholder="johndoe@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary w-full">
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </form>
          )}

          {/* Step 2: Verify OTP */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="form-control">
                <label className="label"><span className="label-text font-medium">OTP</span></label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <Lock className="h-5 w-5" />
                  </span>
                  <input
                    type="text"
                    className="input input-bordered w-full pl-10"
                    placeholder="Enter OTP"
                    value={formData.otp}
                    onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary w-full">
                {loading ? "Verifying OTP..." : "Verify OTP"}
              </button>
            </form>
          )}

          {/* Step 3: Login */}
          {step === 3 && (
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="form-control">
                <label className="label"><span className="label-text font-medium">Email</span></label>
                <input
                  type="email"
                  className="input input-bordered w-full"
                  value={formData.email}
                  disabled
                />
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text font-medium">Password</span></label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <Lock className="h-5 w-5" />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="input input-bordered w-full pl-10"
                    placeholder="*******"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn btn-primary w-full">
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
          )}

          {/* Footer Links */}
          <div className="text-center flex flex-row justify-between gap-2 items-center mt-4">
            <Link to="/signup" className="link link-primary">Create a new account?</Link>
            <Link to="/forgot-password" className="link link-primary">Forgot Password?</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loginpage;

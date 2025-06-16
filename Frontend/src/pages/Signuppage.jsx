import React from 'react';
import { useAuth } from '../StoreValues/useAuth.Store.js';
import { Eye, EyeOff, Lock, Mail, MessageSquare, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import AuthImagePattern from '../components/AuthImagePattern.jsx';

const Signuppage = () => {
  const { sendOtp, verifyOtp, signup, isSignup, isSendOtp,isVerifyOtp } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    otp: ""
  });
  const [showPassword, setShowPassword] = useState(false);

  const validatedata = () => {
    if (!formData.name.trim()) {
      toast.error("Full name is required");
      return false;
    }
    if (!formData.email.trim()) {
      toast.error("Email is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Invalid email format");
      return false;
    }
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

  const handleOtpsend = async (e) => {
    e.preventDefault();
    if (!validatedata()) return;
    
    try {
      await sendOtp(formData.email);
      toast.success("OTP sent successfully!");
    } catch (error) {
      toast.error("Failed to send OTP. Please try again.");
    }
  };

  const hanndleFormsubmit = async (e) => {
    e.preventDefault();
    if (!validatedata()) return;
    
    try {
      
      if (await verifyOtp(formData.email, formData.otp)) {
        await signup(formData.email, formData.password, formData.name);
        navigate('/');
      } else {
        toast.error("Invalid OTP");
      }
    } catch (error) {
      toast.error("Verification failed. Please try again.");
    }
  };

  return (
    <div className='min-h-screen grid lg:grid-cols-2'>
      {/* Left side */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Logo Section */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <MessageSquare className="size-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Create Account</h1>
              <p className="text-base-content/60">Get started with your free account</p>
            </div>
          </div>

          {/* Steps */}
          <ul className="steps w-100">
            <li className={!isSendOtp ? "step" : "step step-primary"}>Register</li>
            <li className={!isSignup ? "step" : "step step-primary"}>Verify Otp</li>
          </ul>

          {/* Signup Form */}
          <form onSubmit={handleOtpsend} className={isSendOtp ? "hidden" : "block space-y-6"}>
            {/* Name Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Full Name</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <User className="h-5 w-5" />
                </span>
                <input
                  type="text"
                  className="input input-bordered w-full pl-10"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
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

            {/* Password Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
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
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isSendOtp}
            >
              {isSendOtp ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>

          {/* OTP Verification Form */}
          <form onSubmit={hanndleFormsubmit} className={isSendOtp ? "block space-y-6" : "hidden"}>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">OTP</span>
              </label>
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
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isVerifyOtp}
            >
              {isVerifyOtp ? "Verify OTP..." : "Signup"}
            </button>
          </form>

          <div className="text-center">
            <p className="text-base-content/60">
              Already have an account? <Link to="/login" className="link link-primary">Login</Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right side */}
      <AuthImagePattern
        title="Join our community"
        subtitle="Connect with friends, share moments, and stay in touch with your loved ones."
      />
    </div>
  );
};

export default Signuppage;
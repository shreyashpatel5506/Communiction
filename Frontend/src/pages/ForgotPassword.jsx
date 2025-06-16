import React, { useState } from 'react';
import { useAuth } from '../StoreValues/useAuth.Store';
import { Mail, Lock, Eye, EyeOff, MessageSquare } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import AuthImagePattern from '../components/AuthImagePattern';

const ForgotPassword = () => {
    const { sendOtp, verifyOtp, forgotPassword } = useAuth();
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        otp: '',
        newPassword: ''
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
        if (!formData.newPassword.trim()) {
            toast.error("Password is required");
            return false;
        }
        if (formData.newPassword.length < 6) {
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
            await sendOtp(formData.email);
            toast.success("OTP sent to email");
            setStep(2);
        } catch (err) {
            toast.error("Failed to send OTP");
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
                toast.success("OTP verified");
                setStep(3);
            } else {
                toast.error("Invalid OTP");
            }
        } catch (err) {
            toast.error("OTP verification failed");
        }
        setLoading(false);
    };

    // Step 3: Reset Password
    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (!validatePassword()) return;
        setLoading(true);
        try {
            await forgotPassword(formData.email, formData.newPassword);
            toast.success("Password reset successful");
            navigate('/login');
        } catch (err) {
            toast.error("Failed to reset password");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left Side Image */}
            <AuthImagePattern
                title="Reset your password"
                subtitle="Don't worry, we'll help you recover your account securely."
            />

            {/* Right Side Form */}
            <div className="flex flex-col justify-center items-center p-6 sm:p-12">
                <div className="w-full max-w-md space-y-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="flex flex-col items-center gap-2 group">
                            <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                <MessageSquare className="size-6 text-primary" />
                            </div>
                            <h1 className="text-2xl font-bold mt-2">Forgot Password</h1>
                            <p className="text-base-content/60">Reset your password in 3 simple steps</p>
                        </div>
                    </div>

                    {/* Step Indicator */}
                    <ul className="steps w-full">
                        <li className={step >= 1 ? "step step-primary" : "step"}>Send OTP</li>
                        <li className={step >= 2 ? "step step-primary" : "step"}>Verify OTP</li>
                        <li className={step === 3 ? "step step-primary" : "step"}>Reset Password</li>
                    </ul>

                    {/* Step 1: Send OTP */}
                    {step === 1 && (
                        <form onSubmit={handleSendOtp} className="space-y-6">
                            <div className="form-control">
                                <label className="label"><span className="label-text font-medium">Email</span></label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <input
                                        type="email"
                                        className="input input-bordered w-full pl-10"
                                        placeholder="your@email.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>
                            <button className="btn btn-primary w-full" type="submit">
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
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <input
                                        type="text"
                                        className="input input-bordered w-full pl-10"
                                        placeholder="Enter OTP"
                                        value={formData.otp}
                                        onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                                    />
                                </div>
                            </div>
                            <button className="btn btn-primary w-full" type="submit">
                                {loading ? "Verifying OTP..." : "Verify OTP"}
                            </button>
                        </form>
                    )}

                    {/* Step 3: Reset Password */}
                    {step === 3 && (
                        <form onSubmit={handleResetPassword} className="space-y-6">
                            {/* Disabled Email */}
                            <div className="form-control">
                                <label className="label"><span className="label-text font-medium">Email</span></label>
                                <input type="email" className="input input-bordered w-full" value={formData.email} disabled />
                            </div>

                            {/* New Password */}
                            <div className="form-control">
                                <label className="label"><span className="label-text font-medium">New Password</span></label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className="input input-bordered w-full pl-10"
                                        placeholder="New password"
                                        value={formData.newPassword}
                                        onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>

                            <button className="btn btn-primary w-full" type="submit">
                                {loading ? "Resetting Password..." : "Reset Password"}
                            </button>
                        </form>
                    )}

                    {/* Links */}
                    <div className="text-center mt-4">
                        <p className="text-base-content/60">
                            Remember your password? <Link to="/login" className="link link-primary">Back to login</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;

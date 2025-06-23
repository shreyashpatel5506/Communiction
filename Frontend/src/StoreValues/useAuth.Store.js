import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useAuth = create((set) => ({
    authuser: null,
    isSignup: false,
    isLogin: false,
    isSendOtp: false,
    isVerifyOtp: false,
    isUpdateProfile: false,
    isCheckAuth: true,
    onlineUsers: [],

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get('/auth/check');
            const authuser = res.data.user;

            if (authuser) {
                set({ authuser });
                localStorage.setItem('authuser', JSON.stringify(authuser));
                console.log("Authenticated user:", authuser);
            }
        } catch (error) {
            set({ authuser: null });
            localStorage.removeItem('authuser');
            console.log("Auth check failed:", error);
        } finally {
            set({ isCheckAuth: false });
        }
    },

    sendOtp: async (email) => {
        try {
            const res = await axiosInstance.post('/auth/send-Otp', { email });
            if (res.status === 200) {
                toast.success('OTP sent successfully');
                set({ isSendOtp: true });
                return true;
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "OTP send failed");
            return false;
        }
    },

    verifyOtp: async (email, otp) => {
        try {
            const res = await axiosInstance.post('/auth/verify-Otp', { email, otp });
            if (res.status === 200) {
                toast.success('OTP verified successfully');
                set({ isVerifyOtp: true });
                return true;
            } else {
                toast.error('OTP verification failed');
                return false;
            }
        } catch (error) {
            toast.error('Error verifying OTP');
            return false;
        }
    },

    signup: async (email, password, name) => {
        try {
            const res = await axiosInstance.post('/auth/signup', { email, password, name });
            if (res.status === 201) {
                const authuser = res.data.user;
                set({ authuser, isSignup: true });
                localStorage.setItem('authuser', JSON.stringify(authuser));
                toast.success('Signup successful');
                return true;
            } else {
                toast.error(res.data.message || 'Signup failed');
                return false;
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Signup error');
            return false;
        }
    },

    login: async (email, password) => {
        try {
            const res = await axiosInstance.post('/auth/login', { email, password });
            if (res.status === 200) {
                const authuser = res.data.user;
                set({ authuser });
                localStorage.setItem('authuser', JSON.stringify(authuser));
                toast.success('Login successful');
                return true;
            } else {
                toast.error('Login failed');
                return false;
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login error');
            return false;
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post('/auth/logout');
            set({ authuser: null });
            localStorage.removeItem('authuser');
            toast.success("Logged out");
        } catch (error) {
            toast.error("Logout failed");
        }
    },

    forgotPassword: async (email, newPassword) => {
        try {
            const res = await axiosInstance.post('/auth/forgot-password', { email, newPassword });
            if (res.status === 200) {
                toast.success("Password updated");
                return true;
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Reset error");
            return false;
        }
    },

    updateProfile: async ({ name, profilePicture }) => {
        try {
            const payload = {};
            if (name) payload.name = name;
            if (profilePicture && profilePicture.trim() !== '') payload.profilePicture = profilePicture;

            if (Object.keys(payload).length === 0) return;

            await axiosInstance.put('/auth/update-profile', payload);

            // refresh user
            const check = await axiosInstance.get('/auth/check');
            const freshUser = check.data.user;
            set({ authuser: freshUser });
            localStorage.setItem('authuser', JSON.stringify(freshUser));

            toast.success('Profile updated');
        } catch (error) {
            toast.error('Update failed');
        }
    }
}));

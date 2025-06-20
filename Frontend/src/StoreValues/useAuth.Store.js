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
    checkAuth: async () => {
        try {
            const res = await axiosInstance.get('/auth/check');

            const authuser = res.data.user;
            set({ authuser });
            localStorage.setItem('authuser', JSON.stringify(authuser));
            console.log("Auth user:", localStorage.getItem('authuser'));
            set({ isCheckAuth: false });
        } catch (error) {
            console.log(error);
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
            } else if (res.status === 452) {
                toast.error('This email cannot receive OTPs (invalid or undeliverable)');
                return false;
            } else if (res.status === 422) {
                toast.error('Invalid email format');
                return false;
            } else {
                toast.error('Something went wrong while sending OTP');
                return false;
            }
        } catch (error) {
            if (error.response?.status === 452) {
                toast.error('Email domain is invalid or unreachable');
            } else if (error.response?.status === 502) {
                toast.error('SMTP server failed to send email');
            } else {
                toast.error('Unexpected error occurred');
            }
            console.error("OTP Send Error:", error);
            return false;
        }
    },


    verifyOtp: async (email, otp) => {
        try {
            const res = await axiosInstance.post('/auth/verify-Otp', { email, otp });
            set({ isSignup: true });
            set({ isVerifyOtp: true });
            if (res.status === 200) {
                return toast.success('Otp verified successfully');
            } else {
                return toast.error('Otp not verified,please try again with correct otp');
            }

        } catch (error) {
            console.log(error);
            return false;
        }
    },

    signup: async (email, password, name) => {
        try {
            const res = await axiosInstance.post('/auth/signup', { email, password, name });
            if (res.status === 200) {
                set({ authuser });
                localStorage.setItem('authuser', JSON.stringify(authuser));
                console.log("Auth user:", localStorage.getItem('authuser'));
                set({ isSignup: true });
                return toast.success('Signup successfully');
            } else {
                return toast.error('Signup not successfully,please try again with correct email');
            }
            const authuser = res.data.user;
        } catch (error) {
            console.log(error);
        }
    },

    login: async (email, password) => {
        try {
            const res = await axiosInstance.post('/auth/login', { email, password });
            if (res.status === 200) {
                const authuser = res.data.user;
                set({ authuser });
                localStorage.setItem('authuser', JSON.stringify(authuser));
                console.log("Auth user:", localStorage.getItem('authuser'));
                return toast.success('Login successfully');
            } else {
                return toast.error('Login not successfully,please try again with correct email and password');
            }
        } catch (error) {
            console.log(error);
        }
    }
    ,

    forgotPassword: async (email, newPassword) => {
        try {
            const res = await axiosInstance.post('/auth/forgot-password', { email, newPassword });
            if (res.status === 200) {
                return toast.success('Password changed successfully');
            } else {
                return toast.error('Password not changed,please try again with correct email');
            }
            return res.data.message;
        } catch (error) {
            console.log(error);
            throw error;
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post('/auth/logout');
            set({ authuser: null });
            localStorage.removeItem('authuser');
            console.log("Logged out successfully");
        } catch (error) {
            console.log(error);
        }
    },
    // ✅ Store function
    updateProfile: async ({ name, profilePicture }) => {
        try {
            const payload = {};
            if (name) payload.name = name;
            if (profilePicture && profilePicture.trim() !== '') payload.profilePicture = profilePicture;

            if (Object.keys(payload).length === 0) {
                console.log("Nothing to update");
                return;
            }

            await axiosInstance.put('/auth/update-profile', payload);
            if (payload.name) {
                toast.success('Name updated successfully');
            }
            if (payload.profilePicture) {
                toast.success('Profile picture updated successfully');
            }

            // Refresh authuser from server
            const check = await axiosInstance.get('/auth/check');
            const freshUser = check.data.user;
            set({ authuser: freshUser });
            localStorage.setItem('authuser', JSON.stringify(freshUser));
            console.log("Profile updated and user refreshed");
        } catch (error) {
            console.log(error);
        }
    }



})
);
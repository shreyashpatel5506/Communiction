import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { Await } from "react-router-dom";

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
            set({ isSendOtp: true });
            set({ isSignup: true });
        } catch (error) {
            console.log(error);
        }
    },

    verifyOtp: async (email, otp) => {
        try {
            const res = await axiosInstance.post('/auth/verify-Otp', { email, otp });
            set({ isSignup: true });
            set({ isVerifyOtp: true });
            set({ authuser: res.data.user });
            set({ isCheckAuth: false });
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    },

    signup: async (email, password, name) => {
        try {
            const res = await axiosInstance.post('/auth/signup', { email, password, name });
            const authuser = res.data.user;
            set({ authuser });
            localStorage.setItem('authuser', JSON.stringify(authuser));
            console.log("Auth user:", localStorage.getItem('authuser'));
            set({ isSignup: true });
        } catch (error) {
            console.log(error);
        }
    },

    login: async (email, password) => {
        try {
            const res = await axiosInstance.post('/auth/login', { email, password });
            const authuser = res.data.user;
            set({ authuser });
            localStorage.setItem('authuser', JSON.stringify(authuser));
            console.log("Auth user:", localStorage.getItem('authuser'));
        } catch (error) {
            console.log(error);
        }
    }
    ,

    forgotPassword: async (email) => {
        try {
            const res = await axiosInstance.post('/auth/forgot-password', { email, password });
            return res.data.message;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
})
);
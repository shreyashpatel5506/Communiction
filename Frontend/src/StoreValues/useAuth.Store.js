import {create} from "zustand";
import { axiosInstance } from "../lib/axios";
import { Await } from "react-router-dom";

export const useAuth = create((set) => ({
    authuser: null,
    isSignup:false,
    isLogin:false,
    isSendOtp:false,
    isUpdateProfile:false,
    isCheckAuth:true,
    checkAuth :async ()=>{
        try {
            const res = await axiosInstance.get('/auth/check');
            set({authuser:res.data.user});
            set({isCheckAuth:false});
        } catch (error) {
            console.log(error);
        }finally{
            set({isCheckAuth:false});
        }
    },
    
    sendOtp : async (email)=>{
        try {
            const res = await axiosInstance.post('/auth/send-Otp',{email});
            set({isSendOtp:true});
            set({isSignup:true});
        } catch (error) {
            console.log(error);
        }
    },

    verifyOtp : async (email,otp)=>{
        try {
            const res = await axiosInstance.post('/auth/verify-Otp',{email,otp});
            set({isSignup:true});
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    },

    signup : async (email,password,name)=>{
        try {
            const res = await axiosInstance.post('/auth/signup',{email,password,name});
            set({authuser:res.data.user});
        }catch(error){
            console.log(error);
        }
    },

    login : async (email,password) =>{
        try {
            const res  = await axiosInstance.post('/auth/login',{email,password});
            set({authuser:res.data.user});
        }catch (error) {
            console.log(error);
        }
    }
  })
);
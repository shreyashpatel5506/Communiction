import {create} from zustand;
import { axiosInstance } from "../lib/axios";

export const useAuthStore = create((set) => ({
    authuser: null,
    isSignup:false,
    isLogin:false,
    isUpdateProfile:false,
    isCheckAuth:true,
    checkauth :async ()=>{
        try {
            const res = await axiosInstance.get('/auth/check');
            set({authuser:res.data.user});
            set({isCheckAuth:false});
        } catch (error) {
            console.log(error);
        }finally{
            set({isCheckAuth:false});
        }
    }
   
  })
);
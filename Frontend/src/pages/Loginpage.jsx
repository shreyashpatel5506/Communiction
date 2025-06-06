import React, { useState } from 'react'
import { useAuth } from '../StoreValues/useAuth.Store'
import { MessageSquare, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import AuthImagePattern from '../components/AuthImagePattern';

const Loginpage = () => {
  const {sendOtp,verifyOtp,login,isLogin,isSendOtp} = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    otp:""
  })
  const validatedata = () => {
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
  }

    

  return (
   <p> login </p>
    
  )
}

export default Loginpage
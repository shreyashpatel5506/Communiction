// auth.routes.js or directly in your main server file
import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { protectRoute } from "../middlewears/auth.middlewear.js";
import { createAuthModule } from "authbackendpackage";
import userModel from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";

const router = express.Router();

// Create auth module instance
const auth = createAuthModule({
  userModel,
  cloudinaryInstance: cloudinary,
  jwtSecret: process.env.JWT_SECRET,
  mailUser: process.env.MY_MAIL,
  mailPass: process.env.MY_PASSWORD,
  env: process.env.NODE_ENV,
});

// Attach all routes
router.post("/send-otp", auth.sendOtp);
router.post("/verify-otp", auth.verifyOTP);
router.post("/signup", auth.signup);
router.post("/login", auth.login);
router.post("/logout", auth.logout);
router.put("/update-profile", protectRoute, auth.updateProfile);
router.get("/check", auth.checkAuth);
router.post("/forgot-password", auth.forgotPassword);

export default router;

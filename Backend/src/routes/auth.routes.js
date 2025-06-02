import express from "express";
import {
  signup,
  verifyOTP,
  sendOtp,
  login,
  updateprofile,
  checkauth,
  logout,
  forgotPassword
} from "../controllers/auth.controllers.js";
import { protectRoute } from "../middlewears/auth.middlewear.js";

const router = express.Router();

// Test endpoint to verify middleware is working
router.post('/test', (req, res) => {
  console.log("Test endpoint - req.body:", req.body);
  res.json({
    message: "Test successful",
    receivedBody: req.body,
    bodyType: typeof req.body
  });
});

router.post('/send-Otp', sendOtp);
router.post('/verify-Otp', verifyOTP);
router.post('/signup', signup);
router.post('/login', login);
router.post('/update-profile', protectRoute, updateprofile);
router.get('/check', protectRoute, checkauth);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);

export default router;

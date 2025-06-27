import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import usermodel from "./../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";
import dns from "dns/promises";

// Store OTP and verification status
const otpStorage = new Map();

// JWT Token Generator
export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  return token;
};

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MY_MAIL,
    pass: process.env.MY_PASSWORD,
  },
});


export const sendOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required", success: false });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(422).json({ message: "Invalid email format", success: false });
  }

  const domain = email.split("@")[1];
  try {
    const mxRecords = await dns.resolveMx(domain);
    if (!mxRecords || mxRecords.length === 0) {
      return res.status(452).json({ message: "Email domain does not accept mail", success: false });
    }
  } catch (dnsError) {
    console.error("DNS lookup failed:", dnsError);
    return res.status(452).json({ message: "Invalid or unreachable email domain", success: false });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const mailOptions = {
    from: `PulseTalk <${process.env.MY_MAIL}>`,
    to: email,
    subject: "Your PulseTalk OTP Code",
    html: `
      <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 32px; border-radius: 8px; max-width: 400px; margin: auto;">
        <h2 style="color: #6C63FF; text-align: center; margin-bottom: 16px;">PulseTalk Verification</h2>
        <p style="font-size: 16px; color: #333; text-align: center;">Your One-Time Password (OTP) for PulseTalk is:</p>
        <div style="font-size: 32px; font-weight: bold; color: #6C63FF; text-align: center; margin: 24px 0; letter-spacing: 4px;">${otp}</div>
        <p style="font-size: 14px; color: #555; text-align: center;">This code is valid for 10 minutes. Please do not share it with anyone.</p>
        <hr style="margin: 24px 0; border: none; border-top: 1px solid #eee;">
        <p style="font-size: 12px; color: #aaa; text-align: center;">If you did not request this, please ignore this email.<br>Thank you for using <b>PulseTalk</b>!</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);

    if (info.accepted && info.accepted.includes(email)) {
      otpStorage.set(email, { otp, verified: false });
      console.log("OTP sent to", email, ":", otp);
      return res.status(200).json({ message: "OTP sent", success: true });
    } else {
      console.error("SMTP rejected the email:", info);
      return res.status(452).json({ message: "SMTP did not accept the email", success: false });
    }

  } catch (error) {
    console.error("Failed to send mail:", error);
    return res.status(502).json({ message: "Failed to send email", success: false });
  }
};


// ✅ Verify OTP
export const verifyOTP = (req, res) => {
  const { email, otp } = req.body;
  const record = otpStorage.get(email);

  if (record && record.otp === otp) {
    otpStorage.set(email, { ...record, verified: true });
    return res.status(200).json({ message: "OTP verified", success: true });
  }

  return res.status(400).json({ message: "Invalid OTP", success: false });
};

// ✅ Signup
export const signup = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const { profilePicture } = "req.files" || {};

    const record = otpStorage.get(email);
    if (!record || !record.verified) {
      return res.status(400).json({ message: "OTP not verified for this email" });
    }

    if (!email || !password || !name) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (password.length < 6) {
      return res.status(401).json({ message: "Password too short" });
    }

    const existingUser = await usermodel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const newUser = new usermodel({ email, password: hashPassword, name });

    await newUser.save();
    generateToken(newUser._id, res);

    otpStorage.delete(email); // optional cleanup

    return res.status(201).json({
      message: "User created",
      success: true,
      user: {
        _id: newUser._id,
        email: newUser.email,
        name: newUser.name,
        createdAt: newUser.createdAt,
        profilePicture: newUser.profilePicture,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ✅ Login
// ✅ Login
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await usermodel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid password" });
    }

    generateToken(user._id, res);
    return res.status(200).json({
      message: "Login successful",
      success: true,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
        profilePicture: user.profilePicture,
        // Add any other fields you want to include
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


// ✅ Logout
export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ✅ Update Profile
export const updateprofile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, profilePicture } = req.body;

    const updatedFields = {};
    if (name) updatedFields.name = name;

    if (profilePicture && profilePicture.trim() !== '') {
      try {
        const pic = await cloudinary.uploader.upload(profilePicture);
        updatedFields.profilePicture = pic.secure_url;
      } catch (uploadError) {
        return res.status(400).json({ message: "Invalid profile picture format" });
      }
    }

    if (Object.keys(updatedFields).length === 0) {
      return res.status(400).json({ message: "Nothing to update" });
    }

    const user = await usermodel.findByIdAndUpdate(userId, updatedFields, { new: true });

    return res.status(200).json({
      message: "Profile updated",
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};



// ✅ Check Auth
export const checkauth = async (req, res) => {
  try {
    const user = req.user;
    return res.status(200).json({
      message: "User authenticated",
      success: true,
      user,
    });
    console.log(req.cookies)
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


// ✅ Forgot Password
export const forgotPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ message: "Email and new password are required" });
    }

    const user = await usermodel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(newPassword, salt);
    await usermodel.findByIdAndUpdate(user._id, { password: hashPassword }, { new: true });

    return res.status(200).json({
      message: "Password updated",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

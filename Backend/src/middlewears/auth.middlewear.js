import jwt from "jsonwebtoken";
import user from "../models/user.model.js";
import dotenv from "dotenv";
dotenv.config();

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ message: "Not authorized - No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "shreyash5506");
    const foundUser = await user.findById(decoded.userId).select("-password");

    if (!foundUser) {
      return res.status(401).json({ message: "Not authorized - User not found" });
    }

    req.user = foundUser;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ message: "Not authorized - Invalid token" });
  }
}
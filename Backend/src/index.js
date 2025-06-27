import express from "express";
import authRoutes from "./routes/auth.routes.js";
import followerRoutes from "./routes/follower.routes.js";
import messageRoutes from "./routes/message.routes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connect from "./lib/db.js";
import path from "path";
import { app, server } from "./lib/socket.js"; // Express app from socket.js

dotenv.config();

const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

// ✅ Middleware to parse JSON and URL-encoded bodies
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));

// ✅ Parse cookies
app.use(cookieParser());

// ✅ Enable CORS with credentials
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// ✅ Middleware to block malformed or unsafe URLs

// 1. Reject invalid URL encodings (e.g., /%:) or /%ZZ)
app.use((req, res, next) => {
  try {
    decodeURIComponent(req.path);
  } catch (err) {
    console.error("❌ Malformed path (decode failed):", req.url);
    return res.status(400).send("Malformed URL");
  }
  next();
});

// 2. Block invalid Express-style dynamic patterns like /:)
app.use((req, res, next) => {
  const invalidPattern = /\/:[^\w]/;
  if (invalidPattern.test(req.path)) {
    console.error("❌ Blocked malformed route pattern:", req.path);
    return res.status(400).send("Malformed route pattern");
  }
  next();
});

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/follower", followerRoutes);
app.use("/api/message", messageRoutes);

// ✅ Serve frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../Frontend/dist")));

  app.get("*", (req, res) => {
    console.log("⚠️ Wildcard route hit:", req.originalUrl);
    res.sendFile(path.join(__dirname, "../Frontend/dist/index.html"));
  });
}

// ✅ Debug: Environment variables
console.log("index MY_MAIL:", process.env.MY_MAIL);
console.log("index MY_PASSWORD:", process.env.MY_PASSWORD);
console.log("index JWT_SECRET:", process.env.JWT_SECRET);

// ✅ Connect DB and start server
server.listen(PORT, () => {
  connect();
  console.log("🚀 Server running on port:", PORT);
});

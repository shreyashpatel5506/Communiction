import express from "express";
import authRoutes from "./routes/auth.routes.js";
import followerRoutes from "./routes/follower.routes.js";
import messageRoutes from "./routes/message.routes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connect from "./lib/db.js";
import path from "path";
import { app, server } from "./lib/socket.js";

dotenv.config();

const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Middleware to catch malformed or invalid paths
app.use((req, res, next) => {
  try { decodeURIComponent(req.path); }
  catch (err) {
    console.error("❌ Malformed path (decode failed):", req.url);
    return res.status(400).send("Malformed URL");
  }
  next();
});

app.use((req, res, next) => {
  const invalidPattern = /\/:[^\w]/;
  if (invalidPattern.test(req.path)) {
    console.error("❌ Blocked malformed route pattern:", req.path);
    return res.status(400).send("Malformed route pattern");
  }
  next();
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/follower", followerRoutes);
app.use("/api/message", messageRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../Frontend/dist")));

  // Fix wildcard route to comply with Express v5
  app.get('/*splat', (req, res) => {
    console.log("⚠️ Wildcard route hit:", req.originalUrl);
    res.sendFile(path.join(__dirname, "../Frontend/dist/index.html"));
  });
}

console.log("index MY_MAIL:", process.env.MY_MAIL);
console.log("index MY_PASSWORD:", process.env.MY_PASSWORD);
console.log("index JWT_SECRET:", process.env.JWT_SECRET);

server.listen(PORT, () => {
  connect();
  console.log("🚀 Server running on port:", PORT);
});

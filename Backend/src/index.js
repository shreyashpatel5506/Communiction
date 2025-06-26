// index.js
import express from "express";
import authRoutes from "./routes/auth.routes.js";
import followerRoutes from "./routes/follower.routes.js"
import messageRoutes from "./routes/message.routes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connect from "./lib/db.js";
import path from "path";
import { app, server } from "./lib/socket.js"; // Importing app and server from socket.js

dotenv.config();

const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();


// ✅ Middleware to parse incoming JSON
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));

// ✅ Debug middleware to log all requests
// app.use((req, res, next) => {
//   next();
// });

// ✅ Parse cookies
app.use(cookieParser());

// ✅ Enable CORS with credentials support
app.use(
  cors({
    origin: "http://localhost:5173", // Frontend origin 
    credentials: true,
  })
);

// ✅ Route setup (MUST be before server starts listening)
app.use("/api/auth", authRoutes);
app.use("/api/follower", followerRoutes);
app.use("/api/message", messageRoutes);

if (process.env.NODE_ENV === "production") {
  // Serve static files from the React frontend app
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  // Handle React routing, return all requests to React app
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });

}
// ✅ Debug environment variables
console.log("index MY_MAIL:", process.env.MY_MAIL);
console.log("index MY_PASSWORD:", process.env.MY_PASSWORD);
console.log("index JWT_SECRET:", process.env.JWT_SECRET);

// Add this before server.listen(...)
app._router.stack
  .filter(r => r.route)
  .forEach(r => {
    console.log(`${Object.keys(r.route.methods).join(',').toUpperCase()} ${r.route.path}`);
  });

// ✅ Connect to DB and start server
server.listen(PORT, () => {
  connect();
  console.log("Server is running on port: " + PORT);
});

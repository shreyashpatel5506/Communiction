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

dotenv.config();

const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

const app = express();

// ✅ Middleware to parse incoming JSON
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));

// ✅ Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log("Headers:", req.headers);
  console.log("Body before parsing:", req.body);
  next();
});

// ✅ Parse cookies
app.use(cookieParser());

// ✅ Enable CORS with credentials
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

// ✅ Debug environment variables
console.log("index MY_MAIL:", process.env.MY_MAIL);
console.log("index MY_PASSWORD:", process.env.MY_PASSWORD);
console.log("index JWT_SECRET:", process.env.JWT_SECRET);

// ✅ Connect to DB and start server
app.listen(PORT, () => {
  connect();
  console.log("Server is running on port: " + PORT);
});

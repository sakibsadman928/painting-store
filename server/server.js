import dns from "node:dns/promises";
dns.setServers(["8.8.8.8", "8.8.4.4"]);
import passport from "./configs/passport.js";

import path from "path";
import { fileURLToPath } from "url";

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoute.js";

import paymentRouter from "./routes/paymentRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import addressRouter from "./routes/addressRoute.js";
import orderRouter from "./routes/orderRoute.js";
import ratingRouter from "./routes/ratingRoute.js";
import exhibitionRouter from "./routes/exhibitionRoute.js";
import adminRouter from "./routes/adminRoute.js";
import "dotenv/config";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

console.log("Starting server...");
await connectDB();

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:5174",
  "https://yourdomain.com",
];

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.use("/api/payment", paymentRouter);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/images", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => res.send("API is working"));

// Routes
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/address", addressRouter);
app.use("/api/order", orderRouter);
app.use("/api/rating", ratingRouter);
app.use("/api/exhibition", exhibitionRouter);
app.use("/api/admin", adminRouter);

console.log("Admin routes registered at /api/admin");

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(
    `Admin dashboard API available at: http://localhost:${port}/api/admin`,
  );
});

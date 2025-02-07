import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";

dotenv.config();

import authRoutes from "./routes/auth.js";
import studentRoutes from "./routes/student.js";
import adminRoutes from "./routes/admin.js";
import sharedRoutes from "./routes/shared.js";
import utilityRoutes from "./routes/utility.js"; // Import utility routes
import supervisorRoutes from "./routes/supervisor.js"; // Import utility routes
import sponsorRoutes from "./routes/sponsor.js"; // Import utility routes

import { initSocket } from "./services/socket.js";
import {
  deleteFiles,
  uploadFiles,
  verifyTokenUsingReq,
} from "./services/utility.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
  })
);

const httpServer = createServer(app);
initSocket(httpServer); // Initialize socket.io with the server

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static("uploads")); // Serve static files

// Routes
app.post("/upload", verifyTokenUsingReq, async (req, res) => {
  try {
    const fileUrls = await uploadFiles(req, res);
    console.log("files uploaded");
    res.status(200).json({
      data: fileUrls,
      message: "تم رفع ملفاتك جاري اتمام عملية التخزين",
    });
  } catch (err) {
    console.log(err, "Error uploading files");
    res.status(500).json({
      message: "حدثت مشكلة غير متوفعة حاول مره اخري بعد قليل",
      error: err.message,
    });
  }
});

// Delete Files
app.post("/delete-files", async (req, res) => {
  const { fileUrls } = req.body;
  try {
    const result = await deleteFiles(fileUrls);
    res.status(200).json(result);
  } catch (err) {
    console.log(err, "Error deleting files");
    res
      .status(500)
      .json({ message: err.message, failedFiles: err.failedFiles });
  }
});
app.use("/auth", authRoutes);
app.use("/student", studentRoutes);
app.use("/supervisor", supervisorRoutes);
app.use("/admin", adminRoutes);
app.use("/sponsor", sponsorRoutes);

app.use("/shared", sharedRoutes);
app.use("/utility", utilityRoutes); // Use utility routes

// routes/admin.js
// server.js or your routes file
// Backend Endpoint: /api/users-by-role

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

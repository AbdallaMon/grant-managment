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
const allowedOrigins = [
  "https://scholarships.onsur.org", // Your production frontend domain
  "https://www.scholarships.onsur.org", // In case you use www (add if applicable)
];
app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps, curl, or same-origin requests from tools)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
        console.log(msg);
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true, // Important if your frontend sends cookies, auth headers, etc.
  })
);

const httpServer = createServer(app);
initSocket(httpServer); // Initialize socket.io with the server

app.use(express.json());
app.use(cookieParser());
// app.use("/uploads", express.static("uploads")); // Serve static files

// Routes
app.post("/upload", verifyTokenUsingReq, async (req, res) => {
  try {
    const fileUrls = await uploadFiles(req, res);
    res.status(200).json({
      data: fileUrls,
      message: "تم رفع ملفاتك جاري اتمام عملية التخزين",
    });
  } catch (err) {
    console.log(err, "Error uploading files");
    res.status(500).json({
      message: "حدثت مشكلة غير متوفعة حاول مره اخري بعد قليل" + err,
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
  console.log(`Server is allowedOrigins ${allowedOrigins}`);
  console.log(`Server is allowedOrigins ${process.env.SERVER}`);
});

import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import authRoutes from './routes/auth.js';
import studentRoutes from './routes/student.js';

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors({
    origin: process.env.ORIGIN,
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/auth', authRoutes);
app.use('/student', studentRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

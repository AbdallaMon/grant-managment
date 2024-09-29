import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import authRoutes from './routes/auth.js';
import studentRoutes from './routes/student.js';
import adminRoutes from './routes/admin.js';

import {deleteFiles, searchData, uploadFiles, verifyTokenUsingReq} from "./services/utility.js";

const app = express();

const PORT = process.env.PORT || 3000;
app.use(cors({
    origin: process.env.ORIGIN,
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static('uploads')); // we might needs to remove this later

// Routes
app.get('/search', verifyTokenUsingReq, async (req, res) => {
    const searchBody=req.query
    try{
        const data=await  searchData(searchBody)
        res.status(200).json({ data });
    } catch (error) {
        console.error(`Error fetching data :`, error);
        res.status(500).json({ message: `حدثت مشكلة اثناء جلب البينات: ${error.message}` });
    }
});

app.post('/upload', verifyTokenUsingReq, async (req, res) => {
    try {
        const fileUrls = await uploadFiles(req, res); // Upload the files and get their URLs
        res.status(200).json({ data: fileUrls ,message:"تم رفع ملفاتك جاري اتمام عملية التخزين"});
    } catch (err) {
        console.log(err, "err")
        res.status(500).json({ message: 'Failed to upload files', error: err.message });
    }
});
app.post('/delete-files', async (req, res) => {
    const { fileUrls } = req.body; // Expecting an array of file URLs in the request body
    try {
        const result = await deleteFiles(fileUrls);
        res.status(200).json(result);
    } catch (err) {
        console.log(err,"errrrro in delete")
        res.status(500).json({ message: err.message, failedFiles: err.failedFiles });
    }
});
app.use('/auth', authRoutes);
app.use('/student', studentRoutes);
app.use('/admin', adminRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

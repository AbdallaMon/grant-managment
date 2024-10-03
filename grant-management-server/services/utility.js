import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY;
import multer from 'multer';
import path from 'path';
import {v4 as uuidv4} from 'uuid';
import fs from 'fs';
import {fileURLToPath} from 'url';
import axios from "axios";
import prisma from "../prisma/prisma.js";
import {getIo} from "./socket.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const deleteFiles = (fileUrls) => {
    return new Promise((resolve, reject) => {
        const baseUploadPath = path.join(__dirname, '../uploads/');
        let deletedFiles = [];
        let failedFiles = [];

        fileUrls.forEach(url => {
            try {
                // Extract file name from the URL
                const fileName = url.split('/').pop();
                const filePath = path.join(baseUploadPath, fileName);

                // Check if file exists
                if (fs.existsSync(filePath)) {
                    // Delete the file
                    fs.unlinkSync(filePath);
                    deletedFiles.push(fileName);
                } else {
                    failedFiles.push(fileName);
                }
            } catch (error) {
                failedFiles.push(fileName);
            }
        });

        if (failedFiles.length > 0) {
            reject({
                message: "بعض الملفات لم يتم العثور عليها أو لم يتم حذفها",
                failedFiles,
            });
        } else {
            resolve({
                message: "تم حذف الملفات بنجاح",
                deletedFiles,
            });
        }
    });
};
const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../uploads/');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, {recursive: true});
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = uuidv4() + path.extname(file.originalname);
        cb(null, uniqueSuffix);
    }
});

// Set up multer for multiple files, allow up to 10 files
const upload = multer({storage}).any();
// Function to handle file upload
export const uploadFiles = (req, res) => {
    return new Promise((resolve, reject) => {
        upload(req, res, (err) => {
            if (err) {
                reject(err);
            } else {
                if (!req.files || req.files.length === 0) {
                    return reject(new Error('No files uploaded.'));
                }
                const fileUrls = {};

                req.files.forEach(file => {
                    const fieldName = file.fieldname; // e.g., 'file_transiction'
                    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;

                    if (fieldName) {
                        fileUrls[fieldName] = fileUrl;
                    }
                });

                resolve(fileUrls);
            }
        });
    });
};
export const verifyTokenUsingReq = (req, res, next) => {
    const token = req.cookies.token
    if (!token) {
        return res.status(403).json({message: 'تم رفض صلاحيتك'});
    }
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({message: 'Invalid token'});
    }
};

export function verifyToken(token) {
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        return decoded;
    } catch (error) {
        throw new Error("Invalid token");
    }
}

export function handlePrismaError(res, error) {
    console.error("Prisma error: x ", error);
    if (error.name === 'PrismaClientValidationError') {
        return res.status(400).json({message: "هناك خطأ في البيانات المرسلة. يرجى التحقق من البيانات وإعادة المحاولة."});
    }

    let response;
    switch (error.code) {
        case 'P2002':
            if (error.meta && error.meta.target && error.meta.target.includes('email')) {
                response = {status: 409, message: "البريد الإلكتروني مسجل بالفعل"};
            } else {
                response = {status: 409, message: `فشل القيد الفريد في الحقل: ${error.meta.target}`};
            }
            break;

        case 'P2003':
            response = {status: 400, message: `فشل القيد المرجعي في الحقل: ${error.meta.field_name}`};
            break;

        case 'P2004':
            response = {status: 400, message: `فشل قيد على قاعدة البيانات: ${error.meta.constraint}`};
            break;

        case 'P2025':
            response = {status: 404, message: `لم يتم العثور على السجل: ${error.meta.cause}`};
            break;

        case 'P2016':
            response = {status: 400, message: `خطأ في تفسير الاستعلام: ${error.meta.details}`};
            break;

        case 'P2000':
            response = {status: 400, message: `القيمة خارج النطاق للعمود: ${error.meta.column}`};
            break;

        case 'P2017':
            response = {status: 400, message: `انتهاك العلاقة: ${error.meta.relation_name}`};
            break;

        case 'P2014':
            response = {
                status: 400,
                message: `التغيير الذي تحاول إجراؤه سينتهك العلاقة المطلوبة: ${error.meta.relation_name}`
            };
            break;

        case 'P2026':
            response = {status: 500, message: `خطأ في مهلة قاعدة البيانات: ${error.meta.details}`};
            break;

        default:
            response = {status: 500, message: `حدث خطأ غير متوقع: ${error.message}`};
    }

    // Send response to the client
    return res.status(response.status).json({message: response.message});
}

export const verifyTokenAndHandleAuthorization = (req, res, next, role) => {

    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({message: 'يجب عليك تسجيل الدخول اولا'});
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        if (role === "SHARED") {
            if (decoded.role !== "ADMIN" && decoded.role !== "SUPERVISOR") {
                return res.status(403).json({message: 'غير مصرح لك بالوصول'});
            }
        } else {
            if (decoded.role !== role) {
                return res.status(403).json({message: 'غير مصرح لك بالوصول'});
            }
        }
        req.user = decoded;
        next();
    } catch (error) {
        console.log("error in middleware", error)
        return res.status(401).json({message: 'انتهت جلسة تسجيل الدخول'});
    }
};
export const getPagination = (req) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    return {page, limit, skip};
};

export async function deleteListOfFiles(files) {
    try {
        const deleteUrl = `${process.env.SERVER}/delete-files`;
        const response = await axios.post(deleteUrl, {
            fileUrls: files
        });
        if (response.status === 200) {
            console.log(`Old file ${files} deleted successfully`);
        } else {
            console.log(`Failed to delete old file: ${files}`);
        }
    } catch (error) {
        console.error(`Error while deleting old file :`, error.message);
    }
}

const modelMap = {
    user: prisma.user,
    grant: prisma.grant,
};

export async function searchData(body) {
    const {model, query, filters} = body;
    const prismaModel = modelMap[model];
    let where = {};
    if (query) {
        if (model === 'user') {
            where.OR = [
                {email: {contains: query}},
                {personalInfo: {basicInfo: {name: {contains: query}}}},
                {personalInfo: {contactInfo: {phone: {contains: query}}}}
            ];
        } else if (model === 'grant') {
            where.name = {contains: query};
        }
    }

    if (filters && filters !== "undefined") {
        const parsedFilters = JSON.parse(filters);
        if (parsedFilters.role) {
            where.role = parsedFilters.role;
        }
        if (parsedFilters.OR) {
            where.OR = parsedFilters.OR
        }
        if (parsedFilters.type) {
            where.type = parsedFilters.type;
        }
    }

    const selectFields = {
        user: {
            id: true,
            email: true,
            personalInfo: {
                select: {
                    basicInfo: {
                        select: {
                            name: true,
                        },
                    },
                    contactInfo: {
                        select: {
                            phone: true,
                            whatsapp: true,
                        },
                    },
                },
            },
        },
        grant: {
            id: true,
            name: true,
            type: true,
            amount: true,
            amountLeft: true,
        },
    };
    const data = await prismaModel.findMany({
        where,
        select: selectFields[model],
    });
    return data;
}

export async function getNotifications(searchParams, limit, skip, unread = true) {
    const where = {}
    if (searchParams.isAdmin === "true") {
        where.isAdmin = true
        where.adminReads = {
            some: {
                adminId: Number(searchParams.userId),
            }
        };
        if (unread) {
            where.adminReads = {
                some: {
                    adminId: Number(searchParams.userId),
                    isRead: !unread,
                }
            };
        }
    } else {
        where.userId = Number(searchParams.userId)
    }
    if (unread) {
        where.isRead = false
    }
    console.log(unread, "unread")
    const notifications = await prisma.notification.findMany({
        where: where,
        skip,
        take: limit,
    });
    const total = await prisma.notification.count({where: where});
    return {notifications, total};
}

export async function markNotificationAsRead(notificationId) {
    const notification = await prisma.notification.update({
        where: {id: Number(notificationId)},
        data: {isRead: true},
    });
    return notification;
}

export async function markLatestNotificationsAsRead(userId) {
    const where = {isRead: false, userId: Number(userId)}
    console.log(userId, "userId in unread")
    const notifications = await prisma.notification.updateMany({
        where,
        data: {isRead: true}
    })
    return notifications
}

export async function markLatestNotificationsAsReadForAdmin(userId) {
    const where = {isRead: false, adminId: Number(userId)}
    const notifications = await prisma.adminNotification.updateMany({
        where,
        data: {isRead: true}
    })
    return notifications
}

export async function getSuperVisorIdByAppId(appId) {
    const supervisor = await prisma.application.findUnique({where: {id: Number(appId)}, select: {supervisorId: true}})
    return supervisor.supervisorId
}

export async function getStudentIdByAppId(appId) {
    const student = await prisma.application.findUnique({where: {id: Number(appId)}, select: {studentId: true}})
    return student.studentId
}

export async function createNotification(userId, content, href, type, isAdmin) {
    const io = getIo(); // Get the initialized socket.io instance
    const notification = await prisma.notification.create({
        data: {
            userId: userId || null, // Null for admin notifications
            content,
            href: href || null,
            type,
            isAdmin: isAdmin || false,
        },
    });
    if (isAdmin) {
        const adminUsers = await prisma.user.findMany({where: {role: 'ADMIN'}, select: {id: true}});
        await prisma.adminNotification.createMany({
            data: adminUsers.map((admin) => ({
                adminId: admin.id,
                notificationId: notification.id,
                isRead: false,
            })),
        });
        adminUsers.forEach((admin) => {
            io.to(admin.id.toString()).emit('notification', notification);
            console.log(`Notification emitted to admin with ID ${admin.id}`);
        });
    } else if (userId) {
        io.to(userId.toString()).emit('notification', notification);
        console.log('Notification emitted to user:', userId);
    }
    return notification;
}
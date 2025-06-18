import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY;
import multer from "multer";
import { fileURLToPath } from "url";
import * as fs from "node:fs";
import * as path from "node:path";
import { v4 as uuidv4 } from "uuid";
import { Client } from "basic-ftp";

import axios from "axios";
import prisma from "../prisma/prisma.js";
import { getIo } from "./socket.js";
import { sendEmail } from "./sendMail.js";
//
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// next cloud uploads
const ftpConfig = {
  host: process.env.FTP_HOST,
  user: process.env.FTP_USER,
  password: process.env.FTP_PASSWORD,
  secure: false, // Set to true if using FTPS
};

const tmpFolder = path.resolve(__dirname, "tmp");
if (!fs.existsSync(tmpFolder)) {
  fs.mkdirSync(tmpFolder, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tmpFolder); // Save files to the tmp directory
  },
  filename: (req, file, cb) => {
    const uniqueFilename = `${uuidv4()}-${Date.now()}${path.extname(
      file.originalname
    )}`;
    cb(null, uniqueFilename);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
}).any();

function deleteFile(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (err) {
    console.error(`Error deleting file: ${filePath}`, err.message);
  }
}
async function uploadToFTP(localFilePath, remotePath) {
  const client = new Client();
  try {
    await client.access(ftpConfig);
    await client.uploadFrom(localFilePath, remotePath);
  } catch (err) {
    console.error(`Failed to upload ${localFilePath}:`, err.message);
  } finally {
    client.close();
  }
}
// Upload API
export const uploadFiles = async (req, res) => {
  try {
    const fileUrls = {}; // Object to store URLs of uploaded files
    await new Promise((resolve, reject) => {
      upload(req, res, async (err) => {
        if (err) {
          reject(err); // Reject on upload error
        } else if (!req.files || req.files.length === 0) {
          reject(new Error("No files uploaded."));
        } else {
          try {
            for (const file of req.files) {
              const uniqueFilename = `${uuidv4()}${path.extname(
                file.originalname
              )}`;
              const remotePath = `public_html/uploads/${uniqueFilename}`;

              // Upload file buffer to FTP server
              await uploadToFTP(file.path, remotePath);

              const fileUrl = `${process.env.FTP_HOST}/uploads/${uniqueFilename}`;
              const fieldName = file.fieldname;

              // Group file URLs by field name
              if (!fileUrls[fieldName]) fileUrls[fieldName] = [];
              fileUrls[fieldName].push(fileUrl);
              deleteFile(file.path);
            }
            resolve(); // Resolve the promise once all files are uploaded
          } catch (uploadErr) {
            reject(uploadErr);
          }
        }
      });
    });

    // Respond with the URLs of uploaded files
    res.status(200).json({ message: "Files uploaded successfully.", fileUrls });
  } catch (error) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ error: "File size exceeds the 50MB limit." });
    }
    console.error("Error:", error.message);
    res.status(400).json({ error: error.message });
  }
};
// export const uploadFiles = async (req, res) => {
//   return new Promise((resolve, reject) => {
//     // Use the Multer upload middleware
//     upload(req, res, async (err) => {
//       if (err) {
//         return reject(err);
//       }

//       if (!req.files || req.files.length === 0) {
//         return reject(new Error("No files uploaded."));
//       }

//       try {
//         const results = {};
//         const nextcloudUrlBase = process.env.NEXTCLOUD_URL;
//         const nextcloudUsername = process.env.NEXTCLOUD_USERNAME;
//         const nextcloudPassword = process.env.NEXTCLOUD_PASSWORD;
//         for (const file of req.files) {
//           const uniqueName = uuidv4() + "-" + file.originalname;
//           const nextcloudUrl = `${nextcloudUrlBase}/${uniqueName}`;

//           // Upload the file to Nextcloud
//           const buffer = Buffer.from(file.buffer);
//           await axios.put(nextcloudUrl, buffer, {
//             auth: {
//               username: nextcloudUsername,
//               password: nextcloudPassword,
//             },
//             headers: {
//               "Content-Type": file.mimetype,
//             },
//           });

//           // Generate a public share link for the uploaded file
//           const shareUrl = `${nextcloudUrlBase.replace(
//             "/remote.php/webdav",
//             ""
//           )}/ocs/v2.php/apps/files_sharing/api/v1/shares`;
//           const shareResponse = await axios.post(
//             shareUrl,
//             `path=/${uniqueName}&shareType=3&permissions=1`,
//             {
//               auth: {
//                 username: nextcloudUsername,
//                 password: nextcloudPassword,
//               },
//               headers: {
//                 "OCS-APIREQUEST": "true",
//                 "Content-Type": "application/x-www-form-urlencoded",
//               },
//             }
//           );
//           const publicUrl =
//             shareResponse.data.ocs.data.url +
//             (file.mimetype === "application/pdf"
//               ? `?type=pdf&name=${uniqueName}`
//               : `/preview?name=${uniqueName}`);

//           results[file.fieldname] = publicUrl.startsWith("http://")
//             ? publicUrl.replace("http://", "https://")
//             : publicUrl;
//         }
//         resolve(results); // <-- Resolving with the results
//       } catch (error) {
//         console.log(error, "error");
//         reject(new Error("حدث خطاء اثناء رفع الملفات"));
//       }
//     });
//   });
// };

// export async function deleteFiles(files) {
//   const nextcloudUrlBase = process.env.NEXTCLOUD_URL;
//   const nextcloudUsername = process.env.NEXTCLOUD_USERNAME;
//   const nextcloudPassword = process.env.NEXTCLOUD_PASSWORD;

//   for (const fileUrl of files) {
//     const parsedUrl = new URL(fileUrl);
//     const name = parsedUrl.pathname.split("/").pop(); // Get the file name from URL

//     const deleteUrl = `${nextcloudUrlBase}/${name}`;

//     const response = await axios.delete(deleteUrl, {
//       auth: {
//         username: nextcloudUsername,
//         password: nextcloudPassword,
//       },
//     });
//   }
// }

export const verifyTokenUsingReq = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(403).json({ message: "تم رفض صلاحيتك" });
  }
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
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
  if (error.name === "PrismaClientValidationError") {
    return res.status(400).json({
      message:
        "هناك خطأ في البيانات المرسلة. يرجى التحقق من البيانات وإعادة المحاولة.",
    });
  }

  let response;
  switch (error.code) {
    case "P2002":
      if (
        error.meta &&
        error.meta.target &&
        error.meta.target.includes("email")
      ) {
        response = { status: 409, message: "البريد الإلكتروني مسجل بالفعل" };
      } else {
        response = {
          status: 409,
          message: `فشل القيد الفريد في الحقل: ${error.meta.target}`,
        };
      }
      break;

    case "P2003":
      response = {
        status: 400,
        message: `فشل القيد المرجعي في الحقل: ${error.meta.field_name}`,
      };
      break;

    case "P2004":
      response = {
        status: 400,
        message: `فشل قيد على قاعدة البيانات: ${error.meta.constraint}`,
      };
      break;

    case "P2025":
      response = {
        status: 404,
        message: `لم يتم العثور على السجل: ${error.meta.cause}`,
      };
      break;

    case "P2016":
      response = {
        status: 400,
        message: `خطأ في تفسير الاستعلام: ${error.meta.details}`,
      };
      break;

    case "P2000":
      response = {
        status: 400,
        message: `القيمة خارج النطاق للعمود: ${error.meta.column}`,
      };
      break;

    case "P2017":
      response = {
        status: 400,
        message: `انتهاك العلاقة: ${error.meta.relation_name}`,
      };
      break;

    case "P2014":
      response = {
        status: 400,
        message: `التغيير الذي تحاول إجراؤه سينتهك العلاقة المطلوبة: ${error.meta.relation_name}`,
      };
      break;

    case "P2026":
      response = {
        status: 500,
        message: `خطأ في مهلة قاعدة البيانات: ${error.meta.details}`,
      };
      break;

    default:
      response = {
        status: 500,
        message: `حدث خطأ غير متوقع: ${error.message}`,
      };
  }

  // Send response to the client
  return res.status(response.status).json({ message: response.message });
}

export const verifyTokenAndHandleAuthorization = (req, res, next, role) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "يجب عليك تسجيل الدخول اولا" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);

    if (role === "SHARED") {
      if (decoded.role !== "ADMIN" && decoded.role !== "SUPERVISOR") {
        return res.status(403).json({ message: "غير مصرح لك بالوصول" });
      }
    } else if (role === "OTHER") {
      if (decoded.role !== "SPONSOR" && decoded.role !== "INDIVIDUAL") {
        return res.status(403).json({ message: "غير مصرح لك بالوصول" });
      }
    } else {
      if (decoded.role !== role) {
        return res.status(403).json({ message: "غير مصرح لك بالوصول" });
      }
    }
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "انتهت جلسة تسجيل الدخول" });
  }
};
export const getPagination = (req) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

export async function deleteListOfFiles(files) {
  try {
    const deleteUrl = `${process.env.SERVER}/delete-files`;
    const response = await axios.post(deleteUrl, {
      fileUrls: files,
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
  const { model, query, filters } = body;
  const prismaModel = modelMap[model];
  let where = {};
  if (query) {
    if (model === "user") {
      where.OR = [
        { email: { contains: query } },
        { personalInfo: { basicInfo: { name: { contains: query } } } },
        { personalInfo: { contactInfo: { phone: { contains: query } } } },
      ];
    } else if (model === "grant") {
      where.name = { contains: query };
    }
  }

  if (filters && filters !== "undefined") {
    const parsedFilters = JSON.parse(filters);
    if (parsedFilters.role) {
      where.role = parsedFilters.role;
    }
    if (parsedFilters.OR) {
      where.OR = parsedFilters.OR;
    }
    if (parsedFilters.type) {
      where.type = parsedFilters.type;
    }
    if (parsedFilters.supervisorId) {
      where.userGrants = {
        some: {
          supervisorId: Number(parsedFilters.supervisorId),
        },
      };
    }
    if (parsedFilters.sponsorId) {
      where.userGrants = {
        some: {
          grant: {
            viewAccessUsers: {
              some: {
                id: Number(parsedFilters.sponsorId),
              },
            },
          },
        },
      };
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

export async function getNotifications(
  searchParams,
  limit,
  skip,
  unread = true
) {
  const where = {};
  if (searchParams.isAdmin === "true") {
    where.isAdmin = true;
    where.adminReads = {
      some: {
        adminId: Number(searchParams.userId),
      },
    };
    if (unread) {
      where.adminReads = {
        some: {
          adminId: Number(searchParams.userId),
          isRead: !unread,
        },
      };
    }
  } else {
    where.userId = Number(searchParams.userId);
  }
  if (unread) {
    where.isRead = false;
  }
  const notifications = await prisma.notification.findMany({
    where: where,
    skip,
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
  });
  const total = await prisma.notification.count({ where: where });
  return { notifications, total };
}

export async function markLatestNotificationsAsRead(userId) {
  const where = { isRead: false, userId: Number(userId) };
  const notifications = await prisma.notification.updateMany({
    where,
    data: { isRead: true },
  });
  return notifications;
}

export async function markLatestNotificationsAsReadForAdmin(userId) {
  const where = { isRead: false, adminId: Number(userId) };
  const notifications = await prisma.adminNotification.updateMany({
    where,
    data: { isRead: true },
  });
  return notifications;
}

export async function getSuperVisorIdByAppId(appId) {
  const supervisor = await prisma.application.findUnique({
    where: { id: Number(appId) },
    select: { supervisorId: true },
  });
  return supervisor.supervisorId;
}

export async function getStudentIdByAppId(appId) {
  const student = await prisma.application.findUnique({
    where: { id: Number(appId) },
    select: { studentId: true },
  });
  return student.studentId;
}

export const NotificationType = {
  MESSAGE: "رسالة جديدة",
  APPLICATION_APPROVED: "تمت الموافقة على طلب المنحة",
  APPLICATION_REJECTED: "تم رفض طلب المنحة",
  APPLICATION_UPDATE: "تحديث على طلب المنحة",
  APPLICATION_UN_COMPLETE: "طلب المنحة غير مكتمل",
  APPLICATION_RESPONSE: "رد على طلب المنحة",
  APPLICATION_NEW: "طلب منحة جديد",
  APPLICATION_UNDER_REVIEW: "طلب المنحة قيد المراجعة",
  APPLICATION_COMPLETED: "تم اكتمال طلب المنحة",
  NEW_TICKET: "تذكرة دعم جديدة",
  TICKET_UPDATE: "تحديث على التذكرة",
  TASK_ASSIGNED: "تم تعيين مهمة جديدة",
  TASK_COMPLETED: "تم إكمال المهمة",
  PAYMENT_DUE: "تذكير بموعد الدفع",
  PAYMENT_COMPLETED: "تم تأكيد عملية الدفع",
};

export async function createNotification(userId, content, href, type, isAdmin) {
  const io = getIo(); // Socket instance for real-time notifications
  const notification = await prisma.notification.create({
    data: {
      userId: userId || null, // Null for admin notifications
      content,
      href: href || null,
      type,
      isAdmin: isAdmin || false,
    },
  });

  const emailSubject = NotificationType[type];
  const link = href
    ? `<a href="${process.env.ORIGIN}${href}" style="color: #1a73e8; text-decoration: none;">اضغط هنا لرؤية التفاصيل</a>`
    : "";
  const emailContent = `
        <div style="font-family: Arial, sans-serif; color: #333; direction: rtl; text-align: right;">
            <h2 style="color: #444; margin-bottom: 16px;">${emailSubject}</h2>
            <p style="font-size: 16px; line-height: 1.5;">${content}</p>
            ${link ? `<p>${link}</p>` : ""}
        </div>
    `;

  if (isAdmin) {
    const adminUsers = await prisma.user.findMany({
      where: { role: "ADMIN" },
      select: { id: true, email: true },
    });
    await prisma.adminNotification.createMany({
      data: adminUsers.map((admin) => ({
        adminId: admin.id,
        notificationId: notification.id,
        isRead: false,
      })),
    });

    // Notify each admin user and defer emails
    adminUsers.forEach((admin) => {
      io.to(admin.id.toString()).emit("notification", notification);
      if (admin.email) {
        setImmediate(() => {
          sendEmail(admin.email, emailSubject, emailContent).catch((error) => {
            console.error(`Failed to send email to admin ${admin.id}:`, error);
          });
        });
      }
    });
  } else if (userId) {
    io.to(userId.toString()).emit("notification", notification);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });
    if (user && user.email) {
      setImmediate(() => {
        sendEmail(user.email, emailSubject, emailContent).catch((error) => {
          console.error(`Failed to send email to user ${userId}:`, error);
        });
      });
    }
  }

  // Return the notification immediately
  return notification;
}

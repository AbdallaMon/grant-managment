import { Router } from "express";
import {
  createNotification,
  getPagination,
  handlePrismaError,
  verifyTokenAndHandleAuthorization,
} from "../services/utility.js";
import prisma from "../prisma/prisma.js";

import {
  assignUserToViewGrant,
  changeUserStatus,
  createNewDocument,
  createNewFAQ,
  createNewFixedData,
  createNewGrantProject,
  createNonStudentUser,
  deleteDocument,
  deleteFAQ,
  deleteGrant,
  editAGrant,
  editDocument,
  editFAQ,
  editFixedData,
  editNonStudentUser,
  getAllTickets,
  getApplications,
  getUser,
  getUserViewAccessForAGrant,
  removeUserFromViewGrant,
  updateTicketStatus,
} from "../services/adminServices.js";
import {
  createMessage,
  getMessagesByTicket,
} from "../services/studentsServices.js";

const router = Router();

router.use((req, res, next) => {
  verifyTokenAndHandleAuthorization(req, res, next, "ADMIN");
});

router.patch("/students/:studentId", async (req, res) => {
  const { studentId } = req.params;
  const { user } = req.body;

  try {
    if (!studentId || !user) {
      return res.status(404).json({ message: "لا يوجد طالب بهذا المعرف" });
    }
    const studentPersonalInfo = await changeUserStatus(user, studentId);
    res
      .status(200)
      .json({ data: studentPersonalInfo, message: "تم العملية بنجاح" });
  } catch (error) {
    console.error("Error fetching personal info:", error);
    res.status(500).json({ message: "حدث خطأ أثناء تحديث بيانات الطالب" });
  }
});
router.get("/supervisor", async (req, res) => {
  const searchParams = req.query;
  const { limit, skip } = getPagination(req);

  try {
    const { users, total } = await getUser(
      searchParams,
      limit,
      skip,
      "SUPERVISOR"
    );
    const totalPages = Math.ceil(total / limit);

    if (!users) {
      return res.status(404).json({ message: "لا يوجد مشرفين" });
    }
    res.status(200).json({ data: users, totalPages, total });
  } catch (error) {
    console.error("Error fetching supervisors:", error);
    res.status(500).json({ message: "حدث خطأ أثناء جلب  المشرفين" });
  }
});
router.post("/supervisor", async (req, res) => {
  const user = req.body;
  try {
    if (!user) {
      return res.status(404).json({ message: "لا يوجد بيانات مرسله" });
    }
    const newUser = await createNonStudentUser(user, "SUPERVISOR");
    res.status(200).json({ data: newUser, message: "تم انشاء الحساب بنجاح" });
  } catch (error) {
    console.error("Error fetching personal info:", error);
    if (error.code === "P2002" && error.meta?.target?.includes("email")) {
      res
        .status(400)
        .json({ status: 400, message: "هذا البريد الإلكتروني مسجل بالفعل" });
    } else {
      handlePrismaError(res, error);
    }
  }
});
router.put("/supervisor/:supervisorId", async (req, res) => {
  const user = req.body;
  const { supervisorId } = req.params;

  try {
    if (!user || !supervisorId) {
      return res.status(404).json({ message: "لا يوجد مشرف بهذا المعرف" });
    }
    const updatedUser = await editNonStudentUser(user, supervisorId);
    res
      .status(200)
      .json({ data: updatedUser, message: "تم تعديل الحساب بنجاح" });
  } catch (error) {
    console.error("Error fetching personal info:", error);
    if (error.code === "P2002" && error.meta?.target?.includes("email")) {
      res
        .status(400)
        .json({ status: 400, message: "هذا البريد الإلكتروني مسجل بالفعل" });
    } else {
      handlePrismaError(res, error);
    }
  }
});
router.patch("/supervisor/:supervisorId", async (req, res) => {
  const { supervisorId } = req.params;
  const { user } = req.body;

  try {
    if (!supervisorId || !user) {
      return res.status(404).json({ message: "لا يوجد مشرف  بهذا المعرف" });
    }
    const studentPersonalInfo = await changeUserStatus(user, supervisorId);
    res
      .status(200)
      .json({ data: studentPersonalInfo, message: "تم العملية بنجاح" });
  } catch (error) {
    console.error("Error fetching personal info:", error);
    res.status(500).json({ message: "حدث خطأ أثناء تحديث بيانات الطالب" });
  }
});
router.get("/sponsor", async (req, res) => {
  const searchParams = req.query;
  const { limit, skip } = getPagination(req);

  try {
    const { users, total } = await getUser(searchParams, limit, skip, "OTHER");
    const totalPages = Math.ceil(total / limit);

    if (!users) {
      return res.status(404).json({ message: "لا يوجد حسابات" });
    }
    res.status(200).json({ data: users, totalPages, total });
  } catch (error) {
    console.error("Error fetching supervisors:", error);
    res.status(500).json({ message: "حدث خطأ أثناء جلب  حسابات الداعمين" });
  }
});
router.post("/sponsor", async (req, res) => {
  const user = req.body;
  try {
    if (!user) {
      return res.status(404).json({ message: "لا يوجد بيانات مرسله" });
    }
    const newUser = await createNonStudentUser(user, user.role);
    res.status(200).json({ data: newUser, message: "تم انشاء الحساب بنجاح" });
  } catch (error) {
    if (error.code === "P2002" && error.meta?.target?.includes("email")) {
      res
        .status(400)
        .json({ status: 400, message: "هذا البريد الإلكتروني مسجل بالفعل" });
    } else {
      handlePrismaError(res, error);
    }
  }
});
router.put("/sponsor/:sponsorId", async (req, res) => {
  const user = req.body;
  const { sponsorId } = req.params;

  try {
    if (!user || !sponsorId) {
      return res.status(404).json({ message: "لا يوجد حساب  بهذا المعرف" });
    }
    const updatedUser = await editNonStudentUser(user, sponsorId);
    res
      .status(200)
      .json({ data: updatedUser, message: "تم تعديل الحساب بنجاح" });
  } catch (error) {
    console.error("Error fetching personal info:", error);
    if (error.code === "P2002" && error.meta?.target?.includes("email")) {
      res
        .status(400)
        .json({ status: 400, message: "هذا البريد الإلكتروني مسجل بالفعل" });
    } else {
      handlePrismaError(res, error);
    }
  }
});
router.patch("/sponsor/:sponsorId", async (req, res) => {
  const { sponsorId } = req.params;
  const { user } = req.body;

  try {
    if (!sponsorId || !user) {
      return res.status(404).json({ message: "لا يوجد حساب  بهذا المعرف" });
    }
    const studentPersonalInfo = await changeUserStatus(user, sponsorId);
    res
      .status(200)
      .json({ data: studentPersonalInfo, message: "تم العملية بنجاح" });
  } catch (error) {
    res.status(500).json({ message: "حدث خطأ أثناء تحديث بيانات الحساب" });
  }
});

router.post("/grants/projects", async (req, res) => {
  const grant = req.body;
  try {
    if (!grant) {
      return res.status(404).json({ message: "لا يوجد بيانات مرسله" });
    }
    const newUser = await createNewGrantProject(grant);
    res
      .status(200)
      .json({ data: newUser, message: "تم انشاء مشروع منحة بنجاح" });
  } catch (error) {
    handlePrismaError(res, error);
  }
});
router.put("/grants/projects/:grantId", async (req, res) => {
  const grant = req.body;
  const { grantId } = req.params;

  try {
    if (!grant || !grantId) {
      return res.status(404).json({ message: "لا يوجد منحة  بهذا المعرف" });
    }
    const updatedUser = await editAGrant(grant, grantId);
    res
      .status(200)
      .json({ data: updatedUser, message: "تم تعديل المنحة بنجاح" });
  } catch (error) {
    handlePrismaError(res, error);
  }
});
router.delete("/grants/projects/:grantId", async (req, res) => {
  const { grantId } = req.params;

  try {
    if (!grantId) {
      return res.status(404).json({ message: "لا يوجد منحة  بهذا المعرف" });
    }
    const updatedUser = await deleteGrant(grantId);
    res.status(200).json({ data: updatedUser, message: "تم حذف المنحة بنجاح" });
  } catch (error) {
    handlePrismaError(res, error);
  }
});
router.get("/grants/projects/access/:grantId", async (req, res) => {
  const { grantId } = req.params;
  try {
    const grant = await getUserViewAccessForAGrant(grantId);
    if (!grant) {
      return res.status(404).json({ message: "لا يوجد منحه" });
    }
    res.status(200).json({ data: grant, users: grant.viewAccessUsers });
  } catch (error) {
    console.error("Error fetching supervisors:", error);
    res.status(500).json({ message: "حدث خطأ أثناء جلب  المنحة " });
  }
});

router.post("/grants/projects/access/:grantId", async (req, res) => {
  const { userId } = req.body;
  const { grantId } = req.params;
  try {
    if (!userId) {
      return res.status(404).json({ message: "لا يوجد بيانات مرسله" });
    }
    const newUser = await assignUserToViewGrant(grantId, userId);
    res.status(200).json({
      data: newUser,
      message: "تم اعطاء الصلاحية لهذا المستخدم بنجاح",
    });
  } catch (error) {
    handlePrismaError(res, error);
  }
});
router.delete("/grants/projects/access/:grantId", async (req, res) => {
  const { grantId } = req.params;
  const { userId } = req.body;
  try {
    if (!grantId) {
      return res.status(404).json({ message: "لا يوجد منحة  بهذا المعرف" });
    }
    const updatedUser = await removeUserFromViewGrant(grantId, userId);
    res
      .status(200)
      .json({ data: updatedUser, message: "تم الغاء صلاحية هذا المستخدم" });
  } catch (error) {
    handlePrismaError(res, error);
  }
});

router.get("/grants/applications/pending", async (req, res) => {
  const searchParams = req.query;
  const { limit, skip } = getPagination(req);
  try {
    const { applications, total } = await getApplications(
      searchParams,
      limit,
      skip,
      "PENDING"
    );
    const totalPages = Math.ceil(total / limit);

    if (!applications) {
      return res.status(404).json({ message: "لا يوجد طلبات حاليا" });
    }
    res.status(200).json({ data: applications, totalPages, total });
  } catch (error) {
    console.error("Error fetching supervisors:", error);
    res.status(500).json({ message: "حدث خطأ أثناء جلب  الطلبات " });
  }
});

//dashboard
router.get("/dashboard/users-by-role", async (req, res) => {
  try {
    const usersByRole = await prisma.user.groupBy({
      by: ["role"],
      _count: true,
    });
    res.json(usersByRole);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Backend Endpoint: /api/applications-stats
router.get("/dashboard/applications-stats", async (req, res) => {
  try {
    const totalApplications = await prisma.application.count({
      where: {
        status: {
          not: "DRAFT", // Exclude applications with status 'DRAFT'
        },
      },
    });

    const applicationsByStatus = await prisma.application.groupBy({
      by: ["status"],
      where: {
        status: {
          not: "DRAFT", // Exclude 'DRAFT' status
        },
      },
      _count: true,
    });

    res.json({ totalApplications, applicationsByStatus });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Backend Endpoint: /api/grants-stats
router.get("/dashboard/grants-stats", async (req, res) => {
  try {
    const totalGrants = await prisma.grant.count();

    const totalAmountResult = await prisma.grant.aggregate({
      _sum: { amount: true },
    });
    const totalAmountLeftResult = await prisma.grant.aggregate({
      _sum: { amountLeft: true },
    });
    const totalMoneySpentResult = await prisma.invoice.aggregate({
      _sum: { amount: true },
    });

    const totalAmount = totalAmountResult._sum.amount || 0;
    const totalAmountLeft = totalAmountLeftResult._sum.amountLeft || 0;
    const totalMoneySpent = totalMoneySpentResult._sum.amount || 0;

    res.json({ totalGrants, totalAmount, totalAmountLeft, totalMoneySpent });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Backend Endpoint: /api/payments-overview
router.get("/dashboard/payments-overview", async (req, res) => {
  try {
    // Get pending payments for the current month
    const startOfMonth = new Date(new Date().setDate(1));
    const endOfMonth = new Date(
      new Date(startOfMonth).setMonth(startOfMonth.getMonth() + 1)
    );

    const paymentsOverview = await prisma.payment.findMany({
      where: {
        status: "PENDING",
        dueDate: {
          gte: startOfMonth,
          lt: endOfMonth,
        },
      },
      select: {
        id: true,
        amount: true,
        dueDate: true,
      },
      orderBy: {
        dueDate: "asc", // Sort by dueDate in ascending order (old to new)
      },
    });

    res.json(paymentsOverview);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Backend Endpoint: /api/admin/recent-activities
// Backend Endpoint: /recent-activities
router.get("/dashboard/recent-activities", async (req, res) => {
  try {
    // Latest Applications
    const latestApplications = await prisma.application.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        student: {
          select: {
            personalInfo: {
              select: {
                basicInfo: {
                  select: { name: true, fatherName: true },
                },
              },
            },
          },
        },
      },
    });

    // Recent Invoices
    const recentInvoices = await prisma.invoice.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        payment: {
          select: {
            userGrant: {
              select: {
                user: {
                  select: {
                    personalInfo: {
                      select: {
                        basicInfo: {
                          select: { name: true, fatherName: true },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    // Recent Open Tickets
    const recentTickets = await prisma.ticket.findMany({
      where: { status: "OPEN" },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        user: {
          select: {
            personalInfo: {
              select: {
                basicInfo: {
                  select: { name: true, fatherName: true },
                },
              },
            },
          },
        },
      },
    });

    res.json({
      latestApplications,
      recentInvoices,
      recentTickets,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//tickets
router.get("/tickets/", async (req, res) => {
  try {
    const { limit, skip } = getPagination(req);
    const { tickets, total } = await getAllTickets(
      req.query,
      parseInt(skip),
      parseInt(limit)
    );
    const totalPages = Math.ceil(+total / +limit);
    res.json({ data: tickets, total, totalPages });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching tickets" });
  }
});

// Get single ticket details
router.get("/tickets/:ticketId/messages", async (req, res) => {
  const ticketId = parseInt(req.params.ticketId);
  const skip = parseInt(req.query.skip) || 0;
  const take = parseInt(req.query.take) || 50;
  try {
    const ticket = await getMessagesByTicket(ticketId, skip, take);
    res.json({ data: ticket });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching ticket details" });
  }
});

// Update ticket status (mark as closed)
router.put("/tickets/:ticketId/status", async (req, res) => {
  const { ticketId } = req.params;
  const { status } = req.body;
  try {
    const updatedTicket = await updateTicketStatus(parseInt(ticketId), status);
    await createNotification(
      updatedTicket.userId,
      `${
        status === "OPEN"
          ? "تم فتح تذكرتك من جديد يمكنك ارسال المزيد من الاستفسارات"
          : "تم غلق تذكرتك من قبل المسئول"
      }`,
      `/dashboard/tickets/${ticketId}`,
      "TICKET_UPDATE"
    );

    res.json({ message: "تم اغلاق التذكرة بنجاح", data: updatedTicket });
  } catch (error) {
    res.status(500).json({ message: "حدثت مشكلة ما برجاء اعد المحاولة لاحقا" });
  }
});

// Send a message on a ticket
router.post("/tickets/:ticketId/messages", async (req, res) => {
  try {
    const userId = req.user.id;
    const ticketId = parseInt(req.params.ticketId);
    const { content } = req.body;
    if (!content || content.trim() === "") {
      return res.status(400).json({ message: "المحتوى مطلوب." });
    }
    const message = await createMessage(userId, ticketId, content);
    await createNotification(
      message.studentId,
      `لديك ردود جديد علي تذكرتك من قبل المسئول #${ticketId}`,
      `/dashboard/tickets/${ticketId}`,
      "TICKET_UPDATE"
    );

    res.status(201).json({
      message: "تم إرسال الرسالة بنجاح.",
      data: message,
    });
  } catch (error) {
    console.log(error, "error");
    res
      .status(500)
      .json({ message: "خطأ في إرسال الرسالة.", error: error.message });
  }
});

// webiste documents
router.post("/documents", async (req, res) => {
  try {
    const document = await createNewDocument(req.body);
    res.status(200).json({ data: document, message: "تم إضافة المستند بنجاح" });
  } catch (error) {
    res.status(500).json({ message: "حدث خطأ أثناء إضافة المستند" });
  }
});
router.put("/documents/:documentId", async (req, res) => {
  try {
    const document = await editDocument(
      parseInt(req.params.documentId),
      req.body
    );
    res.status(200).json({ data: document, message: "تم التعديل بنجاح" });
  } catch (error) {
    res.status(500).json({ message: "حدث خطأ أثناء تعديل المستند" });
  }
});
router.delete("/documents/:documentId", async (req, res) => {
  try {
    const document = await deleteDocument(parseInt(req.params.documentId));
    res.status(200).json({ data: document, message: "تم حذف المستند بنجاح" });
  } catch (error) {
    res.status(500).json({ message: "حدث خطأ أثناء حذف المستند" });
  }
});
router.post("/fixed-data", async (req, res) => {
  try {
    const type = req.query.type;
    req.body.type = type;
    const data = await createNewFixedData(req.body);
    console.log(data, "data");
    res.status(200).json({ data, message: "تم انشاء البيانات بنجاح" });
  } catch (error) {
    console.log(error, "error");
    res.status(500).json({ message: "حدث خطأ أثناء انشاء البيانات" });
  }
});
router.put("/fixed-data/:dataId", async (req, res) => {
  try {
    const data = await editFixedData(parseInt(req.params.dataId), req.body);
    console.log(data, "data");

    res.status(200).json({ data, message: "تم تعديل البيانات بنجاح" });
  } catch (error) {
    res.status(500).json({ message: "حدث خطأ أثناء تعديل البيانات" });
  }
});

router.post("/faqs", async (req, res) => {
  try {
    const faq = await createNewFAQ(req.body);
    res.status(200).json({ data: faq, message: "تم انشاء السؤال بنجاح" });
  } catch (error) {
    res.status(500).json({ message: "حدث خطأ أثناء إضافة السؤال" });
  }
});
router.put("/faqs/:faqId", async (req, res) => {
  try {
    const faq = await editFAQ(parseInt(req.params.faqId), req.body);
    res.status(200).json({ data: faq, message: "تم تعديل السؤال بنجاح" });
  } catch (error) {
    res.status(500).json({ message: "حدث خطأ أثناء تعديل السؤال" });
  }
});

router.delete("/faqs/:faqId", async (req, res) => {
  try {
    const faq = await deleteFAQ(parseInt(req.params.faqId));
    res.status(200).json({ data: faq, message: "تم حذف السؤال بنجاح" });
  } catch (error) {
    res.status(500).json({ message: "حدث خطأ أثناء حذف السؤال" });
  }
});
export default router;

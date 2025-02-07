import { Router } from "express";
import {
  getPagination,
  getStudentIdByAppId,
  getSuperVisorIdByAppId,
  handlePrismaError,
  verifyTokenAndHandleAuthorization,
} from "../services/utility.js";

import {
  approveApplication,
  getApplicationById,
  getApplications,
  getGrantsProjects,
  getSpecificApplicationField,
  getUser,
  markApplicationUnComplete,
  markApplicationUnderReview,
  rejectApplication,
} from "../services/adminServices.js";
import { getPersonalInfo } from "../services/studentsServices.js";
import { createNotification } from "../services/utility.js";
import {
  createUserGrant,
  getDocuments,
  getFAQ,
  getFixedData,
  getInvoiceById,
  getInvoices,
  getPendingPaymentsByMonth,
  getUserGrants,
  processPayment,
} from "../services/shared.js";
import dayjs from "dayjs";

const router = Router();
router.use((req, res, next) => {
  verifyTokenAndHandleAuthorization(req, res, next, "SHARED");
});

router.get("/students", async (req, res) => {
  const searchParams = req.query;
  const { limit, skip } = getPagination(req);

  try {
    const { users, total } = await getUser(searchParams, limit, skip);
    const totalPages = Math.ceil(total / limit);

    if (!users) {
      return res.status(404).json({ message: "لا يوجد طلاب" });
    }
    res.status(200).json({ data: users, totalPages, total });
  } catch (error) {
    console.error("Error fetching personal info:", error);
    res.status(500).json({ message: "حدث خطأ أثناء جلب  الطلاب" });
  }
});

router.get("/students/:studentId", async (req, res) => {
  const { studentId } = req.params;
  try {
    if (!studentId) {
      return res.status(404).json({ message: "لا يوجد طالب بهذا المعرف" });
    }
    const studentPersonalInfo = await getPersonalInfo(studentId);
    res.status(200).json({ data: studentPersonalInfo });
  } catch (error) {
    console.error("Error fetching personal info:", error);
    res.status(500).json({ message: "حدث خطأ أثناء جلب  الطالب" });
  }
});

router.get("/grants/projects", async (req, res) => {
  const searchParams = req.query;
  const { limit, skip } = getPagination(req);

  try {
    const { grants, total } = await getGrantsProjects(
      searchParams,
      limit,
      skip
    );
    const totalPages = Math.ceil(total / limit);

    if (!grants) {
      return res.status(404).json({ message: "لا يوجد منح" });
    }
    res.status(200).json({ data: grants, totalPages, total });
  } catch (error) {
    console.error("Error fetching supervisors:", error);
    res.status(500).json({ message: "حدث خطأ أثناء جلب  المنح " });
  }
});

router.get("/grants/applications/approved", async (req, res) => {
  const searchParams = req.query;
  const { limit, skip } = getPagination(req);
  try {
    const { applications, total } = await getApplications(
      searchParams,
      limit,
      skip,
      "APPROVED"
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
router.get("/grants/applications/updated", async (req, res) => {
  const searchParams = req.query;
  const { limit, skip } = getPagination(req);
  try {
    const { applications, total } = await getApplications(
      searchParams,
      limit,
      skip,
      "UPDATED"
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
router.get("/grants/applications/uncompleted", async (req, res) => {
  const searchParams = req.query;
  const { limit, skip } = getPagination(req);
  try {
    const { applications, total } = await getApplications(
      searchParams,
      limit,
      skip,
      "UN_COMPLETE"
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
router.get("/grants/applications/underreview", async (req, res) => {
  const searchParams = req.query;
  const { limit, skip } = getPagination(req);
  try {
    const { applications, total } = await getApplications(
      searchParams,
      limit,
      skip,
      "UNDER_REVIEW"
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

router.get("/grants/applications/rejected", async (req, res) => {
  const searchParams = req.query;
  const { limit, skip } = getPagination(req);
  try {
    const { applications, total } = await getApplications(
      searchParams,
      limit,
      skip,
      "REJECTED"
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
router.get("/grants/applications/student/:appId", async (req, res) => {
  const { appId } = req.params;
  try {
    const application = await getApplicationById(appId);
    if (!application) {
      return res.status(404).json({ message: "لا يوجد طلب منحة" });
    }
    res.status(200).json({ data: application });
  } catch (error) {
    console.error("Error fetching supervisors:", error);
    res.status(500).json({ message: "حدث خطأ أثناء جلب  طلب منحة " });
  }
});
router.get(
  "/grants/applications/student/:appId/improvementRequests",
  async (req, res) => {
    const { appId } = req.params;
    try {
      const application = await getSpecificApplicationField(
        appId,
        "improvementRequests"
      );
      if (!application) {
        return res.status(404).json({ message: "لا يوجد طلب منحة" });
      }
      res.status(200).json({ data: application });
    } catch (error) {
      console.error("Error fetching supervisors:", error);
      res.status(500).json({ message: "حدث خطأ أثناء جلب  طلب منحة " });
    }
  }
);
router.get(
  "/grants/applications/student/:appId/askedFields",
  async (req, res) => {
    const { appId } = req.params;
    try {
      const application = await getSpecificApplicationField(
        appId,
        "askedFields"
      );
      if (!application) {
        return res.status(404).json({ message: "لا يوجد طلب منحة" });
      }
      res.status(200).json({ data: application });
    } catch (error) {
      console.error("Error fetching applications asked:", error);
      res.status(500).json({ message: "حدث خطأ أثناء جلب  طلب منحة " });
    }
  }
);
router.get("/grants/applications/student/:appId/updates", async (req, res) => {
  const { appId } = req.params;
  try {
    const application = await getSpecificApplicationField(appId, "updates");
    if (!application) {
      return res.status(404).json({ message: "لا يوجد طلب منحة" });
    }
    res.status(200).json({ data: application });
  } catch (error) {
    console.error("Error fetching applications asked:", error);
    res.status(500).json({ message: "حدث خطأ أثناء جلب  طلب منحة " });
  }
});
router.get(
  "/grants/applications/student/:studentId/personal",
  async (req, res) => {
    const { studentId } = req.params;
    try {
      const studentPersonalInfo = await getPersonalInfo(studentId);
      if (!studentPersonalInfo) {
        return res.status(404).json({ message: "لا يوجد  طالب" });
      }
      res.status(200).json({ data: studentPersonalInfo });
    } catch (error) {
      console.error("Error fetching supervisors:", error);
      res.status(500).json({ message: "حدث خطأ أثناء جلب  بيانات الطالب  " });
    }
  }
);
router.post("/grants/applications/student/:appId", async (req, res) => {
  const body = req.body;
  const { appId } = req.params;
  let data = {};
  let message = "";
  try {
    if (!body) {
      res.status(404).json({ message: "لا يوجد بيانات مرسله" });
    }
    const action = body.action;
    if (action === "approve") {
      if (!body.supervisorId && !body.notAdmin) {
        res
          .status(404)
          .json({ message: "يجب اختيار مشرف لهذا الطلب حتي يقبل" });
      }
      data = await approveApplication(
        appId,
        !body.notAdmin && body.supervisorId
      );
      message = "تم قبول الطلب يمكنك تعين منحه من قسم طلبات بدون مشروع  ";
      const studentId = await getStudentIdByAppId(appId);
      await createNotification(
        studentId,
        ` تمت الموافقه علي طلبك وسيتم اختيار منحه له قريبا واخطارك معرف الطلب : #${appId}`,
        null,
        "APPLICATION_APPROVED"
      );
      await createNotification(
        null,
        ` تمت الموافقه علي طلب من قبل احد المشرفين وسيتم اخطارك عند تعين منحه لهذا الطلب معرف الطلب : #${appId}`,
        null,
        "APPLICATION_APPROVED",
        true
      );
    }
    if (action === "reject") {
      data = await rejectApplication(appId, body.rejectReason);
      message = "تم رفض الطلب وسيتم اخطار الطالب بسبب الرفض";
      const studentId = await getStudentIdByAppId(appId);
      await createNotification(
        studentId,
        `للاسف تم رفض طلبك سبب الرفض : ${body.rejectReason}`,
        null,
        "APPLICATION_REJECTED"
      );
      await createNotification(
        null,
        `تم رفض طلب من قبل المشرف معرف الطلب : #${appId}`,
        `/dashboard/apps/view/${appId}/${studentId}`,
        "APPLICATION_REJECTED",
        true
      );
    }
    if (action === "review") {
      data = await markApplicationUnderReview(appId, body.supervisorId);
      message = "تم تعين المشرف لمراجعة الطلب وسيتم اخطاره";
      const studentId = await getStudentIdByAppId(appId);
      await createNotification(
        studentId,
        `تم تعين مشرف لمراجعة طلبك وسيتم اخطارك بنتيجة المراجعة قريبا`,
        null,
        "APPLICATION_UNDER_REVIEW"
      );
      const superVisorId = await getSuperVisorIdByAppId(appId);
      await createNotification(
        superVisorId,
        `تم تعينك لمراجعة طلب جديد معرف الطلب : #${appId}`,
        `/dashboard/apps/view/${appId}/${studentId}`,
        "APPLICATION_UNDER_REVIEW"
      );
    }
    if (action === "uncomplete" || action === "uncomplete_with_edit") {
      data = await markApplicationUnComplete(
        appId,
        body.askFields,
        action === "uncomplete_with_edit"
      );
      message =
        "تم تعين الطلب كغير مكتمل وسيتم اخطار الطلب  بالتحديثات المطلوبه";
      const studentId = await getStudentIdByAppId(appId);
      await createNotification(
        studentId,
        `قم احد المشرفين بمراجعة طلبك وتم تعينه كطلب غير مكتمل (هذا لا يعني ان طلبك مرفوض ولكن هناك بعض التعديلات التي يجب عليك تعديلها ثم سيتم مراجعة طلبك مره اخري)`,
        `/dashboard/applications/uncomplete/${appId}/save`,
        "APPLICATION_UN_COMPLETE"
      );
    }
    res.status(200).json({ data, message });
  } catch (error) {
    handlePrismaError(res, error);
  }
});

router.get(
  "/grants/applications/student/:appId/user-grant",
  async (req, res) => {
    const { appId } = req.params;
    try {
      const userGrants = await getUserGrants(appId);
      if (!userGrants) {
        return res.status(404).json({ message: "لا يوجد  لهذا الطالب منح" });
      }
      res.status(200).json({ data: userGrants });
    } catch (error) {
      console.error("Error fetching supervisors:", error);
      res.status(500).json({ message: "حدث خطأ أثناء جلب  بيانات الطالب  " });
    }
  }
);
router.post(
  "/grants/applications/student/:appId/user-grant",
  async (req, res) => {
    const body = req.body;
    const { appId } = req.params;
    try {
      if (!body) {
        res.status(404).json({ message: "لا يوجد بيانات مرسله" });
      }
      const data = await createUserGrant(body, appId);
      const studentId = await getStudentIdByAppId(appId);
      await createNotification(
        studentId,
        `مبروك تمت الموافقه علي طلبك وتم تعين منحة لك`,
        `/dashboard/applications/view/${appId}`,
        "APPLICATION_COMPLETED"
      );
      await createNotification(
        null,
        `تمت الموافقه علي طلب وتم تعين منحة لهذا الطلب بواسطة مشرف  معرف الطلب : #${appId}`,
        `/dashboard/apps/view/${appId}/${studentId}`,
        "APPLICATION_COMPLETED",
        true
      );

      res.status(200).json({ data, message: "تم انشاء منحة للطالب بنجاح" });
    } catch (error) {
      handlePrismaError(res, error);
    }
  }
);
router.get("/payments", async (req, res) => {
  const { month, userId, paymentId, status } = req.query;
  const startOfMonth = dayjs(month).startOf("month").toDate();
  const endOfMonth = dayjs(month).endOf("month").toDate();
  try {
    const payments = await getPendingPaymentsByMonth(
      startOfMonth,
      endOfMonth,
      status,
      userId,
      paymentId
    );
    if (!payments) {
      return res.status(404).json({ message: "لا يوجد دفعات" });
    }
    res.status(200).json({ data: payments });
  } catch (error) {
    console.error("Error fetching :", error);
    res.status(500).json({ message: "حدث خطأ أثناء جلب الدفعات  " });
  }
});
router.put("/payments/pay/:paymentId", async (req, res) => {
  const { paymentId } = req.params;
  const { amount, paidAt, isAdmin, studentId } = req.body;

  try {
    const payment = await processPayment(
      Number(paymentId),
      +amount,
      new Date(paidAt)
    );
    await createNotification(
      +studentId,
      `تم دفع مبلغ قدرة ${amount} بتاريخ , ${dayjs(paidAt).format(
        "DD/MM/YY"
      )} `,
      null,
      "PAYMENT_COMPLETED"
    );
    if (!isAdmin) {
      await createNotification(
        null,
        ` تم دفع مبلغ قدرة ${amount} بتاريخ ${dayjs(paidAt).format(
          "DD/MM/YY"
        )} , وتم اصدار فاتورة رقم الفاتورة ${payment.invoiceNumber}`,
        `dashboard/invoices?invoiceId=${payment.invoiceId}`,
        "PAYMENT_COMPLETED",
        true
      );
    }

    return res.status(200).json({
      message: "تم الدفع بنجاح",
      data: payment,
    });
  } catch (error) {
    console.error("Error processing payment:", error);
    return res.status(500).json({ message: error.message });
  }
});

router.get("/invoices", async (req, res) => {
  const filters = req.query;
  const userId = req.user.id;
  const invoices = await getInvoices(
    filters,
    filters.pageNumber,
    filters.size,
    userId
  );
  res.json(invoices);
});

// Route to fetch a single invoice by ID
router.get("/invoices/:id", async (req, res) => {
  const invoiceId = parseInt(req.params.id, 10);
  const filters = req.query;

  const userId = req.user?.id;
  const invoice = await getInvoiceById(invoiceId, userId, filters.role);
  if (invoice) {
    res.json(invoice);
  } else {
    res.status(404).send("Invoice not found");
  }
});

// webiste fixed data and documents
router.get("/documents", async (req, res) => {
  try {
    const documents = await getDocuments();
    res.json({ data: documents });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get("/fixed-data", async (req, res) => {
  try {
    const type = req.query.type;
    const fixedData = await getFixedData(type);
    res.json({ data: fixedData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get("/faqs", async (req, res) => {
  try {
    const faq = await getFAQ();
    res.json({ data: faq });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

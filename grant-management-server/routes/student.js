import {Router} from 'express';
import {
    getPagination, getStudentIdByAppId, getSuperVisorIdByAppId,
    handlePrismaError,
    verifyTokenAndHandleAuthorization,
} from "../services/utility.js";
import {
    checkIfFieldsAreEmpty,
    createDraftApplicationModel, createMessage,
    createNewApplication, createNewUpdate, createTicket,
    deleteDraftApplication,
    deleteSibling,
    getApplicationModel, getImprovementRequestsByModel, getMessagesByTicket,
    getPendingFieldsAndRequests,
    getPersonalInfo,
    getStudentApplications, getTicketsByUser, handleUpdateUnCompletedFields,
    submitApplication,
    updateApplicationModel,
    updateAskedFieldsAndImprovementRequests,
    updatePersonalInfo
} from "../services/studentsServices.js";
import prisma from '../prisma/prisma.js';

import {getApplicationById, getSpecificApplicationField} from "../services/adminServices.js";
import {createNotification} from "../services/utility.js";
import {getUserGrants} from "../services/shared.js";

const router = Router();

router.use((req, res, next) => {
    verifyTokenAndHandleAuthorization(req, res, next, "STUDENT");
});


router.get('/:userId/personal/', async (req, res) => {
    const {userId} = req.params;
    try {

        const personalInfo = await getPersonalInfo(userId);
        if (!personalInfo) {
            return res.status(404).json({message: 'المعلومات الشخصية غير موجودة'});
        }
        res.status(200).json({data: personalInfo});
    } catch (error) {
        console.error('Error fetching personal info:', error);
        res.status(500).json({message: 'حدث خطأ أثناء جلب المعلومات الشخصية'});
    }
});
// Route to update specific personal info of a specific user
router.put('/personal/:userId', async (req, res) => {
    const {userId} = req.params;
    const {model, updateData} = req.body; // model can be 'basicInfo', 'contactInfo', or 'studyInfo'

    try {
        if (updateData.hasDisability === "yes") updateData.hasDisability = true
        if (updateData.hasDisability === "no") updateData.hasDisability = false
        const updatedInfo = await updatePersonalInfo(userId, model, updateData);
        if (!updatedInfo) {
            return res.status(404).json({message: 'لم يتم العثور على المعلومات المطلوبة'});
        }
        res.status(200).json({message: 'تم تحديث المعلومات بنجاح', data: updatedInfo});
    } catch (error) {
        console.error('Error updating personal info:', error);
        res.status(500).json({message: 'حدث خطأ أثناء تحديث المعلومات الشخصية'});
    }
});


router.get('/applications', async (req, res) => {
    const {limit, skip} = getPagination(req);
    const studentId = req.user.id;
    try {
        const {applications, total} = await getStudentApplications(studentId, skip, limit);

        const totalPages = Math.ceil(total / limit);
        res.status(200).json({data: applications, total, totalPages});
    } catch (error) {
        console.log(error, "error in student applications getting data")
        res.status(500).json({message: 'خطأ في جلب الطلبات', error: error.message});
    }
});
router.post("/applications/draft", async (req, res) => {
    const studentId = req.user.id;
    try {
        const id = await createNewApplication(studentId)
        res.status(200).json({id, message: "تم انشاء طلب  منحة جديدة جاري اعادة توجيهك لملئ البيانات"});
    } catch (error) {
        console.log(error, "error in creating application ")
        handlePrismaError(res, error)
    }
})
router.delete("/applications/draft/:appId", async (req, res) => {
    const {appId} = req.params;
    try {
        await deleteDraftApplication(+appId)
        res.status(200).json({message: "تم حذف الطلب بنجاح"});
    } catch (error) {
        console.log(error, "error in deleting student application ")
        handlePrismaError(res, error)
    }
})
router.get('/applications/draft/:appId', async (req, res) => {
    const {appId} = req.params;
    const {model, status} = req.query;
    try {
        if (!model) {
            return res.status(400).json({message: "مشكلة في جلب البيانات"});
        }
        const data = await getApplicationModel(appId, model, status);
        if (!data) {
            return res.status(200).json({data: null});
        }

        res.status(200).json({data});
    } catch (error) {
        console.log(error, "Error fetching draft application model data");
        handlePrismaError(res, error);
    }
});
router.post('/applications/draft/:appId', async (req, res) => {
    const {appId} = req.params;
    const {model} = req.query;
    const inputData = req.body;
    try {
        if (!model) {
            return res.status(400).json({message: "بارامتر النموذج مطلوب"});
        }
        if (!inputData) {
            return res.status(400).json({message: "بيانات المدخلات مطلوبة"});
        }

        const createdData = await createDraftApplicationModel(appId, model, inputData);
        if (model === "siblings") {

            await handleUpdateUnCompletedFields(appId, model)
        }

        res.status(200).json({message: "تم حفظ البيانات بنجاح", data: createdData});
    } catch (error) {
        console.log(error, "خطأ في تحديث بيانات نموذج طلب المسودة");
        handlePrismaError(res, error);
    }
});
router.put('/applications/draft/:appId', async (req, res) => {
    const {appId} = req.params;
    const {model} = req.query;
    const inputData = req.body;
    try {
        if (!model) {
            return res.status(400).json({message: "Model is required"});
        }
        if (!inputData) {
            return res.status(400).json({message: "بيانات المدخلات مطلوبة"});
        }
        const updatedData = await updateApplicationModel(appId, model, inputData);

        await handleUpdateUnCompletedFields(appId, model)

        res.status(200).json({
            message: "تم تحديث البيانات بنجاح",
            data: model === "siblings" ? updatedData : updatedData[model]
        });
    } catch (error) {
        console.log(error, "خطأ في تحديث بيانات نموذج طلب المسودة");
        handlePrismaError(res, error);
    }
});

router.put('/applications/draft/apps/siblings/:siblingId', async (req, res) => {
    const {siblingId} = req.params;
    const inputData = req.body;
    try {
        if (!inputData) {
            return res.status(400).json({message: "بيانات المدخلات مطلوبة"});
        }
        const updatedData = await updateApplicationModel(siblingId, "siblings", inputData);
        console.log("are we siblingId")
        await handleUpdateUnCompletedFields(updatedData.applicationId, "siblings")

        res.status(200).json({message: "تم تحديث البيانات بنجاح", data: updatedData});
    } catch (error) {
        console.log(error, "خطأ في تحديث بيانات نموذج طلب المسودة");
        handlePrismaError(res, error);
    }
});

router.delete('/applications/draft/apps/siblings/:siblingId', async (req, res) => {
    const {siblingId} = req.params;
    try {
        console.log("did w e delete")
        const updatedData = await deleteSibling(siblingId);
        await handleUpdateUnCompletedFields(updatedData.applicationId, "siblings")

        res.status(200).json({message: "تمت عملية الحذف بنجاح", data: updatedData});
    } catch (error) {
        console.log(error, "خطأ في تحديث بيانات نموذج طلب المسودة");
        handlePrismaError(res, error);
    }
});
router.get('/applications/:appId/submit', async (req, res) => {
    const {appId} = req.params;
    try {
        const missingFields = await checkIfFieldsAreEmpty(appId);
        if (missingFields.length > 0) {
            return res.status(400).json({
                message: "لا  يمكن حفظ الطلب لانه يوجد بيناتات لم يتم ملئها بعد",
                data: missingFields
            });
        }

        res.status(200).json({message: "تم مراجعة بياناتك والتاكد ان كل البيانات مكتملة", data: []});
    } catch (error) {
        res.status(500).json({message: 'حدث خطأ', error: error.message});
    }
});
router.get('/applications/:appId/submit/uncomplete', async (req, res) => {
    const {appId} = req.params;
    try {
        const data = await getPendingFieldsAndRequests(appId, "UN_COMPLETE");

        return res.status(400).json({
            message: "لديك بعض البيانات التي بحاجه الي تعديل او المشرف يريد المزيد من الاضافات",
            data
        });
    } catch (error) {
        res.status(500).json({message: 'حدث خطأ', error: error.message});
    }
});
router.get('/applications/:appId/improvement-requests-model/:model', async (req, res) => {
    const {appId, model} = req.params;
    try {
        const improvementRequests = await getImprovementRequestsByModel(appId, model);

        if (!improvementRequests.length) {
            return res.status(200).json({message: 'لا توجد طلبات تحسين لهذا النموذج.', data: []});
        }
        res.status(200).json({message: 'تم جلب طلبات التحسين بنجاح.', data: improvementRequests});


    } catch (error) {
        res.status(500).json({message: 'حدث خطأ', error: error.message});
    }
});
router.post('/applications/:appId/submit', async (req, res) => {
    const {appId} = req.params;

    try {
        const missingFields = await checkIfFieldsAreEmpty(appId);

        if (missingFields.length > 0) {
            return res.status(400).json({
                message: "لم يمكن حفظ الطلب لانه يوجد بيناتات لم يتم ملئها بعد",
                data: missingFields
            });
        }

        const submittedApplication = await submitApplication(appId);
        const studentId = await getStudentIdByAppId(appId)
        await createNotification(null, "تم انشاء طلب منحة جديد", `/dashboard/apps/view/${appId}/${studentId}`, "APPLICATION_NEW", true)
        res.status(200).json({
            message: "تم تقديم الطلب بنجاح",
            data: submittedApplication
        });
    } catch (error) {
        res.status(500).json({message: 'حدث خطأ', error: error.message});
    }
});

router.post('/applications/:appId/submit/uncomplete', async (req, res) => {
    const {appId} = req.params;
    const body = req.body
    try {
        const submittedApplication = await updateAskedFieldsAndImprovementRequests(appId, body.askedFields);
        const supervisorId = await getSuperVisorIdByAppId(appId)
        const studentId = await getStudentIdByAppId(appId)

        await createNotification(supervisorId, `تم تحديث طلب منحة من قبل الطالب (معرف الطلب:#${appId})`, `/dashboard/apps/view/${appId}/${studentId}`, "APPLICATION_RESPONSE")
        await createNotification(null, `تم تحديث طلب منحة من قبل الطالب (معرف الطلب:#${appId})`, `/dashboard/apps/view/${appId}/${studentId}`, "APPLICATION_RESPONSE", true)

        res.status(200).json({
            message: "تم تقديم الطلب بنجاح",
            data: submittedApplication
        });
    } catch (error) {
        res.status(500).json({message: `${error.message}`, error: error.message});
    }
});
router.get('/applications/:appId/approved', async (req, res) => {
    const {appId} = req.params
    try {
        const application = await getApplicationById(appId);
        if (!application) {
            return res.status(404).json({message: 'لا يوجد طلب منحة'});
        }
        res.status(200).json({data: application});
    } catch (error) {
        console.error('Error fetching supervisors:', error);
        res.status(500).json({message: 'حدث خطأ أثناء جلب  طلب منحة '});
    }
});
router.get('/applications/:appId/check', async (req, res) => {
    const {appId} = req.params;
    const {status} = req.query;
    try {
        const application = await prisma.application.findUnique({
            where: {id: Number(appId), status}
        });

        if (!application) {
            if (status === "DRAFT") {
                return res.status(404).json({error: 'هذا الطلب غير موجود او تم ارساله للمشرف'});
            } else if (status === "UN_COMPLETE") {
                return res.status(404).json({error: 'هذا الطلب تم تحديثة وسيتم مراجعته م قبل الادمن'});
            } else if (status === "APPROVED") {
                return res.status(404).json({error: 'غير مصرح لك برؤية هذا الطلب في الوقت الحالي'});
            }
        }
        res.status(200).json({data: application});
    } catch (error) {
        console.error(`Error fetching application ${appId}:`, error);
        res.status(500).json({error: 'حدث خطأ أثناء جلب الطلب'});
    }
});
router.get('/applications/:appId/improvementRequests', async (req, res) => {
    const {appId} = req.params
    try {
        const application = await getSpecificApplicationField(appId, "improvementRequests");
        if (!application) {
            return res.status(404).json({message: 'لا يوجد طلب منحة'});
        }
        res.status(200).json({data: application});
    } catch (error) {
        console.error('Error fetching supervisors:', error);
        res.status(500).json({message: 'حدث خطأ أثناء جلب  طلب منحة '});
    }
});
router.get('/applications/:appId/askedFields', async (req, res) => {
    const {appId} = req.params
    try {
        const application = await getSpecificApplicationField(appId, "askedFields");
        if (!application) {
            return res.status(404).json({message: 'لا يوجد طلب منحة'});
        }
        res.status(200).json({data: application});
    } catch (error) {
        console.error('Error fetching applications asked:', error);
        res.status(500).json({message: 'حدث خطأ أثناء جلب  طلب منحة '});
    }
});
router.get('/applications/:appId/updates', async (req, res) => {
    const {appId} = req.params
    try {
        const application = await getSpecificApplicationField(appId, "updates");
        if (!application) {
            return res.status(404).json({message: 'لا يوجد طلب منحة'});
        }
        res.status(200).json({data: application});
    } catch (error) {
        console.error('Error fetching applications asked:', error);
        res.status(500).json({message: 'حدث خطأ أثناء جلب  طلب منحة '});
    }
});
router.post('/applications/:appId/updates', async (req, res) => {
          const {appId} = req.params;
          const body = req.body
          try {
              const update = await createNewUpdate(appId, body);
              const supervisorId = await getSuperVisorIdByAppId(appId)
              const studentId = await getStudentIdByAppId(appId)

              await createNotification(supervisorId, `تم اضافة تحديث جديد علي طلب منحة من قبل الطالب (معرف الطلب:#${appId})`, `/dashboard/apps/view/${appId}/${studentId}`, "APPLICATION_UPDATE")

              res.status(200).json({
                  message: "تم اضافة تحديث جديد",
                  data: update
              });
          } catch (error) {
              handlePrismaError(error)
          }
      }
)
router.get('/applications/:appId/user-grant', async (req, res) => {
    const {appId} = req.params
    try {
        const userGrants = await getUserGrants(appId);
        if (!userGrants) {
            return res.status(404).json({message: 'لا يوجد  لهذا الطالب منح'});
        }
        res.status(200).json({data: userGrants});
    } catch (error) {
        console.error('Error fetching supervisors:', error);
        res.status(500).json({message: 'حدث خطأ أثناء جلب  بيانات الطالب  '});
    }
});
// Backend Endpoint: /student/dashboard/applications-stats
router.get('/dashboard/applications-stats', async (req, res) => {
    try {
        const studentId = req.user.id;

        const totalApplications = await prisma.application.count({
            where: {
                studentId: studentId,
                status: {
                    not: 'DRAFT', // Exclude applications with status 'DRAFT'
                },
            },
        });

        const applicationsByStatus = await prisma.application.groupBy({
            by: ['status'],
            where: {
                studentId: studentId,
                status: {
                    not: 'DRAFT', // Exclude 'DRAFT' status
                },
            },
            _count: true,
        });

        res.json({totalApplications, applicationsByStatus});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});
// Backend Endpoint: /student/dashboard/grants-stats
router.get('/dashboard/grants-stats', async (req, res) => {
    try {
        const studentId = req.user.id;

        // Total user grants
        const totalUserGrants = await prisma.userGrant.count({
            where: {
                userId: studentId,
            },
        });

        // Total payments amount and amount left
        const totalPaymentsResult = await prisma.payment.aggregate({
            _sum: {
                amount: true,
                amountPaid: true,
            },
            where: {
                userGrant: {
                    userId: studentId,
                },
            },
        });

        const totalPaymentsAmount = totalPaymentsResult._sum.amount || 0;
        const totalAmountLeft = totalPaymentsResult._sum.amount - totalPaymentsResult._sum.amountPaid

        // Total amount paid (from invoices)
        const totalInvoicesResult = await prisma.invoice.aggregate({
            _sum: {
                amount: true,
            },
            where: {
                payment: {
                    userGrant: {
                        userId: studentId,
                    },
                },
            },
        });

        const totalAmountPaid = totalInvoicesResult._sum.amount || 0;

        res.json({
            totalUserGrants,
            totalPaymentsAmount,
            totalAmountLeft,
            totalAmountPaid,
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({error: error.message});
    }
});
// Backend Endpoint: /student/dashboard/next-payments
router.get('/dashboard/next-payments', async (req, res) => {
    try {
        const studentId = req.user.id;

        const nextPayments = await prisma.payment.findMany({
            where: {
                userGrant: {
                    userId: studentId,
                },
                status: 'PENDING',
            },
            orderBy: {
                dueDate: 'asc',
            },
            take: 4,
            select: {
                id: true,
                amount: true,
                dueDate: true,
            },
        });

        res.json(nextPayments);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});
// Backend Endpoint: /student/dashboard/recent-invoices
router.get('/dashboard/recent-invoices', async (req, res) => {
    try {
        const studentId = req.user.id;

        const recentInvoices = await prisma.invoice.findMany({
            where: {
                payment: {
                    userGrant: {
                        userId: studentId,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: 5,
            select: {
                id: true,
                amount: true,
                createdAt: true,
            },
        });

        res.json(recentInvoices);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

// Backend Endpoint: /student/tickets
router.get('/tickets', async (req, res) => {
    try {
        const userId = req.user.id;
        const {limit, skip} = getPagination(req);
        const [tickets, total] = await getTicketsByUser(userId, +skip, +limit, req.query);
        const totalPages = Math.ceil(+total / +limit);
        res.json({data: tickets, total, totalPages});
    } catch (error) {
        console.log(error, "err")
        res.status(500).json({message: 'خطأ في جلب التذاكر.', error: error.message});
    }
});

// Create ticket
router.post('/tickets', async (req, res) => {
    try {
        const userId = req.user.id;
        const {title, content} = req.body;

        if (!title || title.trim() === '') {
            return res.status(400).json({message: 'العنوان مطلوب.'});
        }
        if (!content || content.trim() === '') {
            return res.status(400).json({message: 'المحتوى مطلوب.'});
        }

        const ticket = await createTicket(userId, title, content);
        await createNotification(null, `تم انشاء تذكرة جديدة بعنوان ${title}`, `/dashboard/tickets/${ticket.id}`, "NEW_TICKET", true)
        res.status(200).json({
            message: 'تم إنشاء التذكرة بنجاح.',
            data: ticket,
        });
    } catch (error) {
        res.status(500).json({message: 'خطأ في إنشاء التذكرة.', error: error.message});
    }
});

// Get messages for a ticket
router.get('/tickets/:ticketId/messages', async (req, res) => {
    try {
        const userId = req.user.id;
        const ticketId = parseInt(req.params.ticketId);
        const skip = parseInt(req.query.skip) || 0;
        const take = parseInt(req.query.take) || 50;

        const ticketData = await getMessagesByTicket(ticketId, skip, take);

        res.json({
            message: 'تم جلب الرسائل بنجاح.',
            data: ticketData,
        });
    } catch (error) {
        res.status(500).json({message: 'خطأ في جلب الرسائل.', error: error.message});
    }
});

// Create a message for a ticket
router.post('/tickets/:ticketId/messages', async (req, res) => {
    try {
        const userId = req.user.id;
        const ticketId = parseInt(req.params.ticketId);
        const {content} = req.body;
        if (!content || content.trim() === '') {
            return res.status(400).json({message: 'المحتوى مطلوب.'});
        }

        const message = await createMessage(userId, ticketId, content);
        await createNotification(null, `رد جديد علي تذكرة #${ticketId} : ${content}`, `/dashboard/tickets/${ticketId}`, "TICKET_UPDATE", true)

        res.status(201).json({
            message: 'تم إرسال الرسالة بنجاح.',
            data: message,
        });
    } catch (error) {
        console.log(error, "error")
        res.status(500).json({message: 'خطأ في إرسال الرسالة.', error: error.message});
    }
});

export default router;

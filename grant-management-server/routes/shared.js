import {Router} from "express";
import {getPagination, handlePrismaError, verifyTokenAndHandleAuthorization} from "../services/utility.js";
import {
    approveApplication,
    getApplicationById,
    getApplications,
    getGrantsProjects,
    getSpecificApplicationField,
    getUser, markApplicationUnComplete, markApplicationUnderReview, rejectApplication
} from "../services/adminServices.js";
import {getPersonalInfo} from "../services/studentsServices.js";
import {createUserGrant, getUserGrants} from "./supervisor.js";

const router = Router();
router.use((req, res, next) => {
    verifyTokenAndHandleAuthorization(req, res, next, "SHARED");
});

router.get('/students', async (req, res) => {
    const searchParams = req.query;
    const {limit, skip} = getPagination(req);

    try {
        const {users, total} = await getUser(searchParams, limit, skip);
        const totalPages = Math.ceil(total / limit);

        if (!users) {
            return res.status(404).json({message: 'لا يوجد طلاب'});
        }
        res.status(200).json({data: users, totalPages, total});
    } catch (error) {
        console.error('Error fetching personal info:', error);
        res.status(500).json({message: 'حدث خطأ أثناء جلب  الطلاب'});
    }
});

router.get('/students/:studentId', async (req, res) => {
    const {studentId} = req.params
    try {
        if (!studentId) {
            return res.status(404).json({message: 'لا يوجد طالب بهذا المعرف'});
        }
        const studentPersonalInfo = await getPersonalInfo(studentId)
        res.status(200).json({data: studentPersonalInfo});
    } catch (error) {
        console.error('Error fetching personal info:', error);
        res.status(500).json({message: 'حدث خطأ أثناء جلب  الطالب'});
    }
})

router.get('/grants/projects', async (req, res) => {
    const searchParams = req.query;
    const {limit, skip} = getPagination(req);

    try {
        const {grants, total} = await getGrantsProjects(searchParams, limit, skip);
        const totalPages = Math.ceil(total / limit);

        if (!grants) {
            return res.status(404).json({message: 'لا يوجد منح'});
        }
        res.status(200).json({data: grants, totalPages, total});
    } catch (error) {
        console.error('Error fetching supervisors:', error);
        res.status(500).json({message: 'حدث خطأ أثناء جلب  المنح '});
    }
});

router.get('/grants/applications/approved', async (req, res) => {
    const searchParams = req.query;
    const {limit, skip} = getPagination(req);
    try {
        const {applications, total} = await getApplications(searchParams, limit, skip, "APPROVED");
        const totalPages = Math.ceil(total / limit);

        if (!applications) {
            return res.status(404).json({message: 'لا يوجد طلبات حاليا'});
        }
        res.status(200).json({data: applications, totalPages, total});
    } catch (error) {
        console.error('Error fetching supervisors:', error);
        res.status(500).json({message: 'حدث خطأ أثناء جلب  الطلبات '});
    }
});
router.get('/grants/applications/updated', async (req, res) => {
    const searchParams = req.query;
    const {limit, skip} = getPagination(req);
    try {
        const {applications, total} = await getApplications(searchParams, limit, skip, "UPDATED");
        const totalPages = Math.ceil(total / limit);

        if (!applications) {
            return res.status(404).json({message: 'لا يوجد طلبات حاليا'});
        }
        res.status(200).json({data: applications, totalPages, total});
    } catch (error) {
        console.error('Error fetching supervisors:', error);
        res.status(500).json({message: 'حدث خطأ أثناء جلب  الطلبات '});
    }
});
router.get('/grants/applications/uncompleted', async (req, res) => {
    const searchParams = req.query;
    const {limit, skip} = getPagination(req);
    try {
        const {applications, total} = await getApplications(searchParams, limit, skip, "UN_COMPLETE");
        const totalPages = Math.ceil(total / limit);

        if (!applications) {
            return res.status(404).json({message: 'لا يوجد طلبات حاليا'});
        }
        res.status(200).json({data: applications, totalPages, total});
    } catch (error) {
        console.error('Error fetching supervisors:', error);
        res.status(500).json({message: 'حدث خطأ أثناء جلب  الطلبات '});
    }
});
router.get('/grants/applications/underreview', async (req, res) => {
    const searchParams = req.query;
    const {limit, skip} = getPagination(req);
    try {
        const {applications, total} = await getApplications(searchParams, limit, skip, "UNDER_REVIEW");
        const totalPages = Math.ceil(total / limit);

        if (!applications) {
            return res.status(404).json({message: 'لا يوجد طلبات حاليا'});
        }
        res.status(200).json({data: applications, totalPages, total});
    } catch (error) {
        console.error('Error fetching supervisors:', error);
        res.status(500).json({message: 'حدث خطأ أثناء جلب  الطلبات '});
    }
});

router.get('/grants/applications/rejected', async (req, res) => {
    const searchParams = req.query;
    const {limit, skip} = getPagination(req);
    try {
        const {applications, total} = await getApplications(searchParams, limit, skip, "REJECTED");
        const totalPages = Math.ceil(total / limit);

        if (!applications) {
            return res.status(404).json({message: 'لا يوجد طلبات حاليا'});
        }
        res.status(200).json({data: applications, totalPages, total});
    } catch (error) {
        console.error('Error fetching supervisors:', error);
        res.status(500).json({message: 'حدث خطأ أثناء جلب  الطلبات '});
    }
});
router.get('/grants/applications/student/:appId', async (req, res) => {
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
router.get('/grants/applications/student/:appId/improvements', async (req, res) => {
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
router.get('/grants/applications/student/:appId/asked', async (req, res) => {
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
router.get('/grants/applications/student/:appId/updates', async (req, res) => {
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
router.get('/grants/applications/student/:studentId/personal', async (req, res) => {
    const {studentId} = req.params
    try {
        const studentPersonalInfo = await getPersonalInfo(studentId);
        if (!studentPersonalInfo) {
            return res.status(404).json({message: 'لا يوجد  طالب'});
        }
        res.status(200).json({data: studentPersonalInfo});
    } catch (error) {
        console.error('Error fetching supervisors:', error);
        res.status(500).json({message: 'حدث خطأ أثناء جلب  بيانات الطالب  '});
    }
});
router.post('/grants/applications/student/:appId', async (req, res) => {
    const body = req.body
    const {appId} = req.params
    let data = {}
    let message = ""
    try {
        if (!body) {
            res.status(404).json({message: 'لا يوجد بيانات مرسله'});
        }
        const action = body.action;
        if (action === "approve") {
            if (!body.supervisorId && !body.notAdmin) {
                res.status(404).json({message: 'يجب اختيار مشرف لهذا الطلب حتي يقبل'});
            }
            data = await approveApplication(appId, !body.notAdmin && body.supervisorId)
            message = "تم قبول الطلب يمكنك تعين منحه من قسم طلبات بدون مشروع  "
        }
        if (action === "reject") {
            data = await rejectApplication(appId, body.rejectReason)
            message = "تم رفض الطلب وسيتم اخطار الطالب بسبب الرفض"
        }
        if (action === "review") {
            data = await markApplicationUnderReview(appId, body.supervisorId)
            message = "تم تعين المشرف لمراجعة الطلب وسيتم اخطاره"
        }
        if (action === "uncomplete" || action === "uncomplete_with_edit") {
            data = await markApplicationUnComplete(appId, body.askFields, action === "uncomplete_with_edit")
            message = "تم تعين الطلب كغير مكتمل وسيتم اخطار الطلب  بالتحديثات المطلوبه"
        }
        res.status(200).json({data, message});
    } catch (error) {
        handlePrismaError(res, error);
    }
})

router.get('/grants/applications/student/:appId/user-grant', async (req, res) => {
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
router.post('/grants/applications/student/:appId/user-grant', async (req, res) => {
    const body = req.body
    const {appId} = req.params

    try {
        if (!body) {
            res.status(404).json({message: 'لا يوجد بيانات مرسله'});
        }
        const data = await createUserGrant(body, appId)
        res.status(200).json({data, message: "تم انشاء منحة للطالب بنجاح"});
    } catch (error) {
        handlePrismaError(res, error);
    }
})


export default router
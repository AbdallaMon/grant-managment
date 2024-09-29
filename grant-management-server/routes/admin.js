import {Router} from "express";
import {getPagination, handlePrismaError, verifyTokenAndHandleAuthorization} from "../services/utility.js";
import {
    approveApplication,
    assignUserToViewGrant,
    changeUserStatus,
    createNewGrantProject,
    createNonStudentUser,
    deleteGrant,
    editAGrant,
    editNonStudentUser,
    getApplicationById,
    getApplications,
    getGrantsProjects, getSpecificApplicationField,
    getUser,
    getUserViewAccessForAGrant,
    markApplicationUnComplete,
    markApplicationUnderReview,
    rejectApplication,
    removeUserFromViewGrant
} from "../services/adminServices.js";
import {getPersonalInfo} from "../services/studentsServices.js";

const router = Router();

router.use((req, res, next) => {
    verifyTokenAndHandleAuthorization(req, res, next,"ADMIN");
});


router.patch('/students/:studentId', async (req, res) => {
    const {studentId}=req.params
    const {user}=req.body

    try {
        if (!studentId||!user) {
            return res.status(404).json({ message: 'لا يوجد طالب بهذا المعرف' });
        }
        const studentPersonalInfo=await changeUserStatus(user,studentId)
        res.status(200).json({ data: studentPersonalInfo,message:"تم العملية بنجاح" });
    } catch (error) {
        console.error('Error fetching personal info:', error);
        res.status(500).json({ message: 'حدث خطأ أثناء تحديث بيانات الطالب' });
    }
})
router.get('/supervisor', async (req, res) => {
    const searchParams=req.query;
    const { limit, skip } = getPagination(req);

    try {
        const {users,total} = await getUser(searchParams,limit, skip,"SUPERVISOR");
        const totalPages = Math.ceil(total / limit);

        if (!users) {
            return res.status(404).json({ message: 'لا يوجد مشرفين' });
        }
        res.status(200).json({ data: users,totalPages,total });
    } catch (error) {
        console.error('Error fetching supervisors:', error);
        res.status(500).json({ message: 'حدث خطأ أثناء جلب  المشرفين' });
    }
});
router.post('/supervisor', async (req, res) => {
    const user=req.body
    try {
        if (!user) {
            return res.status(404).json({ message: 'لا يوجد بيانات مرسله' });
        }
        const newUser=await createNonStudentUser(user,"SUPERVISOR")
        res.status(200).json({ data: newUser,message:"تم انشاء الحساب بنجاح" });
    } catch (error) {
        console.error('Error fetching personal info:', error);
        if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
            res.status(400).json({ status: 400, message: "هذا البريد الإلكتروني مسجل بالفعل" });
        } else {
            handlePrismaError(res, error);
        }
    }
})
router.put('/supervisor/:supervisorId', async (req, res) => {
    const user=req.body
    const {supervisorId}=req.params

    try {
        if (!user||!supervisorId) {
            return res.status(404).json({ message: 'لا يوجد مشرف بهذا المعرف' });
        }
        const updatedUser=await editNonStudentUser(user,supervisorId)
        res.status(200).json({ data: updatedUser,message:"تم تعديل الحساب بنجاح" });
    } catch (error) {
        console.error('Error fetching personal info:', error);
        if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
            res.status(400).json({ status: 400, message: "هذا البريد الإلكتروني مسجل بالفعل" });
        } else {
            handlePrismaError(res, error);
        }
    }
})
router.patch('/supervisor/:supervisorId', async (req, res) => {
    const {supervisorId}=req.params
    const {user}=req.body

    try {
        if (!supervisorId||!user) {
            return res.status(404).json({ message: 'لا يوجد مشرف  بهذا المعرف' });
        }
        const studentPersonalInfo=await changeUserStatus(user,supervisorId)
        res.status(200).json({ data: studentPersonalInfo,message:"تم العملية بنجاح" });
    } catch (error) {
        console.error('Error fetching personal info:', error);
        res.status(500).json({ message: 'حدث خطأ أثناء تحديث بيانات الطالب' });
    }
})
router.get('/sponsor', async (req, res) => {
    const searchParams=req.query;
    const { limit, skip } = getPagination(req);

    try {
        const {users,total} = await getUser(searchParams,limit, skip,"OTHER");
        const totalPages = Math.ceil(total / limit);

        if (!users) {
            return res.status(404).json({ message: 'لا يوجد حسابات' });
        }
        res.status(200).json({ data: users,totalPages,total });
    } catch (error) {
        console.error('Error fetching supervisors:', error);
        res.status(500).json({ message: 'حدث خطأ أثناء جلب  حسابات الداعمين' });
    }
});
router.post('/sponsor', async (req, res) => {
    const user=req.body
    try {
        if (!user) {
            return res.status(404).json({ message: 'لا يوجد بيانات مرسله' });
        }
        const newUser=await createNonStudentUser(user,user.role)
        res.status(200).json({ data: newUser,message:"تم انشاء الحساب بنجاح" });
    } catch (error) {
        if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
            res.status(400).json({ status: 400, message: "هذا البريد الإلكتروني مسجل بالفعل" });
        } else {
            handlePrismaError(res, error);
        }
    }
})
router.put('/sponsor/:sponsorId', async (req, res) => {
    const user=req.body
    const {sponsorId}=req.params

    try {
        if (!user||!sponsorId) {
            return res.status(404).json({ message: 'لا يوجد حساب  بهذا المعرف' });
        }
        const updatedUser=await editNonStudentUser(user,sponsorId)
        res.status(200).json({ data: updatedUser,message:"تم تعديل الحساب بنجاح" });
    } catch (error) {
        console.error('Error fetching personal info:', error);
        if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
            res.status(400).json({ status: 400, message: "هذا البريد الإلكتروني مسجل بالفعل" });
        } else {
            handlePrismaError(res, error);
        }
    }
})
router.patch('/sponsor/:sponsorId', async (req, res) => {
    const {sponsorId}=req.params
    const {user}=req.body

    try {
        if (!sponsorId||!user) {
            return res.status(404).json({ message: 'لا يوجد حساب  بهذا المعرف' });
        }
        const studentPersonalInfo=await changeUserStatus(user,sponsorId)
        res.status(200).json({ data: studentPersonalInfo,message:"تم العملية بنجاح" });
    } catch (error) {
        res.status(500).json({ message: 'حدث خطأ أثناء تحديث بيانات الحساب' });
    }
})


router.post('/grants/projects', async (req, res) => {
    const grant=req.body
    try {
        if (!grant) {
            return res.status(404).json({ message: 'لا يوجد بيانات مرسله' });
        }
        const newUser=await createNewGrantProject(grant)
        res.status(200).json({ data: newUser,message:"تم انشاء مشروع منحة بنجاح" });
    } catch (error) {
            handlePrismaError(res, error);
    }
})
router.put('/grants/projects/:grantId', async (req, res) => {
    const grant=req.body
    const {grantId}=req.params

    try {
        if (!grant||!grantId) {
            return res.status(404).json({ message: 'لا يوجد منحة  بهذا المعرف' });
        }
        const updatedUser=await editAGrant(grant,grantId)
        res.status(200).json({ data: updatedUser,message:"تم تعديل المنحة بنجاح" });
    } catch (error) {
        handlePrismaError(res, error);
    }
})
router.delete('/grants/projects/:grantId', async (req, res) => {
    const {grantId}=req.params

    try {
        if (!grantId) {
            return res.status(404).json({ message: 'لا يوجد منحة  بهذا المعرف' });
        }
        const updatedUser=await deleteGrant(grantId)
        res.status(200).json({ data: updatedUser,message:"تم حذف المنحة بنجاح" });
    } catch (error) {
        handlePrismaError(res, error);
    }
})
router.get('/grants/projects/access/:grantId', async (req, res) => {
    const {grantId}=req.params
    try {
        const grant = await getUserViewAccessForAGrant(grantId);
        if (!grant) {
            return res.status(404).json({ message: 'لا يوجد منحه' });
        }
        res.status(200).json({ data: grant,users:grant.viewAccessUsers });
    } catch (error) {
        console.error('Error fetching supervisors:', error);
        res.status(500).json({ message: 'حدث خطأ أثناء جلب  المنحة ' });
    }
});

router.post('/grants/projects/access/:grantId', async (req, res) => {
    const {userId}=req.body
    const {grantId}=req.params
    try {
        if (!userId) {
            return res.status(404).json({ message: 'لا يوجد بيانات مرسله' });
        }
        const newUser=await assignUserToViewGrant(grantId,userId)
        res.status(200).json({ data: newUser,message:"تم اعطاء الصلاحية لهذا المستخدم بنجاح" });
    } catch (error) {
        handlePrismaError(res, error);
    }
})
router.delete('/grants/projects/access/:grantId', async (req, res) => {
    const {grantId}=req.params
    const {userId}=req.body
    try {
        if (!grantId) {
            return res.status(404).json({ message: 'لا يوجد منحة  بهذا المعرف' });
        }
        const updatedUser=await removeUserFromViewGrant(grantId,userId)
        res.status(200).json({ data: updatedUser,message:"تم الغاء صلاحية هذا المستخدم" });
    } catch (error) {
        handlePrismaError(res, error);
    }
})

router.get('/grants/applications/pending', async (req, res) => {
    const searchParams=req.query;
    const { limit, skip } = getPagination(req);
    try {
        const {applications,total} = await getApplications(searchParams,limit, skip,"PENDING");
        const totalPages = Math.ceil(total / limit);

        if (!applications) {
            return res.status(404).json({ message: 'لا يوجد طلبات حاليا' });
        }
        res.status(200).json({ data: applications,totalPages,total });
    } catch (error) {
        console.error('Error fetching supervisors:', error);
        res.status(500).json({ message: 'حدث خطأ أثناء جلب  الطلبات ' });
    }
});


export default router;

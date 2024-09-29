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

router.get('/students', async (req, res) => {
    const searchParams=req.query;
    const { limit, skip } = getPagination(req);

    try {
        const {users,total} = await getUser(searchParams,limit, skip);
        const totalPages = Math.ceil(total / limit);

        if (!users) {
            return res.status(404).json({ message: 'لا يوجد طلاب' });
        }
        res.status(200).json({ data: users,totalPages,total });
    } catch (error) {
        console.error('Error fetching personal info:', error);
        res.status(500).json({ message: 'حدث خطأ أثناء جلب  الطلاب' });
    }
});

router.get('/students/:studentId', async (req, res) => {
const {studentId}=req.params
    console.log(studentId,"studentId")
    try {
        if (!studentId) {
            return res.status(404).json({ message: 'لا يوجد طالب بهذا المعرف' });
        }
            const studentPersonalInfo=await getPersonalInfo(studentId)
        res.status(200).json({ data: studentPersonalInfo });
    } catch (error) {
        console.error('Error fetching personal info:', error);
        res.status(500).json({ message: 'حدث خطأ أثناء جلب  الطالب' });
    }
})
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

router.get('/grants/projects', async (req, res) => {
    const searchParams=req.query;
    const { limit, skip } = getPagination(req);

    try {
        const {grants,total} = await getGrantsProjects(searchParams,limit, skip);
        const totalPages = Math.ceil(total / limit);

        if (!grants) {
            return res.status(404).json({ message: 'لا يوجد منح' });
        }
        res.status(200).json({ data: grants,totalPages,total });
    } catch (error) {
        console.error('Error fetching supervisors:', error);
        res.status(500).json({ message: 'حدث خطأ أثناء جلب  المنح ' });
    }
});
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

router.get('/grants/applications/approved', async (req, res) => {
    const searchParams=req.query;
    const { limit, skip } = getPagination(req);
    try {
        const {applications,total} = await getApplications(searchParams,limit, skip,"APPROVED");
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
router.get('/grants/applications/rejected', async (req, res) => {
    const searchParams=req.query;
    const { limit, skip } = getPagination(req);
    try {
        const {applications,total} = await getApplications(searchParams,limit, skip,"REJECTED");
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
router.get('/grants/applications/student/:appId', async (req, res) => {
    const {appId}=req.params
    try {
        const application = await getApplicationById(appId);
        if (!application) {
            return res.status(404).json({ message: 'لا يوجد طلب منحة' });
        }
        res.status(200).json({ data: application});
    } catch (error) {
        console.error('Error fetching supervisors:', error);
        res.status(500).json({ message: 'حدث خطأ أثناء جلب  طلب منحة ' });
    }
});
router.get('/grants/applications/student/:appId/improvements', async (req, res) => {
    const {appId}=req.params
    try {
        const application = await getSpecificApplicationField(appId,"improvementRequests");
        if (!application) {
            return res.status(404).json({ message: 'لا يوجد طلب منحة' });
        }
        res.status(200).json({ data: application});
    } catch (error) {
        console.error('Error fetching supervisors:', error);
        res.status(500).json({ message: 'حدث خطأ أثناء جلب  طلب منحة ' });
    }
});
router.get('/grants/applications/student/:appId/asked', async (req, res) => {
    const {appId}=req.params
    try {
        const application = await getSpecificApplicationField(appId,"askedFields");
        if (!application) {
            return res.status(404).json({ message: 'لا يوجد طلب منحة' });
        }
        res.status(200).json({ data: application});
    } catch (error) {
        console.error('Error fetching applications asked:', error);
        res.status(500).json({ message: 'حدث خطأ أثناء جلب  طلب منحة ' });
    }
});
router.get('/grants/applications/student/:appId/updates', async (req, res) => {
    const {appId}=req.params
    try {
        const application = await getSpecificApplicationField(appId,"updates");
        if (!application) {
            return res.status(404).json({ message: 'لا يوجد طلب منحة' });
        }
        res.status(200).json({ data: application});
    } catch (error) {
        console.error('Error fetching applications asked:', error);
        res.status(500).json({ message: 'حدث خطأ أثناء جلب  طلب منحة ' });
    }
});
router.get('/grants/applications/student/:studentId/personal', async (req, res) => {
    const {studentId}=req.params
    try {
        const studentPersonalInfo = await getPersonalInfo(studentId);
        if (!studentPersonalInfo) {
            return res.status(404).json({ message: 'لا يوجد  طالب' });
        }
        res.status(200).json({ data: studentPersonalInfo});
    } catch (error) {
        console.error('Error fetching supervisors:', error);
        res.status(500).json({ message: 'حدث خطأ أثناء جلب  بيانات الطالب  ' });
    }
});

// same for supervisor
router.post('/grants/applications/student/:appId', async (req, res) => {
    const body=req.body
    const {appId}=req.params
    let data={}
    let message=""
    console.log(body,"bodt")
    try {
        if (!body) {
             res.status(404).json({ message: 'لا يوجد بيانات مرسله' });
        }
        const action=body.action;
        if(action==="approve"){
            if(!body.supervisorId)
            {
                res.status(404).json({ message: 'يجب اختيار مشرف لهذا الطلب حتي يقبل' });
            }
             data= await approveApplication(appId,body.supervisorId)
            message="تم قبول الطلب وتعيين مشرف لاختيار منحه للطلب"
        }
        if(action==="reject")
        {
            data=await rejectApplication(appId,body.rejectReason)
            message="تم رفض الطلب وسيتم اخطار الطالب بسبب الرفض"
        }
        if(action==="review")
        {
            data=await markApplicationUnderReview(appId,body.supervisorId)
            message="تم تعين المشرف لمراجعة الطلب وسيتم اخطاره"
        }
        if(action==="uncomplete"||action==="uncomplete_with_edit")
        {
            data=await markApplicationUnComplete(appId,body.askFields,action==="uncomplete_with_edit")
            message="تم تعين الطلب كغير مكتمل وسيتم اخطار الطلب  بالتحديثات المطلوبه"
        }
        res.status(200).json({ data,message });
    } catch (error) {
        handlePrismaError(res, error);
    }
})

export default router;

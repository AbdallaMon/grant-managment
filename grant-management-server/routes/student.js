import { Router } from 'express';
import {
    getPagination,
    handlePrismaError,
    verifyTokenAndHandleAuthorization,
} from "../services/utility.js";
import {
    checkIfFieldsAreEmpty,
    createDraftApplicationModel,
    createNewApplication,
    deleteDraftApplication, deleteSibling,
    getDraftApplicationModel, getPersonalInfo,
    getStudentApplications, submitApplication, updateDraftApplicationModel, updatePersonalInfo
} from "../services/studentsServices.js";

const router = Router();

router.use((req, res, next) => {
    verifyTokenAndHandleAuthorization(req, res, next,"STUDENT");
});


router.get('/personal/:userId', async (req, res) => {
    const { userId } = req.params;
    try {

        const personalInfo = await getPersonalInfo(userId);
        if (!personalInfo) {
            return res.status(404).json({ message: 'المعلومات الشخصية غير موجودة' });
        }
        res.status(200).json({ data: personalInfo });
    } catch (error) {
        console.error('Error fetching personal info:', error);
        res.status(500).json({ message: 'حدث خطأ أثناء جلب المعلومات الشخصية' });
    }
});
// Route to update specific personal info of a specific user
router.put('/personal/:userId', async (req, res) => {
    const { userId } = req.params;
    const { model, updateData } = req.body; // model can be 'basicInfo', 'contactInfo', or 'studyInfo'

    try {
        if(updateData.hasDisability==="yes")updateData.hasDisability=true
        if(updateData.hasDisability==="no")updateData.hasDisability=false
        const updatedInfo = await updatePersonalInfo(userId, model, updateData);
        if (!updatedInfo) {
            return res.status(404).json({ message: 'لم يتم العثور على المعلومات المطلوبة' });
        }
        res.status(200).json({ message: 'تم تحديث المعلومات بنجاح', data: updatedInfo });
    } catch (error) {
        console.error('Error updating personal info:', error);
        res.status(500).json({ message: 'حدث خطأ أثناء تحديث المعلومات الشخصية' });
    }
});


router.get('/applications', async (req, res) => {
    const { limit, skip } = getPagination(req);
    const studentId = req.user.id;
    try {
        const { applications, total } = await getStudentApplications(studentId, skip, limit);

        const totalPages = Math.ceil(total / limit);
        res.status(200).json({ data: applications, total, totalPages });
    } catch (error) {
        console.log(error,"error in student applications getting data")
        res.status(500).json({ message: 'خطأ في جلب الطلبات', error: error.message });
    }
});
router.post("/applications/draft",async (req,res)=>{
    const studentId = req.user.id;
    try{
        const id=await createNewApplication(studentId)
        res.status(200).json({id,message:"تم انشاء طلب  منحة جديدة جاري اعادة توجيهك لملئ البيانات"});
    }catch (error)
    {
        console.log(error,"error in creating application ")
        handlePrismaError(res,error)
    }
})
router.delete("/applications/draft/:appId",async (req,res)=>{
    const { appId } = req.params;
    try{
       await deleteDraftApplication(+appId)
        res.status(200).json({message:"تم حذف الطلب بنجاح"});
    }catch (error)
    {
        console.log(error,"error in deleting student application ")
        handlePrismaError(res,error)
    }
})
router.get('/applications/draft/:appId', async (req, res) => {
    const { appId } = req.params;
    const { model } = req.query; // Query param e.g., ?model=scholarshipInfo

    try {
        if (!model) {
            return res.status(400).json({ message: "مشكلة في جلب البيانات" });
        }

        const data = await getDraftApplicationModel(appId, model);
        if (!data) {
            return res.status(200).json({ data: null });
        }

        res.status(200).json({ data });
    } catch (error) {
        console.log(error, "Error fetching draft application model data");
        handlePrismaError(res, error);
    }
});
router.post('/applications/draft/:appId', async (req, res) => {
    const { appId } = req.params;
    const { model } = req.query; // Query param e.g., ?model=scholarshipInfo
    const inputData = req.body;  // Assuming the data is coming in the body
    try {
        if (!model) {
            return res.status(400).json({ message: "بارامتر النموذج مطلوب" });
        }
        if (!inputData) {
            return res.status(400).json({ message: "بيانات المدخلات مطلوبة" });
        }

        const createdData = await createDraftApplicationModel(appId, model, inputData);
        res.status(200).json({ message: "تم حفظ البيانات بنجاح", data: createdData });
    } catch (error) {
        console.log(error, "خطأ في تحديث بيانات نموذج طلب المسودة");
        handlePrismaError(res, error);
    }
});
router.put('/applications/draft/:appId', async (req, res) => {
    const { appId } = req.params;
    const { model } = req.query; // Query param e.g., ?model=scholarshipInfo
    const inputData = req.body;  // Assuming the data is coming in the body
    try {
        if (!model) {
            return res.status(400).json({ message: "بارامتر النموذج مطلوب" });
        }
        if (!inputData) {
            return res.status(400).json({ message: "بيانات المدخلات مطلوبة" });
        }
        const updatedData = await updateDraftApplicationModel(appId, model, inputData);
        res.status(200).json({ message: "تم تحديث البيانات بنجاح", data: updatedData[model] });
    } catch (error) {
        console.log(error, "خطأ في تحديث بيانات نموذج طلب المسودة");
        handlePrismaError(res, error);
    }
});

router.put('/applications/draft/apps/siblings/:siblingId', async (req, res) => {
    const { siblingId } = req.params;
    const inputData = req.body;
    try {
        if (!inputData) {
            return res.status(400).json({ message: "بيانات المدخلات مطلوبة" });
        }
        const updatedData = await updateDraftApplicationModel(siblingId, "siblings", inputData);
        res.status(200).json({ message: "تم تحديث البيانات بنجاح", data: updatedData });
    } catch (error) {
        console.log(error, "خطأ في تحديث بيانات نموذج طلب المسودة");
        handlePrismaError(res, error);
    }
});

router.delete('/applications/draft/apps/siblings/:siblingId', async (req, res) => {
    const { siblingId } = req.params;
    try {
        const updatedData = await deleteSibling(siblingId);
        res.status(200).json({ message: "تمت عملية الحذف بنجاح", data: updatedData });
    } catch (error) {
        console.log(error, "خطأ في تحديث بيانات نموذج طلب المسودة");
        handlePrismaError(res, error);
    }
});
router.get('/applications/:appId/submit', async (req, res) => {
    const { appId } = req.params;

    try {
        const missingFields = await checkIfFieldsAreEmpty(appId);

        if (missingFields.length > 0) {
            return res.status(400).json({
                message: "لم يمكن حفظ الطلب لانه يوجد بيناتات لم يتم ملئها بعد",
                data: missingFields
            });
        }

        res.status(200).json({ message: "تم مراجعة بياناتك والتاكد ان كل البيانات مكتملة" });
    } catch (error) {
        res.status(500).json({ message: 'حدث خطأ', error: error.message });
    }
});

router.post('/applications/:appId/submit', async (req, res) => {
    const { appId } = req.params;

    try {
        const missingFields = await checkIfFieldsAreEmpty(appId);

        if (missingFields.length > 0) {
            return res.status(400).json({
                message: "لم يمكن حفظ الطلب لانه يوجد بيناتات لم يتم ملئها بعد",
                data: missingFields
            });
        }

        const submittedApplication = await submitApplication(appId);

        res.status(200).json({
            message: "تم تقديم الطلب بنجاح",
            data: submittedApplication
        });
    } catch (error) {
        res.status(500).json({ message: 'حدث خطأ', error: error.message });
    }
});

export default router;

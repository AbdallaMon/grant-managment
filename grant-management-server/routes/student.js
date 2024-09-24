import { Router } from 'express';
import {getPagination, handlePrismaError, verifyTokenAndHandleAuthorization} from "../services/utility.js";
import {
    createDraftApplicationModel,
    createNewApplication,
    deleteDraftApplication,
    getDraftApplicationModel,
    getStudentApplications, updateDraftApplicationModel
} from "../services/studentsServices.js";

const router = Router();

router.use((req, res, next) => {
    verifyTokenAndHandleAuthorization(req, res, next,"STUDENT");
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
        const updatedData = await createDraftApplicationModel(appId, model, inputData);
        res.status(200).json({ message: "تم تحديث البيانات بنجاح", data: updatedData[model] });
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



export default router;

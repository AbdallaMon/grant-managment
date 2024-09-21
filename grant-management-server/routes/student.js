import { Router } from 'express';
import {getPagination, handlePrismaError, verifyTokenAndHandleAuthorization} from "../services/utility.js";
import {createNewApplication, deleteDraftApplication, getStudentApplications} from "../services/studentsServices.js";

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
        res.status(200).json({id,message:"تم انشاء طلب  منحة جديدة جاري اعادة توجيهك لملئ البيناتا"});
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

export default router;

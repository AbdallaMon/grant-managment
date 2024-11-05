import {
    FaUser,
    FaFileAlt,
    FaGraduationCap,
    FaBook,
    FaHome,
    FaUsers,
    FaCheckCircle,
    FaFileContract,
    FaQuestionCircle,
    FaPaperPlane
} from 'react-icons/fa';


export const initialPageLimit = 10
export const totalLimitPages = [10, 20, 50, 100]

export const ProgramType = {
    BACH: "بكالريوس",
    MAST: "ماجستير", PHD: "دكتوراه"
}
// Roles in Arabic
export const Role = {
    ADMIN: "مسؤول",
    SUPERVISOR: "مشرف",
    STUDENT: "طالب",
    SPONSOR: "جهة داعمة",
    INDIVIDUAL: "حساب افراد"
};


// Application Status in Arabic
export const ApplicationStatus = {
    DRAFT: "مسودة",
    PENDING: "معلق",
    UNDER_REVIEW: "تحت المراجعة",
    UN_COMPLETE: "غير مكتمل",
    UPDATED: "محدث",
    APPROVED: "مقبول",
    REJECTED: "مرفوض"
};
export const StatusColor = {
    DRAFT: "info",
    PENDING: "warning",
    UNDER_REVIEW: "info",
    UN_COMPLETE: "error",
    UPDATED: "info",
    APPROVED: "success",
    REJECTED: "error"
};
// Ticket Status in Arabic
export const TicketStatus = {
    OPEN: "مفتوح",
    CLOSED: "مغلق"
};

// Study Source in Arabic
export const StudySource = {
    SELF_FUNDED: " تغطية ذاتية",
    SCHOLARSHIP: "منحة دراسية"
};

// Residence Type in Arabic
export const ResidenceType = {
    FAMILY: "مع العائلة",
    PRIVATE_HOUSING: "سكن خاص",
    DORMITORY: "سكن جامعي"
};

// Parent Status in Arabic
export const ParentStatus = {
    ALIVE: "حي",
    DECEASED: "متوفى",
    MISSING: "مفقود"
};

// Support Type in Arabic
export const SupportType = {
    FULL_SCHOLARSHIP: "منحة دراسية كاملة",
    PARTIAL_SCHOLARSHIP: "منحة جزئية",
    TUITION_ONLY: "رسوم الدراسة فقط",
    PERSONAL_EXPENSES: "المصاريف الشخصية"
};

// Study Type in Arabic
export const StudyType = {
    NEW_STUDENT: "طالب جديد",
    CURRENT_STUDENT: "طالب حالي"
};

// GPA Type in Arabic
export const GpaType = {
    GPA_4: "معدل 4",
    PERCENTAGE: "النسبة المئوية"
};


// Grant Type in Arabic
export const GrantType = {
    SPONSOR: "جهة",
    INDIVIDUAL: "كفيل"
};

// Field Type in Arabic
export const FieldType = {
    FILE: "ملف",
    TEXT: "نص"
};

// Field Status in Arabic
export const FieldStatus = {
    PENDING: "معلق",
    COMPLETED: "مكتمل"
};
export const GenderType = {
    male: "ذكر",
    female: "انثي"
}
export const PayEveryENUM = {
    ONE_MONTH: "كل شهر",
    TWO_MONTHS: "كل شهرين",
    THREE_MONTHS: "كل ثلاث شهور",
    FOUR_MONTHS: "كل اربع شهور",
    SIX_MONTHS: "كل ست شهور",
    ONE_YEAR: "كل سنه",
};
export const NotificationType = {
    MESSAGE: "رسالة",
    APPLICATION_APPROVED: "تمت الموافقة على الطلب",
    APPLICATION_REJECTED: "تم رفض الطلب",
    APPLICATION_UPDATE: "تحديث الطلب",
    APPLICATION_UN_COMPLETE: "الطلب غير مكتمل",
    APPLICATION_RESPONSE: "رد على الطلب",
    APPLICATION_NEW: "طلب جديد",
    APPLICATION_UNDER_REVIEW: "الطلب قيد المراجعة",
    APPLICATION_COMPLETED: "تم اكتمال الطلب",
    NEW_TICKET: "تذكرة جديدة",
    TICKET_UPDATE: "تحديث التذكرة",
    TASK_ASSIGNED: "تم تعيين مهمة",
    TASK_COMPLETED: "تم الانتهاء من المهمة",
    PAYMENT_DUE: "موعد الدفع",
    PAYMENT_COMPLETED: "تم عملية دفع"
};
// Model names (both English and Arabic)
export const ModelEnum = {
    ScholarshipInfo: "ScholarshipInfo",
    AcademicPerformance: "AcademicPerformance",
    ResidenceInformation: "ResidenceInformation",
    SupportingFiles: "SupportingFiles",
    Sibling: "Sibling",
};

export const ArModelEnum = {
    ScholarshipInfo: "معلومات المنحة",
    AcademicPerformance: "الأداء الأكاديمي",
    ResidenceInformation: "معلومات السكن",
    SupportingFiles: "الملفات الداعمة",
    Sibling: "الأشقاء",
};

// Fields for each model (both English and Arabic)
export const FieldEnum = {

    ScholarshipInfo: {
        supportType: "supportType",
        annualTuitionFee: "annualTuitionFee",
        providedAmount: "providedAmount",
        requestedAmount: "requestedAmount",
    },
    AcademicPerformance: {
        typeOfStudy: "typeOfStudy",
        gpaType: "gpaType",
        gpaValue: "gpaValue",
        transcript: "transcript", gradeRecords: "gradeRecords",
    },
    ResidenceInformation: {
        residenceType: "residenceType",
        fatherStatus: "fatherStatus",
        fatherIncome: "fatherIncome",
        motherStatus: "motherStatus",
        motherIncome: "motherIncome",
        familyIncome: "familyIncome",
        city: "city",
        country: "country",
        address: "address",
    },
    SupportingFiles: {
        personalId: "personalId",
        studentDoc: "studentDoc",
        medicalReport: "medicalReport",
        personalPhoto: "personalPhoto",
        proofOfAddress: "proofOfAddress",
    },
    Sibling: {
        name: "name",
        relation: "relation",
        university: "university",
        college: "college",
        department: "department",
        studyYear: "studyYear",
        sourceOfStudy: "sourceOfStudy",
        grantSource: "grantSource",
        grantAmount: "grantAmount",
        document: "document",
    },
};

export const ArFieldEnum = {
    Application: {
        status: "حالة الطلب",
        rejectReason: "سبب الرفض",
        commitment: "التزام الطالب",
        scholarshipTerms: "شروط المنحة",
    },
    ScholarshipInfo: {
        supportType: "نوع الدعم",
        annualTuitionFee: "الرسوم السنوية",
        providedAmount: "المبلغ المقدم",
        requestedAmount: "المبلغ المطلوب",
    },
    AcademicPerformance: {
        typeOfStudy: "نوع الدراسة",
        gpaType: "نوع المعدل",
        gpaValue: "قيمة المعدل",
        transcript: "كشف الدرجات", gradeRecords: "سجلات الدرجات", // Newly added

    },
    ResidenceInformation: {
        residenceType: "نوع السكن",
        fatherStatus: "حالة الأب",
        fatherIncome: "دخل الأب",
        motherStatus: "حالة الأم",
        motherIncome: "دخل الأم",
        familyIncome: "إجمالي دخل الأسرة",
        city: "المدينة",
        country: "الدولة",
        address: "العنوان",
    },
    SupportingFiles: {
        personalId: "رقم الهوية",
        studentDoc: "وثيقة الطالب",
        medicalReport: "التقرير الطبي",
        personalPhoto: "الصورة الشخصية",
        proofOfAddress: "إثبات العنوان",
    },
    Sibling: {
        name: "الاسم",
        relation: "العلاقة",
        university: "الجامعة",
        college: "الكلية",
        department: "القسم",
        studyYear: "سنة الدراسة",
        sourceOfStudy: "مصدر تغطية الدراسة",
        grantSource: "مصدر المنحة",
        grantAmount: "قيمة المنحة",
        document: "الوثيقة",
    },
};
export const grantLinks = [
    {
        href: "application",
        text: "الطلب",
        icon: <FaUser/>,
        meta: {
            title: "الطلب",
            description: "عرض بيانات الطلب الأساسية"
        }
    },
    {
        href: "scholarship-info",
        text: "معلومات المنحة",
        icon: <FaGraduationCap/>,
        meta: {
            title: "معلومات المنحة",
            description: "توفير كافة المعلومات المتعلقة بالمنحة"
        }
    },
    {
        href: "academic-performance",
        text: "الأداء الأكاديمي",
        icon: <FaBook/>,
        meta: {
            title: "الأداء الأكاديمي",
            description: "إدخال بيانات الأداء الأكاديمي الخاص بك"
        }
    },
    {
        href: "residence-info",
        text: "معلومات السكن",
        icon: <FaHome/>,
        meta: {
            title: "معلومات السكن",
            description: "تفاصيل الإقامة المتعلقة بك"
        }
    },
    {
        href: "siblings",
        text: "الأشقاء",
        icon: <FaUsers/>,
        meta: {
            title: "الأشقاء",
            description: "تفاصيل عن الأشقاء"
        }
    },
    {
        href: "supporting-files",
        text: "الملفات الداعمة",
        icon: <FaFileAlt/>,
        meta: {
            title: "الملفات الداعمة",
            description: "رفع جميع الملفات التي تدعم طلبك"
        }
    },
    {
        href: "commitment",
        text: "التعهد",
        icon: <FaCheckCircle/>,
        meta: {
            title: "التعهد",
            description: "تعهداتك للموافقة على الشروط"
        }
    },
    {
        href: "ship-terms",
        text: "شروط المنحة",
        icon: <FaFileContract/>,
        meta: {
            title: "شروط المنحة",
            description: "الاطلاع على الشروط والأحكام الخاصة بالمنحة"
        }
    },
    {
        href: "faq",
        text: "الأسئلة الشائعة",
        icon: <FaQuestionCircle/>,
        meta: {
            title: "الأسئلة الشائعة",
            description: "عرض الأسئلة الشائعة عن المنحة"
        },
        notRequired: true
    },
    {
        href: "save",
        text: "حفظ الطلب وارساله",
        icon: <FaPaperPlane/>,
        meta: {
            title: "حفظ الطلب وارساله",
            description: "إرسال طلبك بعد مراجعته"
        },
        notRequired: true
    }
];
export const simpleModalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    maxHeight: "90%",
    overflow: "auto",
    width: {
        xs: "95%",
        sm: "80%",
        md: "60%",
    },
    maxWidth: {
        md: "600px",
    },
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
}



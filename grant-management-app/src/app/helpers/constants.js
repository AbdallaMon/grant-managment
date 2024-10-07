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


export const initialPageLimit = 20
export const totalLimitPages = [20, 50, 100]

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

// Task Status in Arabic
const TaskStatus = {
    PENDING: "معلق",
    IN_PROGRESS: "قيد التنفيذ",
    COMPLETED: "مكتمل"
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
// Student Type in Arabic
export const StudentType = {
    NEW: "طالب جديد",
    CURRENT: "طالب حالي"
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

// Payment Status in Arabic
export const PaymentStatus = {
    PENDING: "معلق",
    PAID: "مدفوع",
    OVERDUE: "متأخر"
};

// Grant Type in Arabic
export const GrantType = {
    SPONSOR: "جهة",
    INDIVIDUAL: "كفيل"
};

// File Type in Arabic
export const FileType = {
    ID: "هوية",
    ACADEMIC: "أكاديمي",
    MEDICAL: "طبي",
    SUPPORTING: "داعم",
    OTHER: "آخر"
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


export const grantLinks = [
    {
        href: "",
        text: "البيانات الشخصية",
        icon: <FaUser/>,
        meta: {
            title: "البيانات الشخصية",
            description: ""
        }
    },
    {
        href: "scholarship-info",
        text: "معلومات المنحة",
        icon: <FaGraduationCap/>,  // Scholarship Info Icon
        meta: {
            title: "معلومات المنحة",
            description: "توفير كافة المعلومات المتعلقة بالمنحة"
        }
    },
    {
        href: "academic-performance",
        text: "الأداء الأكاديمي",
        icon: <FaBook/>,  // Academic Performance Icon
        meta: {
            title: "الأداء الأكاديمي",
            description: "إدخال بيانات الأداء الأكاديمي الخاص بك"
        }
    },
    {
        href: "residence-info",
        text: "معلومات الإقامة",
        icon: <FaHome/>,  // Residence Info Icon
        meta: {
            title: "معلومات الإقامة",
            description: "تفاصيل الإقامة المتعلقة بك"
        }
    },
    {
        href: "siblings",
        text: "معلومات الأقارب",
        icon: <FaUsers/>,  // Siblings Info Icon
        meta: {
            title: "معلومات الأقارب",
            description: "تفاصيل عن الأقارب في نفس البرنامج"
        }
    },
    {
        href: "supporting-files",
        text: "الملفات الداعمة",
        icon: <FaFileAlt/>,  // Supporting Files Icon
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
        icon: <FaQuestionCircle/>,  //
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



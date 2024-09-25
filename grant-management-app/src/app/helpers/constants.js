export const initialPageLimit = 1
export const totalLimitPages = [1, 20, 50, 100]

export const ProgramType = {
    BACH: "بكالريوس",
    MAST: "ماجستير", PHD: "دكتوراه"
}
// Roles in Arabic
const Role = {
    ADMIN: "مسؤول",
    SUPERVISOR: "مشرف",
    STUDENT: "طالب",
    SPONSOR: "راعي",
    DONOR: "متبرع"
};

// Task Status in Arabic
const TaskStatus = {
    PENDING: "معلق",
    IN_PROGRESS: "قيد التنفيذ",
    COMPLETED: "مكتمل"
};

// Application Status in Arabic
const ApplicationStatus = {
    DRAFT: "مسودة",
    PENDING: "معلق",
    UNDER_REVIEW: "تحت المراجعة",
    UN_COMPLETE: "غير مكتمل",
    APPROVED: "مقبول",
    REJECTED: "مرفوض"
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

// Notification Type in Arabic
export const NotificationType = {
    APPLICATION: "طلب",
    TICKET: "تذكرة",
    MESSAGE: "رسالة",
    APPLICATION_APPROVED: "تم قبول الطلب",
    APPLICATION_REJECTED: "تم رفض الطلب",
    TASK_ASSIGNED: "تم تعيين المهمة",
    TASK_COMPLETED: "تم إنجاز المهمة",
    PAYMENT_DUE: "الدفعة مستحقة",
    PAYMENT_COMPLETED: "تم سداد الدفعة"
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

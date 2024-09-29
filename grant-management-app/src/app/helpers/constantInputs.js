import {GenderType, ProgramType} from "@/app/helpers/constants";
import CountrySelector from "@/app/UiComponents/formComponents/CustomInputs/CountrySelector";
import DisabilityInput from "@/app/UiComponents/formComponents/CustomInputs/DisabilityInput";
import PhoneInput from "@/app/UiComponents/formComponents/CustomInputs/PhoneInput";

export const studentInputs = [
    [
        {
            data: {id: "name", label: "اسمك", type: "text", required: true},
            pattern: {
                required: {value: true, message: "الاسم مطلوب"},
                pattern: {value: /^[^\s]+(?:\s)?$/, message: "الاسم يجب أن يكون كلمة واحدة فقط"}
            },
        },
        {
            data: {id: "fatherName", label: "اسم الأب", type: "text", required: true},
            pattern: {
                required: {value: true, message: "اسم الأب مطلوب"},
                pattern: {value: /^[^\s]+(?:\s)?$/, message: "اسم الأب يجب أن يكون كلمة واحدة فقط"}
            },
        },
        {
            data: {id: "familyName", label: "اسم العائلة", type: "text", required: true},
            pattern: {
                required: {value: true, message: "اسم العائلة مطلوب"},
                pattern: {value: /^[^\s]+(?:\s)?$/, message: "اسم العائلة يجب أن يكون كلمة واحدة فقط"}
            },
        },
        {
            data: {
                id: "gender",
                label: "الجنس",
                type: "SelectField",
                enums: GenderType,
                options: [
                    {label: "ذكر", value: "male"},
                    {label: "أنثى", value: "female"},
                ],
                required: true,
            },
            pattern: {required: {value: true, message: "الجنس مطلوب"}},
        },
        {
            data: {id: "birthDate", label: "تاريخ الميلاد", type: "date", required: true},
            pattern: {required: {value: true, message: "تاريخ الميلاد مطلوب"}},
        },
        {
            data: {id: "residenceCountry", type: "outComponent", component: CountrySelector, label: "مكان الاقامه"},
        },
        {
            data: {id: "nationality", type: "outComponent", component: CountrySelector, label: "الجنسية"},
        },
        {
            data: {id: "passport", label: "رقم جواز السفر/الهوية", type: "number", required: true},
            pattern: {
                required: {value: true, message: "اسم رقم جواز السفر/الهوي مطلوب"},
            },
        },
        {
            data: {id: "hasDisability", type: "outComponent", component: DisabilityInput, label: "هل لديك اعاقة؟"},
        },
    ],
    [
        {
            data: {
                id: "programType", label: "نوع البرنامج الدراسي", type: "SelectField",
                enums: ProgramType,
                options: [
                    {label: "بكالريوس", value: "BACH"},
                    {label: "ماجستير", value: "MAST"},
                    {label: "دكتوراه", value: "PHD"},
                ]
            },
            pattern: {required: {value: true, message: "نوع البرنامج الدراسي مطلوب"}},
        },
        {
            data: {id: "university", label: "الجامعة", type: "text", required: true},
            pattern: {required: {value: true, message: "اسم الجامعة مطلوب"}},
        },
        {
            data: {id: "college", label: "الكلية", type: "text", required: true},
            pattern: {required: {value: true, message: "اسم الكلية مطلوب"}},
        },
        {
            data: {id: "department", label: "القسم", type: "text", required: true},
            pattern: {required: {value: true, message: "اسم القسم مطلوب"}},
        },
        {
            data: {id: "year", label: "السنة الدراسية", type: "number", required: true},
            pattern: {required: {value: true, message: "السنة الدراسية مطلوبة"}},
        },
        {
            data: {id: "studentIdNo", label: "رقم الطالب الجامعي", type: "number", required: true},
            pattern: {required: {value: true, message: "رقم الطالب الجامعي مطلوب"}},
        },

    ],
    [
        {
            data: {id: "phone", label: "رقم الهاتف", type: "outComponent", component: PhoneInput, required: true},
            pattern: {required: {value: true, message: "رقم الهاتف مطلوب"}},
        },
        {
            data: {id: "whatsapp", label: "واتساب", type: "outComponent", component: PhoneInput},
            pattern: {required: {value: true, message: "رقم الواتساب مطلوب "}},
        },
        {
            data: {id: "facebook", label: "رابط حساب الفيسبوك", type: "text"},
        },
        {
            data: {id: "instagram", label: "رابط حساب الانستقرام", type: "text"},
        },
    ],

];

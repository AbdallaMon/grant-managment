"use client"
import {GrantDraftFrom} from "@/app/UiComponents/formComponents/forms/GrantDraftFrom";
import {handleRequestSubmit} from "@/app/helpers/functions/handleSubmit";
import {useToastContext} from "@/app/providers/ToastLoadingProvider";

const inputs = [
    {
        data: {
            id: "personalId",
            label: "صورة جواز السفر/الهوية الشخصية (من الجهتين)",
            type: "file",
            required: true
        }, size: {
            xs: 12, md: 6
        },
        pattern: {
            required: {value: true, message: "هذه الخانة  مطلوبة"},
        },
    },
    {
        data: {
            id: "studentDoc",
            label: "وثيقة الطالب",
            type: "file",
            required: true
        }, size: {
            xs: 12, md: 6
        },
        pattern: {
            required: {value: true, message: "هذه الخانة  مطلوبة"},
        },
    }, {
        data: {
            id: "medicalReport",
            label: "تقرير طبي في حال وجود إعاقة",
            type: "file",
            required: true
        }, size: {
            xs: 12, md: 6
        },

    }, {
        data: {
            id: "personalPhoto",
            label: "صورة شخصية",
            type: "file",
            required: true
        }, size: {
            xs: 12, md: 6
        },
        pattern: {
            required: {value: true, message: "هذه الخانة  مطلوبة"},
        },
    }, {
        data: {
            id: "proofOfAddress",
            label: "وثيقة تظهر العنوان (فاتورة، عقد إيجار، ورقة إثبات سكن)",
            type: "file",
            required: true
        }, size: {
            xs: 12, md: 6
        },
        pattern: {
            required: {value: true, message: "هذه الخانة  مطلوبة"},
            min: {value: 0, message: "المبلغ الممكن توفيره يجب أن يكون رقمًا إيجابيًا"},
        },
    },
];
export default function SupportingFiles({params: {id}}) {

    const {setLoading} = useToastContext()

    async function handleBeforeUpdate(data, PUT) {
        const formData = new FormData()
        let count = 0;
        Object.entries(data).forEach(([key, value]) => {
            count++;
            if (!value[0] || value[0] === "undefined") {
                count--
            }
            formData.append(key, value[0]);
        })
        if (count === 0 && PUT) return {};
        const request = await handleRequestSubmit(formData, setLoading, "upload", true, "جاري رفع  ملفاتك")
        if (request.status === 200)
            return request.data
    }

    return (
          <GrantDraftFrom inputs={inputs} appId={id} current={"supportingFiles"}
                          next={{url: "siblings", text: "مليء بيانات  الاقارب "}}
                          handleBeforeUpdate={handleBeforeUpdate}
                          formProps={{
                              formTitle:
                                    "الملفات الداعمة",
                              btnText: "حفظ",
                              variant: "outlined"
                          }}/>

    )
}
"use client"
import {GrantDraftFrom} from "@/app/UiComponents/formComponents/forms/GrantDraftFrom";
import {handleRequestSubmit} from "@/app/helpers/functions/handleSubmit";
import {useToastContext} from "@/app/providers/ToastLoadingProvider";


const inputs = [
    {
        data: {
            id: "typeOfStudy",
            label: "نوع الدراسة",
            type: "SelectField",
            required: true,
            options: [
                {label: "طالب جديد", value: "NEW_STUDENT"},
                {label: "طالب حالي", value: "CURRENT_STUDENT"},
            ]
        }, size: {
            xs: 12, md: 6
        },
        pattern: {
            required: {value: true, message: "نوع الدراسة"},
        },
    },
    {
        data: {
            id: "transcript",
            label: "كشف الدرجات",
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
    {
        data: {
            id: "gpaType",
            label: "نوع المعدل الاكاديمي",
            type: "SelectField",
            required: true,
            options: [
                {label: "معدل تراكمي من 4 نقاط", value: "GPA_4"},
                {label: "معدل مئوي", value: "PERCENTAGE"},
            ]
        }, size: {
            xs: 12, md: 6
        },
        pattern: {
            required: {value: true, message: "هذه الخانة  مطلوبة"},
        },
    },
    {
        data: {
            id: "gpaValue",
            label: "المعدل الاكاديمي",
            type: "number",
            required: true
        }, size: {
            xs: 12, md: 6
        },
        pattern: {
            required: {value: true, message: "هذه الخانة  مطلوبة"},
        },
    },
];
export default function AcademicPerformance({params: {id}}) {

    const {setLoading} = useToastContext()

    async function handleBeforeUpdate(data, PUT) {

        if (PUT && !data.transcript[0]) return data;
        const formData = new FormData()
        formData.append('transcript', data.transcript[0]);

        const transcriptFile = await handleRequestSubmit(formData, setLoading, "upload", true, "جاري رفع ملف الشهادة")
        if (transcriptFile.status === 200)
            return {...data, transcript: transcriptFile.data.transcript}
    }

    return (
          <GrantDraftFrom inputs={inputs} appId={id} current={"academicPerformance"}
                          next={{url: "residence-info", text: "مليء بيانات معلومات الاقامة "}}
                          handleBeforeUpdate={handleBeforeUpdate}
                          uncomplete={true}
                          formProps={{
                              formTitle:
                                    "الاداء الاكاديمي",
                              btnText: "حفظ",
                              variant: "outlined"
                          }}/>

    )
}
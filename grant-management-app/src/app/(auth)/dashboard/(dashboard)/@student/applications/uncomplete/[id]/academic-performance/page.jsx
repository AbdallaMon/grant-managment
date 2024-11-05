"use client"
import {GrantDraftFrom} from "@/app/UiComponents/formComponents/forms/GrantDraftFrom";
import {handleRequestSubmit} from "@/app/helpers/functions/handleSubmit";
import {useToastContext} from "@/app/providers/ToastLoadingProvider";
import {GradeRecords} from "@/app/UiComponents/formComponents/CustomInputs/GradeRecords";
import ImprovementRequestsByModel
    from "@/app/(auth)/dashboard/(dashboard)/@student/applications/uncomplete/ImprovementRequest";


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
    {
        data: {
            type: "outComponent",
            component: GradeRecords
        }
    }
];
export default function AcademicPerformance({params: {id}}) {

    const {setLoading} = useToastContext()


    function extractNumber(key) {
        const match = key.match(/^(\d+)_file$/);
        if (match) {
            return parseInt(match[1], 10);
        }
        return null;
    }

    async function handleBeforeUpdate(data, PUT) {
        let hasFiles = false;
        const formData = new FormData()
        const gradeRecords = [];
        if (!PUT && data.transcript && data.transcript[0]) {
            formData.append('transcript', data.transcript[0]);
            hasFiles = true
        }
        for (const key in data) {
            if (key.endsWith("_file") && data[key]) {
                if (data[key] instanceof FileList && data[key].length > 0) {
                    const file = data[key][0];
                    formData.append(key, file);
                    hasFiles = true
                }
                const match = extractNumber(key)
                let url = data[key] instanceof File ? "" : data[key];
                if (data[key].length === 0 && data[match + "_url"]) {
                    url = data[match + "_url"];
                }
                gradeRecords.push({
                    url: url,
                    description: data[match + "_text"],
                    updated: data[key] instanceof FileList
                })
            }
        }
        let uploadedUrls = {};
        if (hasFiles) {
            const fileUploadResponse = await handleRequestSubmit(formData, setLoading, "upload", true, "جاري رفع الملفات");
            if (fileUploadResponse.status !== 200) {
                throw new Error("حدثت مشكلة اثناء رفع الملفات");
            }
            uploadedUrls = fileUploadResponse.data;
        }
        for (const key in uploadedUrls) {
            if (key === "transcript") {
                data.transcript = uploadedUrls[key]
            } else {
                const index = extractNumber(key);
                gradeRecords[index].url = uploadedUrls[key];
            }
        }

        const newData = {
            gpaType: data.gpaType,
            gpaValue: data.gpaValue,
            gradeRecords: gradeRecords,
            transcript: data.transcript,
            typeOfStudy: data.typeOfStudy
        }
        return newData
    }

    return (
          <>
              <ImprovementRequestsByModel appId={id}/>
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
          </>

    )
}
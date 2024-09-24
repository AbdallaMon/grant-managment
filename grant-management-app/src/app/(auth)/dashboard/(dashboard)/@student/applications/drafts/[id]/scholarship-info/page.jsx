import {GrantDraftFrom} from "@/app/UiComponents/formComponents/forms/GrantDraftFrom";

export default function ScholarshipInfo({params: {id}}) {

    const inputs = [
        {
            data: {
                id: "supportType",
                label: "نوع الدعم",
                type: "SelectField",
                required: true,
                options: [
                    {label: "منحة دراسية (رسوم جامعية ومصاريف شخصية)", value: "FULL_SCHOLARSHIP"},
                    {label: "المساهمة في الرسوم الجامعية", value: "PARTIAL_SCHOLARSHIP"},
                    {label: "تغطية الرسوم الجامعية فقط", value: "TUITION_ONLY"},
                    {label: "تغطية مصاريف شخصية", value: "PERSONAL_EXPENSES"},
                ]
            }, size: 6,
            pattern: {
                required: {value: true, message: "نوع الدعم مطلوب"},
            },
        },
        {
            data: {
                id: "annualTuitionFee",
                label: "الرسوم الجامعية السنوية (بالدولار الأمريكي)",
                type: "number",
                required: true
            }, size: 6,
            pattern: {
                required: {value: true, message: "هذه الخانة  مطلوبة"},
                min: {value: 0, message: "الرسوم الدراسية يجب أن تكون رقمًا إيجابيًا"},
            },
        },
        {
            data: {
                id: "providedAmount",
                label: "المبلغ الممكن توفيره من الرسوم الجامعية",
                type: "number",
                required: true
            }, size: 6,
            pattern: {
                required: {value: true, message: "هذه الخانة  مطلوبة"},
                min: {value: 0, message: "المبلغ الممكن توفيره يجب أن يكون رقمًا إيجابيًا"},
            },
        },
        {
            data: {id: "requestedAmount", label: "مبلغ الدعم المطلوب", type: "number", required: true},
            pattern: {
                required: {value: true, message: "هذه الخانة  مطلوبة"},
                min: {value: 0, message: "المبلغ المطلوب يجب أن يكون رقمًا إيجابيًا"},
            }, size: 6,

        },
    ];

    return (
          <GrantDraftFrom inputs={inputs} appId={id} current={"scholarshipInfo"}
                          next={{url: "academic-performance", text: "مليء بيانات الاداء الاكاديمي"}}
                          formProps={{
                              formTitle:
                                    "نوع المنحة المطلوبة",
                              btnText: "حفظ"
                          }}/>
    )
}
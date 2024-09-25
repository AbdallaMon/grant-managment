"use client"
import useDataFetcher from "@/app/helpers/hooks/useDataFetcher";
import React from "react";
import AdminTable from "@/app/UiComponents/DataViewer/AdminTable";
import CreateModal from "@/app/UiComponents/models/CreateModal";
import {handleRequestSubmit} from "@/app/helpers/functions/handleSubmit";
import {useToastContext} from "@/app/providers/ToastLoadingProvider";
import {StudySource} from "@/app/helpers/constants";
import {Button} from "@mui/material";
import Link from "next/link";

export default function Siblings({params: {id}}) {
    const {
        data,
        loading,
        setData,
        page,
        setPage,
        limit,
        setLimit,
        totalPages,
        total,
        setTotal
    } = useDataFetcher(`student/applications/draft/${id}?model=siblings&`, false);
    const {setLoading} = useToastContext()
    const inputs = [
        {
            data: {id: "name", type: "text", label: "الاسم"},
            pattern: {
                required: {
                    value: true,
                    message: "من فضلك أدخل اسم ",
                },
            },
        },
        {
            data: {id: "relation", type: "text", label: "العلاقة"},
            pattern: {
                required: {
                    value: true,
                    message: "من فضلك أدخل العلاقة",
                },
            },
        },
        {
            data: {id: "university", type: "text", label: "الجامعة"},
            pattern: {
                required: {
                    value: true,
                    message: "من فضلك أدخل اسم الجامعة",
                },
            },
        },
        {
            data: {id: "college", type: "text", label: "الكلية"},
            pattern: {
                required: {
                    value: true,
                    message: "من فضلك أدخل اسم الكلية",
                },
            },
        },
        {
            data: {id: "department", type: "text", label: "القسم"},
            pattern: {
                required: {
                    value: true,
                    message: "من فضلك أدخل اسم القسم",
                },
            },
        },
        {
            data: {id: "studyYear", type: "date", label: "السنة الدراسية"},
            pattern: {
                required: {
                    value: true,
                    message: "من فضلك أدخل السنة الدراسية",
                },
            },
        },
        {
            data: {
                id: "sourceOfStudy",
                type: "SelectField",
                label: "مصدر الدراسة",
                options: [{
                    label: "تغطية ذاتية", value: "SELF_FUNDED"
                },
                    {label: "منحة", value: "SCHOLARSHIP"}
                ],
                loading: false
            },
            pattern: {
                required: {
                    value: true,
                    message: "من فضلك اختر مصدر الدراسة",
                },
            },
        },
        {
            data: {id: "grantSource", type: "text", label: "مصدر المنحة"},
            pattern: {
                required: {
                    value: false,
                },
            },
        },
        {
            data: {id: "grantAmount", type: "number", label: "قيمة المنحة"},
            pattern: {
                required: {
                    value: false, // Optional field
                },
                min: {
                    value: 0,
                    message: "يجب أن تكون قيمة المنحة أكبر من الصفر",
                },
            },
        },
        {
            data: {id: "document", type: "file", label: "وثيقة الطالب"},
            pattern: {
                required: {
                    value: false, // Optional field
                },
            },
        }
    ];

    const columns = [
        {name: "name", label: "الاسم"},
        {name: "relation", label: "علاقتك به"},
        {name: "university", label: "الجامعة"},
        {name: "college", label: "الكلية"},
        {name: "department", label: "القسم"},
        {name: "studyYear", label: "السنة الدراسية"},
        {name: "sourceOfStudy", label: "مصدر تغطية الدراسة", type: "ENUM", enum: StudySource},
        {name: "grantSource", label: "مصدر المنحة"},
        {name: "grantAmount", label: "قيمة المنحة"},
        {name: "document", label: "المستند", type: "document"}
    ];


    const editInputs = [...inputs]

    async function handleBeforeSubmit(data) {
        if (Object.values(data.document).length === 0) {
            delete data.document;
            return data;
        }
        const formData = new FormData()
        formData.append('document', data.document[0]);
        const document = await handleRequestSubmit(formData, setLoading, "upload", true, "جاري رفع ملف ")
        if (document.status === 200)
            return {...data, document: document.data.document}
    }

    return (
          <div>
              <CreateModal
                    setData={setData}
                    label={"اضافة قريب جديد"}
                    inputs={inputs}
                    href={`student/applications/draft/${id}?model=siblings`}
                    extraProps={{formTitle: "اضافة قريب جديد", btnText: "اضافة"}}
                    setTotal={setTotal}
                    handleBeforeSubmit={handleBeforeSubmit}

              />
              <AdminTable
                    withEdit={true}
                    data={data}
                    columns={columns}
                    page={page}
                    setPage={setPage}
                    limit={limit}
                    setLimit={setLimit}
                    total={total}
                    setTotal={setTotal}
                    inputs={editInputs}
                    setData={setData}
                    loading={loading}
                    checkChanges={true}
                    totalPages={totalPages}
                    handleBeforeSubmit={handleBeforeSubmit}
                    editHref={"student/applications/draft/apps/siblings"}
                    withDelete={true}
                    deleteHref={"student/applications/draft/apps/siblings"}
              />
              {data && data.length > 0 &&
                    <Button componet={Link} href={`/dashboard/applications/drafts/${id}/commitment`}
                            variant="contained">
                        الذهاب الي صفحة التعهد
                    </Button>
              }
          </div>
    );
}

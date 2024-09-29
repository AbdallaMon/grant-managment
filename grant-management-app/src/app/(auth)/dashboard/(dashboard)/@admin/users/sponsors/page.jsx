"use client";
import useDataFetcher from "@/app/helpers/hooks/useDataFetcher";
import AdminTable from "@/app/UiComponents/DataViewer/AdminTable";
import {handleRequestSubmit} from "@/app/helpers/functions/handleSubmit";
import {useToastContext} from "@/app/providers/ToastLoadingProvider";
import ConfirmWithActionModel from "@/app/UiComponents/models/ConfirmsWithActionModel";
import {Box} from "@mui/material";
import FilterSelect from "@/app/UiComponents/formComponents/FilterSelect";
import CreateModal from "@/app/UiComponents/models/CreateModal";
import {Role} from "@/app/helpers/constants";

const columns = [
    {name: "personalInfo.basicInfo.name", label: "الاسم"},
    {name: "email", label: "الايميل"},
    {name: "personalInfo.contactInfo.phone", label: "رقم الهاتف"},
    {name: "personalInfo.contactInfo.whatsapp", label: "رقم الواتس اب"},
    {name: "_count.GrantViewAccess", label: "عدد المنح الداعمة"},
    {
        name: "role", label: "نوع الحساب", enum: Role,
    },
    {
        name: "isActive", label: "حالة الحساب", type: "boolean", enum: {TRUE: "نشط", FALSE: "محظور"}
    }
];
const studentStatusOption = [
    {id: "active", name: "نشط"}
    , {id: "banned", name: "محظور"}
]
const accountStatus = [
    {id: "SPONSOR", name: "حساب جهات"}
    , {id: "DONOR", name: "حساب افراد"}
]

const inputs = [
    {
        data: {id: "name", type: "text", label: "اسم الداعم(جهة او فرد)", key: "personalInfo.basicInfo.name"},
        pattern: {
            required: {
                value: true,
                message: "الرجاء إدخال اسم الداعم",
            },
        }
    },
    {
        data: {id: "email", type: "email", label: "ايميل"},
        pattern: {
            required: {
                value: true,
                message: "الرجاء إدخال البريد الإلكتروني",
            },
            pattern: {
                value: /\w+@[a-z]+\.[a-z]{2,}/gi,
                message: "الرجاء إدخال بريد إلكتروني صحيح",
            },
        },
    },
    {
        data: {
            id: "password",
            type: "password",
            label: "Password",
            helperText: "يجب أن تحتوي كلمة المرور على حرف كبير وحرف صغير ورقم وأن تكون 8 أحرف على الأقل"
        }, pattern: {
            required: {
                value: true,
                message: "من فضلك ادخل كلمة مرور",
            },
            pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
                message:
                      "يجب أن تحتوي كلمة المرور على حرف كبير وحرف صغير ورقم وأن تكون 8 أحرف على الأقل",
            },
        }
    },
    {
        data: {
            id: "role", type: "SelectField", label: "نوع الحساب", options: [{
                label: "جهة داعمة", value: "SPONSOR",
            }, {
                label: "حساب افراد", value: "INDIVIDUAL",
            }],
            enums: Role
        },
    },
    {
        data: {id: "phone", type: "text", label: "رقم الداعم", key: "personalInfo.contactInfo.phone"},
    },
    {
        data: {id: "whatsapp", type: "text", label: "واتساب الداعم", key: "personalInfo.contactInfo.whatsapp"},
    },
]
export default function SuperVisorPage() {
    const {
        data,
        loading,
        setData,
        page,
        setPage,
        limit,
        setLimit,
        total,
        setTotal, totalPages, setFilters
    } = useDataFetcher("admin/sponsor", false);
    const {setLoading} = useToastContext()

    async function banAStudent(item) {
        const request = await handleRequestSubmit({user: item}, setLoading, `admin/sponsor/${item.id}`, false, "جاري الحظر", null, "PATCH")
        return request;
    }

    const editInputs = [...inputs]
    editInputs.map((input) => {
              if (input.data.id === "password") {
                  input.pattern = {}
              }
              return input;
          }
    );

    return (
          <div>
              <Box display="flex" width="fit-content" gap={2} px={2}>
                  <FilterSelect options={studentStatusOption} label={"حالة حساب الداعم"}
                                loading={false}
                                param={"status"}
                                setFilters={setFilters}
                  />
                  <FilterSelect options={accountStatus} label={"نوع الحساب"}
                                loading={false}
                                param={"role"}
                                setFilters={setFilters}
                  />
                  <CreateModal
                        label={"انشاء حساب داعم"}
                        inputs={inputs}
                        href={"admin/sponsor"}
                        setData={setData}
                        extraProps={{formTitle: "حساب داعم  جديد", btnText: "انشاء", variant: "outlined"}}
                  />
              </Box>
              <AdminTable
                    data={data}
                    withEdit={true}
                    editHref={"admin/sponsor"}
                    columns={columns}
                    page={page}
                    setPage={setPage}
                    limit={limit}
                    setLimit={setLimit}
                    total={total}
                    setTotal={setTotal}
                    totalPages={totalPages}
                    inputs={inputs}
                    setData={setData}
                    loading={loading}
                    extraComponent={({item}) => (
                          <Box sx={{display: "flex", gap: 2}}>
                              <ConfirmWithActionModel
                                    title={item.isActive ? "هل انت متاكد انك تريد حظر هذا الحساب؟" : "هل انت متاكد انك تريد رفع الحظر عن هذا الحساب"}
                                    handleConfirm={() => banAStudent(item)} isDelete={item.isActive}
                                    label={item.isActive ? "حظر الحساب" : "رفع الحظر"}
                              />
                          </Box>
                    )}
              />

          </div>
    );
}

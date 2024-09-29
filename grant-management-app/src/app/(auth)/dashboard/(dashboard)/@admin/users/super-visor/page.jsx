"use client";
import useDataFetcher from "@/app/helpers/hooks/useDataFetcher";
import AdminTable from "@/app/UiComponents/DataViewer/AdminTable";
import {handleRequestSubmit} from "@/app/helpers/functions/handleSubmit";
import {useToastContext} from "@/app/providers/ToastLoadingProvider";
import ConfirmWithActionModel from "@/app/UiComponents/models/ConfirmsWithActionModel";
import {Box} from "@mui/material";
import FilterSelect from "@/app/UiComponents/formComponents/FilterSelect";
import CreateModal from "@/app/UiComponents/models/CreateModal";
import SearchComponent from "@/app/UiComponents/formComponents/SearchComponent";
import React from "react";

const columns = [
    {name: "personalInfo.basicInfo.name", label: "الاسم"},
    {name: "email", label: "الايميل"},
    {name: "personalInfo.contactInfo.phone", label: "رقم الهاتف"},
    {name: "personalInfo.contactInfo.whatsapp", label: "رقم الواتس اب"},
    {name: "_count.superVisorGrants", label: "عدد المنح المدارة"},
    {name: "_count.reviewedApps", label: "عدد المنح المراجعة"},
    {
        name: "isActive", label: "حالة الحساب", type: "boolean", enum: {TRUE: "نشط", FALSE: "محظور"}
    }
];
const studentStatusOption = [
    {id: "active", name: "نشط"}
    , {id: "banned", name: "محظور"}
]


const inputs = [
    {
        data: {id: "name", type: "text", label: "اسم المشرف", key: "personalInfo.basicInfo.name"},
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
        data: {id: "phone", type: "text", label: "رقم المشرف", key: "personalInfo.contactInfo.phone"},
    },
    {
        data: {id: "whatsapp", type: "text", label: "واتساب المشرف", key: "personalInfo.contactInfo.whatsapp"},
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
    } = useDataFetcher("admin/supervisor", false);
    const {setLoading} = useToastContext()

    async function banAStudent(item) {
        const request = await handleRequestSubmit({user: item}, setLoading, `admin/supervisor/${item.id}`, false, "جاري الحظر", null, "PATCH")
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
              <Box display="flex" width="fit-content" gap={2} px={2} flexWrap="wrap" alignItems="center">
                  <div>

                      <SearchComponent
                            apiEndpoint="search?model=user"
                            setFilters={setFilters}
                            inputLabel="  ابحث بالاسم او الايميل لاختيار مشرف"
                            renderKeys={["personalInfo.basicInfo.name", "email"]}
                            mainKey="email"
                            localFilters={{role: "SUPERVISOR"}}
                            withParamsChange={true}
                      />
                  </div>
                  <div>

                      <FilterSelect options={studentStatusOption} label={"حالة المشرف"}
                                    loading={false}
                                    param={"status"}
                                    setFilters={setFilters}

                      />

                  </div>
                  <div>

                      <CreateModal
                            label={"انشاء مشرف جديد"}
                            inputs={editInputs}
                            href={"admin/supervisor"}
                            setData={setData}
                            extraProps={{formTitle: "حساب مشرف جديد", btnText: "انشاء", variant: "outlined"}}
                      />
                  </div>
              </Box>

              <AdminTable
                    data={data}
                    withEdit={true}
                    editHref={"admin/supervisor"}
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
                              {/*<DrawerWithContent item={item} component={StudentProfileViewer}*/}
                              {/*                   extraData={{route: "admin/students", label: "رؤية التفاصيل"}}/>*/}
                              <ConfirmWithActionModel
                                    title={item.isActive ? "هل انت متاكد انك تريد حظر هذا المشرف؟" : "هل انت متاكد انك تريد رفع الحظر عن هذا المشرف"}
                                    handleConfirm={() => banAStudent(item)} isDelete={item.isActive}
                                    label={item.isActive ? "حظر المشرف" : "رفع الحظر"}
                              />
                          </Box>
                    )}
              />

          </div>
    );
}

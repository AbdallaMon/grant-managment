"use client";
import useDataFetcher from "@/app/helpers/hooks/useDataFetcher";
import AdminTable from "@/app/UiComponents/DataViewer/AdminTable";
import StudentProfileViewer from "@/app/UiComponents/DataViewer/StudentProfileViewer";
import DrawerWithContent from "@/app/UiComponents/DataViewer/DrawerWithContent";
import {handleRequestSubmit} from "@/app/helpers/functions/handleSubmit";
import {useToastContext} from "@/app/providers/ToastLoadingProvider";
import ConfirmWithActionModel from "@/app/UiComponents/models/ConfirmsWithActionModel";
import {Box} from "@mui/material";
import FilterSelect from "@/app/UiComponents/formComponents/FilterSelect";
import SearchComponent from "@/app/UiComponents/formComponents/SearchComponent";
import React from "react";

const columns = [
    {name: "personalInfo.basicInfo.name", label: "الاسم"},
    {name: "email", label: "الايميل"},
    {name: "personalInfo.contactInfo.phone", label: "رقم الهاتف"},
    {name: "personalInfo.contactInfo.whatsapp", label: "رقم الواتس اب"},
    {
        name: "isActive", label: "حالة الحساب", type: "boolean", enum: {TRUE: "نشط", FALSE: "محظور"}
    }
];
const studentStatusOption = [
    {id: "active", name: "نشط"}
    , {id: "banned", name: "محظور"}
]
const grantStatus = [
    {id: "withGrant", name: "لدية منح فعاله"}
    , {id: "none", name: "ليس لدية منح"}
]

export default function StudentsPage() {
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
    } = useDataFetcher("shared/students", false);

    const {setLoading} = useToastContext()


    async function banAStudent(item) {
        const request = await handleRequestSubmit({user: item}, setLoading, `admin/students/${item.id}`, false, "جاري الحظر", null, "PATCH")

        return request;
    }


    return (
          <div>
              <Box display="flex" width="fit-content" gap={2} px={2} flexWrap="wrap" alignItems="center">
                  <div>

                      <SearchComponent
                            apiEndpoint="search?model=user"
                            setFilters={setFilters}
                            inputLabel="  ابحث بالاسم او الايميل لاختيار طالب"
                            renderKeys={["personalInfo.basicInfo.name", "email"]}
                            mainKey="email"
                            localFilters={{role: "STUDENT"}}
                            withParamsChange={true}
                      />
                  </div>
                  <div>

                      <FilterSelect options={studentStatusOption} label={"حالة حساب الطالب"}
                                    loading={false}
                                    param={"status"}
                                    setFilters={setFilters}

                      />
                  </div>
                  <div>

                      <FilterSelect options={grantStatus} label={"حالة المنح"}
                                    loading={false}
                                    param={"hasGrant"}
                                    setFilters={setFilters}

                      />
                  </div>
              </Box>
              <AdminTable
                    data={data}
                    columns={columns}
                    page={page}
                    setPage={setPage}
                    limit={limit}
                    setLimit={setLimit}
                    total={total}
                    setTotal={setTotal}
                    totalPages={totalPages}
                    // inputs={inputs}
                    setData={setData}
                    loading={loading}
                    extraComponent={({item}) => (
                          <Box sx={{display: "flex", gap: 2}}>
                              <DrawerWithContent item={item} component={StudentProfileViewer}
                                                 extraData={{route: "shared/students", label: "رؤية التفاصيل"}}/>
                              <ConfirmWithActionModel
                                    title={item.isActive ? "هل انت متاكد انك تريد حظر هذا الطالب؟" : "هل انت متاكد انك تريد رفع الحظر عن هذا الطالب"}
                                    handleConfirm={() => banAStudent(item)} isDelete={item.isActive}
                                    label={item.isActive ? "حظر الطالب" : "رفع الحظر"}
                              />
                          </Box>
                    )}
              />

          </div>
    );
}

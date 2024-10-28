"use client";
import useDataFetcher from "@/app/helpers/hooks/useDataFetcher";
import AdminTable from "@/app/UiComponents/DataViewer/AdminTable";
import StudentProfileViewer from "@/app/UiComponents/DataViewer/StudentProfileViewer";
import DrawerWithContent from "@/app/UiComponents/DataViewer/DrawerWithContent";

import {Box} from "@mui/material";
import FilterSelect from "@/app/UiComponents/formComponents/FilterSelect";
import SearchComponent from "@/app/UiComponents/formComponents/SearchComponent";
import React from "react";
import {useAuth} from "@/app/providers/AuthProvider";

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
    const {user} = useAuth()
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
    } = useDataFetcher(`shared/students?supervisorId=${user.id}&`, false);

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
                            localFilters={{role: "STUDENT", supervisorId: user.id}}
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
                    setData={setData}
                    loading={loading}
                    extraComponent={({item}) => (
                          <Box sx={{display: "flex", gap: 2}}>
                              <DrawerWithContent item={item} component={StudentProfileViewer}
                                                 extraData={{route: "shared/students", label: "رؤية التفاصيل"}}/>
                          </Box>
                    )}
              />

          </div>
    );
}

"use client";
import useDataFetcher from "@/app/helpers/hooks/useDataFetcher";
import AdminTable from "@/app/UiComponents/DataViewer/AdminTable";
import {Box} from "@mui/material";
import DrawerWithContent from "@/app/UiComponents/DataViewer/DrawerWithContent";
import ApplicationWithProfileViewer from "@/app/UiComponents/admin/ApplicationWIthProfileViewer";
import SearchComponent from "@/app/UiComponents/formComponents/SearchComponent";
import React from "react";
import FilterSelect from "@/app/UiComponents/formComponents/FilterSelect";

const columns = [
    {name: "student.personalInfo.basicInfo.name", label: "الاسم"},
    {name: "student.email", label: "الايميل"},
    {name: "student.personalInfo.contactInfo.phone", label: "رقم الهاتف"},
    {name: "createdAt", label: "تاريخ الطلب", type: "date"}
];
const dateOptions = [
    {id: "old", name: "ترتيب من الاقدم للاحدث"}
    ,
    {id: "new", name: "ترتيب من الاحدث للاقدم"}

]
export default function Applications() {


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
    } = useDataFetcher(`shared/grants/applications/uncompleted`, false);
    return (
          <Box mt={2}>
              <Box display="flex" width="fit-content" gap={2} px={2} flexWrap="wrap">
                  <SearchComponent
                        apiEndpoint="search?model=user"
                        setFilters={setFilters}
                        inputLabel="  ابحث بالاسم او الايميل لاختيار طالب"
                        renderKeys={["personalInfo.basicInfo.name", "email"]}
                        mainKey="email"
                        localFilters={{role: "STUDENT"}}
                  />
                  <FilterSelect options={dateOptions} label={"تصنيف حسب التاريخ"}
                                loading={false}
                                param={"sort"}
                                setFilters={setFilters}

                  />
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
                              <DrawerWithContent item={item} component={ApplicationWithProfileViewer}
                                                 extraData={{
                                                     route: "shared/grants/applications",
                                                     label: "اتخاذ اجراء",
                                                     setData: setData,
                                                 }}/>
                          </Box>
                    )}
              />

          </Box>
    );
}

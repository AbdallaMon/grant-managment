"use client";
import useDataFetcher from "@/app/helpers/hooks/useDataFetcher";
import AdminTable from "@/app/UiComponents/DataViewer/AdminTable";
import {Box} from "@mui/material";
import {GrantType} from "@/app/helpers/constants";
import FilterSelect from "@/app/UiComponents/formComponents/FilterSelect";
import CreateModal from "@/app/UiComponents/models/CreateModal";
import DrawerWithContent from "@/app/UiComponents/DataViewer/DrawerWithContent";
import UserSelectorWithAction from "@/app/UiComponents/admin/UserSelectorWithAction";
import {convertEnumToOptions} from "@/app/helpers/functions/utility";

const columns = [
    {name: "name", label: "الاسم"},
    {name: "type", label: "نوع المشروع", enum: GrantType},
    {name: "amount", label: "مبلغ المحفظة الكلي"},
    {name: "amountLeft", label: "المبلغ المتبقي"},
    {name: "_count.userGrants", label: "عدد المنح"},
];

const inputs = [
    {
        data: {id: "name", type: "text", label: "اسم المشروع",},
        pattern: {
            required: {
                value: true,
                message: "الرجاء إدخال اسم المشروع",
            },
        }
    },
    {
        data: {
            id: "type", type: "SelectField", label: "نوع المشروع", options: [{
                label: "جهة داعمة", value: "SPONSOR",
            }, {
                label: "كفيل", value: "INDIVIDUAL",
            }],
            enums: GrantType
        },
    },
    {
        data: {id: "amount", type: "number", label: "مبلغ المحفظة الكلي",},
        pattern: {
            required: {
                value: true,
                message: "الرجاء إدخال مبلغ",
            },
        }
    },
]

export default function GrantPage() {
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
    } = useDataFetcher("shared/grants/projects", false);

    return (
          <Box mt={2}>
              <Box display="flex" width="fit-content" gap={2} px={2} flexWrap="wrap">
                  <FilterSelect options={convertEnumToOptions(GrantType)} label={"نوع المنحة"}
                                loading={false}
                                param={"type"}
                                setFilters={setFilters}
                  />
                  <CreateModal
                        label={"انشاء مشروع منحة"}
                        inputs={inputs}
                        href={"admin/grants/projects"}
                        setData={setData}
                        extraProps={{formTitle: "حساب داعم  جديد", btnText: "انشاء", variant: "outlined"}}
                  />
              </Box>
              <AdminTable
                    data={data}
                    withEdit={true}
                    editHref={"admin/grants/projects"}
                    withDelete={true}
                    deleteHref={"admin/grants/projects"}
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
                              <DrawerWithContent item={item} component={UserSelectorWithAction}
                                                 extraData={{
                                                     route: `admin/grants/projects/access`,
                                                     label: "اضافة مانحين (صلاحيات وصول)",
                                                     searchFilter: {
                                                         OR: [
                                                             {role: "SPONSOR"},
                                                             {role: "INDIVIDUAL"}
                                                         ]
                                                     },
                                                     renderKeys: [{
                                                         id: "name", label: "اسم المنحة"
                                                     },
                                                         {id: "type", label: "نوع المنحة", enums: GrantType},
                                                         {id: "amount", label: "مبلغ المحفظة"},
                                                         {id: "amountLeft", label: "مبلغ المحفظة المتبقي"}
                                                     ]
                                                 }}/>
                          </Box>
                    )}
              />

          </Box>
    );
}

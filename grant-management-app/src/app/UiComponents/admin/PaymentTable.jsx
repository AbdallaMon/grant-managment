"use client";
import React from "react";
import { Box, Container } from "@mui/material";
import AdminTable from "@/app/UiComponents/DataViewer/AdminTable";
import { useAuth } from "@/app/providers/AuthProvider";
import { PaymentStatus } from "@/app/helpers/constants";
import { PaymentHistoryModal } from "./PaymentHistoryModal";
import { BasicTabs } from "../DataViewer/BasicTabs";
import useDataFetcher from "@/app/helpers/hooks/useDataFetcher";

const inputs = [
  {
    data: { id: "amount", label: "المبلغ المراد دفعة", type: "number" },
    pattern: { required: { value: true, message: "يجب ادخال مبلغ" } },
  },
  {
    data: {
      id: "paidAt",
      label: "تاريخ الدفع",
      type: "date",
      defaultValue: new Date(),
    },
    useDefault: true,
    pattern: { required: { value: true, message: "يجب ادخال ميعاد" } },
  },
  {
    data: { id: "studentId", key: "userGrant.userId", type: "number" },
    sx: { display: "none" },
  },
];
const columns = [
  { name: "id", label: "رقم الدفعة" },
  ,
  {
    name: "userGrant.applicationId",
    label: "معرف  طلب المنحة",
    linkCondition: (item) => {
      return `/dashboard/apps/view/${item.userGrant.applicationId}/${item.userGrant.userId}`;
    },
    type: "href",
  },
  { name: "userGrant.grant.name", label: "اسم المنحه" },
  { name: "userGrant.user.personalInfo.basicInfo.name", label: "اسم الطالب" },
  { name: "amount", label: "المبلغ" },
  { name: "amountPaid", label: "المبلغ المدفوع من هذه الدفعه" },
  { name: "dueDate", label: "ميعاد الدفع" },
  { name: "paidAt", label: "مدفوعة بتاريخ", type: "date" },
  { name: "status", label: "حالة الدفع", type: "enum", enum: PaymentStatus },
];
const PaymentTable = ({ paymentStatus = "PAID" }) => {
  const { user } = useAuth();

  const extraParams = user.role === "ADMIN" ? `?isAdmin=true&` : "";

  const {
    data,
    loading,
    setData,
    page,
    setPage,
    limit,
    setLimit,
    total,
    setTotal,
    totalPages,
    setFilters,
  } = useDataFetcher(`shared/payments/status?`, false, {
    status: paymentStatus,
  });
  console.log(data, "data");

  function handleAfterEdit(p) {
    const newPayments = data.map((payment) => {
      if (payment.id === p.id) {
        payment.amountPaid = p.amountPaid;
      }
      return payment;
    });
    setData(newPayments);
  }
  const tabs = [
    { label: "الدفعات", href: "/dashboard/payments" },
    { label: "الدفعات المتاخرة", href: "/dashboard/payments/overdue" },
    { label: "الدفعات المدفوعه", href: "/dashboard/payments/paid" },
  ];
  return (
    <Container maxWidth="xxl" px={{ xs: 2, md: 4 }}>
      <Box mb={3}>
        <BasicTabs tabs={tabs} />;
      </Box>
      <AdminTable
        data={data} // Use filtered payments based on selected date
        columns={columns}
        loading={loading}
        mit={limit}
        page={page}
        total={total}
        setPage={setPage}
        setLimit={setLimit}
        setTotal={setTotal}
        setData={setData}
        totalPages={totalPages}
        withEdit={true}
        handleAfterEdit={(data) => handleAfterEdit(data)}
        editHref={"shared/payments/pay"}
        editButtonText={"دفع"}
        renderFormTitle={(payment) => `الدفعة رقم # ${payment.id}`}
        inputs={inputs}
        extraEditParams={extraParams}
        editFormButton="دفع"
        extraComponent={({ item }) => (
          <>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <PaymentHistoryModal payment={item} />
            </Box>
          </>
        )}
      />
    </Container>
  );
};

export default PaymentTable;

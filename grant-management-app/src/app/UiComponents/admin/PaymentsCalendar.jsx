"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Container,
  Select,
  MenuItem,
} from "@mui/material";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { getData } from "@/app/helpers/functions/getData";
import AdminTable from "@/app/UiComponents/DataViewer/AdminTable";
import { useAuth } from "@/app/providers/AuthProvider";
import { useRouter, useSearchParams } from "next/navigation";
import { PaymentStatus } from "@/app/helpers/constants";
import { BasicTabs } from "../DataViewer/BasicTabs";

const localizer = momentLocalizer(moment);

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
const PaymentCalendar = ({ paymentStatus }) => {
  const { user } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(moment()); // Current month for API data fetching
  const [payments, setPayments] = useState([]); // Payments fetched from the API
  const [filteredPayments, setFilteredPayments] = useState([]); // Payments filtered by selected date
  const [loading, setLoading] = useState(true); // Loading state for data fetching
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("paymentId");
  const router = useRouter();
  const [status, setStatus] = useState("ALL");
  const fetchPayments = async (month, paymentId = null) => {
    const extraParams = user.role !== "ADMIN" ? `userId=${user.id}&` : "";
    let response;
    if (paymentId) {
      // Fetch specific payment by `paymentId`
      response = await getData({
        url: `shared/payments?status=${paymentStatus}&`,
        setLoading,
      });
      const payment = response.data ? response.data[0] : null;

      if (payment) {
        const paymentMonth = moment(payment.dueDate);
        if (!currentMonth.isSame(paymentMonth, "month")) {
          setCurrentMonth(paymentMonth); // Set current month only if different
        }
        setFilteredPayments([payment]); // Filter by specific payment
      }
    } else {
      // Fetch all payments for the specified month
      response = await getData({
        url: `shared/payments?month=${month.format(
          "YYYY-MM"
        )}&status=${status}&${extraParams}`,
        setLoading,
      });
      setPayments(response.data || []);
      setFilteredPayments(response.data || []); // Set filtered payments to all if no `paymentId`
    }
  };
  useEffect(() => {
    if (paymentId) {
      fetchPayments(currentMonth, paymentId);
    } else {
      fetchPayments(currentMonth);
    }
  }, [currentMonth, status, paymentId]);

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };
  const handleResetFilter = () => {
    router.push("/dashboard/payments");
  };
  const handleDateSelect = (slotInfo) => {
    const selectedDateString = moment(slotInfo.start).format("YYYY-MM-DD");
    const filtered = payments.filter(
      (payment) =>
        moment(payment.dueDate).format("YYYY-MM-DD") === selectedDateString
    );
    setFilteredPayments(filtered);
  };

  const handleNextMonth = () => {
    const nextMonth = currentMonth.clone().add(1, "month");
    setCurrentMonth(nextMonth);
  };

  const handlePrevMonth = () => {
    const prevMonth = currentMonth.clone().subtract(1, "month");
    setCurrentMonth(prevMonth);
  };

  const events = payments.map((payment) => ({
    title: `دفعة: ${payment.amount}`,
    start: new Date(payment.dueDate),
    end: new Date(payment.dueDate),
    allDay: true,
  }));

  const extraParams = user.role === "ADMIN" ? `?isAdmin=true&` : "";

  function handleAfterEdit(data) {
    const newPayments = filteredPayments.map((payment) => {
      if (payment.id === data.id) {
        payment.amountPaid = data.amountPaid;
      }
      return payment;
    });
    setFilteredPayments(newPayments);
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
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Button variant="contained" onClick={handlePrevMonth}>
          الشهر الماضي
        </Button>
        <Typography variant="h6">{currentMonth.format("MMMM YYYY")}</Typography>
        <Button variant="contained" onClick={handleNextMonth}>
          الشهر القادم
        </Button>
      </Box>
      <Box mb={3} sx={{ overflow: "auto" }}>
        <BigCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          views={["month"]}
          date={currentMonth.toDate()} // Pass the current month to the calendar
          onNavigate={(date) => {
            const newMonth = moment(date);
            if (!currentMonth.isSame(newMonth, "month")) {
              setCurrentMonth(newMonth);
            }
          }}
          onSelectEvent={handleDateSelect}
          selectable
          style={{ height: 500, minWidth: 800 }}
          popup
          toolbar={false}
        />
      </Box>
      <Box
        mb={3}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Button variant="outlined" onClick={handleResetFilter}>
          إعادة تعيين التصفية
        </Button>
        <Select
          value={status}
          onChange={handleStatusChange}
          displayEmpty
          inputProps={{ "aria-label": "Filter by status" }}
        >
          <MenuItem value="ALL">جميع الحالات</MenuItem>
          <MenuItem value="PENDING">قيد الانتظار</MenuItem>
          <MenuItem value="PAID">مدفوع</MenuItem>
          <MenuItem value="OVERDUE">متأخر</MenuItem>
        </Select>
      </Box>

      <AdminTable
        data={filteredPayments} // Use filtered payments based on selected date
        columns={columns}
        loading={loading}
        noPagination={true}
        withEdit={true}
        handleAfterEdit={(data) => handleAfterEdit(data)}
        editHref={"shared/payments/pay"}
        editButtonText={"دفع"}
        renderFormTitle={(item) => `الدفعة رقم # ${item.id}`}
        inputs={inputs}
        extraEditParams={extraParams}
        editFormButton="دفع"
      />
    </Container>
  );
};

export default PaymentCalendar;

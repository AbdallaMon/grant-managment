"use client";
import React, {useState, useEffect} from 'react';
import {Box, Button, Typography, Badge, Container} from '@mui/material';
import {Calendar as BigCalendar, momentLocalizer} from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {getData} from "@/app/helpers/functions/getData";
import AdminTable from "@/app/UiComponents/DataViewer/AdminTable";
import {useAuth} from "@/app/providers/AuthProvider";
import {useRouter, useSearchParams} from "next/navigation";

const localizer = momentLocalizer(moment);


const inputs = [
    {
        data: {id: "amount", label: "المبلغ المراد دفعة", type: "number"}
        , pattern: {required: {value: true, message: "يجب ادخال مبلغ"}}
    },
    {
        data: {id: "paidAt", label: "تاريخ الدفع", type: "date", defaultValue: new Date()}
        ,
        useDefault: true
        , pattern: {required: {value: true, message: "يجب ادخال ميعاد"}}
    }
    , {
        data: {id: "studentId", key: "userGrant.userId", type: "number"}, sx: {display: "none"}
    }
]
const columns = [
    {name: "id", label: "رقم الدفعة"},
    ,
    {
        name: "userGrant.applicationId", label: "معرف  طلب المنحة", linkCondition: (item) => {
            return `/dashboard/apps/view/${item.userGrant.applicationId}/${item.userGrant.userId}`;
        },
        type: "href"

    },
    {name: "userGrant.grant.name", label: "اسم المنحه"},
    {name: "userGrant.user.personalInfo.basicInfo.name", label: "اسم الطالب"},
    {name: "amount", label: "المبلغ"},
    {name: "amountPaid", label: "المبلغ المدفوع من هذه الدفعه"},
    {name: "dueDate", label: "ميعاد الدفع"},
];
const PaymentCalendar = () => {
    const {user} = useAuth();
    const [currentMonth, setCurrentMonth] = useState(moment()); // Current month for API data fetching
    const [payments, setPayments] = useState([]); // Payments fetched from the API
    const [filteredPayments, setFilteredPayments] = useState([]); // Payments filtered by selected date
    const [loading, setLoading] = useState(true); // Loading state for data fetching
    const router = useRouter();
    const searchParams = useSearchParams()
    const paymentId = searchParams.get("paymentId")
    const fetchPayments = async (month) => {
        const extraParams = user.role !== "ADMIN" ? `userId=${user.id}&` : "";
        const response = await getData({
            url: `shared/payments?month=${month.format('YYYY-MM')}&${extraParams}`,
            setLoading
        });
        setPayments(response.data || []);
        if (paymentId) {
            setFilteredPayments(response.data.filter((payment) => payment.id == paymentId))
            const newSearchParams = new URLSearchParams(searchParams);
            newSearchParams.delete("paymentId");
            router.replace(`?${newSearchParams.toString()}`);
        } else {
            setFilteredPayments(response.data || []);
        }
    };

    useEffect(() => {
        fetchPayments(currentMonth); // Fetch payments when the month changes
    }, [currentMonth]);
    const handleDateSelect = (slotInfo) => {
        const selectedDateString = moment(slotInfo.start).format('YYYY-MM-DD');
        const filtered = payments.filter(payment => moment(payment.dueDate).format('YYYY-MM-DD') === selectedDateString);
        setFilteredPayments(filtered);
    };

    const handleNextMonth = () => {
        const nextMonth = currentMonth.clone().add(1, 'month');
        setCurrentMonth(nextMonth);
    };

    const handlePrevMonth = () => {
        const prevMonth = currentMonth.clone().subtract(1, 'month');
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
                payment.amountPaid = data.amountPaid
            }
            return payment
        })
        setFilteredPayments(newPayments)
    }

    return (
          <Container maxWidth="xxl" px={{xs: 2, md: 4}}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                  <Button variant="contained" onClick={handlePrevMonth}>الشهر الماضي</Button>
                  <Typography variant="h6">{currentMonth.format('MMMM YYYY')}</Typography>
                  <Button variant="contained" onClick={handleNextMonth}>الشهر القادم</Button>
              </Box>
              <Box mb={3} sx={{overflow: "auto"}}>
                  <BigCalendar
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        views={['month']}
                        date={currentMonth.toDate()} // Pass the current month to the calendar
                        onNavigate={(date) => {
                            const newMonth = moment(date);
                            if (!currentMonth.isSame(newMonth, 'month')) {
                                setCurrentMonth(newMonth);
                            }
                        }}
                        onSelectEvent={handleDateSelect}
                        selectable
                        style={{height: 500, minWidth: 800}}
                        popup
                        toolbar={false}
                  />
              </Box>

              {/* Payment Table */}
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

import React, {useEffect, useState} from "react";
import {Box, Typography, Grid2 as Grid, Card, CardContent, Divider, Alert, Collapse, IconButton} from "@mui/material";
import {MdOutlineExpandMore as ExpandMoreIcon} from "react-icons/md";
import {MdOutlineExpandLess as ExpandLessIcon} from "react-icons/md";
import dayjs from "dayjs";
import {getData} from "@/app/helpers/functions/getData";
import FullScreenLoader from "@/app/UiComponents/feedback/loaders/FullscreenLoader";
import {PayEveryENUM} from "@/app/helpers/constants";
import DrawerWithContent from "@/app/UiComponents/DataViewer/DrawerWithContent";
import AddAGrant from "@/app/UiComponents/admin/AddAGrant";

// Constants for payment status
const PaymentStatus = {
    PENDING: "لم يتم الدفع",
    PAID: "مدفوع"
};
const UserGrantsView = ({item, route, isStudent}) => {
    const [userGrants, setUserGrants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedGrants, setExpandedGrants] = useState([]);
    const [application, setApplication] = useState(null)
    // Fetch user grants
    useEffect(() => {
        const fetchUserGrants = async () => {
            const response = await getData({url: `${route}/${item.id}/user-grant`, setLoading});
            if (!response || !response.data) {
                setError("فشل في جلب البيانات");
            }
            console.log(response.data)
            setUserGrants(response.data.grants);
            setApplication(response.data.application)
            setExpandedGrants(response.data.grants.map(() => true));
        };

        fetchUserGrants();
    }, []);

    const toggleExpand = (index) => {
        const updatedExpandedGrants = [...expandedGrants];
        updatedExpandedGrants[index] = !updatedExpandedGrants[index];
        setExpandedGrants(updatedExpandedGrants);
    };

    if (loading) {
        return <FullScreenLoader/>;
    }

    if (error) {
        return <Alert severity="error" color="error">{error}</Alert>;
    }


    return (
          <Box>
              {userGrants?.length > 0 && !isStudent &&
                    <Box mb={4}>
                        <Typography variant="h5" fontWeight="bold">معلومات المستخدم</Typography>
                        <Divider sx={{my: 2}}/>
                        <Typography>الاسم: {userGrants[0]?.user?.personalInfo?.basicInfo?.name || "غير متوفر"}</Typography>
                        <Typography>البريد الإلكتروني: {userGrants[0]?.user?.email || "غير متوفر"}</Typography>
                    </Box>
              }
              {application?.status === "APPROVED" &&
                    <>
                        <Typography variant="h4" mb={2}>المنح المتاحه</Typography>
                        {userGrants.length === 0 && <Typography>لا يوجد منح لهذا المستخدم.</Typography>}
                        {(!isStudent && (item.studentId || item.userId)) &&
                              <Box my={3}>

                                  <DrawerWithContent item={item} component={AddAGrant}
                                                     extraData={{
                                                         userId: item.studentId || item.userId,
                                                         label: "اضافة منحة جديدة"
                                                         , setUserGrants: setUserGrants
                                                     }}/>
                              </Box>
                        }
                    </>

              }
              {userGrants?.map((userGrant, index) => (
                    <Card key={index} variant="outlined" sx={{
                        mb: 4,
                        backgroundColor: "#f4f6f8", // Different background to distinguish each grant
                        borderRadius: "12px",
                        boxShadow: 2
                    }}>
                        <CardContent>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography variant="h6" gutterBottom>
                                    المنحة {index + 1}
                                </Typography>
                                <IconButton onClick={() => toggleExpand(index)}>
                                    {expandedGrants[index] ? <ExpandLessIcon/> : <ExpandMoreIcon/>}
                                </IconButton>
                            </Box>
                            <Divider sx={{my: 2}}/>

                            <Collapse in={expandedGrants[index]}>
                                <Grid container spacing={2}>
                                    <Grid size={6}>
                                        {!isStudent &&
                                              <Typography>اسم
                                                  المنحة: {userGrant.grant && userGrant.grant.name}</Typography>
                                        }
                                        <Typography>تاريخ
                                            البدء: {dayjs(userGrant.startDate).format("DD/MM/YYYY")}</Typography>
                                        <Typography>تاريخ
                                            النهاية: {dayjs(userGrant.endDate).format("DD/MM/YYYY")}</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography>المدة بين الدفعات: {PayEveryENUM[userGrant.payEvery]}</Typography>
                                        <Typography>إجمالي المبلغ: {userGrant.totalAmounts}</Typography>
                                    </Grid>
                                </Grid>

                                <Typography variant="h6" sx={{mt: 3}}>الدفعات</Typography>
                                <Divider sx={{my: 2}}/>
                                <Grid container spacing={2}>

                                    {/* Render Payments for Each Grant */}
                                    {userGrant.payments.length > 0 ? (
                                          userGrant.payments.map((payment, paymentIndex) => (
                                                <Grid size={{sx: 12, md: 6}} key={paymentIndex} mb={2} p={2} border={1}
                                                      borderRadius={2}
                                                      borderColor="grey.300">
                                                    <Typography>المبلغ: {payment.amount}</Typography>
                                                    <Typography>المبلغ
                                                        المدفوع: {payment.amountPaid || "غير مدفوع"}</Typography>
                                                    <Typography>تاريخ
                                                        الاستحقاق: {dayjs(payment.dueDate).format("DD/MM/YYYY")}</Typography>
                                                    <Typography>الحالة: {PaymentStatus[payment.status]}</Typography>
                                                    {payment.status === "PAID" && (
                                                          <Typography>تم الدفع
                                                              في: {dayjs(payment.paidAt).format("DD/MM/YYYY")}</Typography>
                                                    )}
                                                </Grid>
                                          ))
                                    ) : (
                                          <Typography>لا توجد دفعات</Typography>
                                    )}
                                </Grid>
                            </Collapse>
                        </CardContent>
                    </Card>
              ))}
          </Box>
    );
};

export default UserGrantsView;

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
const UserGrantsView = ({item, route, isStudent, isApplication = false}) => {
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
              {/* User Information */}
              {userGrants?.length > 0 && !isStudent && (
                    <>
                        {!isApplication &&

                              <Card sx={{
                                  mb: 4,
                                  p: 3,
                                  backgroundColor: "#f9f9f9",
                                  borderRadius: "16px",
                                  boxShadow: 3
                              }}>
                                  <CardContent>
                                      <Typography variant="h5" fontWeight="bold" color="primary.main" mb={2}>
                                          معلومات المستخدم
                                      </Typography>
                                      <Divider sx={{my: 2}}/>
                                      <Typography>الاسم: {userGrants[0]?.user?.personalInfo?.basicInfo?.name || "غير متوفر"}</Typography>
                                      <Typography>البريد
                                          الإلكتروني: {userGrants[0]?.user?.email || "غير متوفر"}</Typography>
                                  </CardContent>
                              </Card>
                        }
                    </>
              )}

              {/* Available Grants Section */}
              {application?.status === "APPROVED" && (
                    <Box mb={4}>
                        <Typography variant="h4" mb={2} color="primary.main">المنح المتاحه</Typography>
                        {userGrants.length === 0 ? (
                              <Typography>لا يوجد منح لهذا المستخدم.</Typography>
                        ) : (
                              <>
                                  {/* Add Grant Button for Non-Students */}
                                  {(!isStudent && (item.studentId || item.userId)) && (
                                        <Box my={2}>
                                            <DrawerWithContent
                                                  item={item}
                                                  component={AddAGrant}
                                                  extraData={{
                                                      userId: item.studentId || item.userId,
                                                      label: "اضافة منحة جديدة",
                                                      setUserGrants: setUserGrants
                                                  }}
                                            />
                                        </Box>
                                  )}

                                  {/* Grant Details */}
                                  {userGrants.map((userGrant, index) => (
                                        <Card key={index} sx={{
                                            mb: 4,
                                            p: 3,
                                            backgroundColor: "#ffffff",
                                            borderRadius: "16px",
                                            boxShadow: 2
                                        }}>
                                            <CardContent>
                                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                                    <Typography variant="h6" fontWeight="bold" color="text.primary">
                                                        المنحة {index + 1}
                                                    </Typography>
                                                    <IconButton onClick={() => toggleExpand(index)}
                                                                aria-label="Expand/Collapse">
                                                        {expandedGrants[index] ? <ExpandLessIcon/> : <ExpandMoreIcon/>}
                                                    </IconButton>
                                                </Box>
                                                <Collapse in={expandedGrants[index]}>
                                                    <Divider sx={{my: 2}}/>
                                                    <Grid container spacing={2}>
                                                        <Grid item size={{xs: 12, md: 6}}>
                                                            <Typography>اسم
                                                                المنحة: {userGrant.grant?.name || "غير متوفر"}</Typography>
                                                            <Typography>تاريخ
                                                                البدء: {dayjs(userGrant.startDate).format("DD/MM/YYYY")}</Typography>
                                                            <Typography>تاريخ
                                                                النهاية: {dayjs(userGrant.endDate).format("DD/MM/YYYY")}</Typography>
                                                        </Grid>
                                                        <Grid item size={{xs: 12, md: 6}}>
                                                            <Typography>المدة بين
                                                                الدفعات: {PayEveryENUM[userGrant.payEvery]}</Typography>
                                                            <Typography>إجمالي
                                                                المبلغ: {userGrant.totalAmounts}</Typography>
                                                        </Grid>
                                                    </Grid>
                                                    <Typography variant="h6" fontWeight="bold" mt={3}
                                                                color="primary.main">
                                                        الدفعات
                                                    </Typography>
                                                    <Divider sx={{my: 2}}/>
                                                    <Grid container spacing={2}>
                                                        {userGrant.payments.length > 0 ? (
                                                              userGrant.payments.map((payment, paymentIndex) => (
                                                                    <Grid item size={{xs: 12, md: 6}} key={paymentIndex}
                                                                          sx={{
                                                                              mb: 2,
                                                                              p: 2,
                                                                              bgcolor: "#f5f5f5",
                                                                              borderRadius: 2
                                                                          }}>
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
                              </>
                        )}
                    </Box>
              )}
          </Box>

    );
};

export default UserGrantsView;

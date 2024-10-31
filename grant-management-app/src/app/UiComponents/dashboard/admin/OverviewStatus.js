// components/OverviewStats.js
'use client';

import React, {useEffect, useState} from 'react';
import {
    Card,
    CardContent,
    Typography,
    Grid2 as Grid,
    Divider,
    List,
    ListItem,
    ListItemText, useTheme,
} from '@mui/material';
import {Role, ApplicationStatus} from '@/app/helpers/constants';
import {Bar} from 'react-chartjs-2';
import 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {Chart} from 'chart.js';
import LoadingOverlay from '@/app/UiComponents/feedback/loaders/LoadingOverlay';
import {getData} from "@/app/helpers/functions/getData";

import CustomTable from "@/app/UiComponents/dashboard/CustomTable";

// Register the ChartDataLabels plugin
Chart.register(ChartDataLabels);

const COLORS = ["#45cb85", '#3b82f6', '#c084f9', '#249782'];

const OverviewStats = () => {
    // Users by Role
    const [usersByRole, setUsersByRole] = useState([]);
    const [usersLoading, setUsersLoading] = useState(false);

    // Applications Stats
    const [totalApplications, setTotalApplications] = useState(0);
    const [applicationsByStatus, setApplicationsByStatus] = useState([]);
    const [applicationsLoading, setApplicationsLoading] = useState(false);

    // Grants Stats
    const [totalGrants, setTotalGrants] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [totalAmountLeft, setTotalAmountLeft] = useState(0);
    const [totalMoneySpent, setTotalMoneySpent] = useState(0);
    const [grantsLoading, setGrantsLoading] = useState(false);

    // Payments Overview
    const [paymentsOverview, setPaymentsOverview] = useState([]);
    const [paymentsLoading, setPaymentsLoading] = useState(false);
    const theme = useTheme()

    // Fetch Users by Role
    const fetchUsersByRole = async () => {
        setUsersLoading(true);
        const res = await getData({
            url: `admin/dashboard/users-by-role`,
            setLoading: setUsersLoading,
        });
        if (res) {
            setUsersByRole(res);
        }
    };

    // Fetch Applications Stats
    const fetchApplicationsStats = async () => {
        setApplicationsLoading(true);
        const res = await getData({
            url: `admin/dashboard/applications-stats`,
            setLoading: setApplicationsLoading,
        });
        if (res) {
            setTotalApplications(res.totalApplications);
            setApplicationsByStatus(res.applicationsByStatus);
        }
    };

    // Fetch Grants Stats
    const fetchGrantsStats = async () => {
        setGrantsLoading(true);
        const res = await getData({
            url: `admin/dashboard/grants-stats`,
            setLoading: setGrantsLoading,
        });
        if (res) {
            setTotalGrants(res.totalGrants);
            setTotalAmount(res.totalAmount);
            setTotalAmountLeft(res.totalAmountLeft);
            setTotalMoneySpent(res.totalMoneySpent);
        }
    };

    // Fetch Payments Overview
    const fetchPaymentsOverview = async () => {
        setPaymentsLoading(true);
        const res = await getData({
            url: `admin/dashboard/payments-overview`,
            setLoading: setPaymentsLoading,
        });
        if (res) {
            setPaymentsOverview(res);
        }
    };

    useEffect(() => {
        fetchUsersByRole();
        fetchApplicationsStats();
        fetchGrantsStats();
        fetchPaymentsOverview();
    }, []);

    // Compute total users
    const totalUsers = usersByRole.reduce((sum, role) => sum + role._count, 0);

    // Prepare data for Applications By Status Chart
    const applicationsByStatusChartData = {
        labels: applicationsByStatus.map(
              (status) => ApplicationStatus[status.status] || status.status
        ),
        datasets: [
            {
                label: 'عدد الطلبات',
                data: applicationsByStatus.map((status) => status._count),
                backgroundColor: COLORS,
            },
        ],
    };

    // Prepare data for Total Spending Chart
    const spendingChartData = {
        labels: [
            'إجمالي المبلغ',
            'المبالغ المستحقة',
            'المبالغ المتبقية',
            'اجمالي المدفوعات',
        ],
        datasets: [
            {
                label: 'المبلغ',
                data: [
                    totalAmount,
                    totalAmount - totalAmountLeft,
                    totalAmountLeft,
                    totalMoneySpent,
                ],
                backgroundColor: COLORS,
            },
        ],
    };
    const columns = [
        {
            name: "id",
            label: "رقم الدفع",
            type: "href",
            linkCondition: (item) => `/dashboard/payments?paymentId=${item.id}`
        },
        {name: "amount", label: "المبلغ"},
        {name: "dueDate", label: "تاريخ الاستحقاق"},
    ];
    return (
          <>
              {/* Users by Role */}
              <Card sx={{
                  position: 'relative',
                  minHeight: '300px',
                  backgroundColor: theme.palette.background.default,
                  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                  borderRadius: '12px',
                  padding: {xs: 2, md: 4},
              }}> <CardContent>
                  <Typography variant="h6" gutterBottom align="right">
                      {'المستخدمين'}
                  </Typography>
                  {usersLoading ? (
                        <LoadingOverlay/>
                  ) : usersByRole.length > 0 ? (
                        <>
                            <List>
                                <Grid container spacing={2}>
                                    {usersByRole.map((role) => (
                                          <Grid size={6} key={role.role}
                                          >
                                              <ListItem
                                                    sx={{
                                                        display: 'flex',
                                                        justifyContent: 'flex-end',
                                                        backgroundColor: theme.palette.primary.main,
                                                        color: theme.palette.primary.contrastText,
                                                        borderRadius: 1,
                                                        padding: '12px 16px',
                                                        boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
                                                        transition: 'transform 0.2s ease-in-out',
                                                    }}
                                              >
                                                  <ListItemText
                                                        primaryTypographyProps={{
                                                            variant: 'subtitle1',
                                                            align: 'right',
                                                            fontWeight: 500,
                                                            color: theme.palette.primary.contrastText,
                                                        }}
                                                        primary={`${Role[role.role] || role.role}: ${role._count}`}
                                                  />
                                              </ListItem>
                                          </Grid>
                                    ))}
                                </Grid>
                            </List>
                            <Divider sx={{my: 1}}/>
                            <Typography variant="subtitle1" align="right"

                                        sx={{
                                            fontWeight: 600,
                                            fontSize: '1rem',
                                            color: theme.palette.primary.main,
                                            letterSpacing: '0.5px',
                                            marginBottom: '12px',
                                        }}
                            >
                                {'إجمالي المستخدمين'}: {totalUsers}
                            </Typography>
                        </>
                  ) : (
                        <Typography align="right"
                                    sx={{
                                        fontWeight: 600,
                                        fontSize: '1rem',
                                        color: theme.palette.primary.main,
                                        letterSpacing: '0.5px',
                                        marginBottom: '12px',
                                    }}
                        >{'لا توجد بيانات'}</Typography>
                  )}
              </CardContent>
              </Card>

              {/* Payments Overview */}
              <Card sx={{
                  position: 'relative',
                  minHeight: '300px',
                  backgroundColor: theme.palette.background.default,
                  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                  borderRadius: '12px',
                  padding: {xs: 2, md: 4},
              }}> <CardContent>
                  <Typography variant="h6" gutterBottom>
                      {'الدفعات المستحقة لهذا الشهر'}
                  </Typography>
                  <CustomTable columns={columns} data={paymentsOverview} loading={paymentsLoading}/>
              </CardContent>
              </Card>

              {/* Applications By Status */}
              <Card sx={{
                  position: 'relative',
                  minHeight: '300px',
                  backgroundColor: theme.palette.background.default,
                  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                  borderRadius: '12px',
                  padding: {xs: 2, md: 4},
              }}> <CardContent>
                  <Typography variant="h6" gutterBottom>
                      {'إجمالي الطلبات'}
                  </Typography>
                  {applicationsLoading ? (
                        <LoadingOverlay/>
                  ) : (
                        <>
                            <Typography variant="subtitle1"
                                        sx={{
                                            fontWeight: 600,
                                            fontSize: '1rem',
                                            color: theme.palette.primary.main,
                                            letterSpacing: '0.5px',
                                            marginBottom: '12px',
                                        }}
                            >{`الإجمالي: ${totalApplications}`}</Typography>
                            {applicationsByStatus.length > 0 ? (
                                  <Bar
                                        data={applicationsByStatusChartData}
                                        options={{
                                            responsive: true,
                                            plugins: {
                                                legend: {display: false},
                                                tooltip: {enabled: true},
                                                datalabels: {
                                                    anchor: 'center',
                                                    align: 'center',
                                                    formatter: (value) => value,
                                                    font: {
                                                        weight: 'bold',
                                                    },
                                                },
                                            },
                                            scales: {
                                                y: {beginAtZero: true, precision: 0},
                                            },
                                        }}
                                  />
                            ) : (
                                  <Typography
                                        sx={{
                                            fontWeight: 600,
                                            fontSize: '1rem',
                                            color: theme.palette.primary.main,
                                            letterSpacing: '0.5px',
                                            marginBottom: '12px',
                                        }}
                                  >{'لا توجد بيانات'}</Typography>
                            )}
                        </>
                  )}
              </CardContent>
              </Card>

              <Card sx={{
                  position: 'relative',
                  minHeight: '300px',
                  backgroundColor: theme.palette.background.default,
                  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                  borderRadius: '12px',
                  padding: {xs: 2, md: 4},
              }}> <CardContent>
                  <Typography variant="h6" gutterBottom>
                      {'إجمالي الإنفاق والمنح'}
                  </Typography>
                  {grantsLoading ? (
                        <LoadingOverlay/>
                  ) : (
                        <>
                            <Typography variant="subtitle1"
                                        sx={{
                                            fontWeight: 600,
                                            fontSize: '1rem',
                                            color: theme.palette.primary.main,
                                            letterSpacing: '0.5px',
                                            marginBottom: '12px',
                                        }}
                            >{`إجمالي المنح: ${totalGrants}`}</Typography>
                            <Bar
                                  data={spendingChartData}
                                  options={{
                                      responsive: true,
                                      plugins: {
                                          legend: {display: false},
                                          tooltip: {enabled: true},
                                          datalabels: {
                                              anchor: 'center',
                                              align: 'center',
                                              formatter: (value) => value,
                                              font: {
                                                  weight: 'bold',
                                              },
                                          },
                                      },
                                      scales: {
                                          y: {beginAtZero: true, precision: 0},
                                      },
                                  }}
                            />
                        </>
                  )}
              </CardContent>
              </Card>

          </>
    );
};

export default OverviewStats;

// components/OverviewStats.js
'use client';

import React, {useEffect, useState} from 'react';
import {
    Card,
    CardContent,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Divider,
    List,
    ListItem,
    ListItemText,
} from '@mui/material';
import {Role, ApplicationStatus} from '@/app/helpers/constants';
import {Bar} from 'react-chartjs-2';
import 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {Chart} from 'chart.js';
import LoadingOverlay from '@/app/UiComponents/feedback/loaders/LoadingOverlay';
import {getData} from "@/app/helpers/functions/getData";

// Register the ChartDataLabels plugin
Chart.register(ChartDataLabels);

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']; // Chart Colors

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

    return (
          <>
              {/* Users by Role */}
              <Card sx={{position: 'relative', minHeight: '200px'}}>
                  <CardContent>
                      <Typography variant="h6" gutterBottom align="right">
                          {'المستخدمين'}
                      </Typography>
                      {usersLoading ? (
                            <LoadingOverlay/>
                      ) : usersByRole.length > 0 ? (
                            <>
                                <List>
                                    {usersByRole.map((role) => (
                                          <ListItem
                                                key={role.role}
                                                sx={{display: 'flex', justifyContent: 'flex-end'}}
                                          >
                                              <ListItemText
                                                    primaryTypographyProps={{
                                                        variant: 'subtitle1',
                                                        align: 'right',
                                                    }}
                                                    primary={`${Role[role.role] || role.role}: ${role._count}`}
                                              />
                                          </ListItem>
                                    ))}
                                </List>
                                <Divider sx={{my: 1}}/>
                                <Typography variant="subtitle1" align="right">
                                    {'إجمالي المستخدمين'}: {totalUsers}
                                </Typography>
                            </>
                      ) : (
                            <Typography align="right">{'لا توجد بيانات'}</Typography>
                      )}
                  </CardContent>
              </Card>

              {/* Payments Overview */}
              <Card sx={{position: 'relative', minHeight: '300px'}}>
                  <CardContent>
                      <Typography variant="h6" gutterBottom>
                          {'الدفعات المستحقة لهذا الشهر'}
                      </Typography>
                      {paymentsLoading ? (
                            <LoadingOverlay/>
                      ) : paymentsOverview.length > 0 ? (
                            <>
                                <TableContainer component={Paper}>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align="right">{'رقم الدفعة'}</TableCell>
                                                <TableCell align="right">{'المبلغ'}</TableCell>
                                                <TableCell align="right">{'تاريخ الاستحقاق'}</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {paymentsOverview.map((payment) => (
                                                  <TableRow key={payment.id}>
                                                      <TableCell align="right">{payment.id}</TableCell>
                                                      <TableCell align="right">{payment.amount}</TableCell>
                                                      <TableCell align="right">
                                                          {new Date(payment.dueDate).toLocaleDateString('ar-EG')}
                                                      </TableCell>
                                                  </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <Typography variant="subtitle1" sx={{mt: 2}}>
                                    {'إجمالي المبلغ المستحق لهذا الشهر'}:{' '}
                                    {paymentsOverview.reduce(
                                          (sum, payment) => sum + payment.amount,
                                          0
                                    )}
                                </Typography>
                            </>
                      ) : (
                            <Typography>{'لا توجد دفعات معلقة لهذا الشهر'}</Typography>
                      )}
                  </CardContent>
              </Card>

              {/* Applications By Status */}
              <Card sx={{position: 'relative', minHeight: '400px'}}>
                  <CardContent>
                      <Typography variant="h6" gutterBottom>
                          {'إجمالي الطلبات'}
                      </Typography>
                      {applicationsLoading ? (
                            <LoadingOverlay/>
                      ) : (
                            <>
                                <Typography variant="subtitle1">{`الإجمالي: ${totalApplications}`}</Typography>
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
                                      <Typography>{'لا توجد بيانات'}</Typography>
                                )}
                            </>
                      )}
                  </CardContent>
              </Card>

              {/* Total Spending and Grants */}
              <Card sx={{position: 'relative', minHeight: '400px'}}>
                  <CardContent>
                      <Typography variant="h6" gutterBottom>
                          {'إجمالي الإنفاق والمنح'}
                      </Typography>
                      {grantsLoading ? (
                            <LoadingOverlay/>
                      ) : (
                            <>
                                <Typography variant="subtitle1">{`إجمالي المنح: ${totalGrants}`}</Typography>
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

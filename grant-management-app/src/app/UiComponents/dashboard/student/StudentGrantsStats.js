// components/StudentGrantsStats.js
import React, {useEffect, useState} from 'react';
import {Card, CardContent, Typography, Divider, useTheme} from '@mui/material';
import LoadingOverlay from '@/app/UiComponents/feedback/loaders/LoadingOverlay';
import {useAuth} from '@/app/providers/AuthProvider';
import {getData} from '@/app/helpers/functions/getData';
import {Chart, CategoryScale, LinearScale, BarElement, Tooltip, Legend} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {Bar} from "react-chartjs-2";

// Register Chart.js components
Chart.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, ChartDataLabels);

const COLORS = ['#0088FE', '#00C49F'];

const StudentGrantsStats = () => {
    const [stats, setStats] = useState({
        totalPaymentsAmount: 0,
        totalAmountLeft: 0,
        totalAmountPaid: 0
    });
    const theme = useTheme()
    const [loading, setLoading] = useState(true);
    const {user} = useAuth();

    const fetchGrantsStats = async () => {
        const res = await getData({
            url: `student/dashboard/grants-stats`,
            setLoading,
        });
        if (res) {
            setStats(res);
        }
    };

    useEffect(() => {
        if (user) {
            fetchGrantsStats();
        }
    }, [user]);
    const paymentsChartData = {
        labels: ['إجمالي المستحقات', 'إجمالي المستحقات المتبقيه', 'إجمالي المستحقات المدفوعه'],
        datasets: [
            {
                label: 'المبلغ',
                data: [stats.totalPaymentsAmount, stats.totalAmountLeft, stats.totalAmountPaid],
                backgroundColor: COLORS,
            },
        ],
    };
    return (
          <Card sx={{
              position: 'relative',
              minHeight: '300px',
              backgroundColor: theme.palette.background.default,
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
              borderRadius: '12px',
              padding: {xs: 2, md: 4}, width: "100%"
          }}>
              <CardContent>
                  <Typography variant="h6" gutterBottom>
                      {'إحصائيات المنح'}
                  </Typography>
                  {loading ? (
                        <LoadingOverlay/>
                  ) : stats ? (
                        <>
                            <Typography variant="subtitle1" sx={{
                                fontWeight: 600,
                                fontSize: '1rem',
                                color: theme.palette.primary.main,
                                letterSpacing: '0.5px',
                                marginBottom: '12px',
                            }}
                            >{`إجمالي عدد المنح: ${stats.totalUserGrants}`}</Typography>
                            <Divider sx={{my: 1}}/>
                            <Bar
                                  data={paymentsChartData}
                                  options={{
                                      responsive: true,
                                      plugins: {
                                          legend: {display: false},
                                          tooltip: {enabled: true},
                                          datalabels: {
                                              anchor: 'end',
                                              align: 'top',
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
                  ) : (
                        <Typography>{'لا توجد بيانات'}</Typography>
                  )}
              </CardContent>
          </Card>
    );
};

export default StudentGrantsStats;

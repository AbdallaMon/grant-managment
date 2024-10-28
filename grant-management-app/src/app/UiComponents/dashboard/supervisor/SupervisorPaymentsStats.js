import React, {useEffect, useState} from 'react';
import {Card, CardContent, Typography, useTheme} from '@mui/material';
import {Bar} from 'react-chartjs-2';
import LoadingOverlay from '@/app/UiComponents/feedback/loaders/LoadingOverlay';
import {getData} from '@/app/helpers/functions/getData';
import {useAuth} from '@/app/providers/AuthProvider';

// Import Chart.js components
import {Chart, CategoryScale, LinearScale, BarElement, Tooltip, Legend} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Register Chart.js components
Chart.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, ChartDataLabels);

const COLORS = ['#0088FE', '#00C49F'];

const SupervisorPaymentsStats = () => {
    const [totalAmount, setTotalAmount] = useState(0);
    const [totalAmountPaid, setTotalAmountPaid] = useState(0);
    const [loading, setLoading] = useState(true);
    const {user} = useAuth();
    const theme = useTheme()
    const fetchPaymentsStats = async () => {
        const res = await getData({url: `supervisor/dashboard/payments-stats`, setLoading});
        if (res) {
            setTotalAmount(res.totalAmount);
            setTotalAmountPaid(res.totalAmountPaid);
        }
    };

    useEffect(() => {
        if (user) {
            fetchPaymentsStats();
        }
    }, [user]);

    const paymentsChartData = {
        labels: ['اجمالي المستحقات', 'المستحقات المدفوعه'],
        datasets: [
            {
                label: 'المبلغ',
                data: [totalAmount, totalAmountPaid],
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
              padding: {xs: 2, md: 4},
          }}> <CardContent>
              <Typography variant="h6" gutterBottom>
                  {'إجمالي المستحقات والمدفوعات'}
              </Typography>
              {loading ? (
                    <LoadingOverlay/>
              ) : (
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
              )}
          </CardContent>
          </Card>
    );
};

export default SupervisorPaymentsStats;

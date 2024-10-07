import React, {useEffect, useState} from 'react';
import {Card, CardContent, Typography} from '@mui/material';
import {Bar} from 'react-chartjs-2';
import LoadingOverlay from '@/app/UiComponents/feedback/loaders/LoadingOverlay';
import {ApplicationStatus} from '@/app/helpers/constants';
import {useAuth} from '@/app/providers/AuthProvider';
import {getData} from '@/app/helpers/functions/getData';

// Import Chart.js components
import {Chart, CategoryScale, LinearScale, BarElement, Tooltip, Legend} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Register Chart.js components
Chart.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, ChartDataLabels);

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const SupervisorApplicationsStats = () => {
    const [totalApplications, setTotalApplications] = useState(0);
    const [applicationsByStatus, setApplicationsByStatus] = useState([]);
    const [loading, setLoading] = useState(true);
    const {user} = useAuth();

    const fetchApplicationsStats = async () => {
        const res = await getData({url: `supervisor/dashboard/applications-stats`, setLoading});
        if (res) {
            setTotalApplications(res.totalApplications);
            setApplicationsByStatus(res.applicationsByStatus);
        }
    };

    useEffect(() => {
        if (user) {
            fetchApplicationsStats();
        }
    }, [user]);

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

    return (
          <Card sx={{position: 'relative', minHeight: '400px'}}>
              <CardContent>
                  <Typography variant="h6" gutterBottom>
                      {'إجمالي الطلبات'}
                  </Typography>
                  {loading ? (
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
                            ) : (
                                  <Typography>{'لا توجد بيانات'}</Typography>
                            )}
                        </>
                  )}
              </CardContent>
          </Card>
    );
};

export default SupervisorApplicationsStats;

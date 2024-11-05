// components/SponsorGrantsStats.js
import React, {useEffect, useState} from 'react';
import {Card, CardContent, Typography, useTheme, Grid2 as Grid} from '@mui/material';
import LoadingOverlay from '@/app/UiComponents/feedback/loaders/LoadingOverlay';
import {useAuth} from '@/app/providers/AuthProvider';
import {getData} from '@/app/helpers/functions/getData';

const SponsorGrantsStats = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const {user} = useAuth();
    const theme = useTheme()
    const fetchGrantsStats = async () => {
        const res = await getData({
            url: `sponsor/dashboard/grants-stats`,
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

    return (
          <Card
                sx={{
                    position: 'relative',
                    minHeight: '300px',
                    backgroundColor: theme.palette.background.default,
                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                    borderRadius: '12px',
                    padding: {xs: 2, md: 4}, width: "100%"
                }}
          >
              <CardContent>
                  <Typography variant="h6" gutterBottom sx={{fontWeight: 'bold', color: theme.palette.primary.main}}>
                      {'إحصائيات المنح'}
                  </Typography>

                  {/* Loading State */}
                  {loading ? (
                        <LoadingOverlay/>
                  ) : stats ? (
                        <Grid container spacing={2}>
                            {/* Total Grant Amount */}
                            <Grid size={{xs: 12, md: 6}}>
                                <Card
                                      sx={{
                                          backgroundColor: theme.palette.secondary.main,
                                          color: theme.palette.secondary.contrastText,
                                          padding: {xs: 2, md: 4},
                                          py: 4,
                                          borderRadius: '8px',
                                          boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)',
                                      }}
                                >
                                    <Typography variant="subtitle1" sx={{fontWeight: 600}}>
                                        {`إجمالي قيمة المنح`}
                                    </Typography>
                                    <Typography variant="h5" sx={{fontWeight: 700}}>
                                        {`${stats.totalGrantAmount}`}
                                    </Typography>
                                </Card>
                            </Grid>

                            <Grid size={{xs: 12, md: 6}}>
                                <Card
                                      sx={{
                                          backgroundColor: theme.palette.primary.main,
                                          color: theme.palette.success.contrastText,
                                          padding: {xs: 2, md: 4},
                                          py: 4,
                                          borderRadius: '8px',
                                          boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)',
                                      }}
                                >
                                    <Typography variant="subtitle1" sx={{fontWeight: 600}}>
                                        {`إجمالي المبلغ المتبقي`}
                                    </Typography>
                                    <Typography variant="h5" sx={{fontWeight: 700}}>
                                        {`${stats.totalAmountLeft}`}
                                    </Typography>
                                </Card>
                            </Grid>
                        </Grid>
                  ) : (
                        <Typography sx={{color: theme.palette.error.main}}>{'لا توجد بيانات'}</Typography>
                  )}
              </CardContent>
          </Card>

    );
};

export default SponsorGrantsStats;

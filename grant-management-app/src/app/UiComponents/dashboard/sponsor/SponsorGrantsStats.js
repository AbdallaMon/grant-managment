// components/SponsorGrantsStats.js
import React, {useEffect, useState} from 'react';
import {Card, CardContent, Typography, Divider} from '@mui/material';
import LoadingOverlay from '@/app/UiComponents/feedback/loaders/LoadingOverlay';
import {useAuth} from '@/app/providers/AuthProvider';
import {getData} from '@/app/helpers/functions/getData';

const SponsorGrantsStats = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const {user} = useAuth();

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
          <Card sx={{position: 'relative', minHeight: '300px'}}>
              <CardContent>
                  <Typography variant="h6" gutterBottom>
                      {'إحصائيات المنح'}
                  </Typography>
                  {loading ? (
                        <LoadingOverlay/>
                  ) : stats ? (
                        <>
                            <Typography
                                  variant="subtitle1">{`إجمالي قيمة المنح: ${stats.totalGrantAmount}`}</Typography>
                            <Typography
                                  variant="subtitle1">{`إجمالي المبلغ المتبقي: ${stats.totalAmountLeft}`}</Typography>
                        </>
                  ) : (
                        <Typography>{'لا توجد بيانات'}</Typography>
                  )}
              </CardContent>
          </Card>
    );
};

export default SponsorGrantsStats;

// components/SponsorNextPayments.js
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
    Paper, useTheme,
} from '@mui/material';
import LoadingOverlay from '@/app/UiComponents/feedback/loaders/LoadingOverlay';
import {useAuth} from '@/app/providers/AuthProvider';
import {getData} from '@/app/helpers/functions/getData';

const SponsorNextPayments = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const {user} = useAuth();
    const theme = useTheme()
    const fetchNextPayments = async () => {
        const res = await getData({
            url: `sponsor/dashboard/next-payments`,
            setLoading,
        });
        if (res) {
            setPayments(res);
        }
    };

    useEffect(() => {
        if (user) {
            fetchNextPayments();
        }
    }, [user]);

    return (
          <Card sx={{
              position: 'relative',
              minHeight: '300px',
              backgroundColor: theme.palette.background.default,
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
              borderRadius: '12px',
              padding: {xs: 1, md: 3}, width: "100%"
          }}>
              <CardContent>
                  <Typography variant="h6" gutterBottom>
                      {'جدول الدفعات القادمة'}
                  </Typography>
                  {loading ? (
                        <LoadingOverlay/>
                  ) : payments.length > 0 ? (
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="right"

                                                   sx={{
                                                       fontWeight: 'bold',
                                                       backgroundColor: theme.palette.primary.main,
                                                       color: theme.palette.primary.contrastText,
                                                   }}
                                        >{'الطالب'}</TableCell>
                                        <TableCell align="right"
                                                   sx={{
                                                       fontWeight: 'bold',
                                                       backgroundColor: theme.palette.primary.main,
                                                       color: theme.palette.primary.contrastText,
                                                   }}
                                        >{'المبلغ'}</TableCell>
                                        <TableCell align="right"
                                                   sx={{
                                                       fontWeight: 'bold',
                                                       backgroundColor: theme.palette.primary.main,
                                                       color: theme.palette.primary.contrastText,
                                                   }}
                                        >{'تاريخ الاستحقاق'}</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {payments.map((payment) => (
                                          <TableRow key={payment.id}>
                                              <TableCell align="right">
                                                  {`${payment.userGrant.user.personalInfo?.basicInfo?.name || 'غير متوفر'} ${
                                                        payment.userGrant.user.personalInfo?.basicInfo?.fatherName || ''
                                                  }`}
                                              </TableCell>
                                              <TableCell align="right">{payment.amount}</TableCell>
                                              <TableCell align="right">
                                                  {new Date(payment.dueDate).toLocaleDateString('ar-EG')}
                                              </TableCell>
                                          </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                  ) : (
                        <Typography>{'لا توجد دفعات قادمة'}</Typography>
                  )}
              </CardContent>
          </Card>
    );
};

export default SponsorNextPayments;

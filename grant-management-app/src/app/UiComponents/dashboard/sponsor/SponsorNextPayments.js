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
    Paper,
} from '@mui/material';
import LoadingOverlay from '@/app/UiComponents/feedback/loaders/LoadingOverlay';
import {useAuth} from '@/app/providers/AuthProvider';
import {getData} from '@/app/helpers/functions/getData';

const SponsorNextPayments = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const {user} = useAuth();

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
          <Card sx={{position: 'relative', minHeight: '300px'}}>
              <CardContent>
                  <Typography variant="h6" gutterBottom>
                      {'جدول الدفعات القادمة'}
                  </Typography>
                  {loading ? (
                        <LoadingOverlay/>
                  ) : payments.length > 0 ? (
                        <TableContainer component={Paper}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="right">{'الطالب'}</TableCell>
                                        <TableCell align="right">{'المبلغ'}</TableCell>
                                        <TableCell align="right">{'تاريخ الاستحقاق'}</TableCell>
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
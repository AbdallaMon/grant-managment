// components/SupervisorPaymentsOverview.js
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
import {useAuth} from "@/app/providers/AuthProvider";
import {getData} from "@/app/helpers/functions/getData";

const SupervisorPaymentsOverview = () => {
    const [paymentsOverview, setPaymentsOverview] = useState([]);
    const [loading, setLoading] = useState(true);
    const {user} = useAuth();

    const fetchPaymentsOverview = async () => {
        const res = await getData({url: `supervisor/dashboard/payments-overview`, setLoading})
        setPaymentsOverview(res);
    };

    useEffect(() => {
        if (user) {
            fetchPaymentsOverview();
        }
    }, [user]);

    return (
          <Card sx={{position: 'relative', minHeight: '300px'}}>
              <CardContent>
                  <Typography variant="h6" gutterBottom>
                      {'الدفعات المستحقة لهذا الشهر'}
                  </Typography>
                  {paymentsOverview.length > 0 ? (
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
                                {paymentsOverview.reduce((sum, payment) => sum + payment.amount, 0)}
                            </Typography>
                        </>
                  ) : (
                        <Typography>{'لا توجد دفعات معلقة لهذا الشهر'}</Typography>
                  )}
              </CardContent>
              {loading && <LoadingOverlay/>}
          </Card>
    );
};

export default SupervisorPaymentsOverview;

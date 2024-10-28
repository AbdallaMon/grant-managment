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
    Paper, useTheme,
} from '@mui/material';
import LoadingOverlay from '@/app/UiComponents/feedback/loaders/LoadingOverlay';
import {useAuth} from "@/app/providers/AuthProvider";
import {getData} from "@/app/helpers/functions/getData";
import Link from "next/link";
import CustomTable from "@/app/UiComponents/dashboard/CustomTable";

const SupervisorPaymentsOverview = () => {
    const [paymentsOverview, setPaymentsOverview] = useState([]);
    const [loading, setLoading] = useState(true);
    const {user} = useAuth();
    const theme = useTheme()
    const fetchPaymentsOverview = async () => {
        const res = await getData({url: `supervisor/dashboard/payments-overview`, setLoading})
        setPaymentsOverview(res);
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
    useEffect(() => {
        if (user) {
            fetchPaymentsOverview();
        }
    }, [user]);

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
                  {'الدفعات المستحقة لهذا الشهر'}
              </Typography>
              {paymentsOverview.length > 0 ? (
                    <>
                        <CustomTable columns={columns} data={paymentsOverview} loading={loading}/>

                        <Typography variant="subtitle1" sx={{
                            mt: 2,
                            fontWeight: 600,
                            fontSize: '1rem',
                            color: theme.palette.primary.main,
                            letterSpacing: '0.5px',
                            marginBottom: '12px',
                        }}>
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

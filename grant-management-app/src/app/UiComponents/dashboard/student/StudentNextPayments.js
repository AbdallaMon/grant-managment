// components/StudentNextPayments.js
import React, {useEffect, useState} from 'react';
import {
    Card,
    CardContent,
    Typography,
    useTheme,
} from '@mui/material';
import {useAuth} from '@/app/providers/AuthProvider';
import {getData} from '@/app/helpers/functions/getData';
import CustomTable from "@/app/UiComponents/dashboard/CustomTable";

const StudentNextPayments = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const {user} = useAuth();
    const theme = useTheme()


    const fetchNextPayments = async () => {
        const res = await getData({
            url: `student/dashboard/next-payments`,
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

    const columns = [
        {name: "id", label: "معرف الدفعة"},
        {name: "amount", label: "المبلغ"},
        {name: "dueDate", label: "تاريخ الاستحقاق"},
    ];
    return (
          <Card sx={{
              position: 'relative',
              minHeight: '300px',
              backgroundColor: theme.palette.background.default,
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
              borderRadius: '12px',
              padding: {xs: 1, md: 3}, width: "100%"
          }}> <CardContent>
              <Typography variant="h6" gutterBottom>
                  {'الدفعات القادمة'}
              </Typography>
              <CustomTable columns={columns} data={payments} loading={loading}/>

          </CardContent>
          </Card>
    );
};

export default StudentNextPayments;

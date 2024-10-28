// components/StudentRecentInvoices.js
import React, {useEffect, useState} from 'react';
import {
    Card,
    CardContent,
    Typography,
    List,
    ListItem,
    ListItemText,
    Divider, useTheme,
} from '@mui/material';
import LoadingOverlay from '@/app/UiComponents/feedback/loaders/LoadingOverlay';
import {useAuth} from '@/app/providers/AuthProvider';
import {getData} from '@/app/helpers/functions/getData';

const StudentRecentInvoices = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const {user} = useAuth();
    const theme = useTheme()

    const fetchRecentInvoices = async () => {
        const res = await getData({
            url: `student/dashboard/recent-invoices`,
            setLoading,
        });
        if (res) {
            setInvoices(res);
        }
    };

    useEffect(() => {
        if (user) {
            fetchRecentInvoices();
        }
    }, [user]);

    return (
          <Card sx={{
              position: 'relative',
              minHeight: '300px',
              backgroundColor: theme.palette.background.default,
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
              borderRadius: '12px',
              padding: '16px',
          }}> <CardContent>
              <Typography variant="h6" gutterBottom align="center"
                          sx={{fontWeight: 'bold', color: theme.palette.primary.main}}>
                  
                  {'الدفعات المدفوعة حديثاً'}
              </Typography>
              {loading ? (
                    <LoadingOverlay/>
              ) : invoices.length > 0 ? (
                    <>
                        <List>
                            {invoices.map((invoice) => (
                                  <div key={invoice.id}>
                                      <ListItem>
                                          <ListItemText
                                                primary={`رقم الفاتورة: ${invoice.id}`}
                                                secondary={`المبلغ: ${invoice.amount} - التاريخ: ${new Date(
                                                      invoice.createdAt
                                                ).toLocaleDateString('ar-EG')}`}
                                          />
                                      </ListItem>
                                      <Divider/>
                                  </div>
                            ))}
                        </List>
                    </>
              ) : (
                    <Typography>{'لا توجد فواتير مدفوعة حديثاً'}</Typography>
              )}
          </CardContent>
          </Card>
    );
};

export default StudentRecentInvoices;

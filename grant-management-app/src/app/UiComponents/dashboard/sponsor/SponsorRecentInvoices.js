// components/SponsorRecentInvoices.js
import React, {useEffect, useState} from 'react';
import {
    Card,
    CardContent,
    Typography,
    List,
    ListItem,
    ListItemText,
    Divider,
} from '@mui/material';
import LoadingOverlay from '@/app/UiComponents/feedback/loaders/LoadingOverlay';
import {useAuth} from '@/app/providers/AuthProvider';
import {getData} from '@/app/helpers/functions/getData';

const SponsorRecentInvoices = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const {user} = useAuth();

    const fetchRecentInvoices = async () => {
        const res = await getData({
            url: `sponsor/dashboard/recent-invoices`,
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
          <Card sx={{position: 'relative', minHeight: '300px'}}>
              <CardContent>
                  <Typography variant="h6" gutterBottom>
                      {'الفواتير الأخيرة'}
                  </Typography>
                  {loading ? (
                        <LoadingOverlay/>
                  ) : invoices.length > 0 ? (
                        <List>
                            {invoices.map((invoice) => (
                                  <div key={invoice.id}>
                                      <ListItem>
                                          <ListItemText
                                                primary={`الطالب: ${invoice.payment.userGrant.user.personalInfo?.basicInfo?.name || 'غير متوفر'} ${
                                                      invoice.payment.userGrant.user.personalInfo?.basicInfo?.fatherName || ''
                                                }`}
                                                secondary={`المبلغ: ${invoice.amount} - التاريخ: ${new Date(
                                                      invoice.createdAt
                                                ).toLocaleDateString('ar-EG')}`}
                                          />
                                      </ListItem>
                                      <Divider/>
                                  </div>
                            ))}
                        </List>
                  ) : (
                        <Typography>{'لا توجد فواتير حديثة'}</Typography>
                  )}
              </CardContent>
          </Card>
    );
};

export default SponsorRecentInvoices;

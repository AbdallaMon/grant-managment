// components/RecentActivities.js
'use client';

import React, {useEffect, useState} from 'react';
import {
    Card,
    CardContent,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Link, useTheme,
} from '@mui/material';
import {Masonry} from '@mui/lab';
import {
    MdAccessTime as AccessTimeIcon,
    MdDescription as DescriptionIcon,
    MdSupportAgent as SupportAgentIcon,
} from 'react-icons/md';
import LoadingOverlay from '@/app/UiComponents/feedback/loaders/LoadingOverlay';
import {ApplicationStatus as StatusLabels} from '@/app/helpers/constants';
import {getData} from "@/app/helpers/functions/getData";

const RecentActivities = () => {
    const [data, setData] = useState({
        latestApplications: [],
        recentInvoices: [],
        recentTickets: [],
    });
    const theme = useTheme()

    const [loading, setLoading] = useState(true);

    const fetchRecentActivities = async () => {
        const res = await getData({url: `admin/dashboard/recent-activities`, setLoading})
        setData(res);
    };

    useEffect(() => {
        fetchRecentActivities();
    }, []);

    const {latestApplications, recentInvoices, recentTickets} = data;
    return (
          < >
              <Card sx={{
                  position: 'relative',
                  minHeight: '300px',
                  backgroundColor: theme.palette.background.default,
                  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                  borderRadius: '12px',
                  padding: {xs: 2, md: 4}, width: "100%"
              }}>
                  <CardContent>
                      <Typography variant="h6" gutterBottom align="center"
                                  sx={{fontWeight: 'bold', color: theme.palette.primary.main}}>
                          {'الفواتير الأخيرة'}
                      </Typography>
                      <List>
                          {recentInvoices.map((invoice) => (
                                <ListItem key={invoice.id} alignItems="flex-start" sx={{padding: '12px 0'}}>
                                    <ListItemText
                                          primary={
                                              <Typography variant="subtitle1" component="span" sx={{fontWeight: '500'}}>
                                                  {`الاسم: ${
                                                        invoice.payment?.userGrant?.user?.personalInfo?.basicInfo?.name || 'غير متوفر'
                                                  } ${
                                                        invoice.payment?.userGrant?.user?.personalInfo?.basicInfo?.fatherName || ''
                                                  }`}
                                              </Typography>
                                          }
                                          secondary={
                                              <>
                                                  <Typography variant="body2" color="textSecondary" component="span">
                                                      {`المبلغ: ${invoice.amount}`}
                                                  </Typography>
                                                  <br/>
                                                  <Link href={`/dashboard/invoices/${invoice.id}`} variant="body2"
                                                        color="primary">
                                                      {`رقم الفاتورة: ${invoice.invoiceNumber}`}
                                                  </Link>
                                              </>
                                          }
                                    />
                                    <ListItemIcon sx={{minWidth: 40}}>
                                        <DescriptionIcon sx={{color: theme.palette.primary.main}} size={24}/>
                                    </ListItemIcon>
                                </ListItem>
                          ))}
                      </List>
                  </CardContent>
                  {loading && <LoadingOverlay/>}
              </Card>

              {/* Latest Applications */}
              <Card sx={{
                  position: 'relative',
                  minHeight: '300px',
                  backgroundColor: theme.palette.background.default,
                  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                  borderRadius: '12px',
                  padding: {xs: 2, md: 4}, width: "100%"
              }}>
                  <CardContent>
                      <Typography variant="h6" gutterBottom align="center"
                                  sx={{fontWeight: 'bold', color: theme.palette.primary.main}}>
                          {'أحدث الطلبات'}
                      </Typography>
                      <List>
                          {latestApplications.map((app) => (
                                <ListItem key={app.id} alignItems="flex-start" sx={{padding: '12px 0'}}>
                                    <ListItemText
                                          primary={
                                              <Typography variant="subtitle1" component="span" sx={{fontWeight: '500'}}>
                                                  {`الاسم: ${app.student?.personalInfo?.basicInfo?.name || 'غير متوفر'} ${
                                                        app.student?.personalInfo?.basicInfo?.fatherName || ''
                                                  }`}
                                              </Typography>
                                          }
                                          secondary={
                                              <>
                                                  <Typography variant="body2" color="textSecondary" component="span">
                                                      {`الحالة: ${StatusLabels[app.status] || app.status}`}
                                                  </Typography>
                                                  <br/>
                                                  <Link href={`/dashboard/apps/view/${app.id}/${app.studentId}`}
                                                        variant="body2" color="primary">
                                                      {`رقم الطلب: ${app.id}`}
                                                  </Link>
                                              </>
                                          }
                                    />
                                    <ListItemIcon sx={{minWidth: 40}}>
                                        <AccessTimeIcon sx={{color: theme.palette.primary.main}} size={24}/>
                                    </ListItemIcon>
                                </ListItem>
                          ))}
                      </List>
                  </CardContent>
                  {loading && <LoadingOverlay/>}
              </Card>

              {/* Recent Open Tickets */}
              <Card sx={{
                  position: 'relative',
                  minHeight: '300px',
                  backgroundColor: theme.palette.background.default,
                  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                  borderRadius: '12px',
                  padding: {xs: 2, md: 4}, width: "100%"
              }}>
                  <CardContent>
                      <Typography variant="h6" gutterBottom align="center"
                                  sx={{fontWeight: 'bold', color: theme.palette.primary.main}}>
                          {'التذاكر المفتوحة'}
                      </Typography>
                      <List>
                          {recentTickets.map((ticket) => (
                                <ListItem key={ticket.id} alignItems="flex-start" sx={{padding: '12px 0'}}>
                                    <ListItemText
                                          primary={
                                              <Typography variant="subtitle1" component="span" sx={{fontWeight: '500'}}>
                                                  {`المرسل: ${
                                                        ticket.user?.personalInfo?.basicInfo?.name || 'غير متوفر'
                                                  } ${ticket.user?.personalInfo?.basicInfo?.fatherName || ''}`}
                                              </Typography>
                                          }
                                          secondary={
                                              <>
                                                  <Typography variant="body2" color="textSecondary" component="span">
                                                      {`الموضوع: ${ticket.title}`}
                                                  </Typography>
                                                  <br/>
                                                  <Link href={`/dashboard/tickets/${ticket.id}`} variant="body2"
                                                        color="primary">
                                                      {`رقم التذكرة: ${ticket.id}`}
                                                  </Link>
                                              </>
                                          }
                                    />
                                    <ListItemIcon sx={{minWidth: 40}}>
                                        <SupportAgentIcon sx={{color: theme.palette.primary.main}} size={24}/>
                                    </ListItemIcon>
                                </ListItem>
                          ))}
                      </List>
                  </CardContent>
                  {loading && <LoadingOverlay/>}
              </Card>
          </>
    );
};

export default RecentActivities;

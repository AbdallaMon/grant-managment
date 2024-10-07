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
    Link,
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
              <Card sx={{position: 'relative', minHeight: '300px'}}>
                  <CardContent>
                      <Typography variant="h6" gutterBottom align="center">
                          {'الفواتير الأخيرة'}
                      </Typography>
                      <List>
                          {recentInvoices.map((invoice) => (
                                <ListItem key={invoice.id} alignItems="flex-start">

                                    <ListItemText
                                          primary={
                                              <Typography variant="subtitle1" component="span">
                                                  {`الاسم: ${
                                                        invoice.payment?.userGrant?.user?.personalInfo?.basicInfo?.name ||
                                                        'غير متوفر'
                                                  } ${
                                                        invoice.payment?.userGrant?.user?.personalInfo?.basicInfo?.fatherName ||
                                                        ''
                                                  }`}
                                              </Typography>
                                          }
                                          secondary={
                                              <>
                                                  <Typography variant="body2" color="textSecondary" component="span">
                                                      {`المبلغ: ${invoice.amount}`}
                                                  </Typography>
                                                  <br/>
                                                  <Link
                                                        href={`/dashboard/invoices/${invoice.id}`}
                                                        variant="body2"
                                                        color="primary"
                                                  >
                                                      {`رقم الفاتورة: ${invoice.invoiceNumber}`}
                                                  </Link>
                                              </>
                                          }
                                    />
                                    <ListItemIcon sx={{minWidth: 40}}>
                                        <DescriptionIcon size={24}/>
                                    </ListItemIcon>
                                </ListItem>
                          ))}
                      </List>
                  </CardContent>
                  {loading && <LoadingOverlay/>}
              </Card>

              {/* Latest Applications */}
              <Card sx={{position: 'relative', minHeight: '300px'}}>
                  <CardContent>
                      <Typography variant="h6" gutterBottom align="center">
                          {'أحدث الطلبات'}
                      </Typography>
                      <List>
                          {latestApplications.map((app) => (
                                <ListItem key={app.id} alignItems="flex-start">

                                    <ListItemText
                                          primary={
                                              <Typography variant="subtitle1" component="span">
                                                  {`الاسم: ${
                                                        app.student?.personalInfo?.basicInfo?.name || 'غير متوفر'
                                                  } ${app.student?.personalInfo?.basicInfo?.fatherName || ''}`}
                                              </Typography>
                                          }
                                          secondary={
                                              <>
                                                  <Typography variant="body2" color="textSecondary" component="span">
                                                      {`الحالة: ${StatusLabels[app.status] || app.status}`}
                                                  </Typography>
                                                  <br/>
                                                  <Link
                                                        href={`/dashboard/apps/${app.id}/${app.studentId}`}
                                                        variant="body2"
                                                        color="primary"
                                                  >
                                                      {`رقم الطلب: ${app.id}`}
                                                  </Link>
                                              </>
                                          }
                                    />
                                    <ListItemIcon sx={{minWidth: 40}}>
                                        <AccessTimeIcon size={24}/>
                                    </ListItemIcon>
                                </ListItem>
                          ))}
                      </List>
                  </CardContent>
                  {loading && <LoadingOverlay/>}
              </Card>

              {/* Recent Open Tickets */}
              <Card sx={{position: 'relative', minHeight: '300px'}}>
                  <CardContent>
                      <Typography variant="h6" gutterBottom align="center">
                          {'التذاكر المفتوحة'}
                      </Typography>
                      <List>
                          {recentTickets.map((ticket) => (
                                <ListItem key={ticket.id} alignItems="flex-start">

                                    <ListItemText
                                          primary={
                                              <Typography variant="subtitle1" component="span">
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
                                                  <Link
                                                        href={`/dashboard/tickets/${ticket.id}`}
                                                        variant="body2"
                                                        color="primary"
                                                  >
                                                      {`رقم التذكرة: ${ticket.id}`}
                                                  </Link>
                                              </>
                                          }
                                    />
                                    <ListItemIcon sx={{minWidth: 40}}>
                                        <SupportAgentIcon size={24}/>
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

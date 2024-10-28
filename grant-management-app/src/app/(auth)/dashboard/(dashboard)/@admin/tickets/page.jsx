'use client';

import React, {useState} from 'react';
import {
    Card,
    CardContent,
    Typography,
    Grid,
    Box,
    Button,
    Select,
    MenuItem,
    CircularProgress,
    Container,
    Paper,
    Divider,
    List,
    ListItem,
    ListItemText,
    styled,
} from '@mui/material';
import {useRouter} from 'next/navigation';
import dayjs from "dayjs";
import useDataFetcher from "@/app/helpers/hooks/useDataFetcher";
import PaginationWithLimit from "@/app/UiComponents/DataViewer/PaginationWithLimit";
import {TicketStatus} from "@/app/helpers/constants";

const Sidebar = styled(Paper)(({theme}) => ({
    padding: theme.spacing(2),
    width: '250px',
    marginRight: theme.spacing(3),
}));

const TicketCard = styled(Paper)(({theme}) => ({
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
}));

const AdminTicketsList = () => {
    const router = useRouter();
    const [status, setStatus] = useState("all");
    const {
        data: tickets,
        loading,
        total,
        totalPages,
        limit,
        setPage,
        setLimit,
        page,
        setFilters,
    } = useDataFetcher(`admin/tickets`);

    const handleStatusChange = (event) => {
        setStatus(event.target.value);
        setFilters({status: event.target.value});
    };

    return (
          <Container maxWidth="lg" sx={{display: 'flex', mt: 4}}>
              {/* Sidebar for Quick Filters */}
              <Sidebar>
                  <Typography variant="h6" gutterBottom>تصفية التذاكر</Typography>
                  <Divider/>
                  <List>
                      <ListItem button onClick={() => handleStatusChange({target: {value: "all"}})}>
                          <ListItemText primary="الكل"/>
                      </ListItem>
                      <ListItem button onClick={() => handleStatusChange({target: {value: "OPEN"}})}>
                          <ListItemText primary="مفتوحة"/>
                      </ListItem>
                      <ListItem button onClick={() => handleStatusChange({target: {value: "CLOSED"}})}>
                          <ListItemText primary="مغلقة"/>
                      </ListItem>
                  </List>
              </Sidebar>

              {/* Main Content */}
              <Box sx={{flexGrow: 1}}>
                  <Card sx={{mb: 2}}>
                      <CardContent sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                          <Typography variant="h5">إدارة التذاكر</Typography>
                          <Select
                                value={status}
                                onChange={handleStatusChange}
                                variant="outlined"
                                size="small"
                                sx={{minWidth: 150}}
                          >
                              <MenuItem value="all">الكل</MenuItem>
                              <MenuItem value="OPEN">مفتوحة</MenuItem>
                              <MenuItem value="CLOSED">مغلقة</MenuItem>
                          </Select>
                      </CardContent>
                  </Card>

                  {loading ? (
                        <Box sx={{display: 'flex', justifyContent: 'center', mt: 4}}>
                            <CircularProgress/>
                        </Box>
                  ) : tickets.length > 0 ? (
                        <Grid container spacing={3}>
                            {tickets.map((ticket) => (
                                  <Grid item xs={12} sm={6} md={4} key={ticket.id}>
                                      <TicketCard elevation={2}>
                                          <Typography variant="h6" gutterBottom>{ticket.title}</Typography>
                                          <Typography variant="body2" color="textSecondary">
                                              {`الحالة: ${TicketStatus[ticket.status]}`}
                                          </Typography>
                                          <Typography variant="body2" color="textSecondary">
                                              {`تاريخ الإنشاء: ${dayjs(ticket.createdAt).format('DD/MM/YY')}`}
                                          </Typography>
                                          <Button
                                                variant="outlined"
                                                color="primary"
                                                fullWidth
                                                onClick={() => router.push(`/dashboard/tickets/${ticket.id}`)}
                                                sx={{mt: 2}}
                                          >
                                              عرض التذكرة
                                          </Button>
                                      </TicketCard>
                                  </Grid>
                            ))}
                        </Grid>
                  ) : (
                        <Typography sx={{mt: 4, textAlign: 'center'}}>لا توجد تذاكر</Typography>
                  )}

                  <PaginationWithLimit limit={limit} totalPages={totalPages} setPage={setPage} setLimit={setLimit}
                                       page={page} total={total}/>
              </Box>
          </Container>
    );
};

export default AdminTicketsList;

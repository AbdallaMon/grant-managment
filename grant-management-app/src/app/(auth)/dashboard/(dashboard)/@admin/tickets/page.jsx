'use client';

import React, {useEffect, useState} from 'react';
import {
    Grid,
    Card,
    CardContent,
    Typography,
    Button,
    Select,
    MenuItem,
    CircularProgress,
    Box,
    Pagination,
} from '@mui/material';
import {useRouter} from 'next/navigation';
import dayjs from "dayjs";

// Translate status to Arabic
const translateStatus = (status) => {
    switch (status) {
        case 'open':
            return 'مفتوحة';
        case 'closed':
            return 'مغلقة';
        default:
            return status;
    }
};

const AdminTicketsList = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalTickets, setTotalTickets] = useState(0);
    const [page, setPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState('all');
    const router = useRouter();

    const fetchTickets = async (status, page) => {
        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/admin/tickets?status=${status}&skip=${(page - 1) * 10}&take=10`, {
                credentials: 'include'
            });
            const json = await res.json();
            setTickets(json.data.tickets);
            setTotalTickets(json.data.totalTickets);
        } catch (error) {
            console.error('Error fetching tickets', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets(statusFilter, page);
    }, [statusFilter, page]);

    const handleStatusChange = (event) => {
        setStatusFilter(event.target.value);
        setPage(1); // Reset to first page on filter change
    };

    return (
          <Box sx={{p: 2}}>
              {/* Status Filter */}
              <Box sx={{mb: 3, textAlign: 'right'}}>
                  <Select value={statusFilter} onChange={handleStatusChange}>
                      <MenuItem value="all">الكل</MenuItem>
                      <MenuItem value="OPEN">مفتوحة</MenuItem>
                      <MenuItem value="CLOSED">مغلقة</MenuItem>
                  </Select>
              </Box>

              {loading ? (
                    <Box sx={{display: 'flex', justifyContent: 'center', mt: 4}}>
                        <CircularProgress/>
                    </Box>
              ) : (
                    <Grid container spacing={2}>
                        {tickets.map((ticket) => (
                              <Grid item xs={12} md={6} lg={4} key={ticket.id}>
                                  <Card sx={{height: '100%'}}>
                                      <CardContent>
                                          <Typography variant="h6" gutterBottom>
                                              {ticket.title}
                                          </Typography>
                                          <Typography variant="body2" color="textSecondary">
                                              {`الحالة: ${translateStatus(ticket.status)}`}
                                          </Typography>
                                          <Typography variant="body2" color="textSecondary">
                                              {`تاريخ الإنشاء: ${dayjs(ticket.createdAt).format('DD/MM/YY')}`}
                                          </Typography>
                                          <Box sx={{mt: 2, textAlign: 'right'}}>
                                              <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() => router.push(`/dashboard/tickets/${ticket.id}`)}
                                              >
                                                  عرض
                                              </Button>
                                          </Box>
                                      </CardContent>
                                  </Card>
                              </Grid>
                        ))}
                    </Grid>
              )}

              {/* Pagination */}
              <Box sx={{mt: 4, display: 'flex', justifyContent: 'center'}}>
                  <Pagination
                        count={Math.ceil(totalTickets / 10)}
                        page={page}
                        onChange={(event, value) => setPage(value)}
                  />
              </Box>
          </Box>
    );
};

export default AdminTicketsList;

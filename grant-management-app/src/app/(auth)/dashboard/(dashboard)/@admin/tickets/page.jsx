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
    Box, Container,
} from '@mui/material';
import {useRouter} from 'next/navigation';
import dayjs from "dayjs";
import useDataFetcher from "@/app/helpers/hooks/useDataFetcher";
import PaginationWithLimit from "@/app/UiComponents/DataViewer/PaginationWithLimit";
import {TicketStatus} from "@/app/helpers/constants";

// Translate status to Arabic


const AdminTicketsList = () => {
    const router = useRouter();
    const [status, setStatus] = useState("all")
    const {
        data: tickets,
        loading,
        total,
        totalPages,
        limit,
        setPage,
        setLimit, page
        , setFilters
    } = useDataFetcher(`admin/tickets`)

    const handleStatusChange = (event) => {
        setStatus(event.target.value);
        setFilters({status: event.target.value})
    };

    return (
          <Container maxWidth="lg">
              <Box px={{xs: 2, md: 4}}>

                  <Box sx={{p: 2, mx: 2}}>
                      {/* Status Filter */}
                      <Box sx={{mb: 3, textAlign: 'right'}}>
                          <Select value={status} onChange={handleStatusChange}>
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
                                                      {`الحالة: ${TicketStatus[ticket.status]}`}
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
                      <PaginationWithLimit limit={limit} totalPages={totalPages} setPage={setPage} setLimit={setLimit}
                                           page={page} total={total}/>

                  </Box>
              </Box>

          </Container>

    );
};

export default AdminTicketsList;

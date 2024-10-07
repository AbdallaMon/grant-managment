'use client';
import React, {useEffect, useState} from 'react';
import {
    Card,
    CardContent,
    Typography,
    Grid,
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    CircularProgress,
    Paper,
    Pagination,
} from '@mui/material';
import {useAuth} from '@/app/providers/AuthProvider';
import {useRouter} from 'next/navigation';
import LoadingOverlay from '@/app/UiComponents/feedback/loaders/LoadingOverlay';
import {getData} from "@/app/helpers/functions/getData";
import {handleRequestSubmit} from "@/app/helpers/functions/handleSubmit";
import {useToastContext} from "@/app/providers/ToastLoadingProvider";
import Link from "next/link";

const StudentTicketsList = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [newTicketTitle, setNewTicketTitle] = useState('');
    const [newTicketContent, setNewTicketContent] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [totalTickets, setTotalTickets] = useState(0); // To track total tickets
    const [page, setPage] = useState(1); // To track current page
    const {user} = useAuth();
    const router = useRouter();
    const {setLoading: setCreatingTicket} = useToastContext();

    const fetchTickets = async (page) => {
        const res = await getData({
            url: `student/tickets?skip=${(page - 1) * 10}&take=10`,
            setLoading,
        });
        if (res.status === 200) {
            setTickets(res.data.tickets);
            setTotalTickets(res.data.totalTickets);
        }
    };

    useEffect(() => {
        if (user) {
            fetchTickets(page);
        }
    }, [user, page]);

    const handleTicketClick = (ticketId) => {
        router.push(`/dashboard/tickets/${ticketId}`);
    };

    const handleOpenDialog = () => {
        setNewTicketTitle('');
        setNewTicketContent('');
        setErrorMessage('');
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleCreateTicket = async () => {
        if (!newTicketTitle.trim() || !newTicketContent.trim()) {
            setErrorMessage('يرجى ملء جميع الحقول.');
            return;
        }

        const res = await handleRequestSubmit({
                  title: newTicketTitle.trim(),
                  content: newTicketContent.trim(),
              }
              , setCreatingTicket, `student/tickets`, null, "جاري انشاء تذكرة جديدة"
        );
        if (res.status === 201) {
            setOpenDialog(false);
            router.push(`/dashboard/tickets/${res.data.id}`);
        } else {
            setErrorMessage(res.error || 'حدث خطأ أثناء إنشاء التذكرة.');
        }
    };

    return (
          <Card sx={{position: 'relative', minHeight: '400px'}}>
              <CardContent>
                  <Typography variant="h5" gutterBottom>
                      {'تذاكر الشكاوي والمقترحات'}
                  </Typography>
                  <Button variant="contained" color="primary" onClick={handleOpenDialog} sx={{mb: 2}}>
                      {'إنشاء تذكرة جديدة'}
                  </Button>

                  {loading ? (
                        <LoadingOverlay/>
                  ) : tickets.length > 0 ? (
                        <>
                            <Grid container spacing={2}>
                                {tickets.map((ticket) => (
                                      <Grid item xs={12} sm={6} md={4} key={ticket.id}>
                                          <Paper
                                                elevation={2}
                                                sx={{
                                                    p: 2,
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    justifyContent: 'space-between',
                                                    height: '100%',
                                                }}
                                          >
                                              <Typography variant="h6" gutterBottom>
                                                  {ticket.title}
                                              </Typography>
                                              <Typography variant="body2" color="textSecondary">
                                                  {`الحالة: ${ticket.status === 'OPEN' ? 'مفتوحة' : 'مغلقة'}`}
                                              </Typography>
                                              <Typography variant="body2" color="textSecondary">
                                                  {`التاريخ: ${new Date(ticket.createdAt).toLocaleDateString('ar-EG')}`}
                                              </Typography>
                                              <Button
                                                    variant="contained"
                                                    color="primary"
                                                    fullWidth
                                                    href={`/dashboard/tickets/${ticket.id}`}
                                                    component={Link}
                                                    sx={{mt: 2}}
                                              >
                                                  عرض التذكرة
                                              </Button>
                                          </Paper>
                                      </Grid>
                                ))}
                            </Grid>
                            <Box sx={{display: 'flex', justifyContent: 'center', mt: 2}}>
                                <Pagination
                                      count={Math.ceil(totalTickets / 10)}
                                      page={page}
                                      onChange={(event, value) => setPage(value)}
                                />
                            </Box>
                        </>
                  ) : (
                        <Typography>{'لا توجد تذاكر'}</Typography>
                  )}
              </CardContent>

              <Dialog open={openDialog} onClose={handleCloseDialog}>
                  <DialogTitle>{'إنشاء تذكرة جديدة'}</DialogTitle>
                  <DialogContent>
                      {errorMessage && (
                            <Typography variant="body2" color="error" sx={{mb: 1}}>
                                {errorMessage}
                            </Typography>
                      )}
                      <TextField
                            fullWidth
                            label="عنوان التذكرة"
                            variant="outlined"
                            value={newTicketTitle}
                            onChange={(e) => setNewTicketTitle(e.target.value)}
                            sx={{mb: 2}}
                      />
                      <TextField
                            fullWidth
                            label="تفاصيل التذكرة"
                            variant="outlined"
                            value={newTicketContent}
                            onChange={(e) => setNewTicketContent(e.target.value)}
                            multiline
                            rows={4}
                      />
                  </DialogContent>
                  <DialogActions>
                      <Button onClick={handleCloseDialog}>{'إلغاء'}</Button>
                      <Button
                            onClick={handleCreateTicket}
                            variant="contained"
                            color="primary"
                      >
                          {'إنشاء'}
                      </Button>
                  </DialogActions>
              </Dialog>
          </Card>
    );
};

export default StudentTicketsList;

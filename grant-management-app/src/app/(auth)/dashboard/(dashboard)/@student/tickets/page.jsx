"use client"
import React, {useState} from 'react';
import {
    Card,
    CardContent,
    Typography,
    Grid2 as Grid,
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Container,
    Paper,
    Divider,
    List,
    ListItem,
    ListItemText,
    styled,
    useMediaQuery,
    useTheme, Select, MenuItem,
} from '@mui/material';
import LoadingOverlay from '@/app/UiComponents/feedback/loaders/LoadingOverlay';
import {useRouter} from 'next/navigation';
import Link from "next/link";
import useDataFetcher from "@/app/helpers/hooks/useDataFetcher";
import PaginationWithLimit from "@/app/UiComponents/DataViewer/PaginationWithLimit";
import {TicketStatus} from "@/app/helpers/constants";
import {handleRequestSubmit} from "@/app/helpers/functions/handleSubmit";
import {useToastContext} from "@/app/providers/ToastLoadingProvider";

const Sidebar = styled(Paper)(({theme}) => ({
    padding: theme.spacing(2),
    width: '250px',
    marginRight: theme.spacing(2),
}));

const TicketCard = styled(Paper)(({theme}) => ({
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
}));

const StudentTicketsList = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Check if screen size is small
    const [openDialog, setOpenDialog] = useState(false);
    const [newTicketTitle, setNewTicketTitle] = useState('');
    const [newTicketContent, setNewTicketContent] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter();
    const {setLoading: setCreatingTicket} = useToastContext();
    const {
        data: tickets,
        loading,
        total,
        totalPages,
        limit,
        setPage,
        setLimit, page, setData, setFilters
    } = useDataFetcher(`student/tickets`);
    const [status, setStatus] = useState("all");


    const handleOpenDialog = () => {
        setNewTicketTitle('');
        setNewTicketContent('');
        setErrorMessage('');
        setOpenDialog(true);
    };
    const handleStatusChange = (event) => {
        setStatus(event.target.value);
        setFilters({status: event.target.value});
    };

    const handleCloseDialog = () => setOpenDialog(false);

    const handleCreateTicket = async () => {
        if (!newTicketTitle.trim() || !newTicketContent.trim()) {
            setErrorMessage('يرجى ملء جميع الحقول.');
            return;
        }
        const res = await handleRequestSubmit({
            title: newTicketTitle.trim(),
            content: newTicketContent.trim(),
        }, setCreatingTicket, `student/tickets`, null, "جاري انشاء تذكرة جديدة");

        if (res.status === 200) {
            setOpenDialog(false);
            router.push(`/dashboard/tickets/${res.data.id}`);
        } else {
            setErrorMessage(res.error || 'حدث خطأ أثناء إنشاء التذكرة.');
        }
    };

    return (
          <Box sx={{display: 'flex', flexDirection: isMobile ? 'column' : 'row', mt: 4}}>
              {!isMobile && (
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
              )}

              <Box sx={{flexGrow: 1, width: '100%'}}>
                  <Card sx={{mb: 2}}>
                      <CardContent sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexWrap: "wrap", gap: 2
                      }}>
                          <Typography variant="h5">{'تذاكر الشكاوي والمقترحات'}</Typography>
                          {isMobile &&
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
                          }
                          <Button variant="contained" color="primary" onClick={handleOpenDialog}>
                              {'إنشاء تذكرة جديدة'}
                          </Button>
                      </CardContent>
                  </Card>
                  {loading ? (
                        <LoadingOverlay/>
                  ) : tickets.length > 0 ? (
                        <Grid container spacing={3}>
                            {tickets.map((ticket) => (
                                  <Grid xs={12} sm={6} md={4} size={{xs: 12, sm: 6, md: 4}} key={ticket.id}>
                                      <TicketCard elevation={2}>
                                          <Typography variant="h6" gutterBottom>{ticket.title}</Typography>
                                          <Typography variant="body2" color="textSecondary">
                                              {`الحالة: ${TicketStatus[ticket.status]}`}
                                          </Typography>
                                          <Typography variant="body2" color="textSecondary">
                                              {`التاريخ: ${new Date(ticket.createdAt).toLocaleDateString('ar-EG')}`}
                                          </Typography>
                                          <Button
                                                variant="outlined"
                                                color="primary"
                                                fullWidth
                                                href={`/dashboard/tickets/${ticket.id}`}
                                                component={Link}
                                                sx={{mt: 2}}
                                          >
                                              عرض التذكرة
                                          </Button>
                                      </TicketCard>
                                  </Grid>
                            ))}
                        </Grid>
                  ) : (
                        <Typography sx={{mt: 4, textAlign: 'center'}}>{'لا توجد تذاكر'}</Typography>
                  )}

                  <PaginationWithLimit limit={limit} totalPages={totalPages} setPage={setPage} setLimit={setLimit}
                                       page={page} total={total}/>
              </Box>

              {/* New Ticket Dialog */}
              <Dialog open={openDialog} onClose={handleCloseDialog}>
                  <DialogTitle>{'إنشاء تذكرة جديدة'}</DialogTitle>
                  <DialogContent dividers>
                      {errorMessage && (
                            <Typography variant="body2" color="error" sx={{mb: 2}}>
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
                            sx={{mb: 2}}
                      />
                  </DialogContent>
                  <DialogActions sx={{p: 2}}>
                      <Button onClick={handleCloseDialog} color="inherit">{'إلغاء'}</Button>
                      <Button onClick={handleCreateTicket} variant="contained" color="primary">
                          {'إنشاء'}
                      </Button>
                  </DialogActions>
              </Dialog>
          </Box>
    );
};

export default StudentTicketsList;

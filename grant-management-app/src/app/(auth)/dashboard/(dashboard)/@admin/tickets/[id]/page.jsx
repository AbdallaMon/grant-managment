'use client';

import React, {useEffect, useState, useRef} from 'react';
import {
    Card,
    CardContent,
    Typography,
    Button,
    TextField,
    CircularProgress,
    Box,
    Divider,
    Paper,
    Modal,
    Fade,
    Backdrop, Container, Chip,
} from '@mui/material';
import {useRouter} from 'next/navigation';
import LoadingOverlay from '@/app/UiComponents/feedback/loaders/LoadingOverlay';
import {useAuth} from "@/app/providers/AuthProvider";
import {handleRequestSubmit} from "@/app/helpers/functions/handleSubmit";
import {useToastContext} from "@/app/providers/ToastLoadingProvider";
import dayjs from "dayjs";

const MESSAGES_BATCH_SIZE = 50;

const AdminTicketDetails = ({params: {id: ticketId}}) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [ticketStatus, setTicketStatus] = useState('OPEN');
    const [ticketTitle, setTicketTitle] = useState('');
    const [ticketContent, setTicketContent] = useState('');
    const [hasMore, setHasMore] = useState(false);
    const [skip, setSkip] = useState(0);
    const [sendingMessage, setSendingMessage] = useState(false);
    const [newMessageContent, setNewMessageContent] = useState('');
    const [confirmCloseOpen, setConfirmCloseOpen] = useState(false); // State for confirmation modal
    const messagesEndRef = useRef(null);
    const {user} = useAuth();
    const router = useRouter();
    const {setLoading: setSubmitLoading} = useToastContext();

    const fetchMessages = async (initial = false) => {
        if (!ticketId) return;
        setLoading(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/admin/tickets/${ticketId}/messages?skip=${skip}&take=${MESSAGES_BATCH_SIZE}`, {
            credentials: "include",
        });
        const json = await res.json();
        if (json?.data) {
            const {status, title, content, messages: fetchedMessages, totalMessages} = json.data;
            setTicketStatus(status);
            setTicketTitle(title);
            setTicketContent(content);
            setHasMore(skip + MESSAGES_BATCH_SIZE < totalMessages);
            setSkip(skip + MESSAGES_BATCH_SIZE);
            if (initial) {
                setMessages(fetchedMessages);
            } else {
                setMessages((prevMessages) => [...fetchedMessages, ...prevMessages]);
            }

            if (initial) {
                scrollToBottom();
            }
        }
        setLoading(false);
    };

    const handleSendMessage = async () => {
        if (!newMessageContent.trim()) return;

        setSendingMessage(true);

        const tempMessage = {
            id: `temp-${Date.now()}`,
            content: newMessageContent,
            senderId: user.id, // Admin's ID
            createdAt: new Date(),
            pending: true,
        };

        setMessages((prevMessages) => [...prevMessages, tempMessage]);
        setNewMessageContent('');
        scrollToBottom();

        const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/admin/tickets/${ticketId}/messages`, {
            method: 'POST',
            credentials: "include",
            body: JSON.stringify({content: tempMessage.content.trim()}),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response?.status === 201) {
            const resData = await response.json();
            setMessages((prevMessages) => prevMessages.map((msg) => (msg.id === tempMessage.id ? resData.data : msg)));
        } else {
            setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== tempMessage.id));
        }
        setSendingMessage(false);
    };

    // Send message on Enter key press
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleCloseTicket = async () => {
        try {
            const res = await handleRequestSubmit({status: "CLOSED"}, setSubmitLoading, `admin/tickets/${ticketId}/status`, false, "جاري اغلاق التذكرة", null, "PUT");
            if (res.status === 200) {
                router.push('/dashboard/tickets');
            }
        } catch (error) {
            console.error('Error closing ticket', error);
        }
    };

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});
        }, 100);
    };

    // Open/Close the confirm close modal
    const handleOpenCloseModal = () => setConfirmCloseOpen(true);
    const handleCloseModal = () => setConfirmCloseOpen(false);

    useEffect(() => {
        fetchMessages(true);
    }, [ticketId]);

    return (
          <Container maxWidth="lg">
              <Box px={{xs: 2, md: 4}}>
                  <Card
                        sx={{
                            position: "relative",
                            minHeight: "400px",
                            display: "flex",
                            flexDirection: "column",
                            borderRadius: "12px",
                            backgroundColor: "background.default",
                            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)"
                        }}
                  >
                      <CardContent sx={{flexGrow: 1, overflowY: "auto", p: {xs: 2, md: 4}}}>
                          <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2}}>
                              <Box>
                                  <Typography variant="h5" sx={{fontWeight: 'bold'}}>{ticketTitle}</Typography>
                                  <Chip label={ticketStatus === "OPEN" ? "مفتوحة" : "مغلقة"}
                                        color={ticketStatus === 'OPEN' ? 'success' : 'error'}
                                        sx={{mt: 1}}/>
                              </Box>
                              {ticketStatus === "OPEN" &&
                                    <Button variant="contained" color="secondary"
                                            onClick={() => setConfirmCloseOpen(true)}>
                                        اغلاق التذكرة
                                    </Button>}
                          </Box>
                          <Typography variant="body1" color="textSecondary">{ticketContent}</Typography>
                          <Divider sx={{my: 2}}/>

                          {loading && messages.length === 0 ? (
                                <LoadingOverlay/>
                          ) : (
                                <>
                                    {hasMore && (
                                          <Box sx={{textAlign: "center", my: 2}}>
                                              <Button
                                                    variant="outlined"
                                                    onClick={() => fetchMessages(false)}
                                                    sx={{padding: "6px 12px"}}
                                              >
                                                  {loading ? <CircularProgress size={24}/> : "عرض المزيد من الرسائل"}
                                              </Button>
                                          </Box>
                                    )}

                                    <Box
                                          sx={{
                                              height: "48vh",
                                              overflowY: "auto",
                                              p: 1,
                                              backgroundColor: "background.paper",
                                              borderRadius: 1,
                                              border: "1px solid #e0e0e0",
                                          }}
                                    >
                                        {messages.map((message) => (
                                              <Box
                                                    key={message.id}
                                                    sx={{
                                                        display: "flex",
                                                        justifyContent:
                                                              message.senderId === user.id ? "flex-end" : "flex-start",
                                                        opacity: message.pending ? 0.5 : 1,
                                                        my: 1,
                                                        transition: "opacity 0.3s ease",
                                                    }}
                                              >
                                                  <Paper
                                                        sx={{
                                                            p: 2,
                                                            borderRadius: "8px",
                                                            backgroundColor:
                                                                  message.senderId === user.id ? "#e0f7fa" : "#f1f8e9",
                                                            maxWidth: "75%",
                                                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                                                        }}
                                                  >
                                                      <Typography variant="body1">{message.content}</Typography>
                                                      <Typography
                                                            variant="caption"
                                                            sx={{display: 'block', textAlign: 'right'}}>

                                                          {dayjs(message.createdAt).format('DD/MM/YYYY hh:mm A')}
                                                      </Typography>
                                                  </Paper>
                                              </Box>
                                        ))}
                                        <div ref={messagesEndRef}/>
                                    </Box>
                                </>
                          )}
                      </CardContent>

                      {/* Message Input and Close Ticket Button */}
                      {ticketStatus === "OPEN" ? (
                            <>
                                <Box
                                      sx={{
                                          p: 2,
                                          borderTop: "1px solid #ccc",
                                          display: "flex",
                                          alignItems: "center",
                                      }}
                                >
                                    <TextField
                                          fullWidth
                                          variant="outlined"
                                          placeholder="اكتب رسالتك هنا..."
                                          value={newMessageContent}
                                          onChange={(e) => setNewMessageContent(e.target.value)}
                                          multiline
                                          rows={2}
                                          onKeyPress={handleKeyPress}
                                          sx={{flexGrow: 1}}
                                    />
                                    <Button
                                          variant="contained"
                                          color="primary"
                                          onClick={handleSendMessage}
                                          disabled={sendingMessage}
                                          sx={{ml: 2}}
                                    >
                                        {sendingMessage ? <CircularProgress size={24}/> : "إرسال"}
                                    </Button>
                                </Box>
                            </>
                      ) : (
                            <Typography variant="subtitle1" sx={{p: 2, textAlign: "center"}}>
                                {"هذه التذكرة مغلقة ولا يمكن إرسال رسائل جديدة."}
                            </Typography>
                      )}

                      <Modal
                            open={confirmCloseOpen}
                            onClose={handleCloseModal}
                            closeAfterTransition
                            BackdropComponent={Backdrop}
                            BackdropProps={{timeout: 500}}
                      >
                          <Fade in={confirmCloseOpen}>
                              <Box
                                    sx={{
                                        position: "absolute",
                                        top: "50%",
                                        left: "50%",
                                        transform: "translate(-50%, -50%)",
                                        width: 400,
                                        bgcolor: "background.paper",
                                        boxShadow: 24,
                                        borderRadius: 1,
                                        p: 4,
                                        outline: "none",
                                    }}
                              >
                                  <Typography variant="h6" gutterBottom>
                                      تأكيد إغلاق التذكرة
                                  </Typography>
                                  <Typography variant="body1" sx={{mb: 2}}>
                                      هل أنت متأكد من أنك تريد إغلاق هذه التذكرة؟
                                  </Typography>
                                  <Box sx={{display: "flex", justifyContent: "space-between"}}>
                                      <Button variant="contained" color="primary" onClick={handleCloseModal}>
                                          إلغاء
                                      </Button>
                                      <Button variant="contained" color="secondary" onClick={handleCloseTicket}>
                                          إغلاق
                                      </Button>
                                  </Box>
                              </Box>
                          </Fade>
                      </Modal>
                  </Card>
              </Box>
          </Container>
    );
};

export default AdminTicketDetails;

"use client";
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
} from '@mui/material';
import LoadingOverlay from '@/app/UiComponents/feedback/loaders/LoadingOverlay';
import {getData} from "@/app/helpers/functions/getData";
import {useAuth} from "@/app/providers/AuthProvider";
import dayjs from "dayjs";

const MESSAGES_BATCH_SIZE = 50;

const StudentTicketDetails = ({params: {id: ticketId}}) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [ticketStatus, setTicketStatus] = useState('OPEN');
    const [ticketTitle, setTicketTitle] = useState(''); // Add state for title
    const [ticketContent, setTicketContent] = useState(''); // Add state for content
    const [hasMore, setHasMore] = useState(false);
    const [skip, setSkip] = useState(0);
    const [sendingMessage, setSendingMessage] = useState(false);
    const [newMessageContent, setNewMessageContent] = useState('');
    const messagesEndRef = useRef(null);
    const {user} = useAuth();

    const fetchMessages = async (initial = false) => {
        if (!ticketId) return;

        const res = await getData({
            url: `student/tickets/${ticketId}/messages?skip=${skip}&take=${MESSAGES_BATCH_SIZE}`,
            setLoading,
        });

        if (res?.data) {
            const {status, title, content, messages: fetchedMessages, totalMessages} = res.data;
            console.log(fetchedMessages, "fetchedMessages")
            setTicketStatus(status);
            setTicketTitle(title);      // Set title
            setTicketContent(content);  // Set content
            setHasMore(skip + MESSAGES_BATCH_SIZE < totalMessages);
            setSkip(skip + MESSAGES_BATCH_SIZE);
            if (initial) {
                setMessages(fetchedMessages)
            } else {

                setMessages((prevMessages) => [...fetchedMessages, ...prevMessages]);
            }

            if (initial) {
                scrollToBottom();
            }
        }
    };

    const handleSendMessage = async () => {
        if (!newMessageContent.trim()) return;

        setSendingMessage(true);
        const tempMessage = {
            id: `temp-${Date.now()}`,
            content: newMessageContent,
            senderId: user.id,
            createdAt: new Date(),
            pending: true,
        };

        setMessages((prevMessages) => [...prevMessages, tempMessage]);
        setNewMessageContent('');
        scrollToBottom();

        const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/student/tickets/${ticketId}/messages`, {
            credentials: 'include',
            body: JSON.stringify({
                content: tempMessage.content.trim(), // The message content sent in the body
            }), method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
        });
        console.log(response, "response")
        if (response?.status === 201) {
            const resData = await response.json();
            console.log(resData, "resData")
            setMessages((prevMessages) => prevMessages.map((msg) => (msg.id === tempMessage.id ? resData.data : msg)));
        } else {
            setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== tempMessage.id));
        }
        setSendingMessage(false);
    };

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});
        }, 100);
    };

    useEffect(() => {
        fetchMessages(true);
    }, [ticketId]);
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };
    return (
          <Card sx={{
              position: 'relative',
              minHeight: '400px',

              display: 'flex',
              flexDirection: 'column'
          }}>
              <CardContent sx={{flexGrow: 1, overflowY: 'auto'}}>
                  {/* Display Title and Content */}
                  <Typography variant="h5" gutterBottom>
                      {ticketTitle}
                  </Typography>
                  <Typography variant="body1" color="textSecondary" sx={{mb: 2}}>
                      {ticketContent}
                  </Typography>
                  <Divider/>

                  {loading && messages.length === 0 ? (
                        <LoadingOverlay/>
                  ) : (
                        <>
                            {hasMore && (
                                  <Box sx={{textAlign: 'center', my: 2}}>
                                      <Button variant="outlined" onClick={() => fetchMessages(false)}>
                                          {loading ? <CircularProgress size={24}/> : 'عرض المزيد من الرسائل'}
                                      </Button>
                                  </Box>
                            )}
                            <Box sx={{
                                height: "55vh",
                                overflow: "auto",
                            }}>

                                {messages.map((message) => (
                                      <Box
                                            key={message.id}
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: message.senderId === user.id ? 'flex-end' : 'flex-start',
                                                opacity: message.pending ? 0.5 : 1,
                                                my: 1,
                                            }}
                                      >
                                          <Paper
                                                sx={{
                                                    p: 1,
                                                    borderRadius: 1,
                                                    backgroundColor: message.senderId === user.id ? '#e0f7fa' : '#f1f8e9',
                                                    maxWidth: '80%',
                                                }}
                                          >
                                              <Typography variant="body1">{message.content}</Typography>
                                              <Typography variant="caption" sx={{display: 'block', textAlign: 'right'}}>
                                                  {dayjs(message.createdAt).format("DD/MM/YY")}
                                              </Typography>
                                          </Paper>
                                      </Box>
                                ))}
                                <div ref={messagesEndRef}/>
                            </Box>
                        </>
                  )}
              </CardContent>

              {/* Message Input */}
              {ticketStatus === 'OPEN' ? (
                    <Box sx={{p: 2, borderTop: '1px solid #ccc', display: 'flex', alignItems: 'center'}}>
                        <TextField
                              fullWidth
                              variant="outlined"
                              placeholder="اكتب رسالتك هنا..."
                              value={newMessageContent}
                              onChange={(e) => setNewMessageContent(e.target.value)}
                              multiline
                              rows={2}
                              onKeyPress={handleKeyPress}
                        />
                        <Button
                              variant="contained"
                              color="primary"
                              onClick={handleSendMessage}
                              disabled={sendingMessage}
                              sx={{mx: 2,}}
                        >
                            {sendingMessage ? <CircularProgress size={24}/> : 'إرسال'}
                        </Button>
                    </Box>
              ) : (
                    <Typography variant="subtitle1" sx={{p: 2, textAlign: 'center'}}>
                        {'هذه التذكرة مغلقة ولا يمكن إرسال رسائل جديدة.'}
                    </Typography>
              )}
          </Card>
    );
};

export default StudentTicketDetails;

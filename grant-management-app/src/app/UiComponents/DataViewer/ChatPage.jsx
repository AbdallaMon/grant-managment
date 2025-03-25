"use client";
import React, {useState, useEffect, useRef} from 'react';
import {
    Box,
    List,
    ListItem,
    ListItemText,
    TextField,
    Button,
    Typography,
    Paper,
    useMediaQuery,
    Container,
    IconButton, Divider, Avatar, ListItemAvatar, Badge,
} from '@mui/material';
import {IoMdArrowBack as ArrowBack} from "react-icons/io";

import io from 'socket.io-client';
import {useRouter, useSearchParams} from 'next/navigation';
import {useAuth} from '@/app/providers/AuthProvider';
import FullScreenLoader from "@/app/UiComponents/feedback/loaders/FullscreenLoader";
import {MdSupervisorAccount as SupervisorIcon, MdAdminPanelSettings as AdminIcon} from "react-icons/md";

const ChatPage = () => {
    const {user} = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const queryUserId = searchParams.get('userId');
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [socket, setSocket] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true)
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);
    const [loadMoreClicked, setLoadMoreClicked] = useState(false)
    const isSmallScreen = useMediaQuery('(max-width:760px)');

    useEffect(() => {
        const fetchAllowedUsers = async () => {
            setLoading(true)
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/utility/chat/allowed-users`, {
                credentials: 'include',
            });
            const data = await response.json();
            setUsers(data.data);
            setLoading(false)
        };
        fetchAllowedUsers();
    }, []);

    // Establish a socket connection
    useEffect(() => {
        const newSocket = io(process.env.NEXT_PUBLIC_URL);
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, []);

    // Fetch messages between selected users
    const fetchMessages = async (userId, pageNumber = 1, append = false) => {
        setLoading(true)

        const response = await fetch(
              `${process.env.NEXT_PUBLIC_URL}/utility/messages/${userId}?page=${pageNumber}`,
              {credentials: 'include'}
        );
        const data = await response.json();
        setLoading(false)
        if (data.data.length === 0) {
            setHasMore(false);
        } else {
            setHasMore(true);
        }

        if (append) {
            // Prepend new messages
            setMessages((prevMessages) => [...data.data.reverse(), ...prevMessages]);
        } else {
            // Replace messages
            setMessages(data.data.reverse());
        }
    };

    // Handle clicking on a user to start a chat
    const handleUserClick = (userItem) => {
        setSelectedUser(userItem);
        setPage(1);
        setHasMore(true);
        fetchMessages(userItem.id, 1);
        router.push(`/dashboard/chats?userId=${userItem.id}`);
    };

    // Automatically fetch messages when the userId in the query changes
    useEffect(() => {
        if (queryUserId && users?.length > 0) {
            const userItem = users.find((u) => u.id === Number(queryUserId));
            if (userItem) {
                setSelectedUser(userItem);
                setPage(1);
                setHasMore(true);
                fetchMessages(queryUserId, 1);
            }
        }
    }, [queryUserId, users]);

    // Handle sending messages with optimistic UI update
    const handleSendMessage = async () => {
        if (!message.trim()) return;

        const tempId = Date.now(); // Temporary id for optimistic rendering

        const newMessage = {
            id: tempId,
            content: message,
            senderId: user.id,
            receiverId: selectedUser.id,
            status: 'SENDING', // Mark message as sending initially
            createdAt: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, newMessage]);
        setMessage('');

        socket.emit('sendMessage', {
            content: message,
            senderId: user.id,
            receiverId: selectedUser.id,
            tempId,
        });
    };
    useEffect(() => {
        if (!socket) return;

        if (selectedUser) {
            socket.emit('join-user-room', {userId: user.id});

            socket.on('newMessage', (message) => {
                setMessages((prev) => [...prev, message]);
            });

            socket.on('messageSent', (data) => {
                const {tempId, message} = data;
                setMessages((prevMessages) =>
                      prevMessages.map((msg) =>
                            msg.id === tempId ? {...message, status: 'SENT'} : msg
                      )
                );
            });
        }

        return () => {
            socket.off('newMessage');
            socket.off('messageSent');
        };
    }, [socket, selectedUser]);

    useEffect(() => {
        if (messagesEndRef.current && !loadMoreClicked) {
            messagesEndRef.current.scrollIntoView({behavior: 'smooth'});
        }
    }, [messages]);

    // Handle back button click
    const handleBackClick = () => {
        router.push('/dashboard/chats');
        setSelectedUser(null);
        setMessages([]);
    };

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        if (!loadMoreClicked) {
            setLoadMoreClicked(true)
        }
        fetchMessages(selectedUser.id, nextPage, true);
    };
    return (
          <Container maxWidth="xxl">
              {loading && <FullScreenLoader/>}
              <Box
                    display="flex"
                    flexDirection={isSmallScreen ? 'column' : 'row'}
                    height={isSmallScreen ? '100vh' : '80vh'}
                    p={{xs: 1, md: 2}}
              >
                  {/* Left Column - User List */}
                  {(!isSmallScreen || !queryUserId) && (
                        <Box
                              width={isSmallScreen ? '100%' : '30%'}
                              borderRight={isSmallScreen ? 'none' : '1px solid #ccc'}
                              overflow="auto"
                              sx={{backgroundColor: '#eee'}}
                        >
                            <Typography variant="h5" p={2}>
                                المحادثات
                            </Typography>
                            <List>
                                {users?.map((userItem) => (
                                      <React.Fragment key={userItem.id}>
                                          <ListItem
                                                button
                                                onClick={() => handleUserClick(userItem)}
                                                selected={selectedUser?.id === userItem.id}
                                                sx={{
                                                    backgroundColor: selectedUser?.id === userItem.id ? 'rgba(30, 96, 145, 0.1)' : 'transparent',
                                                    borderRadius: '8px',
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(30, 96, 145, 0.05)',
                                                    },
                                                    mb: 1,
                                                    p: 2,
                                                }}
                                          >
                                              {/* Avatar and Icons */}
                                              <ListItemAvatar>
                                                  <Badge
                                                        color={userItem.role === 'ADMIN' ? 'secondary' : 'primary'}
                                                        overlap="circle"
                                                        badgeContent={userItem.role === 'ADMIN' ?
                                                              <AdminIcon size={16}/> : <SupervisorIcon size={16}/>}
                                                  >
                                                      <Avatar>
                                                          {userItem.personalInfo?.basicInfo?.name
                                                                ? userItem.personalInfo.basicInfo.name[0]
                                                                : userItem.email[0].toUpperCase()}
                                                      </Avatar>
                                                  </Badge>
                                              </ListItemAvatar>

                                              {/* User Info */}
                                              {userItem.role === 'ADMIN' || userItem.role === 'SUPERVISOR' ? (
                                                    <ListItemText
                                                          primary={
                                                              <Typography variant="subtitle1" fontWeight="bold"
                                                                          color={userItem.role === 'ADMIN' ? 'secondary' : 'primary'}>
                                                                  {userItem.role === 'ADMIN' ? 'ادمن: ' : 'مشرف: '} {userItem.personalInfo?.basicInfo?.name || userItem.email}
                                                              </Typography>
                                                          }
                                                          secondary={
                                                              <Typography variant="body2" color="textSecondary">
                                                                  {userItem.email}
                                                              </Typography>
                                                          }
                                                    />
                                              ) : (
                                                    <ListItemText
                                                          primary={
                                                              <Typography variant="subtitle1" fontWeight="bold">
                                                                  {userItem.personalInfo?.basicInfo?.name} {userItem.personalInfo?.basicInfo?.fatherName || ''}
                                                              </Typography>
                                                          }
                                                          secondary={
                                                              <Typography variant="body2" color="textSecondary">
                                                                  {userItem.email}
                                                              </Typography>
                                                          }
                                                    />
                                              )}
                                          </ListItem>
                                          <Divider/>
                                      </React.Fragment>
                                ))}
                            </List>
                        </Box>
                  )}

                  <Box
                        width={isSmallScreen || !queryUserId ? '100%' : '70%'}
                        display="flex"
                        flexDirection="column"
                        flexGrow={1}
                  >
                      {selectedUser ? (
                            <>
                                <Box
                                      p={{xs: 1, md: 2}}
                                      sx={{borderBottom: '1px solid #ccc'}}
                                      display="flex"
                                      alignItems="center"
                                >
                                    {isSmallScreen && (
                                          <IconButton onClick={handleBackClick} sx={{mr: 1}}>
                                              <ArrowBack/>
                                          </IconButton>
                                    )}
                                    <Typography variant="h6">
                                        محادثة مع{' '}
                                        {selectedUser.role === 'ADMIN' || selectedUser.role === 'SUPERVISOR' ? (
                                              selectedUser.name || selectedUser.email
                                        ) : (
                                              `${selectedUser.personalInfo?.basicInfo?.name || ''} ${
                                                    selectedUser.personalInfo?.basicInfo?.fatherName || ''
                                              } (${selectedUser.email})`
                                        )}
                                    </Typography>
                                </Box>
                                <Box
                                      flexGrow={1}
                                      display="flex"
                                      flexDirection="column"
                                      overflow="auto"
                                      sx={{padding: '10px'}}
                                      ref={messagesContainerRef}
                                >
                                    {hasMore && (
                                          <Button onClick={handleLoadMore} fullWidth>
                                              تحميل المزيد من الرسائل
                                          </Button>
                                    )}
                                    {messages?.map((msg) => (
                                          <Box
                                                key={msg.id}
                                                display="flex"
                                                justifyContent={msg.senderId === user.id ? 'flex-end' : 'flex-start'}
                                                mb={1}
                                          >
                                              <Paper
                                                    elevation={1}
                                                    sx={{
                                                        padding: '10px',
                                                        borderRadius: '10px',
                                                        maxWidth: '80%',
                                                        backgroundColor: msg.senderId === user.id ? '#DCF8C6' : '#FFFFFF',
                                                        opacity: msg.status === 'SENDING' ? 0.5 : 1,
                                                        wordWrap: 'break-word',
                                                        overflowWrap: 'break-word',
                                                    }}
                                              >
                                                  <Typography>{msg.content}</Typography>
                                                  <Typography variant="caption" color="textSecondary">
                                                      {new Date(msg.createdAt).toLocaleString()}
                                                  </Typography>
                                              </Paper>
                                          </Box>
                                    ))}
                                    <div ref={messagesEndRef}/>
                                </Box>
                                {/* Message Input */}
                                <Box p={1} borderTop="1px solid #ccc" display="flex" alignItems="center">
                                    <TextField
                                          fullWidth
                                          placeholder="اكتب رسالتك"
                                          value={message}
                                          onChange={(e) => setMessage(e.target.value)}
                                          onKeyDown={(e) => {
                                              if (e.key === 'Enter' && !e.shiftKey && message.trim() !== '') {
                                                  e.preventDefault()
                                                  handleSendMessage();
                                              }
                                          }}
                                          multiline
                                          maxRows={4}
                                          sx={{flexGrow: 1, marginRight: '8px'}}
                                    />
                                    <Button variant="contained" onClick={handleSendMessage} disabled={!message.trim()}>
                                        إرسال
                                    </Button>
                                </Box>
                            </>
                      ) : (
                            <Box
                                  display="flex"
                                  flexDirection="column"
                                  flexGrow={1}
                                  justifyContent="center"
                                  alignItems="center"
                            >
                                <Typography variant="h6">اختر مستخدمًا لبدء الدردشة</Typography>
                            </Box>
                      )}
                  </Box>
              </Box>
          </Container>
    );
};

export default ChatPage;

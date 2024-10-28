import React, {useState, useEffect} from 'react';
import {
    IconButton,
    Badge,
    Menu,
    MenuItem,
    List,
    ListItemAvatar,
    Avatar,
    ListItemText,
    Divider,
    Box,
    Link as MuiLink,
    Typography,
} from '@mui/material';
import {FaEnvelope} from 'react-icons/fa';
import Link from 'next/link';
import io from 'socket.io-client';
import {useAuth} from '@/app/providers/AuthProvider';
import {useSearchParams} from "next/navigation";

const url = process.env.NEXT_PUBLIC_URL;

const MessagesIcon = () => {
    const {user} = useAuth();
    const [unreadCount, setUnreadCount] = useState(0);
    const [messages, setMessages] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const searchParams = useSearchParams()
    const userId = searchParams.get("userId")
    const getSenderDisplayName = (sender) => {
        if (sender.personalInfo?.basicInfo) {
            const name = sender.personalInfo.basicInfo.name || '';
            const fatherName = sender.personalInfo.basicInfo.fatherName || '';
            const fullName = `${name} ${fatherName}`.trim();
            return fullName || sender.email;
        } else {
            // For admins or users without personalInfo, use email
            return sender.email;
        }
    };
    const messageSound = typeof Audio !== "undefined" && new Audio('/message-sound.mp3');

    useEffect(() => {
        const fetchLastMessages = async () => {
            try {
                const response = await fetch(`${url}/utility/messages/last-messages`, {
                    credentials: 'include',
                });
                const data = await response.json();
                setMessages(data.data);
                const unreadMessagesCount = data.data.filter(
                      (message) => message.status === 'SENT'
                ).length;
                setUnreadCount(unreadMessagesCount);
            } catch (error) {
                console.error('Error fetching last messages:', error);
            }
        };

        if (user) {
            fetchLastMessages();
        }
    }, [user]);

    useEffect(() => {
        const socket = io(url);

        socket.emit('join-user-room', {userId: user.id});

        socket.on('newMessage', (message) => {
            if (userId && +userId === +message.senderId) {
            } else {
                setMessages((prev) => {
                    // Remove any existing message from the same sender
                    const filteredMessages = prev.filter(
                          (msg) => msg.senderId !== message.senderId
                    );
                    return [message, ...filteredMessages];
                });
                setUnreadCount((prev) => prev + 1);
                if (messageSound) {
                    messageSound.play().catch((error) => {
                        console.error('Error playing message sound:', error);
                    });
                }
            }
        });

        return () => {
            socket.disconnect();
        };
    }, [user]);

    const handleOpen = async (event) => {
        setAnchorEl(event.currentTarget);
        try {
            const response = await fetch(`${url}/utility/messages/mark-as-delivered`, {
                method: 'POST',
                credentials: 'include',
            });
            if (response.ok) {
                setMessages((prevMessages) =>
                      prevMessages.map((message) => {
                          if (message.status === 'SENT') {
                              return {...message, status: 'DELIVERED'};
                          }
                          return message;
                      })
                );
                setUnreadCount(0);
            } else {
                console.error('Failed to mark messages as delivered');
            }
        } catch (error) {
            console.error('Error marking messages as delivered:', error);
        }
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
          <>
              <IconButton color="primary" onClick={handleOpen}>
                  <Badge badgeContent={unreadCount} color="error">
                      <FaEnvelope size={24}/>
                  </Badge>
              </IconButton>
              <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                  <List sx={{width: '350px'}}>
                      {!messages || messages.length === 0 ? (
                            <MenuItem>لا يوجد رسائل جديدة</MenuItem>
                      ) : (
                            messages.map((message) => (
                                  <React.Fragment key={message.id}>
                                      <MenuItem
                                            component={Link}
                                            href={`/dashboard/chats?userId=${message.senderId}`}
                                            onClick={handleClose}
                                            sx={{
                                                transition: 'background-color 0.3s ease',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(30, 96, 145, 0.05)',
                                                },
                                            }}
                                      >
                                          <ListItemAvatar>
                                              <Avatar>
                                                  {getSenderDisplayName(message.sender)[0]}
                                              </Avatar>
                                          </ListItemAvatar>
                                          <ListItemText
                                                primary={
                                                    <Typography variant="subtitle1" fontWeight="bold">
                                                        {getSenderDisplayName(message.sender)}
                                                    </Typography>
                                                }
                                                secondary={
                                                    <Typography
                                                          variant="body2"
                                                          sx={{color: 'text.secondary'}}
                                                          noWrap
                                                    >
                                                        {message.content}
                                                    </Typography>
                                                }
                                          />
                                      </MenuItem>
                                      <Divider/>
                                  </React.Fragment>
                            ))
                      )}
                  </List>
                  <Divider/>
                  <Box textAlign="center" p={1}>
                      <MuiLink component={Link} href="/dashboard/chats" onClick={handleClose}>
                          عرض جميع المحادثات
                      </MuiLink>
                  </Box>
              </Menu>
          </>
    );
};

export default MessagesIcon;

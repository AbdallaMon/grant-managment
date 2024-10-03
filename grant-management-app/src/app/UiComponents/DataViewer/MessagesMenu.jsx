import React, {useState, useEffect} from 'react';
import {
    IconButton,
    Badge,
    Menu,
    MenuItem,
    List,
    ListItemText,
    Divider,
    Box,
    Link as MuiLink,
} from '@mui/material';
import {FaEnvelope} from 'react-icons/fa';
import Link from 'next/link';
import io from 'socket.io-client';
import {useAuth} from '@/app/providers/AuthProvider';

const url = process.env.NEXT_PUBLIC_URL;

const MessagesIcon = () => {
    const {user} = useAuth();
    const [unreadCount, setUnreadCount] = useState(0);
    const [messages, setMessages] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

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

    useEffect(() => {
        const fetchLastMessages = async () => {
            try {
                const response = await fetch(`${url}/utility/messages/last-messages`, {
                    credentials: 'include',
                });
                const data = await response.json();
                setMessages(data.data);

                // Update unread count based on messages with status SENT
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
            setMessages((prev) => {
                // Remove any existing message from the same sender
                const filteredMessages = prev.filter(
                      (msg) => msg.senderId !== message.senderId
                );
                return [message, ...filteredMessages];
            });
            setUnreadCount((prev) => prev + 1);
        });

        return () => {
            socket.disconnect();
        };
    }, [user]);

    const handleOpen = async (event) => {
        setAnchorEl(event.currentTarget);
        // On open, make a request to mark messages with status SENT as DELIVERED
        try {
            const response = await fetch(`${url}/utility/messages/mark-as-delivered`, {
                method: 'POST',
                credentials: 'include',
            });
            if (response.ok) {
                // Update messages status locally
                setMessages((prevMessages) =>
                      prevMessages.map((message) => {
                          if (message.status === 'SENT') {
                              return {...message, status: 'DELIVERED'};
                          }
                          return message;
                      })
                );
                setUnreadCount(0); // Reset unread count
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
                  <List sx={{width: '300px'}}>
                      {!messages || messages.length === 0 ? (
                            <MenuItem>لا يوجد رسائل جديدة</MenuItem>
                      ) : (
                            messages.map((message) => (
                                  <MenuItem
                                        key={message.id}
                                        component={Link}
                                        href={`/dashboard/chats?userId=${message.senderId}`}
                                        onClick={handleClose}
                                  >
                                      <ListItemText
                                            primary={getSenderDisplayName(message.sender)}
                                            secondary={message.content}
                                      />
                                  </MenuItem>
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

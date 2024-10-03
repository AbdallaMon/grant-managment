import React, {useState, useEffect} from 'react';
import {Badge, IconButton, Menu, MenuItem, List, ListItem, ListItemText, Button, Typography, Box} from '@mui/material';
import {FaBell} from 'react-icons/fa';
import Link from 'next/link';
import io from 'socket.io-client';
import {useAuth} from "@/app/providers/AuthProvider";
import {NotificationType} from "@/app/helpers/constants";

const url = process.env.NEXT_PUBLIC_URL;

const NotificationsIcon = () => {
    const {user} = useAuth();
    const [unreadCount, setUnreadCount] = useState(0); // Count of unread notifications
    const [notifications, setNotifications] = useState([]); // Array of notifications
    const [anchorEl, setAnchorEl] = useState(null); // For MUI Menu (dropdown)
    const open = Boolean(anchorEl);

    useEffect(() => {
        const fetchUnreadNotifications = async () => {
            try {
                const response = await fetch(`${url}/utility/notification/unread/?userId=${user.id}&isAdmin=${user.role === "ADMIN"}`);
                const res = await response.json();
                setNotifications(res.data);
                setUnreadCount(res.data.length);
            } catch (error) {
                console.error('Error fetching unread notifications:', error);
            }
        };

        if (user) {
            fetchUnreadNotifications();
        }
    }, [user]);

    useEffect(() => {
        const socket = io(url, {
            transports: ['websocket', 'polling'], // WebSocket first, then fallback to polling
        });

        if (user?.role === 'ADMIN') {
            socket.emit('join-admin-room', {userId: user.id}); // Pass user ID so they join their own room
        } else {
            socket.emit('join-user-room', {userId: user.id});
        }

        socket.on('notification', (notification) => {
            setNotifications((prev) => [notification, ...prev]);
            setUnreadCount((prev) => prev + 1); // Increase unread count
        });

        return () => {
            socket.off('notification');
            socket.disconnect();
        };
    }, [user]);

    useEffect(() => {
        if (open) {
            const handleOpenNotificationPaper = async () => {
                try {
                    const urlPath = user.role === 'ADMIN' ? `${url}/utility/notification/admins/${user.id}` : `${url}/notification/users/${user.id}`;
                    await fetch(urlPath, {method: 'POST'});
                    handleMarkAsRead();
                } catch (error) {
                    console.error('Error marking notifications as read:', error);
                }
            };
            handleOpenNotificationPaper();
        }
    }, [open]);

    const handleOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleMarkAsRead = () => {
        setUnreadCount(0);
        setNotifications((prev) => prev.map((n) => ({...n, isRead: true})));
    };

    const renderNotificationContent = (content) => {
        return content.length > 100 ? `${content.slice(0, 100)}...` : content;
    };

    return (
          <>
              <IconButton
                    color="primary"
                    onClick={handleOpen}
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
              >
                  <Badge badgeContent={unreadCount} color="error">
                      <FaBell size={24}/>
                  </Badge>
              </IconButton>
              <Menu
                    anchorEl={anchorEl}
                    id="basic-menu"
                    open={open}
                    onClose={handleClose}
                    PaperProps={{
                        style: {
                            maxHeight: '500px',
                            width: '350px',
                            overflowY: 'auto', // Add scrolling
                        },
                    }}
              >
                  <List sx={{padding: 0}}>
                      {notifications.length === 0 ? (
                            <Typography textAlign="center" sx={{padding: '16px'}}>لا يوجد إشعارات جديدة</Typography>
                      ) : (
                            notifications.map((notification) => (
                                  notification.href ? (
                                        <ListItem
                                              key={notification.id}
                                              button
                                              component={Link}
                                              href={notification.href || '#'}
                                              sx={{
                                                  '&:hover': {
                                                      backgroundColor: '#f0f4f8',
                                                  },
                                                  padding: '12px 16px',
                                              }}
                                        >
                                            <ListItemText
                                                  primary={
                                                      <Typography
                                                            component="span"
                                                            sx={{color: 'primary.main', fontWeight: 'bold'}}
                                                      >
                                                          {NotificationType[notification.type]}
                                                      </Typography>
                                                  }
                                                  secondary={renderNotificationContent(notification.content)}
                                            />
                                        </ListItem>
                                  ) : (
                                        <ListItem
                                              key={notification.id}
                                              sx={{
                                                  '&:hover': {
                                                      backgroundColor: '#f0f4f8',
                                                  },
                                                  padding: '12px 16px',
                                              }}
                                        >
                                            <ListItemText
                                                  primary={
                                                      <Typography
                                                            component="span"
                                                            sx={{color: 'primary.main', fontWeight: 'bold'}}
                                                      >
                                                          {NotificationType[notification.type]}
                                                      </Typography>
                                                  }
                                                  secondary={renderNotificationContent(notification.content)}
                                            />
                                        </ListItem>
                                  )
                            ))
                      )}
                  </List>
                  <MenuItem>
                      <Button fullWidth component={Link} href="/dashboard/notifications">
                          عرض جميع الإشعارات
                      </Button>
                  </MenuItem>
              </Menu>
          </>
    );
};

export default NotificationsIcon;

"use client";
import React from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    IconButton,
    Grid,
    Divider,
    CardActionArea,
    Avatar,
    Badge,
} from "@mui/material";
import {
    IoIosNotifications as NotificationsIcon,
    IoMdChatbubbles as MessageIcon,
    IoMdCheckmarkCircleOutline as SuccessIcon,
    IoMdCloseCircleOutline as ErrorIcon,
    IoMdAlert as WarningIcon,
} from "react-icons/io";
import useDataFetcher from "@/app/helpers/hooks/useDataFetcher";
import PaginationWithLimit from "@/app/UiComponents/DataViewer/PaginationWithLimit";
import {useAuth} from "@/app/providers/AuthProvider";
import FullScreenLoader from "@/app/UiComponents/feedback/loaders/FullscreenLoader";
import {NotificationType} from "@/app/helpers/constants";
import dayjs from "dayjs";
import Link from "next/link";

const NotificationsPage = () => {
    const {user} = useAuth();
    const {
        data: notifications,
        loading,
        page,
        setPage,
        totalPages,
        limit,
        setLimit,
        total,
    } = useDataFetcher(
          `utility/notification?isAdmin=${user.role === "ADMIN"}&userId=${user.id}&`,
          false
    );
    if (loading) return <FullScreenLoader/>;

    const getNotificationTypeColor = (type) => {
        switch (type) {
            case "MESSAGE":
                return "info";
            case "APPLICATION_APPROVED":
            case "APPLICATION_COMPLETED":
            case "PAYMENT_COMPLETED":
                return "success";
            case "APPLICATION_REJECTED":
            case "APPLICATION_UN_COMPLETE":
                return "error";
            case "APPLICATION_UPDATE":
            case "APPLICATION_RESPONSE":
            case "PAYMENT_DUE":
                return "warning";
            default:
                return "primary";
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case "MESSAGE":
                return <MessageIcon/>;
            case "APPLICATION_APPROVED":
            case "APPLICATION_COMPLETED":
            case "PAYMENT_COMPLETED":
                return <SuccessIcon/>;
            case "APPLICATION_REJECTED":
            case "APPLICATION_UN_COMPLETE":
                return <ErrorIcon/>;
            case "APPLICATION_UPDATE":
            case "APPLICATION_RESPONSE":
            case "PAYMENT_DUE":
                return <WarningIcon/>;
            default:
                return <NotificationsIcon/>;
        }
    };

    return (
          <Box p={4} sx={{backgroundColor: "background.default", minHeight: "100vh"}}>
              <Typography variant="h4" fontWeight="bold" mb={4}>
                  الإشعارات
              </Typography>
              {notifications.length > 0 ? (
                    <Grid container spacing={3}>
                        {notifications.map((notification) => (
                              <Grid item xs={12} md={6} xl={4} key={notification.id}>
                                  <Card
                                        variant="outlined"
                                        sx={{
                                            backgroundColor: "#fff",
                                            borderRadius: "12px",
                                            boxShadow: 2,
                                            transition: "transform 0.3s ease",
                                            "&:hover": {
                                                transform: "scale(1.02)",
                                                boxShadow: 4,
                                            },
                                        }}
                                  >
                                      <CardActionArea
                                            component={notification.href ? Link : "div"}
                                            href={notification.href || "#"}
                                            sx={{textDecoration: "none"}}
                                      >
                                          <CardContent>
                                              <Box display="flex" alignItems="center" mb={2}>
                                                  <Badge
                                                        color={getNotificationTypeColor(notification.type)}
                                                        variant="dot"
                                                        overlap="circular"
                                                        anchorOrigin={{
                                                            vertical: "bottom",
                                                            horizontal: "right",
                                                        }}
                                                        sx={{mr: 2}}
                                                  >
                                                      <Avatar
                                                            sx={{
                                                                bgcolor: `${getNotificationTypeColor(notification.type)}.main`,
                                                                color: "#fff",
                                                            }}
                                                      >
                                                          {getNotificationIcon(notification.type)}
                                                      </Avatar>
                                                  </Badge>
                                                  <Box>
                                                      <Typography variant="subtitle1" fontWeight="bold">
                                                          {notification.content}
                                                      </Typography>
                                                      <Typography variant="body2" color="textSecondary">
                                                          {dayjs(notification.createdAt).format("DD MMMM YYYY, HH:mm")}
                                                      </Typography>
                                                  </Box>
                                              </Box>
                                              <Divider sx={{my: 1}}/>
                                              <Typography
                                                    variant="body2"
                                                    color={`${getNotificationTypeColor(notification.type)}.main`}
                                              >
                                                  {NotificationType[notification.type]}
                                              </Typography>
                                          </CardContent>
                                      </CardActionArea>
                                  </Card>
                              </Grid>
                        ))}
                    </Grid>
              ) : (
                    <Typography variant="body1" color="textSecondary" textAlign="center">
                        لا توجد إشعارات.
                    </Typography>
              )}
              <PaginationWithLimit
                    total={total}
                    limit={limit}
                    page={page}
                    setLimit={setLimit}
                    setPage={setPage}
                    totalPages={totalPages}
                    sx={{mt: 4}}
              />
          </Box>
    );
};

export default NotificationsPage;

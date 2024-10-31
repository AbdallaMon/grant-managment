"use client";
import React from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid2 as Grid,
    Divider,
    CardActionArea,
    Avatar,
    Badge,
    Tooltip,
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
import "dayjs/locale/ar";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";

dayjs.extend(relativeTime);
dayjs.locale("ar");

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
                return <MessageIcon aria-label="رسالة"/>;
            case "APPLICATION_APPROVED":
            case "APPLICATION_COMPLETED":
            case "PAYMENT_COMPLETED":
                return <SuccessIcon aria-label="تمت الموافقة"/>;
            case "APPLICATION_REJECTED":
            case "APPLICATION_UN_COMPLETE":
                return <ErrorIcon aria-label="مرفوض"/>;
            case "APPLICATION_UPDATE":
            case "APPLICATION_RESPONSE":
            case "PAYMENT_DUE":
                return <WarningIcon aria-label="تنبيه"/>;
            default:
                return <NotificationsIcon aria-label="إشعار"/>;
        }
    };

    return (
          <Box p={4} sx={{backgroundColor: "background.default",}}>
              <Typography variant="h4" fontWeight="bold" mb={4}>
                  الإشعارات
              </Typography>
              {notifications.length > 0 ? (
                    <Grid container spacing={3}>
                        {notifications.map((notification) => (
                              <Grid size={{
                                  xs: 12, md: 6, xl: 4
                              }} key={notification.id}>
                                  <Card
                                        variant="outlined"
                                        sx={{
                                            backgroundColor: "#fff",
                                            borderRadius: "12px",
                                            boxShadow: 2,
                                            height: "100%",
                                            transition: "transform 0.3s ease",
                                            transform: notification.isRead ? 'none' : 'scale(1.02)',
                                            "&:hover": {
                                                boxShadow: 4,
                                                transform: "scale(1.03)",
                                            },
                                        }}
                                  >
                                      <CardActionArea
                                            component={notification.href ? Link : "div"}
                                            href={notification.href || "#"}
                                            sx={{textDecoration: "none"}}
                                            onClick={() => {/* Update notification read status here */
                                            }}
                                      >
                                          <CardContent>
                                              <Box display="flex" alignItems="center" mb={2}>
                                                  <Badge
                                                        color={getNotificationTypeColor(notification.type)}
                                                        variant={notification.isRead ? 'standard' : 'dot'}
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
                                                          <Tooltip title={NotificationType[notification.type]}
                                                                   placement="top">
                                                              {getNotificationIcon(notification.type)}
                                                          </Tooltip>
                                                      </Avatar>
                                                  </Badge>
                                                  <Box>
                                                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                                          {notification.content}
                                                      </Typography>
                                                      <Typography variant="body2" color="textSecondary">
                                                          {dayjs(notification.createdAt).isAfter(dayjs().subtract(1, 'day'))
                                                                ? dayjs(notification.createdAt).fromNow()
                                                                : dayjs(notification.createdAt).format("DD MMMM YYYY, HH:mm")}
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

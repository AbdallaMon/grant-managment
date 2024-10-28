"use client";

import React, {useEffect, useState} from "react";
import {
    AppBar,
    Toolbar,
    Box,
    IconButton,
    Button,
    Drawer,
    List,
    ListItem,
    ListItemText,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import {FaBars, FaEnvelope, FaThLarge} from "react-icons/fa"; // FaThLarge as the 'More' button
import Link from "next/link";
import {useAuth} from "@/app/providers/AuthProvider";
import LogoutButton from "@/app/UiComponents/Buttons/LogoutBtn";
import NotificationsIcon from "@/app/UiComponents/DataViewer/NotificationMenu";
import MessagesIcon from "@/app/UiComponents/DataViewer/MessagesMenu";

// Define role-based navigation structure in Arabic
const roleBasedLinks = {
    ADMIN: [
        {name: "لوحة التحكم", route: "dashboard"},
        {name: "المستخدمين", route: "users"},
        {name: "المنح", route: "grants"},
        {name: "الشكاوي", route: "tickets"},
        {name: "مهام المشرفين", route: "tasks"},
        {name: "الدفعات", route: "payments"},
        {name: "الفواتير", route: "invoices"},
    ],
    SUPERVISOR: [
        {name: "لوحة التحكم", route: "dashboard"},
        {name: "الطلاب", route: "students"},
        {name: "طلبات المراجعة", route: "grants/applications"},
        {name: "المنح", route: "grants"},
        {name: "المهام", route: "tasks"},
        {name: "الدفعات", route: "payments"},
        {name: "الفواتير", route: "invoices"},
    ],
    STUDENT: [
        {name: "لوحة التحكم", route: "dashboard"},
        {name: "المنح الدراسية", route: "grants"},
        {name: "الملف الشخصي", route: "profile"},
        {name: "الشكاوي", route: "tickets"},
    ],
    SPONSOR: [
        {name: "لوحة التحكم", route: "dashboard"},
        {name: "الطلاب", route: "students"},
    ],
    DONOR: [
        {name: "لوحة التحكم", route: "dashboard"},
        {name: "الطلاب", route: "students"},
    ],
};

// Separated component for Notifications and Messages
function NotificationsAndMessages({role, isLoggedIn}) {
    if (role === "SPONSOR" || role === "DONOR" || !isLoggedIn) return null;

    return (
          <Box sx={{display: "flex", alignItems: "center"}}>
              <MessagesIcon/>
              <NotificationsIcon/>
          </Box>
    );
}

export default function Navbar() {
    const {isLoggedIn, user: {role} = {}} = useAuth();
    const isSmallMedia = useMediaQuery("(max-width:767px)");
    const isLargeMedia = useMediaQuery("(min-width:768px)");
    const theme = useTheme();

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [links, setLinks] = useState([]);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false); // State for the large-screen drawer

    // Manage links based on role
    useEffect(() => {
        if (isLoggedIn) {
            setLinks(roleBasedLinks[role] || []);
        } else {
            setLinks([]);
        }
    }, [isLoggedIn, role]);

    const toggleDrawer = (open) => {
        setDrawerOpen(open);
    };

    // Function to render first four links
    const renderFirstFourLinks = (links) => {
        return links.slice(0, 4).map((link) => (
              <Button
                    key={link.route}
                    component={Link}
                    href={`/dashboard/${link.route === "dashboard" ? "" : link.route}`}
                    sx={{mx: 2}}
              >
                  {link.name}
              </Button>
        ));
    };

    // Function to render all links in the drawer
    const renderAllLinks = (links) => {
        return links.map((link, index) => (
              <ListItem
                    button
                    key={index}
                    component={Link}
                    href={`/dashboard/${link.route === "dashboard" ? "" : link.route}`}
              >
                  <ListItemText primary={link.name}/>
              </ListItem>
        ));
    };

    // Function to toggle the large-screen drawer
    const handleDrawerToggle = (open) => {
        setIsDrawerOpen(open);
    };

    return (
          <Box sx={{flexGrow: 1}}>
              <AppBar position="fixed" sx={{backgroundColor: theme.palette.background.paper}}>
                  <Toolbar>
                      {isSmallMedia && isLoggedIn ? (
                            <>
                                <IconButton
                                      edge="start"
                                      color="primary"
                                      aria-label="menu"
                                      onClick={() => toggleDrawer(true)}
                                >
                                    <FaBars/>
                                </IconButton>
                                <NotificationsAndMessages role={role} isLoggedIn={isLoggedIn}/>
                                <Drawer
                                      anchor="left"
                                      open={drawerOpen}
                                      onClose={() => toggleDrawer(false)}
                                      sx={{
                                          "& .MuiPaper-root": {
                                              backgroundColor: theme.palette.background.paper,
                                          },
                                      }}
                                >
                                    <Box sx={{width: 250}}>
                                        <List>
                                            {renderAllLinks(links)}
                                        </List>
                                    </Box>

                                </Drawer>
                            </>
                      ) : (
                            <>
                                {isLoggedIn && (
                                      <IconButton
                                            edge="start"
                                            color="primary"
                                            aria-label="more-links"
                                            onClick={() => handleDrawerToggle(true)}
                                      >
                                          <FaBars size={24}/>
                                      </IconButton>
                                )}
                                <NotificationsAndMessages role={role} isLoggedIn={isLoggedIn}/>
                                <Box sx={{flexGrow: 1, display: "flex", justifyContent: "center"}}>
                                    {renderFirstFourLinks(links)}
                                    {isLargeMedia && (
                                          <>
                                              {/* Button to open drawer for the remaining links */}
                                              <Drawer
                                                    anchor="left"
                                                    open={isDrawerOpen}
                                                    onClose={() => handleDrawerToggle(false)}
                                                    sx={{
                                                        "& .MuiPaper-root": {
                                                            width: 250,
                                                            backgroundColor: theme.palette.background.paper,
                                                        },
                                                    }}
                                              >
                                                  <List>
                                                      {renderAllLinks(links)}
                                                  </List>
                                              </Drawer>
                                          </>
                                    )}
                                </Box>
                            </>
                      )}

                      <Box sx={{ml: "auto"}}>
                          {isLoggedIn ? (
                                <LogoutButton/>
                          ) : (
                                <Button
                                      component={Link}
                                      href="/login"
                                      color="secondary"
                                      variant="contained"
                                >
                                    تسجيل الدخول
                                </Button>
                          )}
                      </Box>
                  </Toolbar>
              </AppBar>
          </Box>
    );
}

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
import {FaBars, FaBell, FaEnvelope} from "react-icons/fa";
import Link from "next/link";
import {useAuth} from "@/app/providers/AuthProvider";
import LogoutButton from "@/app/UiComponents/Buttons/LogoutBtn";

// Define role-based navigation structure in Arabic
const roleBasedLinks = {
    ADMIN: [
        {name: "لوحة التحكم", route: "dashboard"},
        {name: "المستخدمين", route: "users"},
        {name: "المنح", route: "grants"},
        {name: "الشكاوي", route: "complaints"},
        {name: "مهام المشرفين", route: "tasks"}
    ],
    SUPERVISOR: [
        {name: "لوحة التحكم", route: "dashboard"},
        {name: "الطلاب", route: "students"},
        {name: "طلبات المراجعة", route: "applications-review"},
        {name: "المنح", route: "grants"},
        {name: "المهام", route: "tasks"}
    ],
    STUDENT: [
        {name: "لوحة التحكم", route: "dashboard"},
        {name: "المنح الدراسية", route: "grants"},
        {name: "الملف الشخصي", route: "profile"},
    ],
    SPONSOR: [
        {name: "لوحة التحكم", route: "dashboard"},
    ],
    DONOR: [
        {name: "لوحة التحكم", route: "dashboard"},
    ],
};

// Separated component for Notifications and Messages
function NotificationsAndMessages({role, isLoggedIn}) {
    if (role === "SPONSOR" || role === "DONOR" || !isLoggedIn) return null;

    return (
          <Box sx={{display: "flex", alignItems: "center"}}>
              <IconButton component={Link} href="/dashboard/messages" aria-label="Messages" sx={{mx: 1}}
                          color="primary">

                  <FaEnvelope size={20}/>
              </IconButton>
              <IconButton component={Link} href="/dashboard/notifications" aria-label="Notifications" sx={{mx: 1}}
                          color="primary">
                  <FaBell size={20}/>
              </IconButton>
          </Box>
    );
}

export default function Navbar() {
    const {isLoggedIn, user: {role} = {}} = useAuth(); // Assuming useAuth provides user data
    const isSmallMedia = useMediaQuery("(max-width:767px)");
    const theme = useTheme();

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [links, setLinks] = useState([]);

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

    const renderLinks = (links) => {
        return links.map((link) => (
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

    return (
          <Box sx={{flexGrow: 1}}>
              <AppBar position="fixed" sx={{backgroundColor: theme.palette.background.paper}}>
                  <Toolbar>
                      {isSmallMedia ? (
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
                                            {isLoggedIn ? (
                                                  links.map((link, index) => (
                                                        <ListItem
                                                              button
                                                              key={index}
                                                              component={Link}
                                                              href={`/dashboard/${link.route === "dashboard" ? "" : link.route}`}
                                                        >
                                                            <ListItemText primary={link.name}/>
                                                        </ListItem>
                                                  ))
                                            ) : (
                                                  <ListItem button component={Link} href="/login">
                                                      <ListItemText primary="تسجيل الدخول"/>
                                                  </ListItem>
                                            )}
                                        </List>
                                    </Box>
                                </Drawer>
                            </>
                      ) : (
                            <>
                                <NotificationsAndMessages role={role}
                                                          isLoggedIn={isLoggedIn}/>

                                <Box sx={{flexGrow: 1, display: "flex", justifyContent: "center"}}>
                                    {renderLinks(links)}
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

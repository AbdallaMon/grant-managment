"use client";
import React, {useState, useEffect} from "react";
import {
    Box,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Snackbar,
    Typography, ListItemAvatar, Avatar, Divider,
} from "@mui/material";
import {MdDelete as DeleteIcon} from "react-icons/md";
import MuiAlert from "@mui/material/Alert";
import {getData} from "@/app/helpers/functions/getData";
import SearchComponent from "@/app/UiComponents/formComponents/SearchComponent";
import {getPropertyValue} from "@/app/helpers/functions/utility";
import Grid from "@mui/material/Grid2"
import {handleRequestSubmit} from "@/app/helpers/functions/handleSubmit";
import {useToastContext} from "@/app/providers/ToastLoadingProvider";
import FullScreenLoader from "@/app/UiComponents/feedback/loaders/FullscreenLoader";
import {BsPerson} from "react-icons/bs";

const UserSelectorWithAction = ({route, label, item, renderKeys, searchFilter}) => {
    const [data, setData] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [snackbarMessage, setSnackbarMessage] = useState(null);
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");
    const {loading: submitLoading, setLoading: setSubmitLoading} = useToastContext()

    useEffect(() => {
        async function handleAssignment(user) {
            const checkIsExist = users.find((u) => u.id === user.id)
            if (checkIsExist) {
                setSnackbarMessage("هذا المستخدم لدية الصلاحيات بالفعل")
                setSnackbarSeverity("error")
                return
            }
            const request = await handleRequestSubmit({userId: user.id}, setSubmitLoading, `${route}/${item.id}`, null, "جاري منح الصلاحية",)
            if (request.status === 200) {
                setUsers((users) => ([...users, request.data]))
            }
        }

        if (selectedUser && selectedUser.query) {
            handleAssignment(selectedUser.query)
        }
    }, [selectedUser])
    useEffect(() => {
        const fetchGrantUsers = async () => {
            const response = await getData({url: `${route}/${item.id}`, setLoading})
            setUsers(response.users);
            setData(response.data);
        }
        fetchGrantUsers();
    }, []);

    const handleDelete = async (userId) => {
        const request = await handleRequestSubmit({userId}, setSubmitLoading, `${route}/${item.id}`, null, "جاري الغاء الصلاحية", null, "DELETE")
        if (request.status === 200) {
            setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
            setSnackbarSeverity("success");
            setSnackbarMessage("تم حذف هذا المستخدم بنجاح");
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbarMessage(null);
    };

    return (
          <Box sx={{padding: 2}}>
              {(loading || submitLoading) && <FullScreenLoader/>}
              <Typography variant="h6" gutterBottom>
                  {label}
              </Typography>
              <>
                  <Grid container spacing={2} sx={{marginBottom: 3}}>
                      {renderKeys.map((key) => (
                            <Grid size={{xs: 12, md: 6}} key={key.id}>
                                <Typography variant="body1">
                                    {key.label}: {getPropertyValue(data, key.id, key.enums)}
                                </Typography>
                            </Grid>
                      ))}
                  </Grid>
                  <SearchComponent
                        apiEndpoint="search?model=user"
                        setFilters={setSelectedUser}
                        inputLabel="ابحث بالاسم او الايميل"
                        renderKeys={["personalInfo.basicInfo.name", "email"]}
                        mainKey="email"
                        localFilters={searchFilter}
                  />
                  <List sx={{
                      backgroundColor: 'background.default',
                      borderRadius: 2,
                      padding: 2,
                      mt: 3,
                      maxWidth: 800,
                      mx: "auto"
                  }}>
                      {users?.map((user) => (
                            <React.Fragment key={user.id}>
                                <ListItem
                                      secondaryAction={
                                          <IconButton edge="end" aria-label="delete"
                                                      onClick={() => handleDelete(user.id)}>
                                              <DeleteIcon sx={{color: "error.main"}}/>
                                          </IconButton>
                                      }
                                >
                                    <ListItemAvatar>
                                        <Avatar sx={{bgcolor: 'primary.main'}}>
                                            <BsPerson/>
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                          primary={<Typography
                                                variant="h6">{user.personalInfo.basicInfo.name}</Typography>}
                                          secondary={<Typography variant="body2"
                                                                 color="textSecondary">{user.email}</Typography>}
                                    />
                                </ListItem>
                                <Divider/>
                            </React.Fragment>
                      ))}
                  </List>
              </>
              <Snackbar
                    open={!!snackbarMessage}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
              >
                  <MuiAlert onClose={handleCloseSnackbar} severity={snackbarSeverity} elevation={6} variant="filled">
                      {snackbarMessage}
                  </MuiAlert>
              </Snackbar>
          </Box>
    );
};

export default UserSelectorWithAction;

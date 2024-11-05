import React, {useState, useEffect} from "react";
import {
    Box,
    Typography,
    Button,
    Collapse,
    Card,
    CardContent,
    Divider, TextField, MenuItem, Snackbar, IconButton, Alert,
    Avatar, List,
    ListItem,
    ListItemText, Portal, Grid2 as Grid, FormControl, InputLabel, Select, Checkbox, FormHelperText, Paper,
} from "@mui/material";
import {MdOutlineExpandMore as ExpandMoreIcon} from "react-icons/md";
import {MdOutlineExpandLess as ExpandLessIcon} from "react-icons/md";
import {AiOutlineEdit as EditIcon} from "react-icons/ai";
import {FaDeleteLeft as DeleteIcon} from "react-icons/fa6";
import CircularProgress from "@mui/material/CircularProgress";
import {getData} from "@/app/helpers/functions/getData";
import FullScreenLoader from "@/app/UiComponents/feedback/loaders/FullscreenLoader";

import {
    ApplicationStatus, ArFieldEnum, ArModelEnum, FieldEnum,
    GenderType, ModelEnum,

    StatusColor,

} from "@/app/helpers/constants";
import dayjs from "dayjs";
import MuiAlert from "@mui/material/Alert";
import ConfirmWithActionModel from "@/app/UiComponents/models/ConfirmsWithActionModel";
import SearchComponent from "@/app/UiComponents/formComponents/SearchComponent";
import {handleRequestSubmit} from "@/app/helpers/functions/handleSubmit";
import {useToastContext} from "@/app/providers/ToastLoadingProvider";
import DrawerWithContent from "@/app/UiComponents/DataViewer/DrawerWithContent";
import ApplicationDataView from "@/app/UiComponents/admin/ApplicationDataView";
import {RenderImprovementsAndAskedFields} from "@/app/UiComponents/admin/RenderImprovementsAndAskedFields";
import UserGrantsView from "@/app/UiComponents/DataViewer/UserGrantsView";


function UserProfilePreview({personalInfo, userImage}) {
    const [openSections, setOpenSections] = React.useState({
        basicInfo: true,
        contactInfo: true,
        studyInfo: true,
    });

    const handleToggle = (section) => {
        setOpenSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    const {basicInfo, contactInfo, studyInfo} = personalInfo;

    return (
          <>
              <Box sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                  gap: 2,
                  py: 2
              }}>
                  <Avatar
                        sx={{
                            width: 80,
                            height: 80,
                            border: '3px solid white',
                        }}
                        src={userImage || '/default-avatar.png'} // Replace with actual avatar URL
                        alt={`${basicInfo?.name} ${basicInfo?.familyName}`}
                  />
                  <Box sx={{mt: 0, textAlign: 'center'}}>
                      <Typography variant="h6" fontWeight="bold">
                          {`${basicInfo?.name || ''} ${basicInfo?.fatherName || ''} ${basicInfo?.familyName || ''}`}
                      </Typography>
                      <Typography variant="subtitle1" color="textSecondary">
                          {basicInfo?.nationality || 'لا يوجد'}
                      </Typography>
                  </Box>
              </Box>

              <CardContent>
                  <Grid container spacing={2}>

                      <Section
                            title="المعلومات الأساسية"
                            open={openSections.basicInfo}
                            onToggle={() => handleToggle('basicInfo')}
                      >
                          <InfoList items={[
                              {label: 'الجواز', value: basicInfo?.passport || 'لا يوجد'},
                              {label: 'الجنس', value: basicInfo?.gender ? GenderType[basicInfo.gender] : 'غير متوفر'},
                              {
                                  label: 'تاريخ الميلاد',
                                  value: basicInfo?.birthDate ? dayjs(basicInfo.birthDate).format('DD/MM/YYYY') : 'غير متوفر'
                              },
                              {label: 'البلد', value: basicInfo?.residenceCountry || 'لا يوجد'},
                              {label: 'هل لديك إعاقة', value: basicInfo?.hasDisability ? 'نعم' : 'لا'},
                              basicInfo?.hasDisability && {
                                  label: 'نوع الإعاقة',
                                  value: basicInfo?.disability || 'غير متوفر'
                              },
                          ]}/>
                      </Section>

                      {/* Contact Information */}
                      <Section
                            title="معلومات الاتصال"
                            open={openSections.contactInfo}
                            onToggle={() => handleToggle('contactInfo')}
                      >
                          <InfoList items={[
                              {label: 'الهاتف', value: contactInfo?.phone || 'لا يوجد'},
                              {label: 'واتساب', value: contactInfo?.whatsapp || 'لا يوجد'},
                              {label: 'فيسبوك', value: contactInfo?.facebook || 'لا يوجد'},
                              {label: 'انستغرام', value: contactInfo?.instagram || 'لا يوجد'},
                              {label: 'تويتر', value: contactInfo?.twitter || 'لا يوجد'},
                          ]}/>
                      </Section>

                      {/* Study Information */}
                      <Section
                            title="المعلومات الدراسية"
                            open={openSections.studyInfo}
                            onToggle={() => handleToggle('studyInfo')}
                      >
                          <InfoList items={[
                              {label: 'الجامعة', value: studyInfo?.university || 'لا يوجد'},
                              {label: 'الكلية', value: studyInfo?.college || 'لا يوجد'},
                              {label: 'القسم', value: studyInfo?.department || 'لا يوجد'},
                              {label: 'السنة الدراسية', value: studyInfo?.year || 'لا يوجد'},
                              {label: 'رقم الطالب', value: studyInfo?.studentIdNo || 'لا يوجد'},
                          ]}/>
                      </Section>
                  </Grid>

              </CardContent>
          </>
    );
}

function Section({title, children, open, onToggle}) {
    return (
          <Grid size={{xs: 12, md: 6}}>
              <Box sx={{display: 'flex', alignItems: 'center', mt: 2}}>
                  {/*<IconButton onClick={onToggle}>*/}
                  {/*    {open ? <ExpandLessIcon/> : <ExpandMoreIcon/>}*/}
                  {/*</IconButton>*/}
                  <Typography variant="subtitle1" fontWeight="bold">
                      {title}
                  </Typography>
              </Box>
              <Divider sx={{my: 1}}/>
              <Collapse in={open} timeout="auto" unmountOnExit>
                  {children}
              </Collapse>
          </Grid>
    );
}

function InfoList({items}) {
    return (
          <List disablePadding>
              {items
                    .filter(Boolean)
                    .map((item, index) => (
                          <ListItem key={index} sx={{py: 0.5}}>
                              <ListItemText
                                    primary={
                                        <Typography variant="body1">
                                            <strong>{item.label}:</strong> {item.value}
                                        </Typography>
                                    }
                              />
                          </ListItem>
                    ))}
          </List>
    );
}

export default function ApplicationWithProfileViewer({
                                                         item,
                                                         route,
                                                         onClose,
                                                         setData,
                                                         view = false,
                                                         isAdmin = true,
                                                         isStudent = false,
                                                         rerender, withUserGrant
                                                         , userGrantRoute,
                                                         userGrantItem
                                                     }) {
    route = isStudent ? "student" : `${route}/student`

    const [personalInfo, setPersonalInfo] = useState(null);
    const [application, setApplication] = useState(null);

    const [loadingPersonalInfo, setLoadingPersonalInfo] = useState(true);
    const [loadingApplication, setLoadingApplication] = useState(true);
    const [openPersonalInfo, setOpenPersonalInfo] = useState(false);
    const [openAppDetails, setOpenAppDetails] = useState(true)
    useEffect(() => {
        const fetchPersonalInfo = async () => {
            setLoadingPersonalInfo(true);
            const response = await getData({
                url: `${route}/${item.studentId}/personal`,
                setLoading: setLoadingPersonalInfo
            })
            setPersonalInfo(response.data);
            setLoadingPersonalInfo(false);
        };

        const fetchApplication = async () => {
            setLoadingApplication(true);
            const url = isStudent ? `student/applications/${item.id}/approved` : `${route}/${item.id}`
            const response = await getData({url, setLoading: setLoadingApplication})
            setApplication(response.data);
        };


        fetchPersonalInfo();
        fetchApplication();
    }, [item]);

    // Personal Info Rendering

    const status = application?.status;
    const alertColor = StatusColor[status] || "info"; // Fallback to info if undefined

    return (
          <Box>
              <Alert severity={alertColor} variant="outlined" width="fit-conent" sx={{my: 2}}>
                  <Typography variant="h6" component="div">
                      حالة الطلب: {ApplicationStatus[status]}
                  </Typography>
              </Alert>
              {withUserGrant && (
                    <>
                        <UserGrantsView route={userGrantRoute}
                                        item={userGrantItem}
                                        isStudent={isStudent}
                                        isApplication={true}
                        />

                    </>
              )}
              {loadingPersonalInfo ? (
                    <CircularProgress/>
              ) : (
                    <>
                        <Card variant="outlined" sx={{
                            mb: 4,
                            p: {xs: 1, md: 3},
                            backgroundColor: "#ffffff",
                            borderRadius: "16px",
                            boxShadow: 2
                        }}>
                            <Box
                                  onClick={() => setOpenPersonalInfo(!openPersonalInfo)}
                                  display="flex" justifyContent="space-between" alignItems="center"
                            >
                                <Typography variant="h6" fontWeight="bold" color="text.primary">

                                    {openPersonalInfo ? "إخفاء المعلومات الشخصية" : "عرض المعلومات الشخصية"}
                                </Typography>
                                <IconButton
                                      aria-label="Expand/Collapse">
                                    {openPersonalInfo ? <ExpandLessIcon/> : <ExpandMoreIcon/>}
                                </IconButton>
                            </Box>

                            <Collapse in={openPersonalInfo}>

                                <UserProfilePreview personalInfo={personalInfo}
                                                    userImage={!loadingApplication && application.supportingFiles?.personalPhoto}/>
                            </Collapse>
                        </Card>
                    </>
              )}

              {loadingApplication ? <FullScreenLoader/> :
                    <>
                        <Card variant="outlined" sx={{
                            mb: 4,
                            p: {xs: 2, md: 3},
                            backgroundColor: "#ffffff",
                            borderRadius: "16px",
                            boxShadow: 2
                        }}>
                            <Box
                                  onClick={() => setOpenAppDetails(!openAppDetails)}
                                  display="flex" justifyContent="space-between" alignItems="center"
                            >
                                <Typography variant="h6" fontWeight="bold" color="text.primary">

                                    {openAppDetails ? "إخفاء معلومات طلب المنحة" : "عرض معلومات طلب المنحة"}
                                </Typography>
                                <IconButton
                                      aria-label="Expand/Collapse">
                                    {openAppDetails ? <ExpandLessIcon/> : <ExpandMoreIcon/>}
                                </IconButton>
                            </Box>
                            <Collapse in={openAppDetails}>{<ApplicationDataView application={application}/>}</Collapse>
                        </Card>
                    </>
              }
              <RenderImprovementsAndAskedFields item={item} route={route} view={view} isStudent={isStudent}/>

              {!loadingApplication && !isStudent &&
                    <RenderActionsButtons isAdmin={isAdmin} onClose={onClose} appId={item.id}
                                          setData={setData}
                                          item={item}
                                          route={route}
                                          view={view}
                                          application={application}
                                          rerender={rerender}
                    />
              }
          </Box>
    );
};


function RenderActionsButtons({isAdmin, route, appId, onClose, setData, item, view, application, rerender}) {
    return (
          <>
              <Alert severity="warning">
                  تحذير: في حالة طلب تحديثات سيتم تعديل الطلب الي غير مكتمل
              </Alert>
              <Box display="flex" gap={2} alignItem="center" flexWrap="wrap" mt={4}>
                  {(isAdmin && !view) &&
                        <>
                            {application.status !== "APPROVED" &&
                                  <>
                                      <ApproveByAdmin route={route} setData={setData} appId={appId} onClose={onClose}
                                                      application={application} rerender={rerender}/>
                                      <MarkUnderReview route={route} setData={setData} appId={appId} onClose={onClose}
                                                       rerender={rerender}/>
                                  </>
                            }
                        </>
                  }
                  {(!isAdmin && !view) &&
                        <>
                            {
                                  application.status !== "APPROVED" &&
                                  <ApproveBySupervisor route={route} setData={setData} appId={appId} onClose={onClose}
                                                       rerender={rerender}/>
                            }
                        </>
                  }
                  <DrawerWithContent item={item} component={ImprovementRequestForm}
                                     extraData={{
                                         route: route,
                                         label: "طلب تعديل حقول نموذج معين",
                                         setData: setData,
                                         appId: item.id,
                                         otherOnClose: onClose,
                                         improvement: true, rerender: rerender
                                     }}/>
                  <DrawerWithContent item={item} component={MarkAsUnCompleteAndAskForImprovement}
                                     extraData={{
                                         route: route,
                                         label: "طلب اضافة تحسينات",
                                         setData: setData,
                                         appId: item.id,
                                         otherOnClose: onClose, rerender: rerender
                                     }}/>

                  {(!view && application.status !== "APPROVED") &&
                        <RejectApplication route={route} setData={setData} appId={appId} onClose={onClose}
                                           rerender={rerender}/>
                  }
              </Box>
          </>
    )
}

function ApproveByAdmin({route, appId, onClose, setData, application, rerender}) {
    const [user, setUser] = useState(null)
    const [error, setError] = useState(null)
    const {setLoading} = useToastContext()

    async function confirm() {
        if (!user && !application.supervisorId) {
            setError("يجب ان تختار مشرف حتي تتم عملية الموافقه علي الطلب")
            return
        }
        const request = await handleRequestSubmit({
            supervisorId: user && user.query?.id,
            action: "approve",
            notAdmin: application.supervisorId
        }, setLoading, `${route}/${appId}`, false, "جاري الموافقه علي الطلب")
        if (request.status === 200) {
            if (setData) {
                setData((oldData) => oldData.filter((item) => item.id !== appId))
            }
            if (rerender) {
                window.location.reload()
            }
            if (onClose) {

                onClose()
            }
            return request
        }
    }

    return (
          <>
              <ConfirmWithActionModel
                    label={"الموافقة علي الطلب"}
                    handleConfirm={confirm}
                    title={"تعين مشرف والموافقه علي الطلب"}
                    removeAfterConfirm={true}
              >
                  {!application.supervisorId &&
                        <SearchComponent
                              apiEndpoint="search?model=user"
                              setFilters={setUser}
                              inputLabel="  ابحث بالاسم او الايميل لاختيار مشرف"
                              renderKeys={["personalInfo.basicInfo.name", "email"]}
                              mainKey="email"
                              localFilters={{role: "SUPERVISOR"}}
                        />
                  }
              </ConfirmWithActionModel>
              {error &&
                    <Portal>

                        <Snackbar
                              open={!!error}
                              autoHideDuration={6000}
                              onClose={() => setError(null)}
                        >
                            <MuiAlert
                                  onClose={() => setError(null)}
                                  severity="error"
                                  elevation={6}
                                  variant="filled"
                            >
                                {error}
                            </MuiAlert>
                        </Snackbar>
                    </Portal>
              }
          </>
    )
}

function ApproveBySupervisor({route, appId, onClose, setData, rerender}) {
    const {setLoading} = useToastContext()

    async function confirm() {
        const request = await handleRequestSubmit({
            action: "approve", notAdmin: true,
        }, setLoading, `${route}/${appId}`, false, "جاري الموافقه علي الطلب")
        if (request.status === 200) {
            if (setData) {
                setData((oldData) => oldData.filter((item) => item.id !== appId))
            }
            if (rerender) {
                window.location.reload()
            }
            if (onClose) {


                onClose()
            }
            return request
        }
    }

    return (
          <ConfirmWithActionModel
                label={"الموافقة علي الطلب"}
                handleConfirm={confirm}
                title={"الموافقه علي الطلب"}
                removeAfterConfirm={true}
          />

    )
}

function RejectApplication({route, appId, onClose, setData, rerender}) {
    const [error, setError] = useState(null)
    const {setLoading} = useToastContext()
    const [rejectReason, setRejectReason] = useState(null)

    async function reject() {
        if (!rejectReason) {
            setError("يجب ان تكتب سبب الرفض")
            return
        }
        const request = await handleRequestSubmit({
            rejectReason,
            action: "reject"
        }, setLoading, `${route}/${appId}`, false, "جاري رفض الطلب")
        if (request.status === 200) {
            if (setData) {
                setData((oldData) => oldData.filter((item) => item.id !== appId))
            }
            if (rerender) {
                window.location.reload()
            }
            if (onClose) {

                onClose()
            }
            return request
        }
    }

    return (
          <>
              <ConfirmWithActionModel
                    label={"رفض الطلب"}
                    handleConfirm={reject}
                    title={"رفض الطلب وذكر سبب الرفض"}
                    removeAfterConfirm={true}
                    isDelete={true}
              >
                  <TextField
                        id="reject"
                        fullWidth
                        margin="normal"
                        label="سبب الرفض"
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        required
                  />
              </ConfirmWithActionModel>
              {error &&
                    <Portal>

                        <Snackbar
                              open={!!error}
                              autoHideDuration={6000}
                              sx={{zIndex: 500000000}}

                              onClose={() => setError(null)}
                        >
                            <MuiAlert
                                  onClose={() => setError(null)}
                                  severity="error"
                                  elevation={6}
                                  variant="filled"
                            >
                                {error}
                            </MuiAlert>
                        </Snackbar>
                    </Portal>
              }
          </>
    )
}

function MarkAsUnCompleteAndAskForImprovement({
                                                  route,
                                                  appId,
                                                  onClose,
                                                  setData,
                                                  otherOnClose,
                                                  improvement = false,
                                                  rerender
                                              }) {
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [type, setType] = useState("TEXT");
    const [error, setError] = useState("");
    const [askFields, setAskFields] = useState([]);
    const [editIndex, setEditIndex] = useState(null); // To track editing
    const {setLoading} = useToastContext()
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title || !message || (!type && !improvement)) {
            setError("جميع الحقول مطلوبة");
            return;
        }
        const newField = {title, message, type};
        if (editIndex !== null) {
            const updatedFields = [...askFields];
            updatedFields[editIndex] = newField;
            setAskFields(updatedFields);
            setEditIndex(null); // Reset edit index
        } else {
            setAskFields([...askFields, newField]);
        }
        setTitle("");
        setMessage("");
        setType("TEXT");
    };

    const handleEdit = (index) => {
        const field = askFields[index];
        setTitle(field.title);
        setMessage(field.message);
        setType(field.type);
        setEditIndex(index);
    };

    const handleDelete = (index) => {
        const updatedFields = askFields.filter((_, i) => i !== index);
        setAskFields(updatedFields);
    };

    const handleSubmitAll = async () => {
        if (askFields.length === 0) {
            setError("يجب إضافة حقول قبل الإرسال");
            return;
        }
        const request = await handleRequestSubmit({
            askFields,
            action: !improvement ? "uncomplete" : "uncomplete_with_edit"
        }, setLoading, `${route}/${appId}`, false, "جاري تعين هذا الطلب كغير مكتمل")
        if (request.status === 200) {
            if (setData) {
                setData((oldData) => oldData.filter((item) => item.id !== appId))
            }
            if (rerender) {
                window.location.reload()
            }
            if (onClose) {

                onClose()
            }
            if (otherOnClose) {

                otherOnClose()
            }
        }
    };

    return (
          <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    p: 3,
                    bgcolor: "background.paper",
                    borderRadius: 1,
                    width: "100%",
                    maxWidth: "800px",
                    mx: "auto",
                    mt: 4,
                    boxShadow: 2,
                }}
          >

              <Typography variant="h5" gutterBottom>
                  {!improvement ?
                        "إضافة طلبات تحسينات" : "طلب تعديل حقول معينه"}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                  {!improvement ?
                        "اكتب ملخص لما تريد اضافته يمكنك اضافة اكثر من طلب" : "اكتب اسم النموذج الذي تريد من الطالب تعديله في العنوان مع ذكر اي حقل تريد تعديله والتفاصيل في الرساله"}
              </Typography>
              <TextField
                    fullWidth
                    margin="normal"
                    label="العنوان"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
              />
              <TextField
                    fullWidth
                    margin="normal"
                    label="الرسالة"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    multiline
                    rows={4}
              />
              {!improvement &&
                    <TextField
                          select
                          fullWidth
                          margin="normal"
                          label="نوع الطلب"
                          helperText={"هل تريد من الطلب رفع ملف ام اجابة عن الحقل فقط"}
                          value={type}
                          onChange={(e) => setType(e.target.value)}
                          required
                    >
                        <MenuItem value="TEXT">نص</MenuItem>
                        <MenuItem value="FILE">ملف</MenuItem>
                    </TextField>
              }
              {error && (
                    <Portal>

                        <Snackbar
                              open={!!error}
                              autoHideDuration={6000}
                              onClose={() => setError(null)}
                              sx={{zIndex: 500000000}}

                        >
                            <MuiAlert
                                  onClose={() => setError(null)}
                                  severity="error"
                                  elevation={6}
                                  variant="filled"
                            >
                                {error}
                            </MuiAlert>
                        </Snackbar>
                    </Portal>
              )}

              <Button variant="contained" color="primary" fullWidth type="submit">
                  {editIndex !== null ? "تحديث" : "إضافة طلب جديد"}
              </Button>

              {/* Render the saved ask fields */}
              {askFields.length > 0 && (
                    <Box mt={4}>
                        <Typography variant="h6">الطلبات المحفوظة:</Typography>
                        {askFields.map((field, index) => (
                              <Card
                                    key={index}
                                    variant="outlined"
                                    sx={{mb: 2, p: 2, position: "relative"}}
                              >
                                  <CardContent>
                                      <Typography>عنوان بسيط: {field.title}</Typography>
                                      <Typography>الطلب: {field.message}</Typography>
                                      <Typography>النوع: {field.type === "TEXT" ? "نص" : "ملف"}</Typography>
                                  </CardContent>
                                  <Box
                                        sx={{position: "absolute", top: "10px", right: "10px", display: "flex", gap: 1}}
                                  >
                                      <IconButton
                                            aria-label="edit"
                                            onClick={() => handleEdit(index)}
                                      >
                                          <EditIcon/>
                                      </IconButton>
                                      <IconButton
                                            aria-label="delete"
                                            onClick={() => handleDelete(index)}
                                      >
                                          <DeleteIcon/>
                                      </IconButton>
                                  </Box>
                              </Card>
                        ))}
                    </Box>
              )}

              <Button
                    variant="contained"
                    color="secondary"
                    disables={askFields.length === 0}
                    fullWidth
                    onClick={handleSubmitAll}
                    sx={{mt: 2}}
              >
                  إرسال جميع الطلبات
              </Button>

          </Box>
    );
}


const ImprovementRequestForm = ({appId, route}) => {
    const [modelName, setModelName] = useState('');
    const [fieldName, setFieldName] = useState(''); // Single field for each improvement request
    const [message, setMessage] = useState('');
    const [error, setError] = useState({model: '', field: '', message: ''});
    const [requests, setRequests] = useState([]); // Store multiple improvement requests
    const {setLoading} = useToastContext()
    const handleModelChange = (event) => {
        setModelName(event.target.value);
        setFieldName(''); // Clear field selection when model changes
        setError((prev) => ({...prev, model: ''}));
    };

    const handleFieldChange = (event) => {
        setFieldName(event.target.value);
        setError((prev) => ({...prev, field: ''}));
    };

    const handleMessageChange = (event) => {
        setMessage(event.target.value);
        setError((prev) => ({...prev, message: ''}));
    };

    const validateRequest = () => {
        let valid = true;
        let newError = {model: '', field: '', message: ''};

        if (!modelName) {
            newError.model = 'يرجى اختيار النموذج';
            valid = false;
        }
        if (!fieldName) {
            newError.field = 'يرجى اختيار الحقل';
            valid = false;
        }
        if (!message) {
            newError.message = 'يرجى إدخال رسالة التحسين';
            valid = false;
        }

        // Check for duplicate Model-Field pairs
        const duplicate = requests.some(
              (request) => request.modelName === modelName && request.fieldName === fieldName
        );
        if (duplicate) {
            newError.field = `الحقل "${ArFieldEnum[modelName][fieldName]}" تم طلب تحسينه مسبقًا`;
            valid = false;
        }

        setError(newError);
        return valid;
    };

    const addRequest = () => {
        if (!validateRequest()) return;

        const newRequest = {
            modelName,
            arModelName: ArModelEnum[modelName],
            fieldName,
            arFieldName: ArFieldEnum[modelName][fieldName],
            message,
        };

        setRequests((prev) => [...prev, newRequest]);
        setModelName('');
        setFieldName('');
        setMessage('');
    };

    const removeRequest = (index) => {
        setRequests((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (requests.length === 0) {
            setError((prev) => ({...prev, message: 'يرجى إضافة طلبات تحسين قبل الإرسال'}));
            return;
        }

        const request = await handleRequestSubmit(
              {
                  askFields: requests,
                  action: 'uncomplete_with_edit',
              },
              setLoading,
              `${route}/${appId}`,
              false,
              'جاري تعيين هذا الطلب كغير مكتمل'
        );
        if (request.status === 200) {
            setRequests([]);
        } else {
            console.error('فشل في إرسال طلب التحسين');
            setError((prev) => ({...prev, message: 'حدث خطأ أثناء الإرسال، يرجى المحاولة لاحقًا'}));
        }
    };

    return (
          <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    maxWidth: 800,
                    margin: '0 auto',
                    padding: 3,
                    bgcolor: '#f5f5f5',
                    borderRadius: 2,
                    boxShadow: 3,
                }}
          >
              <FormControl fullWidth variant="outlined" margin="normal" error={Boolean(error.model)}>
                  <InputLabel>اختر النموذج</InputLabel>
                  <Select value={modelName} onChange={handleModelChange} sx={{bgcolor: 'white'}}>
                      {Object.keys(ModelEnum).map((key) => (
                            <MenuItem key={key} value={ModelEnum[key]}>
                                {ArModelEnum[ModelEnum[key]]}
                            </MenuItem>
                      ))}
                  </Select>
                  {error.model && <FormHelperText>{error.model}</FormHelperText>}
              </FormControl>

              {modelName && (
                    <FormControl fullWidth variant="outlined" margin="normal" error={Boolean(error.field)}>
                        <InputLabel>اختر الحقل</InputLabel>
                        <Select value={fieldName} onChange={handleFieldChange} sx={{bgcolor: 'white'}}>
                            {Object.keys(FieldEnum[modelName]).map((key) => (
                                  <MenuItem key={key} value={FieldEnum[modelName][key]}>
                                      {ArFieldEnum[modelName][key]}
                                  </MenuItem>
                            ))}
                        </Select>
                        {error.field && <FormHelperText>{error.field}</FormHelperText>}
                    </FormControl>
              )}

              <TextField
                    label="رسالة التحسين"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    multiline
                    rows={4}
                    value={message}
                    onChange={handleMessageChange}
                    error={Boolean(error.message)}
                    helperText={error.message}
                    sx={{bgcolor: 'white'}}
              />

              <Button type="button" variant="outlined" color="primary" onClick={addRequest} sx={{mt: 2, mb: 3}}>
                  إضافة الطلب
              </Button>

              <List>
                  {requests.map((request, index) => (
                        <Paper key={index} elevation={2} sx={{mb: 2, p: 2, display: 'flex', alignItems: 'center'}}>
                            <Typography variant="body1" sx={{flexGrow: 1}}>
                                <strong>{request.arModelName}</strong> - <strong>{request.arFieldName}</strong>: {request.message}
                            </Typography>
                            <IconButton edge="end" aria-label="delete" onClick={() => removeRequest(index)}>
                                <DeleteIcon/>
                            </IconButton>
                        </Paper>
                  ))}
              </List>

              <Button type="submit" variant="contained" color="primary" sx={{mt: 2, display: 'block', width: '100%'}}>
                  إرسال جميع طلبات التحسين
              </Button>
          </Box>
    );
};

function MarkUnderReview({route, appId, onClose, setData, rerender}) {
    const [user, setUser] = useState(null)
    const [error, setError] = useState(null)
    const {setLoading} = useToastContext()

    async function review() {
        if (!user || !user.query) {
            setError("يجب ان تختار مشرف حتي تتم تعين مشرف لمراجعة الطلب")
            return
        }
        const request = await handleRequestSubmit({
            supervisorId: user.query.id,
            action: "review"
        }, setLoading, `${route}/${appId}`, false, "جاري تعين مشرف")
        if (request.status === 200) {
            if (setData) {
                setData((oldData) => oldData.filter((item) => item.id !== appId))
            }
            if (rerender) {
                window.location.reload()
            }
            if (onClose) {

                onClose()
            }
            return request
        }
    }

    return (
          <>
              <ConfirmWithActionModel
                    label={"تعين مشرف للمراجعة"}
                    handleConfirm={review}
                    title={"تعين مشرف لمراجعة الطلب"}
                    removeAfterConfirm={true}
                    color="warning"
              >
                  <SearchComponent
                        apiEndpoint="search?model=user"
                        setFilters={setUser}
                        inputLabel="  ابحث بالاسم او الايميل لاختيار مشرف"
                        renderKeys={["personalInfo.basicInfo.name", "email"]}
                        mainKey="email"
                        localFilters={{role: "SUPERVISOR"}}
                  />
              </ConfirmWithActionModel>
              {error &&
                    <Portal>

                        <Snackbar
                              open={!!error}
                              autoHideDuration={6000}
                              onClose={() => setError(null)}
                              sx={{zIndex: 500000000}}

                        >
                            <MuiAlert
                                  onClose={() => setError(null)}
                                  severity="error"
                                  elevation={6}
                                  variant="filled"

                            >
                                {error}
                            </MuiAlert>
                        </Snackbar>
                    </Portal>
              }
          </>
    )
}



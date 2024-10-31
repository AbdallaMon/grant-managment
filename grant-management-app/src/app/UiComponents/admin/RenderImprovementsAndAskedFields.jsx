import React, {useState, useEffect} from 'react';
import {
    Box,
    Typography,
    CircularProgress,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Card,
    CardContent,
    List,
    Grid2 as Grid,
    Alert, Snackbar,
} from '@mui/material';
import {
    MdExpandMore as ExpandMoreIcon,
    MdCheckCircle as CheckCircleIcon,
    MdCancel as CancelIcon,
    MdDateRange as DateIcon
} from 'react-icons/md';

import dayjs from 'dayjs';
import {useToastContext} from "@/app/providers/ToastLoadingProvider";
import {handleRequestSubmit} from "@/app/helpers/functions/handleSubmit";
import DrawerWithContent from "@/app/UiComponents/DataViewer/DrawerWithContent";
import {MainForm} from "@/app/UiComponents/formComponents/forms/MainForm";
import MuiAlert from "@mui/material/Alert";
import {renderFileLink} from "@/app/helpers/functions/utility";
import {FieldStatus, FieldType} from "@/app/helpers/constants";


export const RenderImprovementsAndAskedFields = ({item, route, view, isStudent}) => {
    const [expanded, setExpanded] = useState(false);
    const [improvementRequests, setImprovementRequests] = useState([]);
    const [askedFields, setAskedFields] = useState([]);
    const [updates, setUpdates] = useState([]);
    const [loading, setLoading] = useState({
        improvements: false,
        askedFields: false,
        updates: false,
    });

    const fetchData = async (key, setData) => {
        setLoading((prev) => ({...prev, [key]: true}));
        const apiRoute = !isStudent ? route : 'student/applications';
        const request = await fetch(`${process.env.NEXT_PUBLIC_URL}/${apiRoute}/${item.id}/${key}`, {
            credentials: 'include',
        })
        const response = await request.json()
        console.log(response.data, "data")
        if (response.data) {
            setData(response.data[key]);
        }
        setLoading((prev) => ({...prev, [key]: false}));
    };

    useEffect(() => {
        if (expanded === 'improvements' && improvementRequests.length === 0) {
            fetchData('improvementRequests', setImprovementRequests);
        }
    }, [expanded]);

    useEffect(() => {
        if (expanded === 'askedFields' && askedFields.length === 0) {
            fetchData('askedFields', setAskedFields);
        }
    }, [expanded]);

    useEffect(() => {
        if (expanded === 'updates' && updates.length === 0) {
            fetchData('updates', setUpdates);
        }
    }, [expanded]);

    const handleAccordionChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const renderStatusIcon = (status) => {
        switch (status) {
            case 'APPROVED':
                return <CheckCircleIcon color="success"/>;
            case 'REJECTED':
                return <CancelIcon color="error"/>;
            default:
                return null;
        }
    };

    return (
          <Box>
              {(view || isStudent) && (
                    <>
                        <Box mb={2}/>
                        <Accordion
                              expanded={expanded === 'updates'}
                              onChange={handleAccordionChange('updates')}
                        >
                            <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                                <Typography variant="h6">تحديثات الطالب</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                {loading.updates ? (
                                      <Box display="flex" justifyContent="center">
                                          <CircularProgress/>
                                      </Box>
                                ) : (
                                      <>
                                          {isStudent && <CreateNewUpdate setData={setUpdates} appId={item.id}/>}
                                          {updates.length > 0 ? (
                                                updates.map((update, index) => (
                                                      <Card key={index} sx={{mb: 2}}>
                                                          <CardContent>
                                                              <Grid container spacing={2}>
                                                                  <Grid size={{xs: 12, md: 6}}>
                                                                      <Typography variant="subtitle1" fontWeight="bold">
                                                                          العنوان: {update.title || 'بدون عنوان'}
                                                                      </Typography>
                                                                  </Grid>
                                                                  <Grid size={{xs: 12, md: 6}}>
                                                                      <Typography variant="body1">
                                                                          الوصف: {update.description || 'لا يوجد وصف'}
                                                                      </Typography>
                                                                  </Grid>
                                                                  <Grid size={{xs: 12, md: 6}}>
                                                                      {renderFileLink(update.url, 'الملف المرفق')}
                                                                  </Grid>
                                                                  <Grid size={{xs: 12, md: 6}}>
                                                                      <Typography
                                                                            color="textSecondary"
                                                                            sx={{display: 'flex', alignItems: 'center'}}
                                                                      >
                                                                          <DateIcon sx={{mr: 1}}/>
                                                                          {dayjs(update.createdAt).format('DD/MM/YYYY')}
                                                                      </Typography>
                                                                  </Grid>
                                                              </Grid>
                                                          </CardContent>
                                                      </Card>
                                                ))
                                          ) : (
                                                <Typography>لا يوجد تحديثات</Typography>
                                          )}
                                      </>
                                )}
                            </AccordionDetails>
                        </Accordion>
                    </>

              )}
              <Box mb={2}/>

              {!isStudent && (
                    <Alert severity="info" sx={{my: 2}}>
                        ملاحظة: التعديلات أدناه تم إرسال طلبها من قبلك أو من قبل المشرف إلى الطالب لتعديلها أو لإضافة
                        حقل معين.
                    </Alert>
              )}

              <Accordion
                    expanded={expanded === 'improvements'}
                    onChange={handleAccordionChange('improvements')}
              >
                  <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                      <Typography variant="h6">طلبات تحسين حقول موجودة</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                      {loading.improvements ? (
                            <Box display="flex" justifyContent="center">
                                <CircularProgress/>
                            </Box>
                      ) : improvementRequests.length > 0 ? (
                            <List>
                                {improvementRequests.map((request, index) => (
                                      <Card key={index} sx={{mb: 2}}>
                                          <CardContent>
                                              <Typography variant="subtitle1" fontWeight="bold">
                                                  {request.title}
                                              </Typography>
                                              <Typography variant="body1">{request.message}</Typography>
                                              <Box display="flex" alignItems="center" mt={1}>
                                                  <Typography variant="body2" color="textSecondary" sx={{mr: 1}}>
                                                      الحالة: {FieldStatus[request.status]}
                                                  </Typography>
                                                  {renderStatusIcon(request.status)}
                                              </Box>
                                          </CardContent>
                                      </Card>
                                ))}
                            </List>
                      ) : (
                            <Typography>لا يوجد طلبات تحسين حقول</Typography>
                      )}
                  </AccordionDetails>
              </Accordion>
              <Box mb={2}/>
              <Accordion
                    expanded={expanded === 'askedFields'}
                    onChange={handleAccordionChange('askedFields')}
              >
                  <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                      <Typography variant="h6">طلبات إضافة تحسينات جديدة</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                      {loading.askedFields ? (
                            <Box display="flex" justifyContent="center">
                                <CircularProgress/>
                            </Box>
                      ) : askedFields.length > 0 ? (
                            <List>
                                {askedFields.map((field, index) => (
                                      <Card key={index} sx={{mb: 2}}>
                                          <CardContent>
                                              <Typography variant="subtitle1" fontWeight="bold">
                                                  {field.title}
                                              </Typography>
                                              <Typography variant="body1">{field.message}</Typography>
                                              <Typography variant="body2" color="textSecondary">
                                                  الحالة: {FieldStatus[field.status]}
                                              </Typography>
                                              <Typography variant="body2" color="textSecondary">
                                                  نوع الطلب: {FieldType[field.type]}
                                              </Typography>
                                              {field.type === 'FILE' ? (
                                                    renderFileLink(field.value, 'الملف')
                                              ) : (
                                                    <Typography
                                                          variant="body2">الرد: {field.value || 'لم يتم الرد بعد'}</Typography>
                                              )}
                                          </CardContent>
                                      </Card>
                                ))}
                            </List>
                      ) : (
                            <Typography>لا يوجد طلبات إضافة تحسينات جديدة</Typography>
                      )}
                  </AccordionDetails>
              </Accordion>
          </Box>
    );
};

function CreateNewUpdate({appId, setData}) {
    const [error, setError] = useState(null)

    const {setLoading} = useToastContext()
    const [rerender, setRerender] = useState(false)

    async function handleBeforeUpdate(url) {
        const formData = new FormData()
        formData.append("url", url[0]);

        const request = await handleRequestSubmit(formData, setLoading, "upload", true, "جاري رفع  ملفك")
        if (request.status === 200)
            return request.data
    }

    async function submit(data) {
        const {url, description, title} = data
        if (!title || !description && !url) {
            setError("يجب عليك ملئ جميع الحقول")
            return
        }
        const newUrl = await handleBeforeUpdate(url)
        const request = await handleRequestSubmit({
            title, description, url: newUrl.url
        }, setLoading, `student/applications/${appId}/updates`, false, "جاري اضافة التحديث")
        if (request.status === 200) {
            setData((oldData) => ([...oldData, request.data]))
            setRerender(true)
        }
    }

    const inputs = [
        {
            data: {id: "title", type: "text", label: "عنوان التحديث"},
            pattern: {
                required: {value: true, message: "يجب عليك ادخال عنوان للتحديث"}
            }
        },
        {
            data: {id: "description", type: "textarea", label: "تفاصيل التحديث"}
            ,
            pattern: {
                required: {value: true, message: "يجب عليك ادخال عنوان تفاصيل"}
            }
        },
        {
            data: {id: "url", type: "file", label: "مرفق"},
            pattern: {
                required: {value: true, message: "يجب عليك ادخال مرفق"}
            }
        },
    ]
    return (
          <>
              <DrawerWithContent
                    extraData={{
                        label: "اضافة تحديث علي الطلب",
                        onSubmit: submit,
                        inputs: inputs,
                        formTitle: "اضافة تحديث جديد",
                        btnText: "اضافة",
                        variant: "outlined"
                    }}
                    rerender={rerender}
                    component={MainForm}
              >
              </DrawerWithContent>
              {error &&
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
              }
          </>
    )
}

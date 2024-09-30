"use client";
import React, {useEffect, useState} from "react";
import {
    Box,
    Typography,
    CircularProgress,
    Button,
    Alert,
    TextField,
    Checkbox,
    FormControlLabel,
    Snackbar,
    Card,
    CardContent,
    Grid
} from "@mui/material";
import {getData} from "@/app/helpers/functions/getData";
import {useToastContext} from "@/app/providers/ToastLoadingProvider";
import {handleRequestSubmit} from "@/app/helpers/functions/handleSubmit";

export default function ReviewSubmissionPage({params: {id}}) {
    const [loading, setLoading] = useState(true);
    const {setLoading: setSubmitLoading} = useToastContext();
    const [submitted, setSubmitted] = useState(false);
    const [message, setMessage] = useState();
    const [error, setError] = useState(null);
    const [askedFields, setAskedFields] = useState([]);
    const [improvementRequests, setImprovementRequests] = useState([]);
    const [snackbarError, setSnackbarError] = useState(null); // For snackbar alerts
    // Fetch data on component load
    useEffect(() => {
        async function fetchData() {
            const response = await getData({url: `student/applications/${id}/submit/uncomplete`, setLoading});
            if (response.error) {
                setError(response.error)
                setLoading(false);
                return;
            }
            setAskedFields(response.data.askedFields || []);
            setImprovementRequests(response.data.improvementRequests || []);
            setMessage(response.message);
            setError(response.error);
            setLoading(false);
        }

        fetchData();
    }, []);

    const handleAskedFieldChange = (index, value) => {
        const updatedFields = [...askedFields];
        updatedFields[index].value = value;
        setAskedFields(updatedFields);
    };

    const handleImprovementRequestCheck = (index) => {
        const updatedRequests = [...improvementRequests];
        updatedRequests[index].checked = !updatedRequests[index].checked;
        setImprovementRequests(updatedRequests);
    };
    const validateSubmission = () => {
        const unfilledAskedFields = askedFields.some((field) => !field.value);
        if (unfilledAskedFields) {
            setSnackbarError("يرجى تعبئة جميع الحقول المطلوبة.");
            return false;
        }

        const uncheckedImprovementRequests = improvementRequests.some((request) => !request.checked);
        if (uncheckedImprovementRequests) {
            setSnackbarError("يرجى تأكيد جميع طلبات التحسين.");
            return false;
        }

        return true;
    };

    async function handleBeforeUpdate(askedField, fileFields) {
        const formData = new FormData()
        fileFields.forEach((item, index) => {
            formData.append(item.id, item.value[0]);
        })
        const request = await handleRequestSubmit(formData, setLoading, "upload", true, "جاري رفع  ملفاتك")
        if (request.status === 200) {
            const newFields = fileFields.map((item) => {
                item.value = request.data[item.id]
                return item
            })

            return [...askedField, ...newFields]
        }
    }

    // Handle submission
    const handleSaveAndSubmit = async () => {
        if (!validateSubmission()) {
            return;
        }
        const fileFields = askedFields.filter((field) => field.type === "FILE");
        let submittedAskedFields = askedFields.filter((field) => field.type !== "FILE")
        if (fileFields.length > 0) {
            submittedAskedFields = await handleBeforeUpdate(submittedAskedFields, fileFields)
        }
        const request = await handleRequestSubmit({
            improvementRequests,
            askedFields: submittedAskedFields,
        }, setSubmitLoading, `student/applications/${id}/submit/uncomplete`, false, "جاري الحفظ");
        if (request.status === 200) {
            setSubmitted(true);
        }
    };

    if (submitted) {
        return (
              <Box sx={{p: 4}}>
                  <Alert severity="success">
                      <Typography variant="h6">تم العملية بنجاح</Typography>
                      <Typography>تم حفظ البيانات وتم إرسالها إلى الإدارة بنجاح</Typography>
                  </Alert>
              </Box>
        );
    }
    if (error) {
        return (
              <Box sx={{p: 4}}>
                  <Alert severity="error">
                      <Typography variant="h6">هناك مشكلة ما</Typography>
                      <Typography>${error} </Typography>
                  </Alert>
              </Box>
        );
    }
    return (
          <Box sx={{p: 4}}>
              {loading ? (
                    <Box display="flex" flexDirection="column" alignItems="center">
                        <CircularProgress sx={{mb: 2}}/>
                        <Typography variant="h6" textAlign="center">
                            يتم مراجعة بياناتك والتأكد من أنك أتممت جميع الإجراءات
                        </Typography>
                    </Box>
              ) : (
                    <Box>
                        <Alert severity="error" sx={{mb: 3}}>
                            {message}
                        </Alert>
                        <Typography variant="h5" my={3}>
                            من فضلك قم بملء البيانات التالية
                        </Typography>

                        <Box mb={4}>
                            <Card elevation={3}>
                                <CardContent>
                                    <Typography variant="h6" mb={2}>الحقول المطلوبة</Typography>
                                    {askedFields.map((field, index) => (
                                          <Box key={index} sx={{mb: 3}}>
                                              <Typography variant="subtitle1"
                                                          fontWeight="bold">{field.title}</Typography>
                                              <Typography variant="body2"
                                                          color="textSecondary">{field.message}</Typography>

                                              {field.type === "TEXT" && (
                                                    <TextField
                                                          label="أدخل القيمة"
                                                          fullWidth
                                                          value={field.value || ""}
                                                          onChange={(e) => handleAskedFieldChange(index, e.target.value)}
                                                          sx={{my: 2}}
                                                    />
                                              )}

                                              {field.type === "FILE" && (
                                                    <TextField
                                                          type="file"
                                                          fullWidth
                                                          onChange={(e) => handleAskedFieldChange(index, e.target.files)}
                                                          sx={{my: 2}}
                                                    />
                                              )}
                                          </Box>
                                    ))}
                                </CardContent>
                            </Card>
                        </Box>

                        <Box mb={4}>
                            <Card elevation={3}>
                                <CardContent>
                                    <Typography variant="h6" mb={2}>طلبات تحسين الحقول</Typography>
                                    {improvementRequests.map((request, index) => (
                                          <Box key={index} sx={{mb: 3}}>
                                              <Typography variant="subtitle1"
                                                          fontWeight="bold">{request.title}</Typography>
                                              <Typography variant="body2"
                                                          color="textSecondary">{request.message}</Typography>
                                              <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                              checked={request.checked || false}
                                                              onChange={() => handleImprovementRequestCheck(index)}
                                                        />
                                                    }
                                                    label="تأكيد"
                                              />
                                          </Box>
                                    ))}
                                </CardContent>
                            </Card>
                        </Box>
                        {!error &&
                              <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    onClick={handleSaveAndSubmit}
                                    sx={{mt: 2}}
                              >
                                  حفظ البيانات وارسالها للمراجعة
                              </Button>
                        }
                    </Box>
              )
              }

              {/* Snackbar for Errors */}
              <Snackbar
                    open={!!snackbarError}
                    autoHideDuration={6000}
                    onClose={() => setSnackbarError(null)}
                    anchorOrigin={{vertical: "top", horizontal: "center"}}
              >
                  <Alert onClose={() => setSnackbarError(null)} severity="error" variant="filled">
                      {snackbarError}
                  </Alert>
              </Snackbar>
          </Box>
    );
}

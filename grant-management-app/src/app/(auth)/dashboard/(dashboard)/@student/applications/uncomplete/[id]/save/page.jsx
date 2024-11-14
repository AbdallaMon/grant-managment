"use client";
import React, {useEffect, useState} from "react";
import {Box, Typography, CircularProgress, Button, Alert, TextField, Snackbar, Card, CardContent} from "@mui/material";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {getData} from "@/app/helpers/functions/getData";
import {useToastContext} from "@/app/providers/ToastLoadingProvider";
import {handleRequestSubmit} from "@/app/helpers/functions/handleSubmit";
import {grantLinks} from "@/app/helpers/constants";

export default function ReviewSubmissionPage({params: {id}}) {
    const [loading, setLoading] = useState(true);
    const {setLoading: setSubmitLoading} = useToastContext();
    const [submitted, setSubmitted] = useState(false);
    const [message, setMessage] = useState();
    const [error, setError] = useState(null);
    const [askedFields, setAskedFields] = useState([]);
    const [improvementRequests, setImprovementRequests] = useState([]);
    const [groupedRequests, setGroupedRequests] = useState({});
    const [snackbarError, setSnackbarError] = useState(null);
    const [isFormValid, setIsFormValid] = useState(false);

    useEffect(() => {
        async function fetchData() {
            const response = await getData({
                url: `student/applications/${id}/submit/uncomplete`,
                setLoading,
            });
            if (response.error) {
                setError(response.error);
                setLoading(false);
                return;
            }
            setAskedFields(response.data.askedFields || []);
            setImprovementRequests(response.data.improvementRequests || []);
            setMessage(response.message);
            setError(response.error);
            setLoading(false);
            groupRequestsByModel(response.data.improvementRequests || []);
            validateForm();
        }

        fetchData();
    }, []);

    const getLinkForRequest = (arModelName) => {
        const link = grantLinks.find((link) => link.meta.title === arModelName);
        return link ? link.href : "#";
    };

    const handleAskedFieldChange = (index, value) => {
        const updatedFields = [...askedFields];
        updatedFields[index].value = value;
        setAskedFields(updatedFields);
        validateForm();
    };

    const validateForm = () => {
        const allFieldsFilled = askedFields.every((field) => field.value);
        const allRequestsChecked = improvementRequests.every((request) => request.checked);
        setIsFormValid(allFieldsFilled && allRequestsChecked);
    };

    const groupRequestsByModel = (requests) => {
        const grouped = requests.reduce((acc, request) => {
            if (!acc[request.arModelName]) {
                acc[request.arModelName] = [];
            }
            acc[request.arModelName].push(request);
            return acc;
        }, {});
        setGroupedRequests(grouped);
    };

    async function handleBeforeUpdate(askedField, fileFields) {
        const formData = new FormData();
        fileFields.forEach((item) => {
            formData.append(item.id, item.value[0]);
        });
        const request = await handleRequestSubmit(
              formData,
              setLoading,
              "upload",
              true,
              "جاري رفع ملفاتك"
        );
        if (request.status === 200) {
            const newFields = fileFields.map((item) => {
                item.value = request.data[item.id];
                return item;
            });

            return [...askedField, ...newFields];
        }
    }

    const handleSaveAndSubmit = async () => {
        if (!isFormValid) {
            setSnackbarError("يرجى تعبئة جميع الحقول المطلوبة وتأكيد جميع طلبات التحسين.");
            return;
        }

        const fileFields = askedFields.filter((field) => field.type === "FILE");
        let submittedAskedFields = askedFields.filter((field) => field.type !== "FILE");
        if (fileFields.length > 0) {
            submittedAskedFields = await handleBeforeUpdate(submittedAskedFields, fileFields);
        }
        const request = await handleRequestSubmit(
              {
                  askedFields: submittedAskedFields,
              },
              setSubmitLoading,
              `student/applications/${id}/submit/uncomplete`,
              false,
              "جاري الحفظ"
        );
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
                        {askedFields.length > 0 && groupedRequests.length > 0 &&
                              <>
                                  <Alert severity="error" sx={{mb: 3}}>
                                      {message}
                                  </Alert>
                                  <Typography variant="h5" my={3}>
                                      من فضلك قم بملء البيانات التالية
                                  </Typography>
                              </>
                        }

                        {/* Asked Fields Section */}
                        {askedFields.length > 0 &&
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
                        }
                        {/* Grouped Improvement Requests Section */}
                        {groupedRequests.length > 0 &&
                              <Box mb={4}>
                                  <Card elevation={3}>
                                      <CardContent>
                                          <Typography variant="h6" mb={2}>طلبات تحسين الحقول</Typography>
                                          {Object.keys(groupedRequests).map((modelName) => (
                                                <Box key={modelName} sx={{mb: 3}}>
                                                    <Typography variant="subtitle1"
                                                                fontWeight="bold">{modelName}</Typography>
                                                    {groupedRequests[modelName].map((request, index) => (
                                                          <Typography variant="body2" color="textSecondary" key={index}
                                                                      sx={{pl: 2, mb: 1}}>
                                                              - {request.arFieldName}: {request.message}
                                                          </Typography>
                                                    ))}
                                                    <Button
                                                          variant="outlined"
                                                          color="primary"
                                                          component={Link}
                                                          href={getLinkForRequest(modelName)}
                                                          sx={{mt: 1}}
                                                    >
                                                        الذهاب إلى الصفحة المطلوبة
                                                    </Button>
                                                </Box>
                                          ))}
                                      </CardContent>
                                  </Card>
                              </Box>
                        }
                        <Button
                              variant="contained"
                              color="primary"
                              fullWidth
                              onClick={handleSaveAndSubmit}
                              sx={{mt: 2, maxWidth: 300, py: 2, mx: "auto"}}
                              disabled={!isFormValid}
                        >
                            حفظ البيانات وارسالها للمراجعة
                        </Button>
                    </Box>
              )}

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

"use client";
import React, {useEffect, useState} from "react";
import {
    Box,
    Typography,
    CircularProgress,
    Button,
    Link as MuiLink, Alert, AlertTitle,
} from "@mui/material";
import {getData} from "@/app/helpers/functions/getData";
import {useToastContext} from "@/app/providers/ToastLoadingProvider";
import {useRouter} from "next/navigation";
import {handleRequestSubmit} from "@/app/helpers/functions/handleSubmit";

export default function ReviewSubmissionPage({params: {id}}) {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const {setLoading: setSubmitLoading} = useToastContext()
    const [submitted, setSubmitted] = useState(false)
    const [message, setMessage] = useState()
    const [error, setError] = useState(null)
    useEffect(() => {
        async function fetchData() {
            try {
                const response = await getData({url: `student/applications/${id}/submit`, setLoading});
                setData(response.data || null); // Set the fetched data or null if no data
                setMessage(response.message)
                setLoading(false);
                setError(response.error)
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    const handleSaveAndSubmit = async () => {
        const request = await handleRequestSubmit({}, setSubmitLoading, `student/applications/${id}/submit`, false, "جاري الحفظ")
        if (request.status === 200) {
            setSubmitted(true)
        }
    };
    if (submitted) {
        return <div>
            <Alert>
                تم العملية بنجاح
            </Alert>
            <Typography>
                تم حفظ البينانات وتم ارسالها الي الادارة بنجاح
            </Typography>
        </div>
    }
    return (
          <Box sx={{p: 4, textAlign: "center"}}>
              {loading ? (
                    <Box display="flex" flexDirection="column" alignItems="center">
                        <CircularProgress sx={{mb: 2}}/>
                        <Typography variant="h6">
                            يتم مراجعة بياناتك والتأكد من أنك أتممت جميع الإجراءات
                        </Typography>
                    </Box>
              ) : data ? (
                    <Box>
                        <Alert>
                            {message}
                        </Alert>
                        {Object.entries(data).map(([key, value]) => (
                              <Box key={key} sx={{mb: 2}}>
                                  <Typography variant="body1" component="span">
                                      {value.text}:&nbsp;
                                  </Typography>
                                  <MuiLink href={value.link} underline="hover" color="primary">
                                      {value.link}
                                  </MuiLink>
                              </Box>
                        ))}
                    </Box>
              ) : (
                    <Box>
                        <Alert severity={error ? "error" : "success"}>
                            {message}
                        </Alert>
                        {error &&
                              <Typography>
                                  {error}
                              </Typography>
                        }
                        {!error &&
                              <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleSaveAndSubmit}
                              >
                                  حفظ البيانات وارسالها للمراجعه
                              </Button>
                        }
                    </Box>
              )}
          </Box>
    );
}

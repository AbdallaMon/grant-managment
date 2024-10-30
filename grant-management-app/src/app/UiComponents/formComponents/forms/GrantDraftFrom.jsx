"use client"
import {Form} from "@/app/UiComponents/formComponents/forms/Form";
import {handleRequestSubmit} from "@/app/helpers/functions/handleSubmit";
import {useToastContext} from "@/app/providers/ToastLoadingProvider";
import {useEffect, useState} from "react";
import {Alert, Box, Button, Typography, CircularProgress} from "@mui/material";
import Link from "next/link";
import {usePathname, useRouter} from "next/navigation";
import {getData} from "@/app/helpers/functions/getData";
import {useGrantLinks} from "@/app/providers/GrantLinksProvider";
import {grantLinks} from "@/app/helpers/constants";

// Loading Component
export const LoadingState = () => (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <CircularProgress/>
          <Typography sx={{ml: 2}}>Loading...</Typography>
      </Box>
);

// Success Message Component
const SuccessMessage = ({message}) => (
      <Box sx={{textAlign: "center", mt: 4}}>
          <Alert severity="success">{message}</Alert>
      </Box>
);

// Draft Component (First/Last)
const DraftInfo = ({text, saveApp}) => (
      <Box textAlign="center" mt={4}>
          <Typography>{text}</Typography>
          <Button variant="contained" color="primary" onClick={saveApp} sx={{mt: 2}}>
              إرسال الطلب؟
          </Button>
      </Box>
);

// Submission Confirmation Component
export const SubmissionConfirmation = ({next, saveApp, appId}) => (
      <Box textAlign="center" mt={4}>
          {next ? (
                <>
                    <Alert>
                        تم حفظ بيانات بنجاح
                    </Alert>
                    <Typography mt={3}>هل ترغب في ملء باقي البيانات؟</Typography>
                    <Button
                          variant="contained"
                          component={Link}
                          href={`/dashboard/applications/drafts/${appId}/${next.url}`}
                          sx={{mt: 2}}
                    >
                        {next.text}
                    </Button>
                </>
          ) : (
                <>
                    {saveApp &&
                          <DraftInfo text="لقد وصلت إلى آخر صفحة. يمكنك الآن إرسال طلبك إذا قمت بملء جميع البيانات."
                                     saveApp={saveApp}/>
                    }
                </>
          )}
      </Box>
);

export function GrantDraftFrom({
                                   inputs,
                                   current,
                                   next,
                                   isFileUpload,
                                   formProps,
                                   appId,
                                   last,
                                   first,
                                   handleBeforeUpdate, uncomplete = false
                               }) {
    const {setLoading} = useToastContext();
    const [submitted, setSubmitted] = useState(false);
    const [saved, setSaved] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const router = useRouter();
    const [currentData, setCurrentData] = useState(null)
    const [prefilledInputs, setInputs] = useState(inputs)
    const {setNotFilledLinks, nonFilledLinks} = useGrantLinks()
    const unCompleteParam = uncomplete && "status=UN_COMPLETE&"

    useEffect(() => {
        async function getAppData() {
            setLoadingData(true);
            const request = await getData({
                url: `student/applications/draft/${appId}?model=${current}&${unCompleteParam}`,
                setLoading: setLoadingData
            });
            const currentData = request.data;
            if (currentData) {
                const prefilledInputs = inputs.map((input) => {
                    const updatedPattern = {...input.pattern}; // Copy the existing pattern
                    if (updatedPattern.required) {
                        delete updatedPattern.required;
                    }
                    return {
                        ...input,
                        data: {
                            ...input.data,
                            defaultValue: currentData[input.data.id] ?? input.data.defaultValue,
                        },
                        pattern: updatedPattern, // Set the updated pattern without 'required'
                    };
                });
                setCurrentData(currentData)
                setInputs(prefilledInputs)
            }
            setLoadingData(false);
        }

        getAppData();
    }, [appId, current]);
    useEffect(() => {
        if (saved) {
            setTimeout(() => {
                router.push("/dashboard/grants");
            }, 200);
        }
    }, [saved]);
    const onSubmit = async (formData) => {
        try {

            if (handleBeforeUpdate) {
                formData = await handleBeforeUpdate(formData, currentData)
            }
            const request = await handleRequestSubmit(
                  formData,
                  setLoading,
                  `student/applications/draft/${appId}?model=${current}`,
                  isFileUpload,
                  "جاري الحفظ",
                  null,
                  !currentData ? "POST" : "PUT"
            );
            if (request.status === 200) {
                setSubmitted(true);
                const nowNonFilled = nonFilledLinks.filter((item) => item.key !== current)
                setNotFilledLinks(nowNonFilled)
            }
        } catch (e) {

        }
    };

    const saveApp = async () => {
        const request = await handleRequestSubmit(
              {},
              setLoading,
              `/students/applications/draft/${appId}confirm`,
              false,
              "جاري تأكيد طلبك",
              null,
              "POST"
        );
        if (request.status === 200) {
            setSaved(true);
        }
    };

    const renderContent = () => {
        switch (true) {
            case loadingData:
                return <LoadingState/>;
            case saved:
                return <SuccessMessage message="تم إرسال حفظ طلبك بنجاح وجاري إعادة التوجية"/>;
            case submitted:
                return <SubmissionConfirmation next={next} saveApp={saveApp} appId={appId}/>;
            case first:
                return <DraftInfo text="هذه هي البيانات الشخصية" saveApp={saveApp}/>;
            case last:
                return <DraftInfo text="لقد وصلت إلى آخر صفحة. يمكنك الآن إرسال طلبك إذا قمت بملء جميع البيانات."
                                  saveApp={saveApp}/>;
            default:
                return (
                      <Box mt={4}>
                          <Form inputs={prefilledInputs} onSubmit={onSubmit} {...formProps} />
                      </Box>
                );
        }
    };

    return renderContent();
}

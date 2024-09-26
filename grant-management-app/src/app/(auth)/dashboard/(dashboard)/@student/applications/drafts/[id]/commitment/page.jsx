"use client"
import React, {useEffect, useState} from "react";
import {
    Box,
    Button,
    Checkbox,

    FormControlLabel,

    Typography
} from "@mui/material";
import {handleRequestSubmit} from "@/app/helpers/functions/handleSubmit";
import {useToastContext} from "@/app/providers/ToastLoadingProvider";
import {getData} from "@/app/helpers/functions/getData";
import {LoadingState, SubmissionConfirmation} from "@/app/UiComponents/formComponents/forms/GrantDraftFrom";
import {useGrantLinks} from "@/app/providers/GrantLinksProvider";

export default function CommitmentForm({params: {id}}) {
    const [agreed, setAgreed] = useState(false);
    const [submit, setSubmit] = useState(false)
    const [isSubmittedBefore, setIsSubmittedBefore] = useState(false)
    const [loading, setLoadingData] = useState(false)
    const {setLoading} = useToastContext()
    const handleCheckboxChange = (event) => {
        setAgreed(event.target.checked);
    };
    const {nonFilledLinks, setNotFilledLinks} = useGrantLinks()

    useEffect(() => {
        const fetchData = async () => {
            const request = await getData({
                url: `student/applications/draft/${id}?model=commitment&`,
                setLoading: setLoadingData
            });
            if (request.status === 200) {
                setAgreed(request.data)
                if (request.data === true) {
                    setSubmit(true)
                    setIsSubmittedBefore(true)
                }
            }
        };

        fetchData();
    }, [id]);
    const handleSubmit = async () => {
        const request = await handleRequestSubmit({commitment: agreed}, setLoading, `student/applications/draft/${id}?model=commitment`, false, "جاري حفظ بياناتك")
        if (request.status === 200) {
            setSubmit(true)
            const nowNonFilled = nonFilledLinks.filter((item) => item.key !== current)
            setNotFilledLinks(nowNonFilled)
        }
    };
    const submittedText = isSubmittedBefore ? "لقد وافقت علي هذا من قبل هل تريد الذهاب للموافقة علي شروط المنحه؟" : "الذهاب للموافقه علي شروط المنحه"
    const renderContent = () => {
        switch (true) {
            case loading:
                return <LoadingState/>;
            case submit:
                return <SubmissionConfirmation next={{
                    text: submittedText,
                    url: "ship-terms"
                }} appId={id}/>;
            default:
                return (
                      <Box>
                          <Typography variant="h5" gutterBottom>
                              التعهد
                          </Typography>
                          <Typography variant="h6" gutterBottom>
                              هذا النص هو تعهد من الطالب بأن جميع البيانات التي قام بإدخالها صحيحة
                              ودقيقة، ويتحمل المسؤولية الكاملة عن أي معلومات غير صحيحة. كما يقر
                              الطالب بأن جميع الأوراق المقدمة تتعلق به شخصياً، وأنه يلتزم بإبلاغ
                              الجهة المختصة بأي تغيير يحدث في هذه المعلومات. وفي حالة تقديم
                              معلومات خاطئة، يحق للجهة المختصة اتخاذ الإجراءات القانونية اللازمة.
                          </Typography>

                          <FormControlLabel
                                control={<Checkbox checked={agreed} onChange={handleCheckboxChange}/>}
                                label="أوافق على التعهد"
                          />
                          {agreed && (
                                <Button variant="contained" color="primary" onClick={handleSubmit}>
                                    إرسال
                                </Button>
                          )}
                      </Box>

                );
        }
    };
    return renderContent()

}

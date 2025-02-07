"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { handleRequestSubmit } from "@/app/helpers/functions/handleSubmit";
import { useToastContext } from "@/app/providers/ToastLoadingProvider";
import { getData } from "@/app/helpers/functions/getData";
import {
  LoadingState,
  SubmissionConfirmation,
} from "@/app/UiComponents/formComponents/forms/GrantDraftFrom";
import { useGrantLinks } from "@/app/providers/GrantLinksProvider";
import FullScreenLoader from "../feedback/loaders/FullscreenLoader";

const fakeTerms = [
  "يلتزم الطالب بحضور جميع المحاضرات.",
  "يلتزم الطالب بتقديم جميع الأوراق المطلوبة في الوقت المحدد.",
  "في حال الإخلال بالشروط، يحق للجهة المانحة سحب المنحة.",
  "المنحة تغطي الرسوم الدراسية فقط، ولا تشمل مصاريف أخرى.",
];
export default function ScholarshipTermsForm({ id, extraParams }) {
  const [agreed, setAgreed] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [isSubmittedBefore, setIsSubmittedBefore] = useState(false);
  const [data, setData] = useState([]);
  const [loadingTerms, setLoadingTerms] = useState(true);
  const [loading, setLoadingData] = useState(false);
  const { setLoading } = useToastContext();
  const handleCheckboxChange = (event) => {
    setAgreed(event.target.checked);
  };
  const { nonFilledLinks, setNotFilledLinks } = useGrantLinks();

  useEffect(() => {
    const fetchData = async () => {
      const dataRequest = await getData({
        url: "student/fixed-data?type=GRANTTERMS&",
        setLoading: setLoadingTerms,
      });
      console.log(dataRequest);
      if (dataRequest.status === 200) {
        setData(dataRequest.data);
      }
      const request = await getData({
        url: `student/applications/draft/${id}?model=scholarshipTerms&${extraParams}`,
        setLoading: setLoadingData,
      });
      if (request.status === 200) {
        setAgreed(request.data);
        if (request.data === true) {
          setSubmit(true);
          setIsSubmittedBefore(true);
        }
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async () => {
    const request = await handleRequestSubmit(
      { grantShipTerms: agreed },
      setLoading,
      `student/applications/draft/${id}?model=grantShipTerms`,
      false,
      "جاري حفظ بياناتك"
    );
    if (request.status === 200) {
      setSubmit(true);
      const nowNonFilled = nonFilledLinks.filter(
        (item) => item.key !== "scholarshipTerms"
      );
      setNotFilledLinks(nowNonFilled);
    }
  };

  const submittedText = isSubmittedBefore
    ? "لقد وافقت على شروط المنحة من قبل هل تريد الذهاب إلى الأسئلة الشائعة؟"
    : "الذهاب إلى الأسئلة الشائعة";

  const renderContent = () => {
    switch (true) {
      case loading:
        return <LoadingState />;
      case submit:
        return (
          <SubmissionConfirmation
            next={{
              text: submittedText,
              url: "faq",
            }}
            appId={id}
          />
        );
      default:
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              شروط المنحة الدراسية
            </Typography>

            <Typography variant="body1" gutterBottom>
              الطالب يتعهد بالالتزام بالشروط التالية:
            </Typography>
            {loadingTerms && <FullScreenLoader />}
            <List>
              {data?.map((term, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={
                      <Typography
                        component="pre"
                        sx={{
                          textWrap: "auto",
                        }}
                      >
                        {term.content}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
            <FormControlLabel
              control={
                <Checkbox checked={agreed} onChange={handleCheckboxChange} />
              }
              label="أوافق على شروط المنحة"
            />
            {agreed && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                إرسال
              </Button>
            )}
          </Box>
        );
    }
  };

  return renderContent();
}

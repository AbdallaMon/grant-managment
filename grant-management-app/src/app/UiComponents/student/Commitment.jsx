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

export default function CommitmentForm({ id, extraParams }) {
  const [agreed, setAgreed] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [isSubmittedBefore, setIsSubmittedBefore] = useState(false);
  const [data, setData] = useState([]);
  const [loadingCommitment, setLoadingCommitment] = useState(true);
  const [loading, setLoadingData] = useState(false);
  const { setLoading } = useToastContext();
  const handleCheckboxChange = (event) => {
    setAgreed(event.target.checked);
  };
  const { nonFilledLinks, setNotFilledLinks } = useGrantLinks();

  useEffect(() => {
    const fetchData = async () => {
      const dataRequest = await getData({
        url: "student/fixed-data?type=COMMITMENT&",
        setLoading: setLoadingCommitment,
      });
      if (dataRequest.status === 200) {
        setData(dataRequest.data);
      }
      const request = await getData({
        url: `student/applications/draft/${id}?model=commitment&${extraParams}`,
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
      { commitment: agreed },
      setLoading,
      `student/applications/draft/${id}?model=commitment`,
      false,
      "جاري حفظ بياناتك"
    );
    if (request.status === 200) {
      setSubmit(true);
      const nowNonFilled = nonFilledLinks.filter(
        (item) => item.key !== "commitment"
      );
      setNotFilledLinks(nowNonFilled);
    }
  };
  const submittedText = isSubmittedBefore
    ? "لقد وافقت علي هذا من قبل هل تريد الذهاب للموافقة علي شروط المنحه؟"
    : "الذهاب للموافقه علي شروط المنحه";
  const renderContent = () => {
    switch (true) {
      case loading:
        return <LoadingState />;
      case submit:
        return (
          <SubmissionConfirmation
            next={{
              text: submittedText,
              url: "ship-terms",
            }}
            appId={id}
          />
        );
      default:
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              التعهد والالتزام
            </Typography>

            <Typography variant="body1" gutterBottom>
              أتقدم بهذا التعهد للالتزام بكافة الشروط والأحكام الخاصة ببرنامج
              المنح الدراسية، وأقر بما يلي:
            </Typography>
            {loadingCommitment && <FullScreenLoader />}
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
            <Typography>
              أقر بأنني قرأت وفهمت جميع شروط المنحة الدراسية وأوافق على الالتزام
              بها.
            </Typography>
            <FormControlLabel
              control={
                <Checkbox checked={agreed} onChange={handleCheckboxChange} />
              }
              label="أوافق على التعهد"
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

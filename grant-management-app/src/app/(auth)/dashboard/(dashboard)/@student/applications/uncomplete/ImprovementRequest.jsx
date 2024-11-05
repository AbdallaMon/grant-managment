"use client";
import React, {useEffect, useState} from "react";
import {Box, Card, CardContent, Typography, Alert, CircularProgress, Stack} from "@mui/material";
import {usePathname} from "next/navigation";
import {getData} from "@/app/helpers/functions/getData";
import colors from "@/app/helpers/colors";

export default function ImprovementRequestsByModel({appId}) {
    const [loading, setLoading] = useState(true);
    const [improvementRequests, setImprovementRequests] = useState([]);
    const [error, setError] = useState(null);
    const pathname = usePathname();
    const pathSegments = pathname.split('/').filter(Boolean);
    const modelSlug = pathSegments[pathSegments.length - 1];

    const modelMap = {
        "scholarship-info": "ScholarshipInfo",
        "academic-performance": "AcademicPerformance",
        "residence-info": "ResidenceInformation",
        "siblings": "Sibling",
        "supporting-files": "SupportingFiles",
    };

    const modelName = modelMap[modelSlug];

    useEffect(() => {
        async function fetchImprovementRequests() {
            if (!modelName) return setLoading(false);

            try {
                const result = await getData({
                    url: `student/applications/${appId}/improvement-requests-model/${modelName}`,
                    setLoading
                })
                if (result.status === 200) {
                    setImprovementRequests(result.data || []);
                }
            } catch (err) {
                console.log(err)
            } finally {
                setLoading(false);
            }
        }

        fetchImprovementRequests();
    }, [modelName, appId]);

    if (loading) return <CircularProgress/>;
    if (improvementRequests.length === 0) return null;
    return (
          <Box sx={{p: 2, mb: -3}}>
              <Alert severity="info" variant="outlined" sx={{mb: 2}}>
                  <Typography variant="h6" fontWeight="bold" mb={1}>طلبات تحسين الحقول</Typography>
                  <Typography>يرجى مراجعة طلبات التحسين أدناه وإجراء التعديلات اللازمة:</Typography>
              </Alert>
              <Stack spacing={2}>
                  {improvementRequests.map((request) => (
                        <Box
                              key={request.id}
                              sx={{
                                  backgroundColor: "#f9f9f9",
                                  padding: 1.5,
                                  borderLeft: `4px solid ${colors.primary}`,
                                  borderRadius: 1,
                              }}
                        >
                            <Typography variant="subtitle1" fontWeight="bold">
                                {request.arModelName} - {request.arFieldName}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                {request.message}
                            </Typography>
                        </Box>
                  ))}
              </Stack>
          </Box>
    );
}

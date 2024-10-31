import {studentInputs} from "@/app/helpers/constantInputs";
import React, {Fragment, useEffect, useState} from "react";
import {getData} from "@/app/helpers/functions/getData";
import {Box, CircularProgress, Divider, Typography, Grid2 as Grid} from "@mui/material";
import dayjs from "dayjs";

const inputs = studentInputs

export default function StudentProfileViewer({item, route}) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        async function fetchData() {
            const request = await getData({
                url: `${route}/${item.id}`,
                setLoading,
            });
            setData(request.data);
            setLoading(false);
        }

        fetchData();
    }, [item]);
    if (loading) {
        return (
              <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
                  <CircularProgress/>
              </Box>
        );
    }
    return (
          <>
              {inputs.map((section, sectionIndex) => {
                  return (
                        <Section key={sectionIndex}
                                 title={sectionIndex === 0 ? "المعلومات الاساسية" : sectionIndex === 1 ? "معلومات الدراسة" : "معلومات الاتصال"}>
                            {section.map((sectionInput, index) => (
                                  <Fragment key={index}>
                                      <RenderField item={sectionInput}
                                                   data={data && sectionIndex === 0 ? data.basicInfo : sectionIndex === 1 ? data.studyInfo : data.contactInfo}
                                      />
                                  </Fragment>
                            ))}
                        </Section>
                  )
              })}

          </>
    )
}

function RenderField({item, data}) {
    let content = item.data.id === "birthDate" ? dayjs(data[item.data.id]).format("DD/ MM/ YYYY") : data[item.data.id]
    let extraContent = ""
    if (item.data.enums) content = item.data.enums[content]
    if (item.data.id === "hasDisability") {
        if (data.hasDisability) {
            content = "نعم"
            extraContent = "تفاصيل الاعاقة: " + data.disability
        } else {
            content = "لا"
        }
    }
    return (
          <Grid size={{sm: 12, md: 6}}>
              <Box sx={{mb: 2}}>
                  <Box sx={{display: "flex"}} gap={2}>

                      <Typography variant="subtitle1" color="textSecondary">
                          {item.data.label}:
                      </Typography>
                      <Typography variant="body1" sx={{ml: 2}}>
                          {content}
                      </Typography>
                  </Box>
                  {extraContent && (
                        <Typography variant="subtitle2" color="textSecondary">
                            {extraContent}
                        </Typography>
                  )}
              </Box>
          </Grid>
    )
}

const Section = ({title, children}) => (

      <Box mt={0} sx={{
          backgroundColor: theme => theme.palette.background.paper, p: 2
      }}>
          <Typography variant="h5" sx={{mb: 2}}>
              {title}
          </Typography>
          <Divider sx={{mb: 2}}/>

          <Grid container>
              {children}</Grid>
      </Box>
);
"use client"
import React, {useEffect, useState} from 'react';
import {useForm, Controller} from 'react-hook-form';
import {Button, TextField, Select, MenuItem, InputLabel, FormControl, Typography} from '@mui/material';
import Grid from "@mui/material/Grid2";

import {getData} from "@/app/helpers/functions/getData";
import {handleRequestSubmit} from "@/app/helpers/functions/handleSubmit";
import CountryCitySelector from "@/app/UiComponents/formComponents/CustomInputs/CountryCitySelector";
import {useToastContext} from "@/app/providers/ToastLoadingProvider";
import {LoadingState, SubmissionConfirmation} from "@/app/UiComponents/formComponents/forms/GrantDraftFrom";
import {useGrantLinks} from "@/app/providers/GrantLinksProvider";

// Enums for residence and parent status in Arabic
const ResidenceType = {
    FAMILY: 'FAMILY',
    PRIVATE_HOUSING: 'PRIVATE_HOUSING',
    DORMITORY: 'DORMITORY',
};

const ParentStatus = {
    ALIVE: 'ALIVE',
    DECEASED: 'DECEASED',
    MISSING: 'MISSING',
};

// Main form component
export default function ResidenceInfo({id, extraParams}) {
    const {control, handleSubmit, watch, setValue, formState: {errors}} = useForm();
    const [loadingData, setLoadingData] = useState(true);
    const {setLoading} = useToastContext()
    const [currentData, setCurrentData] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const residenceType = watch('residenceType'); // watch the residenceType field
    const fatherStatus = watch('fatherStatus');
    const motherStatus = watch('motherStatus');
    const {nonFilledLinks, setNotFilledLinks} = useGrantLinks()
    useEffect(() => {
        const fetchData = async () => {
            const request = await getData({
                url: `student/applications/draft/${id}?model=residenceInfo&${extraParams}`,
                setLoading: setLoadingData
            });
            if (request.status === 200) {
                setCurrentData(request.data);
                if (request.data) {
                    Object.keys(request.data).forEach(key => setValue(key, request.data[key])); // Set default values in the form
                }
            }
        };

        fetchData();
    }, [id, setValue]);

    const onSubmit = async (formData) => {
        const request = await handleRequestSubmit(
              formData,
              setLoading,
              `student/applications/draft/${id}?model=residenceInfo`,
              false, // Assuming no file upload
              "جارٍ الحفظ...",
              null,
              currentData ? "PUT" : "POST"
        );
        if (request.status === 200) {
            setSubmitted(true)
            const nowNonFilled = nonFilledLinks.filter((item) => item.key !== "residenceInfo")
            setNotFilledLinks(nowNonFilled)
        }
    };


    const renderContent = () => {
        switch (true) {
            case loadingData:
                return <LoadingState/>;
            case submitted:
                return <SubmissionConfirmation next={{
                    text: "الذهاب لملء نموذج الملفات الداعمة",
                    url: "supporting-files"
                }} appId={id}/>;

            default:
                return (
                      <form onSubmit={handleSubmit(onSubmit)}>
                          <Typography
                                variant="h4"
                                color="primary"
                                sx={{
                                    mb: 3,
                                    textAlign: "center",
                                    fontWeight: "bold",
                                }}
                          >
                              معلومات الإقامة
                          </Typography>
                          <Grid container spacing={2}>
                              <Grid size={{xs: 12, md: 6}}>
                                  <FormControl fullWidth>
                                      <InputLabel>نوع الإقامة</InputLabel>
                                      <Controller
                                            name="residenceType"
                                            variant="outlined"
                                            control={control}
                                            defaultValue=""
                                            rules={{required: "من فضلك اختر نوع الإقامة"}}
                                            render={({field}) => (
                                                  <Select {...field} label="نوع الإقامة" variant={"outlined"}
                                                          sx={(theme) => ({
                                                              backgroundColor: theme.palette.background.default,
                                                          })}
                                                  >
                                                      <MenuItem value={ResidenceType.FAMILY}>مع العائلة</MenuItem>
                                                      <MenuItem value={ResidenceType.PRIVATE_HOUSING}>سكن
                                                          خاص</MenuItem>
                                                      <MenuItem value={ResidenceType.DORMITORY}>سكن
                                                          طلاب</MenuItem>
                                                  </Select>
                                            )}
                                      />
                                      {errors.residenceType && <p>{errors.residenceType.message}</p>}
                                  </FormControl>
                              </Grid>

                              {/* Parent Status (if family) */}
                              {residenceType === ResidenceType.FAMILY && (
                                    <>
                                        <Grid size={{xs: 12, md: 6}}>
                                            <FormControl fullWidth>
                                                <InputLabel>حالة الأب</InputLabel>
                                                <Controller
                                                      name="fatherStatus"
                                                      control={control}
                                                      defaultValue=""
                                                      render={({field}) => (
                                                            <Select {...field} label="حالة الأب" variant={"outlined"}

                                                                    sx={(theme) => ({
                                                                        backgroundColor: theme.palette.background.default,
                                                                    })}
                                                            >
                                                                <MenuItem value={ParentStatus.ALIVE}>على قيد
                                                                    الحياة</MenuItem>
                                                                <MenuItem
                                                                      value={ParentStatus.DECEASED}>متوفى</MenuItem>
                                                                <MenuItem
                                                                      value={ParentStatus.MISSING}>مفقود</MenuItem>
                                                            </Select>
                                                      )}
                                                />
                                            </FormControl>
                                        </Grid>
                                        {fatherStatus === ParentStatus.ALIVE && (
                                              <Grid size={{xs: 12, md: 6}}>
                                                  <Controller
                                                        name="fatherIncome"
                                                        control={control}
                                                        defaultValue=""
                                                        render={({field}) => (
                                                              <TextField {...field} label="دخل الأب" type="number"
                                                                         variant={"outlined"}
                                                                         fullWidth
                                                                         sx={(theme) => ({
                                                                             backgroundColor: theme.palette.background.default,
                                                                         })}
                                                              />
                                                        )}
                                                  />
                                              </Grid>
                                        )}
                                        <Grid size={{xs: 12, md: 6}}>
                                            <FormControl fullWidth>
                                                <InputLabel>حالة الأم</InputLabel>
                                                <Controller
                                                      name="motherStatus"
                                                      control={control}
                                                      defaultValue=""
                                                      render={({field}) => (
                                                            <Select {...field} label="حالة الأم" variant={"outlined"}
                                                                    sx={(theme) => ({
                                                                        backgroundColor: theme.palette.background.default,
                                                                    })}
                                                            >
                                                                <MenuItem value={ParentStatus.ALIVE}>على قيد
                                                                    الحياة</MenuItem>
                                                                <MenuItem
                                                                      value={ParentStatus.DECEASED}>متوفاة</MenuItem>
                                                                <MenuItem
                                                                      value={ParentStatus.MISSING}>مفقودة</MenuItem>
                                                            </Select>
                                                      )}
                                                />
                                            </FormControl>
                                        </Grid>


                                        {motherStatus === ParentStatus.ALIVE && (
                                              <Grid size={{xs: 12, md: 6}}>
                                                  <Controller
                                                        name="motherIncome"
                                                        control={control}
                                                        defaultValue=""
                                                        render={({field}) => (
                                                              <TextField {...field} label="دخل الأم" type="number"
                                                                         fullWidth variant={"outlined"}
                                                                         sx={(theme) => ({
                                                                             backgroundColor: theme.palette.background.default,
                                                                         })}
                                                              />
                                                        )}
                                                  />
                                              </Grid>
                                        )}

                                        {/* Family Income */}
                                        <Grid size={{xs: 12, md: 6}}>
                                            <Controller
                                                  name="familyIncome"
                                                  control={control}
                                                  defaultValue=""
                                                  render={({field}) => (
                                                        <TextField {...field} label="دخل الأسرة" type="number"
                                                                   variant={"outlined"} fullWidth
                                                                   sx={(theme) => ({
                                                                       backgroundColor: theme.palette.background.default,
                                                                   })}
                                                        />
                                                  )}
                                            />
                                        </Grid>
                                    </>
                              )}

                              <Grid size={{xs: 12, md: 6}}>
                                  <CountryCitySelector control={control} errors={errors}
                                                       input={{data: {country: {}, city: {}}}}
                                                       setValue={setValue}/>
                              </Grid>

                              <Grid size={{xs: 12, md: 6}}>
                                  <Controller
                                        name="address"
                                        control={control}
                                        defaultValue=""

                                        rules={{required: "من فضلك أدخل العنوان"}}
                                        render={({field}) => (
                                              <TextField {...field} label="العنوان" fullWidth
                                                         error={!!errors.address}
                                                         variant={"outlined"}
                                                         sx={(theme) => ({
                                                             backgroundColor: theme.palette.background.default,
                                                         })}
                                                         helperText={errors.address ? errors.address.message : ''}/>
                                        )}
                                  />
                              </Grid>

                              <Grid size={12}>
                                  <Button type="submit" variant="contained" color="primary">
                                      إرسال
                                  </Button>
                              </Grid>
                          </Grid>
                      </form>
                );
        }
    };
    return renderContent()
}

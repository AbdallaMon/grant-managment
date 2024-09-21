"use client";
import React, {Fragment, useState} from "react";
import {Controller, useForm} from "react-hook-form";
import {
    Box,
    Button,
    Typography,
    Stepper,
    Step,
    StepLabel,
    TextField,
    InputLabel,
    FormControl,
    Select, MenuItem, Divider, Container, Alert
} from "@mui/material";
import Grid from '@mui/material/Grid2';

import {MuiDatePicker} from "@/app/UiComponents/FormComponents/MUIInputs/MuiDatePicker";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import CountryCitySelector from "@/app/UiComponents/formComponents/MUIInputs/CountryCitySelector";
import InputField from "@/app/UiComponents/formComponents/MUIInputs/InputField";
import PhoneInput from "@/app/UiComponents/formComponents/MUIInputs/PhoneInput";
import {handleRequestSubmit} from "@/app/helpers/functions/handleSubmit";
import {useToastContext} from "@/app/providers/ToastLoadingProvider";
import ResidenceAndNationalitySelectors
    from "@/app/UiComponents/formComponents/MUIInputs/ResidenceAndNationalitySelectors";
import DisabilityInput from "@/app/UiComponents/formComponents/MUIInputs/DisabilityInput";

const locales = ["ar"];

const steps = [
    "المعلومات الأساسية",
    "المعلومات الدراسية",
    "معلومات الاتصال",
    "مراجعة البيانات"

]
const stepsIds = ["basicInfo", "studyInformation", "contactInfo"]
const stepInputs = [
    [
        {
            data: {id: "name", label: "اسمك", type: "text", required: true},
            pattern: {
                required: {value: true, message: "الاسم مطلوب"},
                pattern: {value: /^[^\s]+(?:\s)?$/, message: "الاسم يجب أن يكون كلمة واحدة فقط"}
            },
        },
        {
            data: {id: "fatherName", label: "اسم الأب", type: "text", required: true},
            pattern: {
                required: {value: true, message: "اسم الأب مطلوب"},
                pattern: {value: /^[^\s]+(?:\s)?$/, message: "اسم الأب يجب أن يكون كلمة واحدة فقط"}
            },
        },
        {
            data: {id: "familyName", label: "اسم العائلة", type: "text", required: true},
            pattern: {
                required: {value: true, message: "اسم العائلة مطلوب"},
                pattern: {value: /^[^\s]+(?:\s)?$/, message: "اسم العائلة يجب أن يكون كلمة واحدة فقط"}
            },
        },
        {
            data: {
                id: "gender",
                label: "الجنس",
                type: "SelectField",
                options: [
                    {label: "ذكر", value: "male"},
                    {label: "أنثى", value: "female"},
                ],
                required: true,
            },
            pattern: {required: {value: true, message: "الجنس مطلوب"}},
        },
        {
            data: {id: "birthDate", label: "تاريخ الميلاد", type: "date", required: true},
            pattern: {required: {value: true, message: "تاريخ الميلاد مطلوب"}},
        },
        {
            data: {
                id: "email",
                type: "email",
                name: "email",
                label: "البريد الالكتروني",
            },
            pattern: {
                required: {
                    value: true,
                    message: "الرجاء إدخال البريد الإلكتروني",
                },
                pattern: {
                    value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: "الرجاء إدخال بريد إلكتروني صحيح",
                },
            },
        },
        {
            data: {
                id: "password",
                type: "password",
                label: "كلمة المرور",
                name: "password",
            },
            sx: {mb: 0, my: "auto"},
            pattern: {
                required: {
                    value: true,
                    message: "الرجاء إدخال  كلمة المرور",
                },
                pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
                    message:
                          "يجب أن تحتوي كلمة المرور على حرف كبير وحرف صغير ورقم وأن تكون 8 أحرف على الأقل",
                },
            },
        },
        {
            data: {
                id: "confirmPassword",
                type: "password",
                label: "تأكيد كلمة المرور",
                name: "confirmPassword",
            },
            sx: {mb: 0, my: "auto"},
            pattern: {
                required: {
                    value: true,
                    message: " يجب تأكيد كلمة المرور",
                },
                validate: {
                    matchesPreviousPassword: (value) => {
                        const password = document.getElementById("password").value;
                        return password === value || "كلمة المرور غير متطابقة";
                    },
                },
            },
        },
        {
            data: {id: "country", type: "country",},
        },
        {
            data: {id: "passport", label: "رقم جواز السفر/الهوية", type: "number", required: true},
            pattern: {
                required: {value: true, message: "اسم رقم جواز السفر/الهوي مطلوب"},
            },
        },
        {
            data: {id: "hasDisability", type: "disability",},
        },
    ],
    [
        {
            data: {
                id: "programType", label: "نوع البرنامج الدراسي", type: "SelectField", options: [
                    {label: "بكالريوس", value: "BACH"},
                    {label: "ماجستير", value: "MAST"},
                    {label: "دكتوراه", value: "PHD"},
                ]
            },
            pattern: {required: {value: true, message: "نوع البرنامج الدراسي مطلوب"}},
        },
        {
            data: {id: "university", label: "الجامعة", type: "text", required: true},
            pattern: {required: {value: true, message: "اسم الجامعة مطلوب"}},
        },
        {
            data: {id: "college", label: "الكلية", type: "text", required: true},
            pattern: {required: {value: true, message: "اسم الكلية مطلوب"}},
        },
        {
            data: {id: "department", label: "القسم", type: "text", required: true},
            pattern: {required: {value: true, message: "اسم القسم مطلوب"}},
        },
        {
            data: {id: "year", label: "السنة الدراسية", type: "number", required: true},
            pattern: {required: {value: true, message: "السنة الدراسية مطلوبة"}},
        },
        {
            data: {id: "studentIdNo", label: "رقم الطالب الجامعي", type: "number", required: true},
            pattern: {required: {value: true, message: "رقم الطالب الجامعي مطلوب"}},
        },

    ],
    [
        {
            data: {id: "phone", label: "رقم الهاتف", type: "phone", required: true},
            pattern: {required: {value: true, message: "رقم الهاتف مطلوب"}},
        },
        {
            data: {id: "whatsapp", label: "واتساب", type: "phone"},
            pattern: {required: {value: true, message: "رقم الواتساب مطلوب "}},
        },
        {
            data: {id: "facebook", label: "رابط حساب الفيسبوك", type: "text"},
        },
        {
            data: {id: "instagram", label: "رابط حساب الانستقرام", type: "text"},
        },
    ],

];

export default function RegisterForm() {
    const [activeStep, setActiveStep] = useState(0); // Active step index
    const [formData, setFormData] = useState({});
    const [message, setMessage] = useState(""); // Success message state
    const {setLoading} = useToastContext()
    const {control, setValue, handleSubmit, register, trigger, formState: {errors}, watch} = useForm();

    const onSubmit = async (data) => {
        if (activeStep < steps.length - 1) {
            const sectionData = {}
            stepInputs[activeStep].forEach((input) => {
                if (input.data.id === "country") {
                    sectionData.residenceCountry = data.residenceCountry.country
                    sectionData.nationality = data.nationality.country
                } else if (input.data.id === "hasDisability") {
                    sectionData.hasDisability = data.hasDisability
                    sectionData.disability = data.disability
                } else {
                    sectionData[input.data.id] = data[input.data.id]
                }
            })
            setFormData((prevData) => ({...prevData, [stepsIds[activeStep]]: sectionData}));

            // setFormData((prevData) => ({...prevData, [stepsIds[activeStep]]: sectionData}));
            setActiveStep((prevStep) => prevStep + 1);
        } else {
            const response = await handleRequestSubmit(formData, setLoading, "auth/register", false, "جاري انشاء الحساب")
            if (response.status === 200) {
                setMessage(response.message);
            }
        }
    };

    const handleBack = () => {
        setActiveStep((prevStep) => prevStep - 1);
    };


    return (
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={locales}>
              <Box sx={{width: "100%", minHeight: "100vh", py: 4}}>
                  <Container maxWidth="md" sx={{p: 0}}>
                      <Box sx={{
                          width: "100%",
                          my: 3,
                          p: {xs: 2, md: 4},
                          bgcolor: "background.default",
                          borderRadius: 2
                      }}>
                          <Typography
                                color="primary"
                                variant="h4" sx={{
                              mb: 2,
                              textAlign: "center",
                              fontWeight: "bold"
                          }}>
                              تسجيل حساب جديد
                          </Typography>
                          <Stepper activeStep={activeStep} alternativeLabel sx={{mb: 5}}>
                              {steps.map((step) => (
                                    <Step key={step}>
                                        <StepLabel>{step}</StepLabel>
                                    </Step>
                              ))}
                          </Stepper>
                          {message && (
                                <Alert everity="success">
                                    <Typography variant="h6" color="success" sx={{textAlign: "center", my: 4}}>
                                        {message}
                                    </Typography>
                                </Alert>
                          )}
                          {!message && (
                                <>
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <Grid container spacing={2}>
                                            {activeStep < stepInputs.length && stepInputs[activeStep].map((input) => (
                                                  input.data.type === "SelectField" ? (
                                                        <Grid size={{
                                                            xs: 12,
                                                            md: 6
                                                        }} key={input.data.id}>
                                                            <Controller
                                                                  name={input.data.id}
                                                                  control={control}
                                                                  rules={{
                                                                      required: input.pattern?.required.message,
                                                                      pattern: {
                                                                          value: input.pattern?.pattern?.value,
                                                                          message: input.pattern?.pattern?.message,
                                                                      }
                                                                  }}
                                                                  render={({field}) => (
                                                                        <FormControl fullWidth margin="none">
                                                                            <InputLabel>{input.data.label}</InputLabel>
                                                                            <Select {...field} label={input.data.label}
                                                                                    error={!!errors[input.data.id]}
                                                                                    sx={{bgcolor: 'background.default'}}>
                                                                                {input.data.options.map((item, index) => (
                                                                                      <MenuItem key={index}
                                                                                                value={item.value}>{item.label}</MenuItem>
                                                                                ))}
                                                                            </Select>
                                                                            {errors[input.data.id] &&
                                                                                  <Typography
                                                                                        color="error">{errors[input.data.id].message}</Typography>}
                                                                        </FormControl>
                                                                  )
                                                                  }

                                                            />
                                                        </Grid>
                                                  ) : input.data.type === "date" ? (
                                                        <Grid size={{
                                                            xs: 12,
                                                            md: 6
                                                        }}
                                                              key={input.data.id}
                                                        >
                                                            <MuiDatePicker
                                                                  key={input.data.id}
                                                                  input={input}
                                                                  control={control}
                                                                  errors={errors}
                                                            />
                                                        </Grid>
                                                  ) : input.data.type === "disability" ?
                                                        <Grid size={{
                                                            xs: 12,
                                                            md: 6
                                                        }}
                                                              key={input.data.id}
                                                        >
                                                            <DisabilityInput errors={errors}
                                                                             control={control}
                                                                             watch={watch}
                                                            />
                                                        </Grid>
                                                        :
                                                        input.data.type === "country" ?
                                                              <Grid size={12} key={input.data.id}
                                                              >
                                                                  <ResidenceAndNationalitySelectors errors={errors}
                                                                                                    control={control}
                                                                                                    setValue={setValue}
                                                                                                    register={register}
                                                                  />
                                                              </Grid>
                                                              :
                                                              input.data.type === "password" ?
                                                                    <Grid size={{
                                                                        xs: 12,
                                                                        md: 6
                                                                    }}
                                                                          key={input.data.id}
                                                                    >
                                                                        <Controller
                                                                              name={input.data.id}
                                                                              control={control}
                                                                              rules={{
                                                                                  required: input.pattern?.required.message,
                                                                                  pattern: {
                                                                                      value: input.pattern?.pattern?.value,
                                                                                      message: input.pattern?.pattern?.message,
                                                                                  }
                                                                              }}
                                                                              render={({field}) => (
                                                                                    <InputField
                                                                                          input={input}
                                                                                          register={register}
                                                                                          errors={errors}
                                                                                          watch={watch}
                                                                                          trigger={trigger}
                                                                                          variant="outlined"

                                                                                    />
                                                                              )}
                                                                        />
                                                                    </Grid>
                                                                    : input.data.type === "phone" ?
                                                                          <Grid size={{
                                                                              xs: 12,
                                                                              md: 6
                                                                          }}
                                                                                key={input.data.id}
                                                                          >
                                                                              <PhoneInput
                                                                                    name={"phone"}
                                                                                    control={control}
                                                                                    input={input}
                                                                              />
                                                                          </Grid>
                                                                          :
                                                                          (
                                                                                <Grid size={{
                                                                                    xs: 12,
                                                                                    md: 6
                                                                                }}
                                                                                      key={input.data.id}
                                                                                >
                                                                                    <Controller

                                                                                          name={input.data.id}
                                                                                          control={control}
                                                                                          rules={{
                                                                                              required: input.pattern?.required.message,
                                                                                              pattern: {
                                                                                                  value: input.pattern?.pattern?.value,
                                                                                                  message: input.pattern?.pattern?.message,
                                                                                              }
                                                                                          }}
                                                                                          render={({field}) => (
                                                                                                <TextField
                                                                                                      {...field}
                                                                                                      label={input.data.label}
                                                                                                      fullWidth

                                                                                                      type={input.data.type}
                                                                                                      margin="none"
                                                                                                      error={!!errors[input.data.id]}
                                                                                                      helperText={errors[input.data.id] && errors[input.data.id].message}
                                                                                                      sx={{
                                                                                                          bgcolor: 'background.default',

                                                                                                      }}

                                                                                                />
                                                                                          )}
                                                                                    />
                                                                                </Grid>
                                                                          )
                                            ))}
                                        </Grid>
                                        {activeStep === steps.length - 1 && (
                                              <Box sx={{mt: 4}}>
                                                  <Review data={formData} inputs={stepInputs} steps={steps}
                                                          stepsIds={stepsIds}/>
                                              </Box>
                                        )
                                        }
                                        <Box sx={{display: "flex", justifyContent: "space-between", mt: 2}}>
                                            <Button type="submit" variant="contained">
                                                {activeStep < steps.length - 1 ? "التالي" : "إرسال"}
                                            </Button>
                                            {activeStep > 0 && (
                                                  <Button onClick={handleBack} variant="contained">رجوع</Button>
                                            )}
                                        </Box>
                                    </form>
                                </>
                          )}
                      </Box>
                  </Container>
              </Box>
          </LocalizationProvider>
    );
}

function Review({stepsIds, steps, data, inputs}) {
    return (
          <>
              {stepsIds.map((step, index) => (
                    <Box key={step} sx={{mb: 4}}>
                        <Typography variant="h5">{steps[index]}</Typography>
                        <Divider sx={{my: 2}}/>
                        <Grid container spacing={2}>
                            {inputs[index].map((item) => (
                                  <>
                                      {item.data.type !== "password" && item.data.type !== "confirmPassword" && item.data.type !== "disability" && item.data.type !== "country" &&
                                            <>
                                                <Grid size={{xs: 12, md: 6}} key={item.data.id}>
                                                    <Typography
                                                          variant="body1"><strong>{item.data.label}:</strong> {data[step][item.data.id]}
                                                    </Typography>
                                                </Grid>
                                            </>
                                      }

                                  </>

                            ))}
                            {index === 0 &&
                                  <>
                                      <Grid size={6}>
                                          <Typography
                                                variant="body1"><strong>بلد
                                              الاقامة:</strong> {data.basicInfo.residenceCountry}
                                          </Typography>
                                          <Typography
                                                variant="body1"><strong>المدينة:</strong> {data.basicInfo.nationality}
                                          </Typography>
                                      </Grid>
                                      <Grid size={6}>
                                          <Typography
                                                variant="body1"><strong> لدية اعاقة؟
                                              :</strong> {data.basicInfo.hasDisability === "yes" ? "نعم" : "لا"}
                                          </Typography>
                                          <Typography
                                                variant="body1"><strong>تفاصيل
                                              الاعاقة:</strong> {data.basicInfo.disability}
                                          </Typography>
                                      </Grid>
                                  </>
                            }
                        </Grid>
                    </Box>
              ))}
          </>
    );
}
"use client";
import React, {useState, useEffect, Fragment} from "react";
import {
    Box,
    Typography,
    Button,
    IconButton,

    CircularProgress, Modal,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import {CiEdit as Edit} from "react-icons/ci";
import {getData} from "@/app/helpers/functions/getData";
import {handleRequestSubmit} from "@/app/helpers/functions/handleSubmit";
import {useAuth} from "@/app/providers/AuthProvider";
import {useToastContext} from "@/app/providers/ToastLoadingProvider";
import {Form} from "@/app/UiComponents/formComponents/forms/Form";
import {GenderType, ProgramType, simpleModalStyle} from "@/app/helpers/constants";
import dayjs from "dayjs";
import DisabilityInput from "@/app/UiComponents/formComponents/CustomInputs/DisabilityInput";
import CountrySelector from "@/app/UiComponents/formComponents/CustomInputs/CountrySelector";
import PhoneInput from "@/app/UiComponents/formComponents/CustomInputs/PhoneInput";

const inputs = [
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
                enums: GenderType,
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
            data: {id: "residenceCountry", type: "outComponent", component: CountrySelector, label: "مكان الاقامه"},
        },
        {
            data: {id: "nationality", type: "outComponent", component: CountrySelector, label: "الجنسية"},
        },
        {
            data: {id: "passport", label: "رقم جواز السفر/الهوية", type: "number", required: true},
            pattern: {
                required: {value: true, message: "اسم رقم جواز السفر/الهوي مطلوب"},
            },
        },
        {
            data: {id: "hasDisability", type: "outComponent", component: DisabilityInput, label: "هل لديك اعاقة؟"},
        },
    ],
    [
        {
            data: {
                id: "programType", label: "نوع البرنامج الدراسي", type: "SelectField",
                enums: ProgramType,
                options: [
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
            data: {id: "phone", label: "رقم الهاتف", type: "outComponent", component: PhoneInput, required: true},
            pattern: {required: {value: true, message: "رقم الهاتف مطلوب"}},
        },
        {
            data: {id: "whatsapp", label: "واتساب", type: "outComponent", component: PhoneInput},
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

export default function ProfileComponent({isApplication, id}) {
    const {user} = useAuth();
    const [personalInfo, setPersonalInfo] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [selectedField, setSelectedField] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const {setLoading: setSubmitLoading} = useToastContext()
    const [currentData, setCurrentData] = useState(null)
    useEffect(() => {
        async function fetchData() {
            const request = await getData({
                url: `student/${user.id}`,
                setLoading,
            });
            setPersonalInfo(request.data);
            setLoading(false);
        }

        fetchData();
    }, [user]);

    const toggleEditMode = () => setEditMode(!editMode);


    const handleModalClose = () => {
        setOpenModal(false);
        setSelectedField(null);
    };


    const handleSave = async (data) => {
        const model = getModelFromField(selectedField.data.id);
        if (data.hasDisability === "no") data.disability = null
        const request = await handleRequestSubmit(
              {updateData: data, model},
              setSubmitLoading,
              `student/${user.id}/`,
              false,
              "جاري الحفظ",
              null,
              "PUT"
        );
        if (request.status === 200) {
            setPersonalInfo((prev) => ({
                ...prev,
                [model]: {...prev[model], ...data}
            }));
            handleModalClose();
        }
    };

    const getModelFromField = (field) => {
        if (["name", "fatherName", "familyName", "nationality", "residenceCountry", "passport", "gender", "birthDate", "hasDisability", "disability"].includes(field)) {
            return "basicInfo";
        }
        if (["phone", "whatsapp", "facebook", "instagram", "twitter"].includes(field)) {
            return "contactInfo";
        }
        if (["programType", "university", "college", "department", "year", "studentIdNo"].includes(field)) {
            return "studyInfo";
        }
    };


    if (loading) {
        return (
              <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
                  <CircularProgress/>
              </Box>
        );
    }
    return (
          <Box sx={{p: 3}}>
              <Typography variant="h4" gutterBottom>
                  البيانات الشخصية
              </Typography>
              {isApplication && <>
                  <Typography variant="h6" gutterBottom>
                      هذه البيانات مسجلة من وقت التسجيل ان كنت لا تريد تعديلها اذهب الي قسم اخر
                  </Typography>
                  <Button href={`/dashboard/applications/drafts/${id}/scholarship-info`}>
                      الذهاب لملئ بيانات نوع المنحة المطلوبه
                  </Button>
              </>}
              <Button variant="contained" color="primary" onClick={toggleEditMode}>
                  {editMode ? "وضع العرض" : "وضع التعديل"}
              </Button>
              {inputs.map((section, sectionIndex) => {
                  return (
                        <Section key={sectionIndex}
                                 title={sectionIndex === 0 ? "المعلومات الاساسية" : sectionIndex === 1 ? "معلومات الدراسة" : "معلومات الاتصال"}>
                            {section.map((sectionInput, index) => (
                                  <Fragment key={index}>
                                      <RenderField item={sectionInput} editMode={editMode}
                                                   setItem={setSelectedField}
                                                   setOpenModal={setOpenModal}
                                                   data={sectionIndex === 0 ? personalInfo.basicInfo : sectionIndex === 1 ? personalInfo.studyInfo : personalInfo.contactInfo}
                                                   setCurrentData={setCurrentData}
                                      />
                                  </Fragment>
                            ))}
                        </Section>
                  )
              })}

              <Modal open={openModal} onClose={handleModalClose}>
                  <Box sx={simpleModalStyle}>
                      <RenderForm data={currentData} handleSave={handleSave} selectedField={selectedField}/>
                  </Box>
              </Modal>
          </Box>
    );
}

function RenderForm({selectedField, data, handleSave}) {
    const input = {
        ...selectedField,
        data: {
            ...selectedField.data,
            defaultValue: data[selectedField.data.id],
            disability: selectedField.data.id === "hasDisability" && data.disability
        }
    }
    return (
          <Form inputs={[input]} formTitle={"تعديل"} btnText={"حفظ"} onSubmit={handleSave}>
          </Form>
    )
}

// Helper to render each field
function RenderField({item, editMode, setItem, setOpenModal, data, setCurrentData}) {
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
              <Box sx={{
                  display: "flex", flexWrap: "wrap", alignItem: "center", gap: 4
              }}>
                  <Typography variant="body1" mb={2}>
                      {item.data.label}: {content}
                      <Typography variant={"subtitle2"}>
                          {extraContent}
                      </Typography>
                  </Typography>
                  {editMode && (
                        <IconButton onClick={() => {
                            setItem(item)
                            setOpenModal(true)
                            setCurrentData(data)
                        }}>
                            <Edit/>
                        </IconButton>
                  )}
              </Box>
          </Grid>
    )
}


const Section = ({title, children}) => (

      <Box mt={3} sx={{
          backgroundColor: theme => theme.palette.background.paper, p: 2
      }}>
          <Typography variant="h5" sx={{my: 2}}>
              {title}
          </Typography>
          <Grid container>{children}</Grid>
      </Box>
);
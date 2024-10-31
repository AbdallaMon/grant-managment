"use client";
import React, {useState, useEffect, Fragment} from "react";
import {
    Box,
    Typography,
    Button,
    IconButton,
    Grid,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Card,
    CardHeader,
    CardContent,
    Tooltip,
    Avatar,
    Tabs,
    Tab,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Divider,
} from "@mui/material";
import {CiEdit as Edit} from "react-icons/ci";
import {getData} from "@/app/helpers/functions/getData";
import {handleRequestSubmit} from "@/app/helpers/functions/handleSubmit";
import {useAuth} from "@/app/providers/AuthProvider";
import {useToastContext} from "@/app/providers/ToastLoadingProvider";
import {MainForm} from "@/app/UiComponents/formComponents/forms/MainForm";
import dayjs from "dayjs";
import {studentInputs} from "@/app/helpers/constantInputs";
import Link from "next/link";

const inputs = studentInputs;

export default function UserProfile({isApplication, id}) {
    const {user} = useAuth();
    const [personalInfo, setPersonalInfo] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [selectedField, setSelectedField] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const {setLoading: setSubmitLoading} = useToastContext();
    const [currentData, setCurrentData] = useState(null);
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        async function fetchData() {
            const request = await getData({
                url: `student/${user.id}/personal`,
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
        if (data.hasDisability === "no") data.disability = null;
        const request = await handleRequestSubmit(
              {updateData: data, model},
              setSubmitLoading,
              `student/personal/${user.id}/`,
              false,
              "جاري الحفظ",
              null,
              "PUT"
        );
        if (request.status === 200) {
            setPersonalInfo((prev) => ({
                ...prev,
                [model]: {...prev[model], ...data},
            }));
            handleModalClose();
        }
    };

    const getModelFromField = (field) => {
        if (
              [
                  "name",
                  "fatherName",
                  "familyName",
                  "nationality",
                  "residenceCountry",
                  "passport",
                  "gender",
                  "birthDate",
                  "hasDisability",
                  "disability",
              ].includes(field)
        ) {
            return "basicInfo";
        }
        if (
              ["phone", "whatsapp", "facebook", "instagram", "twitter"].includes(field)
        ) {
            return "contactInfo";
        }
        if (
              [
                  "programType",
                  "university",
                  "college",
                  "department",
                  "year",
                  "studentIdNo",
              ].includes(field)
        ) {
            return "studyInfo";
        }
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    if (loading) {
        return (
              <Box
                    sx={{display: "flex", justifyContent: "center", alignItems: "center", height: "100vh"}}
              >
                  <CircularProgress/>
              </Box>
        );
    }

    return (
          <Box sx={{p: {xs: 0.5, md: 3}}}>
              {isApplication &&
                    <div>
                        <Typography variant="h4" gutterBottom>
                            البيانات الشخصية
                        </Typography>
                        <Typography variant="h6" gutterBottom>
                            هذه البيانات مسجلة من وقت التسجيل ان كنت لا تريد تعديلها اذهب الي قسم اخر
                        </Typography>
                        <Button href={`/dashboard/applications/drafts/${id}/scholarship-info`} component={Link}>
                            اضغط هنا للذهاب لملئ بيانات نوع المنحة المطلوبه
                        </Button>
                    </div>}
              {!isApplication &&
                    <Box sx={{position: "relative", mb: 3}}>

                        <Box
                              sx={{
                                  height: 200,
                                  backgroundImage: 'url("/images/cover-photo.jpg")', // Replace with your cover photo URL
                                  backgroundSize: "cover",
                                  backgroundPosition: "center",
                              }}
                        />
                        <Avatar
                              sx={{
                                  width: 120,
                                  height: 120,
                                  position: "absolute",
                                  bottom: -60,
                                  left: "50%",
                                  transform: "translateX(-50%)",
                                  border: "4px solid white",
                              }}
                              src="/images/avatar.jpg" // Replace with your avatar URL
                        />
                    </Box>
              }
              <Typography variant="h5" align="center" sx={{mt: 8}}>
                  {user.name}
              </Typography>

              <Box sx={{textAlign: "center", mt: 2}}>
                  <Button variant="outlined" onClick={toggleEditMode}>
                      {editMode ? "وضع العرض" : "وضع التعديل"}
                  </Button>
              </Box>

              {/* Tabs */}
              <Box sx={{width: "100%", mt: 3}}>
                  <Tabs
                        value={activeTab}
                        onChange={handleTabChange}
                        centered
                        indicatorColor="primary"
                        textColor="primary"
                        variant="fullWidth"
                  >
                      <Tab label="المعلومات الاساسية"/>
                      <Tab label="معلومات الدراسة"/>
                      <Tab label="معلومات الاتصال"/>
                  </Tabs>

                  {activeTab === 0 && (
                        <TabPanel>
                            <Section>
                                {inputs[0].map((sectionInput, index) => (
                                      <RenderField
                                            key={index}
                                            item={sectionInput}
                                            editMode={editMode}
                                            setItem={setSelectedField}
                                            setOpenModal={setOpenModal}
                                            data={personalInfo.basicInfo}
                                            setCurrentData={setCurrentData}
                                      />
                                ))}
                            </Section>
                        </TabPanel>
                  )}
                  {activeTab === 1 && (
                        <TabPanel>
                            <Section>
                                {inputs[1].map((sectionInput, index) => (
                                      <RenderField
                                            key={index}
                                            item={sectionInput}
                                            editMode={editMode}
                                            setItem={setSelectedField}
                                            setOpenModal={setOpenModal}
                                            data={personalInfo.studyInfo}
                                            setCurrentData={setCurrentData}
                                      />
                                ))}
                            </Section>
                        </TabPanel>
                  )}
                  {activeTab === 2 && (
                        <TabPanel>
                            <Section>
                                {inputs[2].map((sectionInput, index) => (
                                      <RenderField
                                            key={index}
                                            item={sectionInput}
                                            editMode={editMode}
                                            setItem={setSelectedField}
                                            setOpenModal={setOpenModal}
                                            data={personalInfo.contactInfo}
                                            setCurrentData={setCurrentData}
                                      />
                                ))}
                            </Section>
                        </TabPanel>
                  )}
              </Box>

              {/* Edit Modal */}
              <Dialog open={openModal} onClose={handleModalClose} fullWidth maxWidth="sm">
                  {selectedField && (
                        <>
                            <DialogTitle>تعديل {selectedField.data.label}</DialogTitle>
                            <DialogContent>
                                <RenderForm
                                      data={currentData}
                                      handleSave={handleSave}
                                      selectedField={selectedField}
                                />
                            </DialogContent>
                        </>
                  )}
              </Dialog>
          </Box>
    );
}

function RenderForm({selectedField, data, handleSave}) {
    if (!selectedField) return null; // Add this null check

    const input = {
        ...selectedField,
        data: {
            ...selectedField.data,
            defaultValue: data[selectedField.data.id],
            disability:
                  selectedField.data.id === "hasDisability" && data.disability,
        },
    };
    return (
          <MainForm
                inputs={[input]}
                formTitle="تعديل"
                btnText="حفظ"
                onSubmit={handleSave}
                variant="outlined"
          >
          </MainForm>
    );
}

function RenderField({item, editMode, setItem, setOpenModal, data, setCurrentData}) {
    let content =
          item.data.id === "birthDate"
                ? dayjs(data[item.data.id]).format("DD/ MM/ YYYY")
                : data[item.data.id];
    let extraContent = "";
    if (item.data.enums) content = item.data.enums[content];
    if (item.data.id === "hasDisability") {
        if (data.hasDisability) {
            content = "نعم";
            extraContent = "تفاصيل الاعاقة: " + data.disability;
        } else {
            content = "لا";
        }
    }

    return (
          <Fragment>
              <ListItem alignItems="flex-start">
                  <ListItemText
                        primary={
                            <Typography variant="subtitle1">
                                <strong>{item.data.label}:</strong> {content}
                            </Typography>
                        }
                        secondary={
                              extraContent && (
                                    <Typography variant="body2" color="textSecondary">
                                        {extraContent}
                                    </Typography>
                              )
                        }
                  />
                  {editMode && (
                        <ListItemSecondaryAction>
                            <Tooltip title="تعديل">
                                <IconButton
                                      edge="end"
                                      onClick={() => {
                                          setItem(item);
                                          setOpenModal(true);
                                          setCurrentData(data);
                                      }}
                                >
                                    <Edit/>
                                </IconButton>
                            </Tooltip>
                        </ListItemSecondaryAction>
                  )}
              </ListItem>
              <Divider variant="inset" component="li"/>
          </Fragment>
    );
}

const Section = ({children}) => (
      <Card sx={{mb: 3}}>
          <CardContent>
              <List>{children}</List>
          </CardContent>
      </Card>
);

function TabPanel({children}) {
    return <Box sx={{p: 0, py: 2}}>{children}</Box>;
}

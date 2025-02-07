"use client";
import React, { useState, useEffect, Fragment } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  Card,
  CardContent,
  Tooltip,
  Avatar,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  Divider,
  Container,
  Collapse,
} from "@mui/material";
import { CiEdit as Edit } from "react-icons/ci";
import { getData } from "@/app/helpers/functions/getData";
import { handleRequestSubmit } from "@/app/helpers/functions/handleSubmit";
import { useAuth } from "@/app/providers/AuthProvider";
import { useToastContext } from "@/app/providers/ToastLoadingProvider";
import { MainForm } from "@/app/UiComponents/formComponents/forms/MainForm";
import dayjs from "dayjs";
import { studentInputs } from "@/app/helpers/constantInputs";
import Link from "next/link";
import {
  MdAccountBalance,
  MdAdd,
  MdExpandLess,
  MdExpandMore,
  MdMore,
} from "react-icons/md";
import EditModal from "../models/EditModal";
import CreateModal from "../models/CreateModal";
import { bankInfoInputs } from "@/app/helpers/constants";

const inputs = studentInputs;
const MAX_LENGTH = 25;

const truncateText = (text, maxLength) => {
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
};

export default function UserProfile({ isApplication, id }) {
  const { user } = useAuth();
  const [personalInfo, setPersonalInfo] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const { setLoading: setSubmitLoading } = useToastContext();
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
      { updateData: data, model },
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
        [model]: { ...prev[model], ...data },
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
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ p: 0 }}>
      <Box sx={{ p: { xs: 0.5, md: 3 } }}>
        {isApplication && (
          <div>
            <Typography variant="h4" gutterBottom>
              البيانات الشخصية
            </Typography>
            <Typography variant="h6" gutterBottom>
              هذه البيانات مسجلة من وقت التسجيل ان كنت لا تريد تعديلها اذهب الي
              قسم اخر
            </Typography>
            <Button
              href={`/dashboard/applications/drafts/${id}/scholarship-info`}
              component={Link}
            >
              اضغط هنا للذهاب لملئ بيانات نوع المنحة المطلوبه
            </Button>
          </div>
        )}
        {!isApplication && (
          <EditableAvatar
            personalInfo={personalInfo}
            setPersonalInfo={setPersonalInfo}
          />
        )}
        <Typography variant="h5" align="center" sx={{ mt: 8 }}>
          {user.name}
        </Typography>

        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Button variant="outlined" onClick={toggleEditMode}>
            {editMode ? "وضع العرض" : "وضع التعديل"}
          </Button>
        </Box>
        <Box sx={{ width: "100%", mt: 3 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            centered
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab label="المعلومات الاساسية" />
            <Tab label="معلومات الدراسة" />
            <Tab label="معلومات الاتصال" />
            <Tab label="البيانات النبكية" />
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
          {activeTab === 3 && (
            <TabPanel>
              <Section>
                <BankInfoSection
                  personalInfo={personalInfo}
                  setPersonalInfo={setPersonalInfo}
                />
              </Section>
            </TabPanel>
          )}
        </Box>

        {/* Edit Modal */}
        <Dialog
          open={openModal}
          onClose={handleModalClose}
          fullWidth
          maxWidth="sm"
        >
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
    </Container>
  );
}

function RenderForm({ selectedField, data, handleSave }) {
  if (!selectedField) return null; // Add this null check

  const input = {
    ...selectedField,
    data: {
      ...selectedField.data,
      defaultValue: data[selectedField.data.id],
      disability: selectedField.data.id === "hasDisability" && data.disability,
    },
  };
  return (
    <MainForm
      inputs={[input]}
      formTitle="تعديل"
      btnText="حفظ"
      onSubmit={handleSave}
      variant="outlined"
    ></MainForm>
  );
}

function RenderField({
  item,
  editMode,
  setItem,
  setOpenModal,
  data,
  setCurrentData,
}) {
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
  console.log(editMode, "editMode");
  return (
    <Fragment>
      <ListItem
        alignItems="flex-start"
        secondaryAction={
          editMode && (
            <Tooltip title="تعديل">
              <IconButton
                edge="end"
                onClick={() => {
                  setItem(item);
                  setOpenModal(true);
                  setCurrentData(data);
                }}
              >
                <Edit />
              </IconButton>
            </Tooltip>
          )
        }
      >
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
      </ListItem>
      <Divider variant="inset" component="li" />
    </Fragment>
  );
}

const Section = ({ children }) => (
  <Card sx={{ mb: 3 }}>
    <CardContent>
      <List>{children}</List>
    </CardContent>
  </Card>
);

function TabPanel({ children }) {
  return <Box sx={{ p: 0, py: 2 }}>{children}</Box>;
}

function EditableAvatar({ personalInfo, setPersonalInfo }) {
  const { user } = useAuth();
  const [editMode, setEditMode] = useState(false);
  function handleModalClose() {
    setEditMode(false);
  }
  const handleEditClick = () => {
    setEditMode(true);
  };
  const { setLoading } = useToastContext();
  const handleFileChange = async (event) => {
    console.log(event.avatar[0]);
    const file = event.avatar[0];
    const formData = new FormData();
    formData.append("avatar", file);
    const request = await handleRequestSubmit(
      formData,
      setLoading,
      "upload",
      true,
      "جاري رفع  ملفاتك"
    );
    if (request.status === 200) {
      const url = request.data.avatar;
      const saveAvatar = await handleRequestSubmit(
        { updateData: { avatar: url }, model: "avatar" },
        setLoading,
        `student/personal/${user.id}/`,
        false,
        "جاري الحفظ",
        null,
        "PUT"
      );
      if (saveAvatar.status === 200) {
        setPersonalInfo((prev) => ({
          ...prev,
          avatar: url,
        }));
        handleModalClose();
      }
    }
    setEditMode(false);
  };
  console.log(personalInfo, "personalInfo");
  return (
    <Box sx={{ position: "relative", mb: 3 }}>
      <Box
        sx={{
          height: 100,
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
        src={personalInfo.avatar}
      />
      {editMode ? (
        <Dialog
          open={editMode}
          onClose={handleModalClose}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>تعديل الصورة الشخصية</DialogTitle>
          <DialogContent>
            <MainForm
              inputs={[
                {
                  acceptOnly: "image",
                  data: {
                    id: "avatar",
                    label: "الصورة الشخصية",
                    type: "file",
                    pattern: {
                      required: true,
                      message: "هذه الخانة مطلوب",
                    },
                  },
                },
              ]}
              formTitle=""
              btnText="حفظ"
              onSubmit={handleFileChange}
              variant="outlined"
            ></MainForm>
          </DialogContent>
        </Dialog>
      ) : (
        <Tooltip title="Edit Avatar">
          <IconButton
            sx={{
              position: "absolute",
              bottom: -60,
              left: "calc(50% + 60px)",
              transform: "translateX(-50%)",
              backgroundColor: "white",
            }}
            onClick={handleEditClick}
          >
            <Edit />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
}

const BankInfoSection = ({ personalInfo, setPersonalInfo }) => {
  const [expanded, setExpanded] = useState(null);
  function handleExpandClick(index) {
    setExpanded(expanded === index ? null : index);
  }
  function handleAfterEdit(data) {
    setPersonalInfo((prevPersonalInfo) => {
      const updatedBankInfos = prevPersonalInfo.bankInfos.map((bankInfo) =>
        bankInfo.id === data.id ? { ...bankInfo, ...data } : bankInfo
      );
      return { ...prevPersonalInfo, bankInfos: updatedBankInfos };
    });
  }
  function handleAfterCreate(data) {
    setPersonalInfo((prevPersonalInfo) => ({
      ...prevPersonalInfo,
      bankInfos: [...prevPersonalInfo.bankInfos, data],
    }));
    return true;
  }
  return (
    <List
      sx={{
        width: "100%",
        maxWidth: 600,
        margin: "auto",
        bgcolor: "background.paper",
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      {personalInfo.bankInfos?.map((bankInfo, index) => (
        <React.Fragment key={index}>
          <ListItem
            button
            onClick={() => handleExpandClick(index)}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
            secondaryAction={
              <Box sx={{ display: "flex", gap: 0.5 }}>
                <EditModal
                  editButtonText={"تعديل"}
                  inputs={bankInfoInputs}
                  item={bankInfo}
                  checkChanges={true}
                  href="student/personal/bankinfo"
                  handleAfterEdit={handleAfterEdit}
                />
                <IconButton
                  edge="end"
                  onClick={() => handleExpandClick(index)}
                  aria-expanded={expanded === index}
                  aria-label="show more"
                >
                  {expanded === index ? <MdExpandLess /> : <MdExpandMore />}
                </IconButton>
              </Box>
            }
          >
            <MdAccountBalance size={24} style={{ marginLeft: 10 }} />
            <ListItemText
              primary={truncateText(bankInfo.bankName, MAX_LENGTH)}
              secondary={truncateText(bankInfo.bankAddress, MAX_LENGTH)}
            />
          </ListItem>
          <Collapse in={expanded === index} timeout="auto" unmountOnExit>
            <Card
              sx={{
                mx: 1,
                p: 2,
                mb: 2,
                mt: 1,
                borderRadius: 2,
                boxShadow: 2,
                backgroundColor: "#f9f9f9",
              }}
            >
              <CardContent>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  المستفيد: {bankInfo.beneficiaryName}
                </Typography>
                <Typography variant="subtitle2" gutterBottom>
                  <strong>اسم البنك:</strong> {bankInfo.bankName}
                </Typography>
                <Typography variant="subtitle2" gutterBottom>
                  <strong>عنوان البنك:</strong> {bankInfo.bankAddress}
                </Typography>
                <Typography variant="body2">
                  <strong>رقم الحساب:</strong> {bankInfo.accountNumber}
                </Typography>
                <Typography variant="body2">
                  <strong>رقم الآيبان:</strong> {bankInfo.iban}
                </Typography>
                <Typography variant="body2">
                  <strong>رمز الفرع:</strong> {bankInfo.branchCode}
                </Typography>
                <Typography variant="body2">
                  <strong>العملة:</strong> {bankInfo.currency}
                </Typography>
              </CardContent>
            </Card>
          </Collapse>
          <Divider />
        </React.Fragment>
      ))}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2, px: 2 }}>
        <CreateModal
          href="student/personal/bankinfo"
          handleSubmit={handleAfterCreate}
          inputs={bankInfoInputs}
          extraProps={{
            extraId: personalInfo.id,
            formTitle: "اضافة حساب بنكي جديد",
            btnText: "اضافة",
          }}
          label={"اضف حساب بنكي جديد"}
        />
      </Box>
    </List>
  );
};

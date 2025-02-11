import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  Grid2 as Grid,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  Paper,
  TabScrollButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import {
  MdSchool as School,
  MdGrade as Grade,
  MdHome as Home,
  MdAttachFile as AttachFile,
  MdPeople as People,
  MdCheckCircle as CheckCircle,
  MdCancel as Cancel,
  MdAccountBalance,
} from "react-icons/md";

import { renderFileLink } from "@/app/helpers/functions/utility";
import {
  GpaType,
  ParentStatus,
  ResidenceType,
  StudySource,
  StudyType,
  SupportType,
} from "@/app/helpers/constants";

export default function ApplicationDataView({ application }) {
  const [activeTab, setActiveTab] = useState(0);

  const {
    scholarshipInfo,
    academicPerformance,
    residenceInfo,
    supportingFiles,
    siblings,
    commitment,
    scholarshipTerms,
    bankInfo,
  } = application;
  console.log(application, "application");

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  const getScrollButtonDirection = (direction) => {
    return direction === "left" ? "left" : "right";
  };
  return (
    <Card
      variant="outlined"
      sx={{ p: { xs: 0, md: 2 }, borderRadius: "12px", mt: 2 }}
    >
      <CardContent>
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
          بيانات الطلب
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons
          allowScrollButtonsMobile
          sx={{ mb: 3 }}
          ScrollButtonComponent={(props) => (
            <TabScrollButton
              {...props}
              direction={getScrollButtonDirection(props.direction)}
            />
          )}
        >
          <Tab label="معلومات المنحة" icon={<School />} iconPosition="start" />
          <Tab label="الأداء الأكاديمي" icon={<Grade />} iconPosition="start" />
          <Tab label="معلومات السكن" icon={<Home />} iconPosition="start" />
          <Tab
            label="الملفات الداعمة"
            icon={<AttachFile />}
            iconPosition="start"
          />
          <Tab label="الأشقاء" icon={<People />} iconPosition="start" />
          <Tab label="التعهدات" icon={<CheckCircle />} iconPosition="start" />
          <Tab
            label="الحساب البنكي"
            icon={<MdAccountBalance />}
            iconPosition="start"
          />
        </Tabs>

        {activeTab === 0 && (
          <TabPanel>
            <Section title="معلومات المنحة">
              <InfoList
                items={[
                  {
                    label: "نوع الدعم المطلوب",
                    value:
                      SupportType[scholarshipInfo?.supportType] || "لا يوجد",
                  },
                  {
                    label: "الرسوم السنوية",
                    value: scholarshipInfo?.annualTuitionFee || "لا يوجد",
                  },
                  {
                    label: "المبلغ الممكن توفيره",
                    value: scholarshipInfo?.providedAmount || "لا يوجد",
                  },
                  {
                    label: "المبلغ المطلوب",
                    value: scholarshipInfo?.requestedAmount || "لا يوجد",
                  },
                ]}
              />
            </Section>
          </TabPanel>
        )}

        {activeTab === 1 && (
          <TabPanel>
            <Section title="الأداء الأكاديمي">
              <InfoList
                items={[
                  {
                    label: "نوع الدراسة",
                    value:
                      StudyType[academicPerformance?.typeOfStudy] || "لا يوجد",
                  },
                  {
                    label: "نوع المعدل",
                    value: GpaType[academicPerformance?.gpaType] || "لا يوجد",
                  },
                  {
                    label: "قيمة المعدل",
                    value: academicPerformance?.gpaValue || "لا يوجد",
                  },
                  {
                    label: "كشف الدرجات",
                    value: renderFileLink(academicPerformance?.transcript, ""),
                  },
                ]}
              />
              <GradeRecordsInfo
                gradeRecords={academicPerformance?.gradeRecords || []}
              />
            </Section>
          </TabPanel>
        )}

        {activeTab === 2 && (
          <TabPanel>
            <Section title="معلومات السكن">
              <InfoList
                items={[
                  {
                    label: "نوع السكن",
                    value:
                      ResidenceType[residenceInfo?.residenceType] || "لا يوجد",
                  },
                  {
                    label: "الدولة",
                    value: residenceInfo?.country || "لا يوجد",
                  },
                  {
                    label: "المدينة",
                    value: residenceInfo?.city || "لا يوجد",
                  },
                  {
                    label: "العنوان",
                    value: residenceInfo?.address || "لا يوجد",
                  },
                  {
                    label: "حالة الأب",
                    value:
                      ParentStatus[residenceInfo?.fatherStatus] || "غير متوفر",
                  },
                  {
                    label: "دخل الأب",
                    value: residenceInfo?.fatherIncome
                      ? `${residenceInfo.fatherIncome} USD`
                      : "غير متوفر",
                  },
                  {
                    label: "حالة الأم",
                    value:
                      ParentStatus[residenceInfo?.motherStatus] || "غير متوفر",
                  },
                  {
                    label: "دخل الأم",
                    value: residenceInfo?.motherIncome
                      ? `${residenceInfo.motherIncome} USD`
                      : "غير متوفر",
                  },
                  {
                    label: "إجمالي دخل الأسرة",
                    value: residenceInfo?.familyIncome
                      ? `${residenceInfo.familyIncome} USD`
                      : "غير متوفر",
                  },
                ]}
              />
            </Section>
          </TabPanel>
        )}

        {activeTab === 3 && (
          <TabPanel>
            <Section title="الملفات الداعمة">
              <InfoList
                items={[
                  {
                    label: "الهوية الشخصية",
                    value: renderFileLink(supportingFiles?.personalId, ""),
                  },
                  {
                    label: "وثيقة الطالب",
                    value: renderFileLink(supportingFiles?.studentDoc, ""),
                  },
                  {
                    label: "التقرير الطبي",
                    value: renderFileLink(supportingFiles?.medicalReport, ""),
                  },
                  {
                    label: "الصورة الشخصية",
                    value: renderFileLink(supportingFiles?.personalPhoto, ""),
                  },
                  {
                    label: "إثبات العنوان",
                    value: renderFileLink(supportingFiles?.proofOfAddress, ""),
                  },
                ]}
              />
            </Section>
          </TabPanel>
        )}

        {activeTab === 4 && (
          <TabPanel>
            <Section title="الأشقاء">
              <SiblingsInfo siblings={siblings} />
            </Section>
          </TabPanel>
        )}

        {activeTab === 5 && (
          <TabPanel>
            <Section title="التعهدات">
              <InfoList
                items={[
                  {
                    label: "الموافقة على التعهد",
                    value: commitment ? (
                      <Typography color="success.main">
                        <CheckCircle sx={{ verticalAlign: "middle" }} /> تم
                        الموافقة
                      </Typography>
                    ) : (
                      <Typography color="error.main">
                        <Cancel sx={{ verticalAlign: "middle" }} /> لم يتم
                        الموافقة
                      </Typography>
                    ),
                  },
                  {
                    label: "الموافقة على شروط المنحة",
                    value: scholarshipTerms ? (
                      <Typography color="success.main">
                        <CheckCircle sx={{ verticalAlign: "middle" }} /> تم
                        الموافقة
                      </Typography>
                    ) : (
                      <Typography color="error.main">
                        <Cancel sx={{ verticalAlign: "middle" }} /> لم يتم
                        الموافقة
                      </Typography>
                    ),
                  },
                ]}
              />
            </Section>
          </TabPanel>
        )}
        {activeTab === 6 && (
          <TabPanel>
            <Section title="الحساب البنكي">
              <InfoList
                items={[
                  {
                    label: "اسم المستفيد",
                    value: bankInfo?.beneficiaryName || "لا يوجد",
                  },
                  {
                    label: "اسم البنك",
                    value: bankInfo?.bankName || "لا يوجد",
                  },
                  {
                    label: "رمز الفرع",
                    value: bankInfo?.branchCode || "لا يوجد",
                  },
                  {
                    label: "عنوان البنك",
                    value: bankInfo?.bankAddress || "لا يوجد",
                  },
                  {
                    label: "رقم الحساب",
                    value: bankInfo?.accountNumber || "لا يوجد",
                  },
                  {
                    label: "العملة",
                    value: bankInfo?.currency || "لا يوجد",
                  },
                  {
                    label: "رقم الآيبان",
                    value: bankInfo?.iban || "لا يوجد",
                  },
                ]}
              />
            </Section>
          </TabPanel>
        )}
      </CardContent>
    </Card>
  );
}

// Helper Components

function TabPanel({ children }) {
  return <Box sx={{ p: 2 }}>{children}</Box>;
}

function Section({ title, children }) {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
        {title}
      </Typography>
      <Divider sx={{ mb: 2 }} />
      {children}
    </Box>
  );
}

function InfoList({ items }) {
  return (
    <List>
      <Grid container spacing={2}>
        {items.map(
          (item, index) =>
            item && (
              <Grid size={{ xs: 12, md: 6 }} key={index}>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText
                    primary={
                      <Typography variant="body1">
                        <strong>{item.label}:</strong> {item.value}
                      </Typography>
                    }
                  />
                </ListItem>
              </Grid>
            )
        )}
      </Grid>
    </List>
  );
}

function SiblingsInfo({ siblings }) {
  return (
    <TableContainer
      component={Paper}
      sx={{
        backgroundColor: "#ffffff",
        borderRadius: 2,
        boxShadow: 3, // Increase shadow for depth
        overflowX: "auto",
      }}
    >
      <Table>
        <TableHead>
          <TableRow>
            {[
              "الرقم",
              "الاسم",
              "العلاقة",
              "الجامعة",
              "الكلية",
              "القسم",
              "سنة الدراسة",
              "مصدر تغطية الدراسة",
              "مصدر المنحة",
              "قيمة المنحة",
              "الوثيقة",
            ].map((header, index) => (
              <TableCell
                key={index}
                align="center"
                sx={{
                  fontWeight: "bold",
                  backgroundColor: "#f8f9fa",
                  color: "#495057",
                  padding: "10px 20px", // Increase padding
                  borderBottom: "2px solid #dee2e6",
                }}
              >
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {siblings.length > 0 ? (
            siblings.map((sibling, index) => (
              <TableRow
                key={index}
                sx={{
                  "&:nth-of-type(odd)": { backgroundColor: "#fdfdfd" },
                  "&:nth-of-type(even)": { backgroundColor: "#f7f7f7" },
                }}
              >
                <TableCell align="center">{index + 1}</TableCell>
                <TableCell align="center">{sibling.name}</TableCell>
                <TableCell align="center">{sibling.relation}</TableCell>
                <TableCell align="center">{sibling.university}</TableCell>
                <TableCell align="center">{sibling.college}</TableCell>
                <TableCell align="center">{sibling.department}</TableCell>
                <TableCell align="center">{sibling.studyYear}</TableCell>
                <TableCell align="center">
                  {StudySource[sibling.sourceOfStudy]}
                </TableCell>
                <TableCell align="center">
                  {sibling.grantSource || "غير متوفر"}
                </TableCell>
                <TableCell align="center">
                  {sibling.grantAmount || "غير متوفر"}
                </TableCell>
                <TableCell align="center">
                  {renderFileLink(sibling.document, "")}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={11}
                align="center"
                sx={{ padding: "20px", fontSize: "16px", color: "#6c757d" }}
              >
                لا يوجد معلومات عن الأشقاء
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function GradeRecordsInfo({ gradeRecords }) {
  return (
    <div>
      <Typography
        variant="h6"
        sx={{ mb: 2, fontWeight: "bold", color: "#495057" }}
      >
        جدول سجلات الدرجات الأكاديمية
      </Typography>
      <TableContainer
        component={Paper}
        sx={{
          backgroundColor: "#ffffff",
          borderRadius: 2,
          boxShadow: 3, // Adds shadow for depth
          overflowX: "auto",
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              {["الوصف", "الرابط"].map((header, index) => (
                <TableCell
                  key={index}
                  align="center"
                  sx={{
                    fontWeight: "bold",
                    backgroundColor: "#f8f9fa",
                    color: "#495057",
                    padding: "10px 20px",
                    borderBottom: "2px solid #dee2e6",
                  }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {gradeRecords.length > 0 ? (
              gradeRecords.map((record, index) => (
                <TableRow
                  key={record.uniqueId || index}
                  sx={{
                    "&:nth-of-type(odd)": { backgroundColor: "#fdfdfd" },
                    "&:nth-of-type(even)": { backgroundColor: "#f7f7f7" },
                  }}
                >
                  <TableCell align="center">
                    {record.description || "غير متوفر"}
                  </TableCell>
                  <TableCell align="center">
                    {record.url
                      ? renderFileLink(record.url, "عرض الملف")
                      : "غير متوفر"}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={3}
                  align="center"
                  sx={{ padding: "20px", fontSize: "16px", color: "#6c757d" }}
                >
                  لا يوجد معلومات عن سجلات الدرجات
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

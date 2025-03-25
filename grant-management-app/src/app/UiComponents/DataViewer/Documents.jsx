"use client";
import React, { useState, useEffect } from "react";
import {
  Tabs,
  Tab,
  Box,
  CircularProgress,
  Typography,
  Container,
  Paper,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Snackbar,
} from "@mui/material";

import {
  MdContentCopy,
  MdFileCopy,
  MdInfo,
  MdQuestionAnswer,
} from "react-icons/md";
import { getData } from "@/app/helpers/functions/getData";
import CreateModal from "../models/CreateModal";
import EditModal from "../models/EditModal";
import { handleRequestSubmit } from "@/app/helpers/functions/handleSubmit";
import { FaEye } from "react-icons/fa";
import { useAuth } from "@/app/providers/AuthProvider";

const DocumentsPanel = ({ isAdmin }) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleChange = (_, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <Tabs value={activeTab} onChange={handleChange} centered>
        <Tab icon={<MdFileCopy />} label="ملفات الموقع" isAdmin={isAdmin} />
        <Tab icon={<MdInfo />} label="التعهد" isAdmin={isAdmin} />
        <Tab icon={<MdInfo />} label="شروط المنحه" isAdmin={isAdmin} />
        <Tab
          icon={<MdQuestionAnswer />}
          label="الاسئلة الشائعة"
          isAdmin={isAdmin}
        />
      </Tabs>

      <Box sx={{ p: 3 }}>
        {activeTab === 0 && <WebsiteDocuments />}
        {activeTab === 1 && <CommitmentGrantTerms type="COMMITMENT" />}
        {activeTab === 2 && <CommitmentGrantTerms type="GRANTTERMS" />}
        {activeTab === 3 && <FAQ />}
      </Box>
    </Box>
  );
};

const documentsInputs = [
  {
    data: {
      id: "title",
      label: "اسم الملف",
      type: "text",
      required: true,
    },
    pattern: {
      required: { value: true, message: "اسم الملف مطلوب" },
    },
  },
  {
    data: {
      id: "description",
      label: "وصف الملف",
      type: "text",
      required: true,
    },
    pattern: {
      required: { value: true, message: "اسم الملف مطلوب" },
    },
  },
  {
    data: { id: "url", type: "file", label: "الملف" },
    pattern: {
      required: {
        value: false, // Optional field
      },
    },
  },
];
function CopyTextButton({ text }) {
  const [open, setOpen] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setOpen(true);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <>
      <IconButton onClick={handleCopy} color="primary">
        <MdContentCopy size={24} />
      </IconButton>
      <Snackbar
        open={open}
        autoHideDuration={2000}
        onClose={() => setOpen(false)}
        message="تم نسخ النص!"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </>
  );
}
const WebsiteDocuments = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  async function handleBeforeSubmit(data) {
    if (Object.values(data.url).length === 0) {
      delete data.url;
      return data;
    }
    const formData = new FormData();
    formData.append("url", data.url[0]);
    const document = await handleRequestSubmit(
      formData,
      setLoading,
      "upload",
      true,
      "جاري رفع ملف "
    );
    if (document.status === 200) return { ...data, url: document.data.url };
  }

  useEffect(() => {
    async function getDocs() {
      const request = await getData({
        url: "shared/documents",
        setLoading,
      });
      if (request.status === 200) {
        setFiles(request.data);
      }
    }
    getDocs();
  }, []);
  if (loading) return <CircularProgress />;

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ padding: 3, mt: 3, borderRadius: 2 }}>
        <Typography
          variant="h5"
          gutterBottom
          textAlign="center"
          fontWeight={600}
        >
          ملفات الموقع
        </Typography>
        <List>
          {files.map((file) => (
            <ListItem
              key={file.id}
              divider
              secondaryAction={
                <Box display="flex" gap={0.5}>
                  <CopyTextButton text={file.url} />
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<FaEye />}
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Preview
                  </Button>
                  {user.role === "ADMIN" && (
                    <EditModal
                      editButtonText="تعديل"
                      handleBeforeSubmit={handleBeforeSubmit}
                      href="admin/documents"
                      inputs={documentsInputs}
                      item={file}
                      setData={setFiles}
                    />
                  )}
                </Box>
              }
            >
              <ListItemText primary={file.title} secondary={file.description} />
            </ListItem>
          ))}
        </List>
        {user.role === "ADMIN" && (
          <Box display="flex" justifyContent="center" mt={3}>
            <CreateModal
              href="admin/documents"
              handleBeforeSubmit={handleBeforeSubmit}
              inputs={documentsInputs}
              setData={setFiles}
              extraProps={{
                formTitle: "اضافة ملف جديد",
                btnText: "اضافة",
              }}
              label="اضف ملف جديد"
            />
          </Box>
        )}
      </Paper>
    </Container>
  );
};
const fixedDataInputs = [
  {
    data: {
      id: "content",
      label: "المحتوي",
      type: "textarea",
      required: true,
    },
    pattern: {
      required: { value: true, message: "المحتوي مطلوب" },
    },
  },
];
const CommitmentGrantTerms = ({ type }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  useEffect(() => {
    async function getTerms() {
      const request = await getData({
        url: "shared/fixed-data?type=" + type + "&",
        setLoading,
      });
      if (request.status === 200) {
        setData(request.data);
      }
    }
    getTerms();
  }, [type]);

  if (loading) return <CircularProgress />;

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ padding: 3, mt: 3, borderRadius: 2 }}>
        <Typography
          variant="h5"
          gutterBottom
          textAlign="center"
          fontWeight={600}
        >
          {type === "COMMITMENT" ? "تعهد" : "شروط المنحه"}
        </Typography>
        <List>
          {data?.map((item) => (
            <ListItem
              key={item.id}
              divider
              secondaryAction={
                <>
                  {user.role === "ADMIN" && (
                    <EditModal
                      editButtonText="تعديل"
                      href="admin/fixed-data"
                      inputs={fixedDataInputs}
                      item={item}
                      setData={setData}
                    />
                  )}
                </>
              }
            >
              <ListItemText
                primary={
                  <Typography
                    component="pre"
                    sx={{
                      textWrap: "auto",
                    }}
                  >
                    {item.content}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
        {user.role === "ADMIN" && (
          <Box display="flex" justifyContent="center" mt={3}>
            {data.length === 0 && (
              <CreateModal
                href={`admin/fixed-data?type=${type}&`}
                inputs={fixedDataInputs}
                setData={setData}
                extraProps={{
                  formTitle: `اضافة ${
                    type === "COMMITMENT" ? "تعهد" : "شروط المنحه"
                  }`,
                  btnText: "اضافة",
                }}
                label={`اضافة ${
                  type === "COMMITMENT" ? "تعهد" : "شروط المنحه"
                }`}
              />
            )}
          </Box>
        )}
      </Paper>
    </Container>
  );
};

const faqInputs = [
  {
    data: {
      id: "question",
      label: "السؤال",
      type: "text",
      required: true,
    },
    pattern: {
      required: { value: true, message: "السؤال مطلوب" },
    },
  },
  {
    data: {
      id: "answer",
      label: "الاجابة",
      type: "textarea",
      required: true,
    },
    pattern: {
      required: { value: true, message: "الاجابة مطلوبه" },
    },
  },
];
const FAQ = () => {
  const [faqList, setFaqList] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  useEffect(() => {
    async function getFaq() {
      const request = await getData({
        url: "shared/faqs",
        setLoading,
      });
      if (request.status === 200) {
        setFaqList(request.data);
      }
    }
    getFaq();
  }, []);

  if (loading) return <CircularProgress />;

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ padding: 3, mt: 3, borderRadius: 2 }}>
        <Typography
          variant="h5"
          gutterBottom
          textAlign="center"
          fontWeight={600}
        >
          الاسئلة الشائعة
        </Typography>
        <List>
          {faqList?.map((faq) => (
            <ListItem
              key={faq.id}
              divider
              secondaryAction={
                <>
                  {user.role === "ADMIN" && (
                    <EditModal
                      editButtonText="تعديل"
                      href="admin/faqs"
                      inputs={faqInputs}
                      item={faq}
                      setData={setFaqList}
                    />
                  )}
                </>
              }
            >
              <ListItemText
                primary={faq.question}
                secondary={
                  <Typography
                    component="pre"
                    sx={{
                      textWrap: "auto",
                    }}
                  >
                    {faq.answer}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
        {user.role === "ADMIN" && (
          <Box display="flex" justifyContent="center" mt={3}>
            <CreateModal
              href={`admin/faqs`}
              inputs={faqInputs}
              setData={setFaqList}
              extraProps={{
                formTitle: "اضافة سؤال جديد",
                btnText: "اضافة",
              }}
              label="اضافة سؤال جديد"
            />
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default DocumentsPanel;

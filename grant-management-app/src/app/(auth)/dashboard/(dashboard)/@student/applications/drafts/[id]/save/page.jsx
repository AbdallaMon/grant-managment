"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Alert,
  DialogActions,
  ListItem,
  List,
  FormControlLabel,
  Radio,
  ListItemText,
  RadioGroup,
  DialogContent,
  DialogTitle,
  Dialog,
} from "@mui/material";
import { getData } from "@/app/helpers/functions/getData";
import { useToastContext } from "@/app/providers/ToastLoadingProvider";
import { handleRequestSubmit } from "@/app/helpers/functions/handleSubmit";
import Link from "next/link";
import { useAuth } from "@/app/providers/AuthProvider";
import { MdOutlineAccountBalance } from "react-icons/md";

export default function ReviewSubmissionPage({ params: { id } }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const { setLoading: setSubmitLoading } = useToastContext();
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState();
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getData({
          url: `student/applications/${id}/submit`,
          setLoading,
        });
        setData(response.data || null); // Set the fetched data or null if no data
        setMessage(response.message);
        setLoading(false);
        console.log(response, "response");
        setError(response.error);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    }

    fetchData();
  }, []);
  function onClose() {
    setOpen(false);
  }
  const handleSaveAndSubmit = async (bankId) => {
    const request = await handleRequestSubmit(
      { bankId },
      setSubmitLoading,
      `student/applications/${id}/submit`,
      false,
      "جاري الحفظ"
    );
    if (request.status === 200) {
      setSubmitted(true);
    }
  };
  if (submitted) {
    return (
      <div>
        <Alert>تم العملية بنجاح</Alert>
        <Typography>تم حفظ البينانات وتم ارسالها الي الادارة بنجاح</Typography>
      </div>
    );
  }
  return (
    <Box sx={{ p: 4, textAlign: "center" }}>
      <ChooseABankModal
        handleSaveAndSubmit={handleSaveAndSubmit}
        onClose={onClose}
        open={open}
      />
      {loading ? (
        <Box display="flex" flexDirection="column" alignItems="center">
          <CircularProgress sx={{ mb: 2 }} />
          <Typography variant="h6">
            يتم مراجعة بياناتك والتأكد من أنك أتممت جميع الإجراءات
          </Typography>
        </Box>
      ) : data && data.length > 0 ? (
        <Box>
          <Alert severity={data.length > 0 ? "warning" : "info"}>
            {message}
          </Alert>
          <Typography variant="h5" my={3}>
            من فضلك قم بملئ البيانات التاليه
          </Typography>
          {data.map((item) => (
            <Box key={item.key} sx={{ mb: 2 }}>
              <Button variant="contained" component={Link} href={item.href}>
                {item.text}
              </Button>
            </Box>
          ))}
        </Box>
      ) : (
        <Box>
          <Alert severity={error ? "error" : "success"}>{message}</Alert>
          {error && <Typography>{error}</Typography>}
          {!error && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpen(true)}
            >
              حفظ البيانات وارسالها للمراجعه
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
}

function ChooseABankModal({ open, onClose, handleSaveAndSubmit }) {
  const { user } = useAuth();
  const [banks, setBanks] = useState([]);
  const [selectedBank, setSelectedBank] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getBanks() {
      const request = await getData({
        url: `student/banks?userId=${user.id}`,
        setLoading,
      });
      console.log(request, "reuq");
      if (request.status === 200) {
        setBanks(request.data);
      }
      setLoading(false);
    }
    if (open) {
      getBanks();
    }
  }, [open]);

  const handleSelectBank = (bankId) => {
    setSelectedBank(bankId);
  };

  const handleSubmit = () => {
    if (selectedBank) {
      handleSaveAndSubmit(selectedBank);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <MdOutlineAccountBalance size={24} style={{ marginRight: 8 }} />
        اختر حساب بنكي لربطه بالمنحه
      </DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <CircularProgress />
        ) : (
          <RadioGroup
            value={selectedBank}
            onChange={(e) => handleSelectBank(e.target.value)}
          >
            <List>
              {banks.map((bank) => (
                <ListItem
                  key={bank.id}
                  button
                  onClick={() => handleSelectBank(bank.id)}
                >
                  <FormControlLabel
                    value={bank.id}
                    control={<Radio />}
                    label={
                      <ListItemText
                        primary={bank.bankName}
                        secondary={`رقم الحساب: ${bank.accountNumber} | IBAN: ${bank.iban}`}
                      />
                    }
                  />
                </ListItem>
              ))}
            </List>
          </RadioGroup>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          إلغاء
        </Button>
        <Button onClick={handleSubmit} color="primary" disabled={!selectedBank}>
          حفظ
        </Button>
      </DialogActions>
    </Dialog>
  );
}

import { getData } from "@/app/helpers/functions/getData";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  List,
  ListItem,
  Modal,
  Paper,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import {
  MdAttachMoney,
  MdCalendarToday,
  MdClose,
  MdReceipt,
} from "react-icons/md";

export const PaymentHistoryModal = ({ payment }) => {
  const [open, setOpen] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  useEffect(() => {
    async function getInvoices() {
      const request = await getData({
        url: `shared/payments/${payment.id}/invoices`,
        setLoading,
      });
      if (request.status === 200) {
        setInvoices(request.data);
      }
    }
    if (open) {
      getInvoices();
    }
  }, [open]);

  return (
    <>
      <Button
        variant="contained"
        onClick={handleOpen}
        startIcon={<MdReceipt />}
        sx={{
          borderRadius: 1.5,
          textTransform: "none",
          fontWeight: 500,
        }}
      >
        رؤية تواريخ الدفع{" "}
      </Button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="payment-history-modal"
      >
        <Paper
          elevation={6}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 450, md: 550 },
            maxHeight: "80vh",
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 3,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              p: 2.5,
              bgcolor: "primary.main",
              color: "primary.contrastText",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
              تاريخ الدفع
            </Typography>
            <IconButton
              onClick={handleClose}
              size="small"
              sx={{ color: "white" }}
              aria-label="close"
            >
              <MdClose />
            </IconButton>
          </Box>

          {/* Body */}
          <Box sx={{ p: 0, maxHeight: "60vh", overflow: "auto" }}>
            {loading ? (
              <CircularProgress />
            ) : invoices && invoices.length > 0 ? (
              <List sx={{ pt: 0 }}>
                {invoices?.map((invoice, index) => (
                  <React.Fragment key={invoice.id || index}>
                    <ListItem
                      alignItems="flex-start"
                      sx={{
                        py: 2,
                        px: 3,
                        transition: "background-color 0.2s",
                        "&:hover": {
                          bgcolor: "action.hover",
                        },
                      }}
                    >
                      <Box sx={{ width: "100%" }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 1,
                          }}
                        >
                          <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: 600 }}
                          >
                            Invoice #{invoice.invoiceNumber}
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            mb: 0.5,
                            color: "text.secondary",
                          }}
                        >
                          <MdCalendarToday
                            size={16}
                            style={{ marginRight: 8 }}
                          />
                          <Typography variant="body2">
                            <strong>تاريخ الدفع :</strong>{" "}
                            {dayjs(invoice.paidAt).format("MMMM D, YYYY")}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            mb: 0.5,
                            color: "text.secondary",
                          }}
                        >
                          <MdCalendarToday
                            size={16}
                            style={{ marginRight: 8 }}
                          />
                          <Typography variant="body2">
                            <strong>تاريخ التسجيل علي الموقع :</strong>{" "}
                            {dayjs(invoice.createdAt).format("MMMM D, YYYY")}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            color: "text.secondary",
                          }}
                        >
                          <MdAttachMoney size={16} style={{ marginRight: 8 }} />
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            ${parseFloat(invoice.amount).toFixed(2)}
                          </Typography>
                        </Box>
                      </Box>
                    </ListItem>
                    {index < invoices.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Box sx={{ p: 4, textAlign: "center" }}>
                <Typography variant="body1" color="textSecondary">
                  No payment history available.
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>
      </Modal>
    </>
  );
};

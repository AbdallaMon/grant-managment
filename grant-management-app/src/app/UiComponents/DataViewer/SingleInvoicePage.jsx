"use client";
import React, {useRef, useEffect, useState, forwardRef, useCallback} from "react";
import {
    Box,
    Typography,
    Button,
    Container,
    Grid2 as Grid,
    Divider,
    Paper,
    CircularProgress,
    Alert,
} from "@mui/material";
import {useRouter} from "next/navigation";
import {useReactToPrint} from "react-to-print";
import {getData} from "@/app/helpers/functions/getData";
import dayjs from "dayjs";
import {GrantType} from "@/app/helpers/constants";

// InvoiceContent component wrapped in forwardRef
const InvoiceContent = forwardRef(({invoice}, ref) => {
    const {invoiceNumber, dueDate, amount, paidAt, payment} = invoice;
    const {userGrant} = payment || {};
    const {grant, user} = userGrant || {};
    const userFullName = user?.personalInfo?.basicInfo
          ? `${user.personalInfo.basicInfo.name} ${user.personalInfo.basicInfo.familyName}`
          : "غير متوفر";
    const userAddress = user?.personalInfo?.contactInfo?.address || "غير متوفر";

    return (
          <Box
                ref={ref}
                component={Paper}
                elevation={3}
                sx={{
                    padding: 4,
                    backgroundColor: "#ffffff",
                    marginTop: 2,
                    maxWidth: "600px",
                    border: "1px solid #ddd",
                    borderRadius: 2,
                    mx: "auto",
                    fontFamily: "Arial, sans-serif",
                }}
          >
              <style jsx global>{`
                @media print {
                  body {
                    direction: rtl;
                    font-family: "Arial", sans-serif; /* Customize as needed */
                  }
                  .MuiBox-root {
                    direction: rtl;
                    text-align: right;
                  }
                }
              `}</style>
              <Typography variant="h4" align="center" gutterBottom sx={{fontWeight: "bold"}}>
                  فاتورة
              </Typography>
              <Typography align="center" variant="subtitle1" sx={{fontWeight: "bold", color: "gray"}}>
                  رقم الفاتورة: #{invoiceNumber}
              </Typography>
              <Divider sx={{my: 2}}/>

              <Grid container spacing={3}>
                  {/* Customer and Invoice Details */}
                  <Grid size={12}>
                      <Typography variant="subtitle2" sx={{fontWeight: "bold", mt: 2}}>
                          تفاصيل الفاتورة
                      </Typography>
                  </Grid>
                  <Grid size={6}>
                      <Typography>تاريخ الاستحقاق: {dayjs(dueDate).format("DD/MM/YYYY")}</Typography>
                      <Typography>المبلغ: {amount.toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD"
                      })}</Typography>
                      {paidAt && <Typography>تاريخ الدفع: {dayjs(paidAt).format("DD/MM/YYYY")}</Typography>}
                  </Grid>
                  <Grid size={6}>
                      <Typography>اسم الطالب: {userFullName}</Typography>
                      <Typography>العنوان: {userAddress}</Typography>
                      <Typography>رقم الهاتف: {user?.personalInfo?.contactInfo?.phone || "غير متوفر"}</Typography>
                  </Grid>
              </Grid>

              <Divider sx={{my: 2}}/>

              <Grid container spacing={3}>
                  {/* Grant Details */}
                  <Grid size={12}>
                      <Typography variant="subtitle2" sx={{fontWeight: "bold"}}>تفاصيل المنحة</Typography>
                  </Grid>
                  <Grid size={6}>
                      <Typography>اسم المنحة: {grant?.name || "غير متوفر"}</Typography>
                  </Grid>
                  <Grid size={6}>
                      <Typography>نوع المنحة: {GrantType[grant?.type] || "غير متوفر"}</Typography>
                  </Grid>
              </Grid>

              <Divider sx={{my: 3}}/>
              <Box textAlign="center" mt={2}>
                  <Typography variant="body2" color="textSecondary">
                      يرجى الاحتفاظ بهذه الفاتورة للرجوع إليها مستقبلاً.
                  </Typography>
              </Box>
          </Box>
    );
});
InvoiceContent.displayName = "InvoiceContent";

// Main SingleInvoicePage component
const SingleInvoicePage = ({invoiceId, supervisor}) => {
    const router = useRouter();
    const componentRef = useRef(null);
    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        contentRef: componentRef,
        documentTitle: `فاتورة_${invoice?.invoiceNumber}`,
        removeAfterPrint: true,
    });

    // Fetch invoice data
    const fetchInvoice = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getData({
                url: `shared/invoices/${invoiceId}?role=${supervisor ? "SUPERVISOR" : "ADMIN"}&`,
                setLoading
            });
            setInvoice(response);
        } catch (error) {
            setError("فشل تحميل الفاتورة. يرجى المحاولة لاحقاً.");
        } finally {
            setLoading(false);
        }
    };

    // Load invoice data on component mount
    useEffect(() => {
        fetchInvoice();
    }, [invoiceId]);

    // Render loading state
    if (loading) return <Box display="flex" justifyContent="center" mt={4}><CircularProgress/></Box>;

    // Render error state
    if (error) return <Alert severity="error" sx={{mt: 2}}>{error}</Alert>;

    // Render if no invoice is found
    if (!invoice) return <Typography variant="h6" color="error">فاتورة غير موجودة</Typography>;

    return (
          <Container sx={{maxWidth: "750px", mx: "auto", mt: 4, padding: 2}}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Button variant="outlined" onClick={() => router.back()}>رجوع</Button>
                  <Button variant="contained" onClick={handlePrint}>طباعة الفاتورة</Button>
              </Box>
              <Divider sx={{mb: 3}}/>
              {invoice && <InvoiceContent ref={componentRef} invoice={invoice}/>}
          </Container>
    );
};

export default SingleInvoicePage;

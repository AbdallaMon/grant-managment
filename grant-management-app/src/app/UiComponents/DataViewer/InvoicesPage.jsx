"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Container,
  CircularProgress,
  Alert,
  Typography,
  Pagination,
  TextField,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import "dayjs/locale/ar";
import { useRouter } from "next/navigation";
import { getData } from "@/app/helpers/functions/getData";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Link from "next/link";

const locales = ["en-gb"];

dayjs.locale("en-gb");

const InvoicesPage = ({ isSupervisor = false }) => {
  const [invoices, setInvoices] = useState([]);
  const [filters, setFilters] = useState({
    dueDateFrom: null,
    dueDateTo: null,
    status: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalInvoices, setTotalInvoices] = useState(0);
  const pageSize = 2;

  const fetchInvoices = async () => {
    setLoading(true);
    setError(null);
    const query = new URLSearchParams({
      ...filters,
      dueDateFrom: filters.dueDateFrom ? filters.dueDateFrom.toISOString() : "",
      dueDateTo: filters.dueDateTo ? filters.dueDateTo.toISOString() : "",
      pageNumber: page,
      size: pageSize,
      role: isSupervisor ? "SUPERVISOR" : "ADMIN",
    }).toString();

    try {
      const response = await getData({
        url: `shared/invoices?${query}&`,
        setLoading,
      });
      setInvoices(response.invoices);
      setTotalInvoices(response.total);
    } catch (err) {
      setError("حدث خطأ أثناء تحميل الفواتير. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [filters, page]);

  const handleFilterChange = (key, value) => {
    setFilters((prevFilters) => ({ ...prevFilters, [key]: value }));
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={locales}>
      <Container>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 3 }}>
          <DatePicker
            label="تاريخ الاستحقاق من"
            inputFormat="DD/MM/YYYY"
            value={filters.dueDateFrom}
            onChange={(date) => handleFilterChange("dueDateFrom", date)}
            slotProps={{
              textField: {
                inputProps: {
                  placeholder: "DD/MM/YYYY",
                },
              },
            }}
          />
          <DatePicker
            label="تاريخ الاستحقاق إلى"
            inputFormat="DD/MM/YYYY"
            value={filters.dueDateTo}
            onChange={(date) => handleFilterChange("dueDateTo", date)}
            slotProps={{
              textField: {
                inputProps: {
                  placeholder: "DD/MM/YYYY",
                },
              },
            }}
          />
        </Box>

        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="200px"
          >
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : (
          <>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>رقم الفاتورة</TableCell>
                  <TableCell>رقم الدفعة</TableCell>
                  <TableCell>تاريخ الاستحقاق</TableCell>
                  <TableCell>تاريخ الدفع</TableCell>
                  <TableCell>المبلغ</TableCell>
                  <TableCell>الطالب</TableCell>
                  <TableCell>المنحة</TableCell>
                  <TableCell>عرض</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invoices?.length > 0 ? (
                  invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell>{invoice.invoiceNumber}</TableCell>
                      <TableCell>
                        <Button
                          component={Link}
                          href={`/dashboard/payments?paymentId=${invoice.payment.id}`}
                        >
                          #{invoice.payment.id}
                        </Button>
                      </TableCell>

                      <TableCell>
                        {dayjs(invoice.dueDate).format("DD/MM/YYYY")}
                      </TableCell>
                      <TableCell>
                        {dayjs(invoice.paidAt).format("DD/MM/YYYY")}
                      </TableCell>

                      <TableCell>{invoice.amount}</TableCell>
                      <TableCell>
                        {invoice.payment.userGrant.user.personalInfo.basicInfo
                          .name || "غير متوفر"}
                      </TableCell>
                      <TableCell>
                        {invoice.payment.userGrant.grant.name || "غير متوفر"}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          component={Link}
                          href={`/dashboard/invoices/${invoice.id}`}
                        >
                          عرض
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      لا توجد فواتير.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <Pagination
              count={Math.ceil(totalInvoices / pageSize)}
              page={page}
              onChange={handlePageChange}
              sx={{ display: "flex", justifyContent: "center", mt: 3 }}
            />
          </>
        )}
      </Container>
    </LocalizationProvider>
  );
};

export default InvoicesPage;

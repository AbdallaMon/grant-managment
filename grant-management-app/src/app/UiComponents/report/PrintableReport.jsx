import {
  Box,
  Typography,
  Paper,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
} from "@mui/material";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import {
  ApplicationStatus,
  GrantType,
  PaymentStatus,
  PayEveryENUM,
  ProgramType,
} from "@/app/helpers/constants";
import { styled } from "@mui/material/styles";

// Create styled components for print-friendly grid
const PrintGrid = styled(Box)({
  display: "flex",
  flexWrap: "wrap",
  gap: "16px",
  "@media print": {
    display: "flex",
    flexWrap: "wrap",
    gap: "16px",
  },
});

const PrintGridItem = styled(Box)(({ size }) => ({
  flex: `1 1 calc(100% - 16px)`,
  minWidth: `calc(100% - 16px)`,
  "@media (min-width: 900px)": {
    flex: `1 1 calc(${((size?.md || 12) * 100) / 12}% - 16px)`,
    minWidth: `calc(${((size?.md || 12) * 100) / 12}% - 16px)`,
  },
  "@media print": {
    flex: `1 1 calc(${((size?.md || 12) * 100) / 12}% - 16px)`,
    minWidth: `calc(${((size?.md || 12) * 100) / 12}% - 16px)`,
  },
}));
export const ApplicationReport = ({ application }) => {
  const formatDate = (date) => {
    return date ? format(new Date(date), "dd/MM/yyyy", { locale: ar }) : "-";
  };

  return (
    <Paper sx={{ p: 3, mb: 3, bgcolor: "background.default" }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          معلومات الطالب
        </Typography>
        <PrintGrid container spacing={2}>
          <PrintGridItem size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2">الاسم الكامل</Typography>
            <Typography>{application.student.name || "-"}</Typography>
          </PrintGridItem>
          <PrintGridItem size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2">البريد الإلكتروني</Typography>
            <Typography>{application.student.email}</Typography>
          </PrintGridItem>
          <PrintGridItem size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2">الجامعة</Typography>
            <Typography>
              {application.student.studyInfo?.university || "-"}
            </Typography>
          </PrintGridItem>
          <PrintGridItem size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2">الكلية</Typography>
            <Typography>
              {application.student.studyInfo?.college || "-"}
            </Typography>
          </PrintGridItem>
          <PrintGridItem size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2">القسم</Typography>
            <Typography>
              {application.student.studyInfo?.department || "-"}
            </Typography>
          </PrintGridItem>
          <PrintGridItem size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2">السنة الدراسية</Typography>
            <Typography>
              {application.student.studyInfo?.year || "-"}
            </Typography>
          </PrintGridItem>
          <PrintGridItem size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2">نوع الاختصاص</Typography>
            <Typography>
              {ProgramType[application.student.studyInfo?.programType] || "-"}
            </Typography>
          </PrintGridItem>
        </PrintGrid>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          معلومات الطلب
        </Typography>
        <PrintGrid container spacing={2}>
          <PrintGridItem size={{ xs: 12, md: 4 }}>
            <Typography variant="subtitle2">رقم الطلب</Typography>
            <Typography>{application.applicationId}</Typography>
          </PrintGridItem>
          <PrintGridItem size={{ xs: 12, md: 4 }}>
            <Typography variant="subtitle2">الحالة</Typography>
            <Chip
              label={ApplicationStatus[application.status]}
              color="primary"
              size="small"
            />
          </PrintGridItem>
          <PrintGridItem size={{ xs: 12, md: 4 }}>
            <Typography variant="subtitle2">تاريخ التقديم</Typography>
            <Typography>{formatDate(application.createdAt)}</Typography>
          </PrintGridItem>
        </PrintGrid>
      </Box>

      {/* Grants Information */}
      {application.grants.map((grant, index) => (
        <Box key={grant.id} sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            معلومات المنحة {index + 1}
          </Typography>

          <PrintGrid container spacing={2} sx={{ mb: 3 }}>
            <PrintGridItem size={{ xs: 12, md: 4 }}>
              <Typography variant="subtitle2">اسم المانح</Typography>
              <Typography>{grant.grantName}</Typography>
            </PrintGridItem>
            <PrintGridItem size={{ xs: 12, md: 4 }}>
              <Typography variant="subtitle2">نوع المنحة</Typography>
              <Typography>{GrantType[grant.grantType]}</Typography>
            </PrintGridItem>
            <PrintGridItem size={{ xs: 12, md: 4 }}>
              <Typography variant="subtitle2">المبلغ الإجمالي</Typography>
              <Typography>${grant.totalAmount.toFixed(2)}</Typography>
            </PrintGridItem>
            <PrintGridItem size={{ xs: 12, md: 4 }}>
              <Typography variant="subtitle2">تاريخ البداية</Typography>
              <Typography>{formatDate(grant.startDate)}</Typography>
            </PrintGridItem>
            <PrintGridItem size={{ xs: 12, md: 4 }}>
              <Typography variant="subtitle2">تاريخ النهاية</Typography>
              <Typography>{formatDate(grant.endDate)}</Typography>
            </PrintGridItem>
            <PrintGridItem size={{ xs: 12, md: 4 }}>
              <Typography variant="subtitle2">جدول الدفع</Typography>
              <Typography>{PayEveryENUM[grant.paymentSchedule]}</Typography>
            </PrintGridItem>
          </PrintGrid>

          {/* Payments Table */}
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>تاريخ الاستحقاق</TableCell>
                  <TableCell>المبلغ</TableCell>
                  <TableCell>المبلغ المدفوع</TableCell>
                  <TableCell>الحالة</TableCell>
                  <TableCell>تاريخ الدفع</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {grant.payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>{formatDate(payment.dueDate)}</TableCell>
                    <TableCell>${payment.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      {payment.amountPaid
                        ? `$${payment.amountPaid.toFixed(2)}`
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={PaymentStatus[payment.status]}
                        color={
                          payment.status === "PAID" ? "success" : "warning"
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{formatDate(payment.paidAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Grant Summary */}
          <Box
            sx={{ mt: 2, p: 2, bgcolor: "background.paper", borderRadius: 1 }}
          >
            <PrintGrid container spacing={2}>
              <PrintGridItem size={{ xs: 12, md: 4 }}>
                <Typography variant="subtitle2">إجمالي المدفوع</Typography>
                <Typography color="success.main">
                  $
                  {grant.payments
                    .reduce((sum, p) => sum + (p.amountPaid || 0), 0)
                    .toFixed(2)}
                </Typography>
              </PrintGridItem>
              <PrintGridItem size={{ xs: 12, md: 4 }}>
                <Typography variant="subtitle2">إجمالي المتبقي</Typography>
                <Typography color="warning.main">
                  $
                  {grant.payments
                    .reduce(
                      (sum, p) => sum + (p.status !== "PAID" ? p.amount : 0),
                      0
                    )
                    .toFixed(2)}
                </Typography>
              </PrintGridItem>
              <PrintGridItem size={{ xs: 12, md: 4 }}>
                <Typography variant="subtitle2">نسبة الإنجاز</Typography>
                <Typography>
                  {Math.round(
                    (grant.payments.filter((p) => p.status === "PAID").length /
                      grant.payments.length) *
                      100
                  )}
                  %
                </Typography>
              </PrintGridItem>
            </PrintGrid>
          </Box>
        </Box>
      ))}
    </Paper>
  );
};

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { PaymentStatus } from "@/app/helpers/constants";

export const exportToExcel = (reportData) => {
  if (!reportData || !reportData.report) return;

  const flattenedData = reportData.report.flatMap((application) => {
    return application.grants.flatMap((grant) => {
      return grant.payments.map((payment) => ({
        "رقم الطلب": application.applicationId,
        "اسم الطالب": application.student.name,
        "البريد الإلكتروني": application.student.email,
        الجامعة: application.student.studyInfo?.university,
        الكلية: application.student.studyInfo?.college,
        القسم: application.student.studyInfo?.department,
        "السنة الدراسية": application.student.studyInfo?.year,
        "اسم المنحة": grant.grantName,
        "نوع المنحة": grant.grantType,
        "المبلغ الإجمالي": grant.totalAmount,
        "تاريخ الاستحقاق": payment.dueDate,
        المبلغ: payment.amount,
        "المبلغ المدفوع": payment.amountPaid || 0,
        الحالة: PaymentStatus[payment.status],
        "تاريخ الدفع": payment.paidAt || "",
      }));
    });
  });

  const worksheet = XLSX.utils.json_to_sheet(flattenedData, { RTL: true });
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "تقرير المنح");

  // Generate buffer
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const data = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
  });

  // Save file
  saveAs(data, `تقرير_المنح_${new Date().toISOString().split("T")[0]}.xlsx`);
};

import PaymentTable from "@/app/UiComponents/admin/PaymentTable";

export default function OverduePayments() {
  return <PaymentTable paymentStatus="OVERDUE" />;
}

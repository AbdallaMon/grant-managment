import SingleInvoicePage from "@/app/UiComponents/DataViewer/SingleInvoicePage";

export default function page({params: {invoiceId}}) {
    return <SingleInvoicePage invoiceId={invoiceId} supervisor={true}/>
}
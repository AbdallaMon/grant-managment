import ProfileComponent from "@/app/UiComponents/DataViewer/ProfileComponent";

export const metadata = {
    title: "البيانات الشخصية"
}
export default function Page({params: {id}}) {
    return (<ProfileComponent isApplication={true} id={id}/>)
}
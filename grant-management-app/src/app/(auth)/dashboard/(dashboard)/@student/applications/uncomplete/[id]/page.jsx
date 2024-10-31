import UserProfile from "@/app/UiComponents/DataViewer/UserProfile";

export const metadata = {
    title: "البيانات الشخصية"
}
export default function Page({params: {id}}) {
    return (<UserProfile isApplication={true} id={id}/>)
}
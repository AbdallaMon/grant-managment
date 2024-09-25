import ProfileComponent from "@/app/UiComponents/DataViewer/ProfileComponent";

export default function Page({params: {id}}) {
    return (<ProfileComponent isApplication={true} id={id}/>)
}
"use client"
import React from "react";
import SiblingsPage from "@/app/UiComponents/student/SiblingPage";
import ImprovementRequestsByModel
    from "@/app/(auth)/dashboard/(dashboard)/@student/applications/uncomplete/ImprovementRequest";

export default function Siblings({params: {id}}) {


    return <>
        <ImprovementRequestsByModel appId={id}/>

        <SiblingsPage route={"uncomplete"} id={id} extraParams="status=UN_COMPLETE&"/>
    </>
}

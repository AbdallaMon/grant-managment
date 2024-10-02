"use client"
import React from "react";
import SiblingsPage from "@/app/UiComponents/student/SiblingPage";

export default function Siblings({params: {id}}) {

    return <SiblingsPage route={"drafts"} id={id}/>
}

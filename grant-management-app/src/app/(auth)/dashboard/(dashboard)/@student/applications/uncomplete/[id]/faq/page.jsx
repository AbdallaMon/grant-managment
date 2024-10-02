"use client";
import React from "react";

import FAQPage from "@/app/UiComponents/student/Faq";

// Fake FAQ Data

export default function Page({params: {id}}) {
    return <FAQPage id={id} route={"uncomplete"}/>
}

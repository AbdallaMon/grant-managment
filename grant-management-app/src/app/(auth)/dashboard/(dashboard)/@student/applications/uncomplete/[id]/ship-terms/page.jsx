"use client";

import ScholarshipTermsForm from "@/app/UiComponents/student/ScholarshipTermsForm";

export default function page({params: {id}}) {

    return <ScholarshipTermsForm id={id} extraParams={"status=UN_COMPLETE&"}/>
}

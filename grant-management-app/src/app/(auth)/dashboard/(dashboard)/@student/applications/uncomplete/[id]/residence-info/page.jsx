"use client";

import ResidenceInfo from "@/app/UiComponents/student/ResidenceInfo";
import ImprovementRequestsByModel
    from "@/app/(auth)/dashboard/(dashboard)/@student/applications/uncomplete/ImprovementRequest";

export default function page({params: {id}}) {

    return (
          <>
              <ImprovementRequestsByModel appId={id}/>
              <ResidenceInfo id={id} extraParams={"status=UN_COMPLETE&"}/>
          </>
    )
}

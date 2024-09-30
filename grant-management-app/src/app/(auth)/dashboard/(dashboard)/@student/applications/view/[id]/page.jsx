"use client"
import CheckIfApplicationAllowed from "@/app/UiComponents/feedback/CheckIfApplicationAllowed";
import ApplicationWithProfileViewer from "@/app/UiComponents/admin/ApplicationWIthProfileViewer";
import {useAuth} from "@/app/providers/AuthProvider";

export default function PAGE({params}) {
    const {user} = useAuth()
    return (
          <CheckIfApplicationAllowed appId={params.id} appStatus={"APPROVED"}>
              <ApplicationWithProfileViewer isStudent={true} item={{studentId: user.id, id: params.id}}/>

          </CheckIfApplicationAllowed>
    )
}

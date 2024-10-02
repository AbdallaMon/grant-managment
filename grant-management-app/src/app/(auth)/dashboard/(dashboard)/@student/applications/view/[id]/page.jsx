"use client"
import CheckIfApplicationAllowed from "@/app/UiComponents/feedback/CheckIfApplicationAllowed";
import ApplicationWithProfileViewer from "@/app/UiComponents/admin/ApplicationWIthProfileViewer";
import {useAuth} from "@/app/providers/AuthProvider";
import UserGrantsView from "@/app/UiComponents/DataViewer/UserGrantsView";

export default function PAGE({params}) {
    const {user} = useAuth()
    return (
          <CheckIfApplicationAllowed appId={params.id} appStatus={"APPROVED"}>
              <UserGrantsView item={{id: params.id}} route="student/applications" isStudent={true}/>
              <ApplicationWithProfileViewer isStudent={true} item={{studentId: user.id, id: params.id}}/>
          </CheckIfApplicationAllowed>
    )
}

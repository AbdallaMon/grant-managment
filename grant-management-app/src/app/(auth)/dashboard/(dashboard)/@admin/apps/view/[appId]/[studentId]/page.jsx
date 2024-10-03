"use client"
import ApplicationWithProfileViewer from "@/app/UiComponents/admin/ApplicationWIthProfileViewer";
import UserGrantsView from "@/app/UiComponents/DataViewer/UserGrantsView";
import {Container} from "@mui/material";

export default function page({params}) {
    return (
          <Container maxWidth="xxl" px={3}>
              <UserGrantsView item={{id: params.appId}} route="shared/grants/applications/student"/>
              <ApplicationWithProfileViewer item={{id: params.appId, studentId: params.studentId}}
                                            route="shared/grants/applications"
                                            isAdmin={true}
              />
          </Container>
    )
}

"use client"
import ApplicationWithProfileViewer from "@/app/UiComponents/admin/ApplicationWIthProfileViewer";
import {Container} from "@mui/material";

export default function page({params}) {
    return (
          <Container maxWidth="xxl" px={3}>
              <ApplicationWithProfileViewer item={{id: params.appId, studentId: params.studentId}}
                                            route="shared/grants/applications"
                                            isAdmin={true}
                                            withUserGrant={true}
                                            userGrantRoute={"shared/grants/applications/student"}
                                            userGrantItem={{id: params.appId}}
              />
          </Container>
    )
}

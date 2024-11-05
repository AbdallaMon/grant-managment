"use client"
import ApplicationWithProfileViewer from "@/app/UiComponents/admin/ApplicationWIthProfileViewer";
import UserGrantsView from "@/app/UiComponents/DataViewer/UserGrantsView";
import {Container} from "@mui/material";
import DrawerWithContent from "@/app/UiComponents/DataViewer/DrawerWithContent";
import AddAGrant from "@/app/UiComponents/admin/AddAGrant";
import React from "react";

export default function page({params}) {
    return (
          <Container maxWidth="xl" px={3}>
              <ApplicationWithProfileViewer item={{id: params.appId, studentId: params.studentId}}
                                            route="shared/grants/applications" isAdmin={false}
                                            rerender={true}
                                            withUserGrant={true}
                                            userGrantRoute={"shared/grants/applications/student"}
                                            userGrantItem={{id: params.appId, userId: params.studentId}}
              />
          </Container>
    )
}

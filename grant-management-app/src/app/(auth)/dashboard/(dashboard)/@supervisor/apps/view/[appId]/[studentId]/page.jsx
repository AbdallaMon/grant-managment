"use client"
import ApplicationWithProfileViewer from "@/app/UiComponents/admin/ApplicationWIthProfileViewer";
import UserGrantsView from "@/app/UiComponents/DataViewer/UserGrantsView";
import {Container} from "@mui/material";
import DrawerWithContent from "@/app/UiComponents/DataViewer/DrawerWithContent";
import AddAGrant from "@/app/UiComponents/admin/AddAGrant";
import React from "react";

export default function page({params}) {

    return (
          <Container maxWidth="xxl" px={3}>
              <UserGrantsView item={{id: params.appId, userId: params.studentId}}
                              route="shared/grants/applications/student"/>
              <ApplicationWithProfileViewer item={{id: params.appId, studentId: params.studentId}}
                                            route="shared/grants/applications" isAdmin={false}
                                            rerender={true}
              />
          </Container>
    )
}

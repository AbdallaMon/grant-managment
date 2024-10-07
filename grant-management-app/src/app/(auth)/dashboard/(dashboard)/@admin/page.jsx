import OverviewStats from "@/app/UiComponents/dashboard/admin/OverviewStatus";
import {Box, Container} from "@mui/material";
import {Masonry} from "@mui/lab";
import RecentActivities from "@/app/UiComponents/dashboard/admin/RecentActivities";
import React from "react";

const DashboardPage = () => {
    return (
          <Container maxWidth="xl">
              <Box sx={{my: 4}}>
                  <Masonry columns={{xs: 1, md: 2}} spacing={2}>

                      <OverviewStats/>
                      <RecentActivities/>

                  </Masonry>

              </Box>
          </Container>
    );
};

export default DashboardPage;

import OverviewStats from "@/app/UiComponents/dashboard/admin/OverviewStatus";
import {Box, Container} from "@mui/material";
import {Masonry} from "@mui/lab";
import RecentActivities from "@/app/UiComponents/dashboard/admin/RecentActivities";
import React from "react";

const DashboardPage = () => {
    return (
          <Box sx={{my: 4, px: {xs: 2, md: 3}, background: "background.default"}}>
              <Masonry columns={{xs: 1, md: 2, xxl: 3}} spacing={2}>

                  <OverviewStats/>
                  <RecentActivities/>

              </Masonry>

          </Box>

    );
};

export default DashboardPage;

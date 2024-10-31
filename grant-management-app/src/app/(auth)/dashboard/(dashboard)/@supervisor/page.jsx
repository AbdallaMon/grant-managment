"use client"
import {Masonry} from "@mui/lab";
import {Box, Container} from "@mui/material";
import SupervisorApplicationsStats from "@/app/UiComponents/dashboard/supervisor/SupervisorApplicationsStats";
import SupervisorPaymentsOverview from "@/app/UiComponents/dashboard/supervisor/SupervisorPaymentsOverview";
import SupervisorPaymentsStats from "@/app/UiComponents/dashboard/supervisor/SupervisorPaymentsStats";
import SupervisorStudentsList from "@/app/UiComponents/dashboard/supervisor/SupervisorStudentsList";

export default function SupervisorPage() {
    return <>
        <>
            <Box sx={{my: 4}}>
                
                <Masonry columns={{xs: 1, md: 2}} spacing={2}>
                    <SupervisorStudentsList/>
                    <SupervisorPaymentsOverview/>
                    <SupervisorApplicationsStats/>
                    <SupervisorPaymentsStats/>
                </Masonry>
            </Box>
        </>
    </>
}
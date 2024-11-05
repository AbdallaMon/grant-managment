"use client"
import {Masonry} from "@mui/lab";
import {Box, Container} from "@mui/material";
import StudentApplicationsStats from "@/app/UiComponents/dashboard/student/StudentApplicationsStats";
import StudentGrantsStats from "@/app/UiComponents/dashboard/student/StudentGrantsStats";
import StudentNextPayments from "@/app/UiComponents/dashboard/student/StudentNextPayments";
import StudentRecentInvoices from "@/app/UiComponents/dashboard/student/StudentRecentInvoices";

export default function SupervisorPage() {
    return <>
        <>
            <Container maxWidth="xl" sx={{p: 0}}>
                <Box sx={{my: 4}}>
                    <Masonry columns={{xs: 1, md: 2}} spacing={2}>
                        <StudentApplicationsStats/>
                        <StudentGrantsStats/>
                        <StudentNextPayments/>
                        <StudentRecentInvoices/>
                    </Masonry>
                </Box>
            </Container>
        </>
    </>
}
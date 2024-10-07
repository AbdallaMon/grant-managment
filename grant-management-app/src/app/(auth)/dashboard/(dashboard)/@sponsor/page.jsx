"use client"
import {Masonry} from "@mui/lab";
import {Box, Container} from "@mui/material";
import SponsorGrantsStats from "@/app/UiComponents/dashboard/sponsor/SponsorGrantsStats";
import SponsorStudentsList from "@/app/UiComponents/dashboard/sponsor/SponsorStudentsList";
import SponsorNextPayments from "@/app/UiComponents/dashboard/sponsor/SponsorNextPayments";
import SponsorRecentInvoices from "@/app/UiComponents/dashboard/sponsor/SponsorRecentInvoices";

export default function SupervisorPage() {
    return <>
        <Container maxWidth="xl">
            <Box sx={{my: 4}}>
                <Masonry columns={{xs: 1, md: 2}} spacing={2}>
                    <SponsorGrantsStats/>
                    <SponsorStudentsList/>
                    <SponsorNextPayments/>
                    <SponsorRecentInvoices/>
                </Masonry>
            </Box>
        </Container>
    </>
}
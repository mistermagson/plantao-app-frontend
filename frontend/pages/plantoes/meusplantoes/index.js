import { useMemo } from "react";

import dynamic from "next/dynamic";

// @mui material components
import Grid from "@mui/material/Grid";

// NextJS Material Dashboard 2 PRO components
import MDBox from "/components/MDBox";

// NextJS Material Dashboard 2 PRO examples
import DashboardLayout from "/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "/examples/Navbars/DashboardNavbar";
import Footer from "/examples/Footer";
import EventCalendar from "/examples/Calendar";

// Calendar application components
import Header from "/pagesComponents/applications/calendar/components/Header";
import NextEvents from "/pagesComponents/applications/calendar/components/NextEvents";
import ProductivityChart from "/pagesComponents/applications/calendar/components/ProductivityChart";

// Data
import calendarEventsData from "/pagesComponents/applications/calendar/data/calendarEventsData";

function Meusplantoes() {
    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox pt={3}>
                <Grid container spacing={3}>
                    <Grid item xs={12} xl={9} sx={{ height: "max-content" }}>
                        {useMemo(
                            () => (
                                <EventCalendar
                                    initialView="dayGridMonth"
                                    initialDate="2021-08-10"
                                    events={calendarEventsData}
                                    selectable
                                    editable
                                />
                            ),
                            // eslint-disable-next-line react-hooks/exhaustive-deps
                            [calendarEventsData],
                        )}
                    </Grid>
                    <Grid item xs={12} xl={3}>
                        <MDBox mb={3}>
                            <NextEvents />
                        </MDBox>
                    </Grid>
                </Grid>
            </MDBox>
            <Footer />
        </DashboardLayout>
    );
}
export default Meusplantoes;
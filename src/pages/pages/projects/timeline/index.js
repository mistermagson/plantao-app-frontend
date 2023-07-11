/**
=========================================================
* NextJS Material Dashboard 2 PRO - v2.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/nextjs-material-dashboard-pro
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Grid from "@mui/material/Grid";

// NextJS Material Dashboard 2 PRO components
import MDBox from "/src/components/MDBox";

// NextJS Material Dashboard 2 PRO examples
import DashboardLayout from "/src/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "/src/examples/Navbars/DashboardNavbar";
import Footer from "/src/examples/Footer";
import TimelineList from "/src/examples/Timeline/TimelineList";
import TimelineItem from "/src/examples/Timeline/TimelineItem";

// Data
import timelineData from "/src/pagesComponents/pages/projects/timeline/data/timelineData";

function Timeline() {
  const renderTimelineItems = timelineData.map(
    ({ color, icon, title, dateTime, description, badges, lastItem }) => (
      <TimelineItem
        key={title + color}
        color={color}
        icon={icon}
        title={title}
        dateTime={dateTime}
        description={description}
        badges={badges}
        lastItem={lastItem}
      />
    ),
  );

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox my={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={6}>
            <TimelineList title="Timeline with dotted line">
              {renderTimelineItems}
            </TimelineList>
          </Grid>
          <Grid item xs={12} lg={6}>
            <TimelineList title="Timeline with dotted line" dark>
              {renderTimelineItems}
            </TimelineList>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Timeline;

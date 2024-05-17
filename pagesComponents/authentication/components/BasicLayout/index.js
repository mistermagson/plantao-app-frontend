
// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Grid from "@mui/material/Grid";

// NextJS Material Dashboard 2 PRO components
import MDBox from "/components/MDBox";

// NextJS Material Dashboard 2 PRO examples

import PageLayout from "/examples/LayoutContainers/PageLayout";

function BasicLayout({  children }) {


  return (
    <PageLayout>

      <MDBox
        position="absolute"
        width="100%"
        minHeight="100vh"

      />
      <MDBox px={1} width="100%" height="100vh" mx="auto">
        <Grid
          container
          spacing={1}
          justifyContent="center"
          alignItems="center"
          height="100%"
        >
          <Grid item xs={11} sm={9} md={5} lg={4} xl={3}>
            {children}
          </Grid>
        </Grid>
      </MDBox>

    </PageLayout>
  );
}

// Typechecking props for the BasicLayout
BasicLayout.propTypes = {

  children: PropTypes.node.isRequired,
};

export default BasicLayout;

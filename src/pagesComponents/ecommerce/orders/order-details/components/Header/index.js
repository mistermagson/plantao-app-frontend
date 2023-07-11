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

// NextJS Material Dashboard 2 PRO components
import MDBox from "/src/components/MDBox";
import MDTypography from "/src/components/MDTypography";
import MDButton from "/src/components/MDButton";

function Header() {
  return (
    <MDBox display="flex" justifyContent="space-between" alignItems="center">
      <MDBox>
        <MDBox mb={1}>
          <MDTypography variant="h6" fontWeight="medium">
            Order Details
          </MDTypography>
        </MDBox>
        <MDTypography component="p" variant="button" color="text">
          Order no. <b>241342</b> from
          <b>23.02.2021</b>
        </MDTypography>
        <MDTypography
          component="p"
          variant="button"
          fontWeight="regular"
          color="text"
        >
          Code: <b>KF332</b>
        </MDTypography>
      </MDBox>
      <MDButton variant="gradient" color="dark">
        invoice
      </MDButton>
    </MDBox>
  );
}

export default Header;

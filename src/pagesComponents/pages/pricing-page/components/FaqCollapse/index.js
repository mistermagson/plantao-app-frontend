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

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Icon from "@mui/material/Icon";
import Collapse from "@mui/material/Collapse";

// NextJS Material Dashboard 2 PRO components
import MDBox from "/src/components/MDBox";
import MDTypography from "/src/components/MDTypography";

// NextJS Material Dashboard 2 PRO components
import borders from "/public/assets/theme/base/borders";

function FaqCollapse({ title, open, children, ...rest }) {
  const { borderWidth, borderColor } = borders;

  return (
    <MDBox mb={2}>
      <MDBox
        {...rest}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        p={2}
        borderBottom={`${borderWidth[1]} solid ${borderColor}`}
        sx={{ cursor: "pointer" }}
      >
        <MDTypography
          variant="h5"
          color={open ? "dark" : "text"}
          sx={{ userSelect: "none" }}
        >
          {title}
        </MDTypography>
        <MDBox color={open ? "dark" : "text"}>
          <Icon sx={{ fontWeight: "bold" }} fontSize="small">
            {open ? "remove" : "add"}
          </Icon>
        </MDBox>
      </MDBox>
      <Collapse timeout={400} in={open}>
        <MDBox p={2} lineHeight={1}>
          <MDTypography
            variant="button"
            color="text"
            opacity={0.8}
            fontWeight="regular"
          >
            {children}
          </MDTypography>
        </MDBox>
      </Collapse>
    </MDBox>
  );
}

// Typechecking props for the FaqCollapse
FaqCollapse.propTypes = {
  title: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
};

export default FaqCollapse;

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

import { useEffect } from "react";

import { useRouter } from "next/router";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// NextJS Material Dashboard 2 PRO components
import MDBox from "/components/MDBox";

// NextJS Material Dashboard 2 PRO context
import { useMaterialUIController, setLayout } from "/context";
import AuthCheck from "../../../context/AuthCheck";
import Sidenav from "../../Sidenav";
import brandDark from "../../../assets/images/logo-ct-dark.png";
import brandWhite from "/assets/images/logo-ct.png";

import {adminRoutes, routes} from "../../../routes";
import {useCookies} from "react-cookie";

function DashboardLayout({ children }) {
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav } = controller;
  const { pathname } = useRouter();
  const [cookies, setCookies] = useCookies(["user_tipo"]);


  useEffect(() => {
    setLayout(dispatch, "dashboard");
  }, [dispatch, pathname]);

  return (
<>
    <Sidenav
    brand={brandWhite}
    brandName="Plantao Juizes App"
    routes={cookies.user_tipo === 'admin'? adminRoutes : routes}
    />
      <MDBox
      sx={({ breakpoints, transitions, functions: { pxToRem } }) => ({
        p: 3,
        position: "relative",

        [breakpoints.up("xl")]: {
          marginLeft: miniSidenav ? pxToRem(120) : pxToRem(274),
          transition: transitions.create(["margin-left", "margin-right"], {
            easing: transitions.easing.easeInOut,
            duration: transitions.duration.standard,
          }),
        },
      })}
    >
      {children}
    </MDBox>
</>
  );

}

// Typechecking props for the DashboardLayout
DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DashboardLayout;

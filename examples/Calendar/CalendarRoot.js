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
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";

export default styled(Box)(({ theme, ownerState }) => {
  const { palette, typography, functions, boxShadows } = theme;
  const { darkMode } = ownerState;

  const { white, dark, light, grey, gradients, info } = palette;
  const {
    size,
    fontWeightMedium,
    fontWeightBold,
    fontWeightRegular,
    fontWeightLight,
  } = typography;
  const { linearGradient, pxToRem } = functions;
  const { md } = boxShadows;

  return {
    height: "50%",


    "& .fc-media-screen": {
      height: "80%",
      color: dark.main,
    },

    "& .fc-theme-standard .fc-scrollgrid": {
      border: "none",
    },

    "& .fc-theme-standard thead tr th": {
      borderLeft: "none",
      borderRight: "none",

    },

    "& .fc-theme-standard td, .fc-theme-standard th": {
      //borderColor: light.main,
    },

    "& .fc th": {
      textAlign: "center",
    },

    "& .fc .fc-col-header-cell-cushion": {
      fontSize: size.lg,
      fontWeight: fontWeightMedium,
      color: darkMode ? white.main : grey[600],
    },

    "& .fc .fc-daygrid-day-number": {
      margin: 1,
      color: darkMode ? white.main : grey[700],
      fontSize: '16px',
      fontWeight: fontWeightBold,
      width: "100%",
      textAlign: "center",
      border: 'none',
    },


    "& .fc .fc-bg-event": {
        border: 'none'
    },

    "& .fc .fc-daygrid-day": {
      border: `1px solid #86889f !important`,

    },

    "& .fc .fc-day-today": {
      border: `2px solid #7B809A !important`,
      borderColor: `#7B809A !important`,

    },

    "& .fc .fc-view-harness-active > .fc-view": {
      position: "static",
      height: "100.05%",
    },

    "& .fc .fc-scroller-liquid-absolute": {
      position: "static",
    },


    "& .fc-daygrid-event": {
      borderRadius: pxToRem(3.6),
      fontSize: size.sm,
      fontWeight: fontWeightMedium,
      border: `1px solid #86889f !important`,
      borderColor: `${dark.main} !important`,
      margin: 1,

      "&:hover": {
        transform: "scale(1.04)",
        boxShadow: `${md} !important`,
        border: `1px solid #dddddd !important`,
        borderColor: `${dark.main} !important`,
      },
    },


    "& .fc .fc-daygrid-body-unbalanced .fc-daygrid-day-events": {
      maxHeight: pxToRem(80),
      minHeight: pxToRem(40),
      align: 'center',
      marginLeft: 10,
      marginRight: 10,
      marginBottom: 4,
      padding: 1,
    },

    "& .fc-event-title": {
      fontSize: `${size.sm} !important`,
      fontWeight: `${fontWeightRegular} !important`,
      padding: `${pxToRem(2)} ${pxToRem(4.8)} ${pxToRem(1.5)} !important`,
    },

    "& .fc-button, .fc-today-button, .fc-button:disabled": {
      backgroundColor: `${dark.main} !important`,
      borderColor: `${dark.main} !important`,
      fontSize: `13px !important`,
      boxShadow: `${md} !important`,
      opacity: "1 !important",
      transition: `all 150ms ease-in`,

      "&:hover, &:focus, &:active": {
        transform: "scale(1.03)",
        boxShadow: `${md} !important`,
        backgroundColor: `${dark.main} !important`,
        borderColor: `${dark.main} !important`,
      },
    },

    "& .fc .fc-button .fc-icon": {
      fontSize: '17px',
    },

    "& .fc-toolbar-title": {
      fontSize: `${size.lg} !important`,
      fontWeight: `${fontWeightBold} !important`,
      color: darkMode ? white.main : dark.main,
    },

  };
});

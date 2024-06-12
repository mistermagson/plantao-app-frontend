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
function navbar(theme, ownerState) {
  const { palette, boxShadows, functions, transitions, breakpoints, borders } =
    theme;
  const { transparentNavbar, absolute, light, darkMode } = ownerState;

  const { dark, white, text, transparent, background } = palette;
  const { navbarBoxShadow } = boxShadows;
  const { rgba, pxToRem } = functions;
  const { borderRadius } = borders;

  return {
    boxShadow: transparentNavbar || absolute ? "none" : navbarBoxShadow,
    backdropFilter:
      transparentNavbar || absolute
        ? "none"
        : `saturate(200%) blur(${pxToRem(30)})`,
    backgroundColor:
      transparentNavbar || absolute
        ? `${transparent.main} !important`
        : rgba(darkMode ? background.default : white.main, 0.8),

    color: () => {
      let color;

      if (light) {
        color = white.main;
      } else if (transparentNavbar) {
        color = text.main;
      } else {
        color = dark.main;
      }

      return color;
    },

    "& > *": {
      transition: transitions.create("all", {
        easing: transitions.easing.easeInOut,
        duration: transitions.duration.standard,
      }),
    },


  };
}

const navbarContainer = ({ breakpoints }) => ({

});

const navbarRow = ({ breakpoints }, { isMini }) => ({

});

const navbarIconButton = ({ typography: { size }, breakpoints }) => ({
  px: 1,

  "& .material-icons, .material-icons-round": {
    fontSize: `${size.xl} !important`,
  },


});

const navbarDesktopMenu = ({ breakpoints }) => ({

});

const navbarMobileMenu = ({ breakpoints }) => ({
  display: "inline-block",
  lineHeight: 0,

  [breakpoints.up("xl")]: {
    display: "none",
  },
});

export {
  navbar,
  navbarContainer,
  navbarRow,
  navbarIconButton,
  navbarDesktopMenu,
  navbarMobileMenu,
};

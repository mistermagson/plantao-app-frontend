import { useState, useEffect, useMemo } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";

// NextJS Material Dashboard 2 PRO components
import MDBox from "/components/MDBox";

// NextJS Material Dashboard 2 PRO examples
import Sidenav from "/components/examples/Sidenav";
import Configurator from "/components/examples/Configurator";

// NextJS Material Dashboard 2 PRO themes
import theme from "/assets/theme";
import themeRTL from "/assets/theme/theme-rtl";

// NextJS Material Dashboard 2 PRO Dark Mode themes
import themeDark from "/assets/theme-dark";
import themeDarkRTL from "/assets/theme-dark/theme-rtl";

// RTL plugins
import rtlPlugin from "stylis-plugin-rtl";

// NextJS Material Dashboard 2 PRO routes
import {adminRoutes, routes} from "/routes";

// NextJS Material Dashboard 2 PRO Context Provider
import {
  MaterialUIControllerProvider,
  useMaterialUIController,
  setMiniSidenav,
  setOpenConfigurator,
} from "/context";

// Images
import favicon from "/assets/images/favicon.png";
import trf from "/assets/images/trf.png";
import appleIcon from "/assets/images/apple-icon.png";
import brandWhite from "/assets/images/logo-ct.png";
import brandDark from "/assets/images/logo-ct-dark.png";
import {validateAuthToken} from "../utils/sistemaUtils";
import {parseCookies} from "nookies";
import {fetchEscalasDoJuiz} from "../utils/escalaUtils";
import MDTypography from "../components/MDTypography";
import MDButton from "../components/MDButton";
import jwt from "jsonwebtoken";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createCache({ key: "css", prepend: true });

function Main({ Component, pageProps }) {
  const [controller, dispatch] = useMaterialUIController();
  const {
    miniSidenav,
    direction,
    layout,
    openConfigurator,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
  } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const [rtlCache, setRtlCache] = useState(null);
  const { pathname } = useRouter();

  // Cache for the rtl
  useMemo(() => {
    const cacheRtl = createCache({
      key: "rtl",
      stylisPlugins: [rtlPlugin],
    });

    setRtlCache(cacheRtl);
  }, []);

  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  // Close sidenav when mouse leave mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  // Change the openConfigurator state
  const handleConfiguratorOpen = () =>
    setOpenConfigurator(dispatch, !openConfigurator);

  // Setting the dir attribute for the body element
  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const brandIcon =
    (transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite;


  return direction === "rtl" ? (
    <CacheProvider value={rtlCache}>
      <ThemeProvider theme={darkMode ? themeDarkRTL : themeRTL}>
        <CssBaseline />
        <Component {...pageProps} />
        {layout === "dashboard" && (
          <>
            {/*<Sidenav*/}
            {/*  color={sidenavColor}*/}
            {/*  brand={brandIcon}*/}
            {/*  brandName="Plantao Juizes App"*/}
            {/*  routes={routes}*/}
            {/*  onMouseEnter={handleOnMouseEnter}*/}
            {/*  onMouseLeave={handleOnMouseLeave}*/}
            {/*/>*/}
            {/*<Configurator />*/}
            {/*configsButton*/}
          </>
        )}
        {layout === "vr" && <Configurator />}
      </ThemeProvider>
    </CacheProvider>
  ) : (
    <ThemeProvider theme={darkMode ? themeDark : theme}>
      <CssBaseline />
      <Component {...pageProps} />
      {layout === "dashboard" && (
        <>
          {/*<Sidenav*/}
          {/*  color={sidenavColor}*/}
          {/*  brand={brandIcon}*/}
          {/*  brandName="Plantão Juízes App"*/}
          {/*  routes={(tipoUser === "admin"  ? adminRoutes : routes)}*/}
          {/*  onMouseEnter={handleOnMouseEnter}*/}
          {/*  onMouseLeave={handleOnMouseLeave}*/}
          {/*/>*/}
          {/*<Configurator />*/}
          {/*configsButton*/}
        </>
      )}
      {layout === "vr" && <Configurator />}

    </ThemeProvider>
  );
}

function MyApp({
  Component,
  pageProps,
  emotionCache = clientSideEmotionCache,
}) {
  return (
    <MaterialUIControllerProvider>
      <CacheProvider value={emotionCache}>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="shortcut icon" href={trf.src} />
          <link rel="apple-touch-icon" sizes="76x76" href={appleIcon.src} />
          <title>Plantão App</title>
        </Head>
        <Main Component={Component} pageProps={pageProps} />
      </CacheProvider>
    </MaterialUIControllerProvider>
  );
}

export default MyApp;

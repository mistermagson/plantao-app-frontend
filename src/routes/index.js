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

/** 
  All of the routes for the NextJS Material Dashboard 2 PRO are added here,
  You can add a new route, customize the routes and delete the routes here.

  Once you add a new route on this file it will be visible automatically on
  the Sidenav.

  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav. 
  3. The `type` key with the `divider` value is used for a divider between Sidenav items.
  4. The `name` key is used for the name of the route on the Sidenav.
  5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
  7. The `collapse` key is used for making a collapsible item on the Sidenav that contains other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  8. The `route` key is used to store the route location which is used for the react router.
  9. The `href` key is used to store the external links location.
  10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
*/

// NextJS Material Dashboard 2 PRO components
import MDAvatar from "/src/components/MDAvatar";

// @mui icons
import Icon from "@mui/material/Icon";
import CalendarViewMonthIcon from '@mui/icons-material/CalendarViewMonth';

// Images
import profilePicture from "/public/assets/images/team-2.jpg";
import {Dashboard} from "@mui/icons-material";

const routes = [
  {
    type: "collapse",
    name: "Juiz Ado",
    key: "juiz-ado",
    icon: <MDAvatar src={profilePicture.src} alt="Juiz Ado" size="sm" />,
    collapse: [
      {
        name: "Meus Perfil",
        key: "meu-perfil",
        route: "/pages/profile/profile-overview",
      },
      {
        name: "Configurações",
        key: "configuracoes",
        route: "/pages/account/settings",
      },
      {
        name: "Logout",
        key: "logout",
        route: "/authentication/sign-in/basic",
      },
    ],
  },
  { type: "divider", key: "divider-0" },
  { type: "title", title: "Área do Magistrado", key: "area-magistrado" },
  {
    type: "collapse",
    name: "Meus Plantões",
    key: "plantoes",
    icon: <CalendarViewMonthIcon />,/*<Icon fontSize="medium">calendar</Icon>,*/
    collapse: [
      {
        name: "Regional",
        key: "calendar",
        route: "/applications/calendar",

      },
      {
        name: "Local",
        key: "regionais",
        route: "/applications/calendar",
      },
      {
        name: "Distribuidor",
        key: "wizard",
        route: "/applications/calendar",
      },


    ],
  },
  { type: "divider", key: "divider-1" },
  { type: "title", title: "Área do Admin", key: "area-admin" },
  {
    type: "collapse",
    name: "Gestão",
    key: "gestao",
    icon: <Dashboard />,/*<Icon fontSize="medium">calendar</Icon>,*/
    collapse: [
      {
        name: "Usuários e Permissões",
        key: "permissoes",
        route: "/applications/calendar",
      },
      {
        name: "Escalas",
        key: "escalas",
        route: "/escalas",
      },
      {
        name: "Regionais",
        key: "regionais",
        route: "/applications/calendar",
      },
      {
        name: "Portarias",
        key: "portarias",
        route: "/applications/calendar",
      },
      {
        name: "Feriados",
        key: "feriados",
        route: "/applications/calendar",
      },


    ],
  },

];

export default routes;

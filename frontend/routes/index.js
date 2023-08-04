
// NextJS Material Dashboard 2 PRO components
import MDAvatar from "/components/MDAvatar";

// @mui icons
import Icon from "@mui/material/Icon";

// Images
import profilePicture from "/assets/images/team-3.jpg";

const routes = [
  {
    type: "collapse",
    name: "Juiz Ado",
    key: "juiz-ado",
    icon: <MDAvatar src={profilePicture.src} alt="Juiz Ado" size="sm" />,
    collapse: [
      {
        name: "Meus Plantoes",
        key: "meus-plantoes",
        route: "/plantoes/meusplantoes",
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
    icon: <Icon fontSize="medium">dashboard</Icon>,
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
    icon: <Icon fontSize="medium">dashboard</Icon>,
    collapse: [
     {
            name: "Escalas",
            key: "profile",
            collapse: [
              {
                name: "Adicionar Escala",
                key: "participantes",
                route: "/escalas/adicionaescalas",
              },
              {
                name: "Participantes",
                key: "participantes",
                route: "/escalas/participantes",
              },
              {
                name: "Datas",
                key: "datas",
                route: "/escalas/datas",              },
            ],
          },

      {
        name: "Portarias",
        key: "portarias",
        route: "/applications/calendar",
         collapse: [
                      {
                        name: "Escalas",
                        key: "participantes",
                        route: "/escalas/adicionarescala",
                      },
                      {
                        name: "Participantes",
                        key: "participantes",
                        route: "/escalas/participantes",
                      },
                      {
                        name: "Datas",
                        key: "datas",
                        route: "/escalas/datas",              },
                    ],
      },


      {
        name: "Regionais",
        key: "regionais",
        route: "/applications/calendar",
      },
      {
        name: "Feriados",
        key: "feriados",
        route: "/applications/calendar",
      },


    ],
  },

  { type: "divider", key: "divider-0" },

  { type: "title", title: "Pages", key: "title-pages" },
  {
    type: "collapse",
    name: "Pages",
    key: "pages",
    icon: <Icon fontSize="medium">image</Icon>,
    collapse: [
      {
        name: "Profile",
        key: "profile",
        collapse: [
          {
            name: "Profile Overview",
            key: "profile-overview",
            route: "/pages/profile/profile-overview",
          },
          {
            name: "All Projects",
            key: "all-projects",
            route: "/pages/profile/all-projects",
          },
        ],
      },
      {
        name: "Users",
        key: "users",
        collapse: [
          {
            name: "New User",
            key: "new-user",
            route: "/pages/users/new-user",
          },
        ],
      },
      {
        name: "Account",
        key: "account",
        collapse: [
          {
            name: "Settings",
            key: "settings",
            route: "/pages/account/settings",
          },
          {
            name: "Billing",
            key: "billing",
            route: "/pages/account/billing",
          },
          {
            name: "Invoice",
            key: "invoice",
            route: "/pages/account/invoice",
          },
        ],
      },
      {
        name: "Projects",
        key: "projects",
        collapse: [
          {
            name: "Timeline",
            key: "timeline",
            route: "/pages/projects/timeline",
          },
        ],
      },


      {
        name: "Widgets",
        key: "widgets",
        route: "/pages/widgets",
      },
      {
        name: "Charts",
        key: "charts",
        route: "/pages/charts",
      },
      {
        name: "Notfications",
        key: "notifications",
        route: "/pages/notifications",
      },
    ],
  },



  { type: "divider", key: "divider-1" },




];

export default routes;

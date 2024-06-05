
// NextJS Material Dashboard 2 PRO components
import MDAvatar from "/components/MDAvatar";

// @mui icons
import Icon from "@mui/material/Icon";
import PersonIcon from '@mui/icons-material/Person';

// Images
import profilePicture from "/assets/images/team-3.jpg";

export const routes = [
  {
    type: "collapse",
    name: "Magistrado",
    key: "nome-juiz",
        //icon: <MDAvatar src={profilePicture.src} alt="Nome do Magistrado" size="sm" />,
        icon: <PersonIcon />,
    collapse: [
      {
        name: "Meus Plantoes",
        key: "meus-plantoes",
        route: "/plantoes",
      },
     /* {
        name: "Configurações",
        key: "configuracoes",
        route: "/pages/account/settings",
      },*/
      {
        name: "Logout",
        key: "logout",
        route: "/",
      },
    ],
  },
  //{ type: "divider", key: "divider-2" },
  //{ type: "title", title: "Área do Magistrado", key: "area-magistrado" },

  { type: "title", title: "Opções", key: "area-admin" },
  {
    type: "collapse",
    name: "Plantões Magistrados",
    key: "gestao",
    icon: <Icon fontSize="medium">dashboard</Icon>,
    collapse: [
     // {
     //        name: "Escalas",
     //        key: "profile",
     //        collapse: [
              // {
              //   name: "Adicionar Escala",
              //   key: "participantes",
              //   route: "/escalas/adicionaescalas",
              // },
              // {
              //   name: "Editar Escala",
              //   key: "participantes",
              //   route: "/escalas",
              // },
              // {
              //   name: "Participantes",
              //   key: "participantes",
              //   route: "/escalas/participantes",
              // },
              {
                name: "Plantões",
                key: "datas",
                route: "/plantoes",
              },
            ],
          },

      /*{
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
      */

     /* {
        name: "Regionais",
        key: "regionais",
        route: "/applications/calendar",
      },
      {
        name: "Feriados",
        key: "feriados",
        route: "/applications/calendar",
      },*/
  //   ],
  // },
  /*
  { type: "divider", key: "divider-3" },
  {
    type: "collapse",
    name: "Plantões Varas",
    key: "plantoes-varas",
    icon: <Icon fontSize="medium">dashboard</Icon>,
    collapse: [
      {
        name: "Escalas",
        key: "profile",
        collapse: [
          {
            name: "Adicionar Escala",
            key: "escalas-varas",
            route: "/",
          },
          {
            name: "Participantes",
            key: "participantes=vara",
            route: "/",
          },

        ],
      },




    ],
  },*/

];

export const allRoutes = [
  {
    type: "collapse",
    name: "Magistrado",
    key: "nome-juiz",
    //icon: <MDAvatar src={profilePicture.src} alt="Nome do Magistrado" size="sm" />,
    icon: <PersonIcon />,
    collapse: [
      {
        name: "Meus Plantoes",
        key: "meus-plantoes",
        route: "/plantoes",
      },
      /* {
         name: "Configurações",
         key: "configuracoes",
         route: "/pages/account/settings",
       },*/
      {
        name: "Logout",
        key: "logout",
        route: "/",
      },
    ],
  },
  //{ type: "divider", key: "divider-2" },
  //{ type: "title", title: "Área do Magistrado", key: "area-magistrado" },

  { type: "title", title: "Opções", key: "area-admin" },
  {
    type: "collapse",
    name: "Plantões Magistrados",
    key: "gestao",
    icon: <Icon fontSize="medium">dashboard</Icon>,
    collapse: [
      // {
      //        name: "Escalas",
      //        key: "profile",
      //        collapse: [
      // {
      //   name: "Adicionar Escala",
      //   key: "participantes",
      //   route: "/escalas/adicionaescalas",
      // },
      // {
      //   name: "Editar Escala",
      //   key: "participantes",
      //   route: "/escalas",
      // },
      // {
      //   name: "Participantes",
      //   key: "participantes",
      //   route: "/escalas/participantes",
      // },
      {
        name: "Escolher Plantões",
        key: "datas",
        route: "/plantoes",
      },

    ],
  },
  {
    type: "collapse",
    name: "Configuraçãos",
    key: "gestao2",
    icon: <Icon fontSize="medium">tune</Icon>,
    collapse: [
      {

        name: "Adicionar Escala",
        key: "addEscala",
        route: "/escalas/adicionaescalas",
      },
      {
        name: "Editar Escala",
        key: "editEscala",
        route: "/escalas",
      },
      {
        name: "Editar Participantes",
        key: "participantes",
        route: "/escalas/participantes",
      },
      {
        name: "Editar Plantões",
        key: "datas",
        route: "/plantoes/adm",
      },
    ],
  },
  /*{
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
  */

  /* {
     name: "Regionais",
     key: "regionais",
     route: "/applications/calendar",
   },
   {
     name: "Feriados",
     key: "feriados",
     route: "/applications/calendar",
   },*/
  //   ],
  // },
  /*
  { type: "divider", key: "divider-3" },
  {
    type: "collapse",
    name: "Plantões Varas",
    key: "plantoes-varas",
    icon: <Icon fontSize="medium">dashboard</Icon>,
    collapse: [
      {
        name: "Escalas",
        key: "profile",
        collapse: [
          {
            name: "Adicionar Escala",
            key: "escalas-varas",
            route: "/",
          },
          {
            name: "Participantes",
            key: "participantes=vara",
            route: "/",
          },

        ],
      },




    ],
  },*/

];


export const adminRoutes = [
  {
    type: "collapse",
    name: "Magistrado",
    key: "nome-juiz",
    //icon: <MDAvatar src={profilePicture.src} alt="Nome do Magistrado" size="sm" />,
    icon: <PersonIcon />,
    collapse: [
      {
        name: "Logout",
        key: "logout",
        route: "/",
      },
    ],
  },
  //{ type: "divider", key: "divider-2" },
  //{ type: "title", title: "Área do Magistrado", key: "area-magistrado" },

  { type: "title", title: "Área do Admin", key: "area-admin" },
  {
    type: "collapse",
    name: "Opções",
    key: "gestao",
    icon: <Icon fontSize="medium">dashboard</Icon>,
    collapse: [
      {

        name: "Adicionar Escala",
        key: "addEscala",
        route: "/escalas/adicionaescalas",
      },
      {
        name: "Editar Escala",
        key: "editEscala",
        route: "/escalas",
      },
      {
        name: "Editar Participantes",
        key: "participantes",
        route: "/escalas/participantes",
      },
      {
        name: "Editar Plantões",
        key: "datas",
        route: "/plantoes/adm",
      },

    ],
  },
];



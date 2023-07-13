import React from 'react';
import DashboardLayout from "/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "/examples/Navbars/DashboardNavbar";
import DataTable from "/examples/Tables/DataTable";
import {keys} from "regenerator-runtime";
import MDTypography from "../../components/MDTypography";

export async function getStaticProps(){
    //const data = await fetch('http://localhost:3000/api/escala')

     const escalas = await fetch('http://localhost:1337/api/escala', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer fdf91895e074ebc8f78176d61d74b3c62612c5a3bd80d86d83c2fcd6da7cce2cf0eeae3218760769aa7e2c81cee7cc5b3f27d21575cc5257d8c3f6067dd49e5fbef4d808da83216d3222f5c847029e5ae1e9f3df5221b562ba19cdb2f3fc07abe334b4862313acf441a8905d02af247df8ec219ea674c2f7759c85d614096141'
      },
    })
      .then(response => response.json())
      .then(data => console.log(data));



   // const escalas = await data.json()

    return{
      props: {escalas},
    }
}

function Escalas({escalas}) {

          return (
                   <DashboardLayout>
                       <DashboardNavbar />
                       <MDTypography variant="h6" sx={{ mt: 2, mb: 1, ml: 2 }}>
                           Sales by Country
                       </MDTypography>
                       <DataTable
                           table={{
                               columns: [
                                   {Header: "id", accessor: "id", width: "15%"},
                                   {Header: "descricao", accessor: "descricao", width: "5%"},
                                   {Header: "tipo", accessor: "tipo"},
                                   {Header: "datainicio", accessor: "datainicio"},
                                   {Header: "datafim", accessor: "datafim"},
                                   {Header: "status", accessor: "status"},
                               ],
                               rows: escalas
                           }}
                       />
                   </DashboardLayout>
                  );
  }
export default Escalas;
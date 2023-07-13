import React from 'react';
import DashboardLayout from "/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "/examples/Navbars/DashboardNavbar";
import DataTable from "/examples/Tables/DataTable";
import {keys} from "regenerator-runtime";

export async function getStaticProps(){
    const data = await fetch('http://localhost:3000/api/escala')
    const escalas = await data.json()

    return{
      props: {escalas},
    }
}

function Escalas({escalas}) {

          return (
                   <DashboardLayout>
                       <DashboardNavbar />
                       <h1>Escalas</h1>
                       <DataTable
                           table={{
                               columns: [
                                   {Header: "id", accessor: "id", width: "10%"},
                                   {Header: "descricao", accessor: "descricao", width: "30%"},
                                   {Header: "tipo", accessor: "tipo"},

                               ],
                               rows: escalas
                           }}
                       />
                   </DashboardLayout>
                  );
  }
export default Escalas;
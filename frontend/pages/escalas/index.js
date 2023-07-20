import React from 'react';
import DashboardLayout from "/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "/examples/Navbars/DashboardNavbar";
import DataTable from "/examples/Tables/DataTable";
import {keys} from "regenerator-runtime";
import MDTypography from "../../components/MDTypography";

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
            <MDTypography variant="h2" sx={{ mt: 2, mb: 1, ml: 2 }}>
                Escalas
            </MDTypography>
            <DataTable
                table={{
                    columns: [
                        {Header: "id", accessor: "id", width: "15%",},
                        {Header: "descricao", accessor: "descricao", width: "5%",},
                        {Header: "tipo", accessor: "tipo",},
                        {Header: "datainicio", accessor: "datainicio",},
                        {Header: "datafim", accessor: "datafim",},
                        {Header: "status", accessor: "status",},
                    ],
                    rows: escalas
                }}
            />
        </DashboardLayout>
    );
}
export default Escalas;
import React from 'react';
import DashboardLayout from "/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "/examples/Navbars/DashboardNavbar";

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
                         <ul>
                           {escalas.map((escala)=>(
                             <li key={escala.id}>{escala.descricao} - <strong>{escala.tipo}</strong> - {escala.datainicio} até {escala.datafim}</li>
                           ))}
                         </ul>
                   </DashboardLayout>
                  );
  }
export default Escalas;
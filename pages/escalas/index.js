import React, { useEffect, useState } from 'react';
import DashboardLayout from "/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "/examples/Navbars/DashboardNavbar";

  export default  function Escalas() {

        const [escalas, setEscalas] = useState([]);

        useEffect(() => {
            const fetchData = async () => {
              const response = await fetch('http://localhost:3000/api/escala');
              const json = await response.json();
              setEscalas(json);
            };
        
            fetchData();
          }, []);
        
          return (
            <>
            <DashboardLayout>
                <DashboardNavbar/>
                <ul>{escalas.map((item) => (
                    <li>{item}</li>
                ))}</ul>
            </DashboardLayout>
            </>
        )
  }
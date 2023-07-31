import React, {useEffect, useState} from 'react';
import DashboardLayout from "/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "/examples/Navbars/DashboardNavbar";
import DataTable from "/examples/Tables/DataTable";
import MDTypography from "../../components/MDTypography";
import Card from "@mui/material/Card";

function Escalas() {

    const [escalas, setEscalas] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEscalas = async () => {
            try {

                const response = await fetch('http://localhost:1337/api/escalas', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ceeb0dd52060307ab38137799d4f61d249602fb52e52b4c2f9343a743eaec40cffa447c0537093ff02c26a362bcfddf9cf196206f082ae2e7ceaaa2afea35c1c7c1b7ab527076ccc0b06f80428b5304723b6e77e0c460a24043e33d762585d75c0d1dcb7554598490b0edf6a1a41ce79381486a10281a42c245c80e4d1bfd54b',
                    },
                });

                if (!response.ok) {
                    throw new Error('Falha ao obter os dados das escalas.');
                }

                const responseData = await response.json();
                console.log('')
                console.log('---------------------')
                console.log('-------| Constante DATA:', responseData);

                if (Array.isArray(responseData.data)) {
                    const escalasData = responseData.data.map((item) => ({id: item.id, ...item.attributes,}));
                    setEscalas(escalasData);

                } else {
                    setError('Formato de dados inválido.');
                }

            } catch (error) {
                setError(error.message);
            }
        };

        fetchEscalas();
    }, []);


    if (error) {
        return <div>Erro: {error}</div>;
    }


    return (
        <DashboardLayout>
            <DashboardNavbar />
            <Card id="listaescalas" sx={{ overflow: "visible" }}>
            <MDTypography variant="h2" sx={{ mt: 2, mb: 1, ml: 2 }}>
                Escalas
            </MDTypography>
                <h2>
                    {console.log('-------| PÓS MAP |--------')}
                    {console.log('-------| Constante Escalas:', escalas)}
                </h2>
            <DataTable
                table={{
                    columns: [
                        {Header: "id", accessor: "id",},
                        {Header: "descricao", accessor: "descricao",},
                        {Header: "tipo", accessor: "tipo",},
                        {Header: "inicio", accessor: "inicio",},
                        {Header: "fim", accessor: "fim",},
                        {Header: "fechada", accessor: "fechada",},
                    ],
                    rows: escalas
                }}
            />
            </Card>
        </DashboardLayout>
    );
}
export default Escalas;
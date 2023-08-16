// @mui material components
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";

// NextJS Material Dashboard 2 PRO components
import MDBox from "/components/MDBox";
import DashboardLayout from "/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "/examples/Navbars/DashboardNavbar";
import Footer from "/examples/Footer";
import EventCalendar from "/examples/Calendar";
import Header from "/pagesComponents/applications/calendar/components/Header";
import NextEvents from "/pagesComponents/applications/calendar/components/NextEvents";
import ProductivityChart from "/pagesComponents/applications/calendar/components/ProductivityChart";
import calendarEventsData from "/pagesComponents/applications/calendar/data/calendarEventsData";
import React, {useState, useEffect} from "react";
import Autocomplete from "@mui/material/Autocomplete";
import Card from "@mui/material/Card";
import MDButton from "../../../components/MDButton";
import DataTable from "/examples/Tables/DataTable";

const headers= {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ceeb0dd52060307ab38137799d4f61d249602fb52e52b4c2f9343a743eaec40cffa447c0537093ff02c26a362bcfddf9cf196206f082ae2e7ceaaa2afea35c1c7c1b7ab527076ccc0b06f80428b5304723b6e77e0c460a24043e33d762585d75c0d1dcb7554598490b0edf6a1a41ce79381486a10281a42c245c80e4d1bfd54b'
};

function Datas() {

    const [juizes, setJuizes] = useState([]);
    const [escalas, setEscalas] = useState([]);
    const [plantoes, setPlantoes] = useState([]);
    const [error, setError] = useState(null);
    const [juizSelecionado, setJuizSelecionado] = useState(null);

    useEffect(() => {
        const fetchEscalas = async () => {
            try {

                const response = await fetch('http://localhost:1337/api/juizs?populate[plantoes][populate][0]=escala', {
                    method: 'GET',
                    headers,
                });


                if (!response.ok) {
                    throw new Error('Falha ao obter os dados dos juizes.');
                }

                const responseJuiz = await response.json();
                console.log('response',responseJuiz);
                if (Array.isArray(responseJuiz.data)) {
                    const juizesData = responseJuiz.data.map((item) => ({id: item.id, ...item.attributes,}));
                    setJuizes(juizesData);


                } else {
                    setError('Formato de dados inválido.');
                }

            } catch (error) {
                setError(error.message);
            }
        };
        console.log('juizes',juizes);
        fetchEscalas();
    }, []);

    return (
       <DashboardLayout>
           <Card>
               <DataTable
                   table={{
                       columns: [
                           {Header: "name", accessor: "nome", width: "25%"},
                           {Header: "position", accessor: "position", width: "30%"},
                           {Header: "office", accessor: "office"},
                           {Header: "age", accessor: "age", width: "12%"},
                       ],
                       rows: juizes
                   }}/>
           </Card>
       </DashboardLayout>
      );
  }
export default Datas;
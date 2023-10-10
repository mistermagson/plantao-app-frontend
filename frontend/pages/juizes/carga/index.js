import React, {useState} from 'react';
import DashboardLayout from "/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "/examples/Navbars/DashboardNavbar";
import MDButton from "../../../components/MDButton";
import {cargaJuizes} from "../../../utils/juizes";

const url = `http://10.28.80.30:3000/api/juizes`;
const token = 'ceeb0dd52060307ab38137799d4f61d249602fb52e52b4c2f9343a743eaec40cffa447c0537093ff02c26a362bcfddf9cf196206f082ae2e7ceaaa2afea35c1c7c1b7ab527076ccc0b06f80428b5304723b6e77e0c460a24043e33d762585d75c0d1dcb7554598490b0edf6a1a41ce79381486a10281a42c245c80e4d1bfd54b';
const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
};

function Carga() {
    const [juizes, setJuizes] = useState([])

    const handleClick = async e => {
        e.preventDefault();

        try {
            const response = await fetch(url, {
                method: 'GET',
            })
                .then(r => r.json())

            setJuizes(response)

            cargaJuizes(juizes,headers)
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <DashboardLayout>
                <DashboardNavbar />
                <MDButton onClick={handleClick} size="small" color="success" >Carga Juizes</MDButton>

            </DashboardLayout>
        </>

    )
}
export default Carga;
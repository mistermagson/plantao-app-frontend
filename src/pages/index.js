import Image from "next/image";
import logoJF from '../public/assets/images/logojf.png';
import Button from "@mui/material/Button";

function HomePage() {
    return <>
        <div className={'main'}>
            <Image src={logoJF} alt="Logo JF" width={80} />
            <div className={'jf-h1'}>Justiça Federal</div>
            <div className={'jf-h2'}>Seção Judiciária de Mato Grosso do Sul</div>
    <div>
        <p>&nbsp;</p>
        <p>&nbsp;</p>        

    </div>
            <Button href={"painel"} variant="contained">Acessar APP</Button>
        </div>
    </>
}

export default HomePage
import React, { useState } from 'react';
import {
    TextField,
    Button,
    Autocomplete,
    Box,
    Typography,
    MenuItem,
    DialogTitle,
    DialogContent,
    Dialog, DialogActions, DialogContentText
} from '@mui/material';
import MDBox from '@mui/material/Box';
import MDTypography from '@mui/material/Typography';
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDButton from "../../../components/MDButton";


const NovoJuizForm = ({ varas }) => {
    const [nomeCompleto, setNomeCompleto] = useState('');
    const [email, setEmail] = useState('');
    const [rf, setRf] = useState('');
    const [antiguidade, setAntiguidade] = useState('');
    const [cargo, setCargo] = useState('');
    const [opcaoSelecionada, setOpcaoSelecionada] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');

    // Função para fechar o Dialog
    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const criarJuiz = async (juiz) => {
        try {
            const dados = {
                nome: juiz.nomeCompleto,         // Nome completo do juiz
                email: juiz.email,               // Email do juiz
                rf: juiz.rf,                     // RF do juiz
                antiguidade: parseInt(juiz.antiguidade), // Antiguidade convertida para número
                cargo: juiz.cargo,               // Cargo do juiz
                lotacao: {
                    connect: [juiz.varaId],      // ID da vara selecionada
                },
            }
            console.log(JSON.stringify(dados))

            const response = await fetch('http://localhost:1337/api/juizs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    data: dados
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                console.error('Erro ao criar juiz:', data);
                return { success: false, message: 'Erro ao criar o juiz.' };
            }

            setAntiguidade('')
            setNomeCompleto('')
            setEmail('')
            setCargo('')
            setOpcaoSelecionada(null)
            setRf('')

            return { success: true, message: 'Juiz criado com sucesso!' };
        } catch (error) {
            console.error('Erro na requisição de criação do juiz:', error);
            return { success: false, message: 'Erro na conexão com o servidor.' };
        }
    };


    const handleSubmit = async (event) => {
        event.preventDefault();

        const novoJuiz = {
            nomeCompleto,
            email,
            rf,
            antiguidade,
            cargo,
            varaId: opcaoSelecionada ? opcaoSelecionada.id : null, // ID da vara selecionada
        };

        const resultado = await criarJuiz(novoJuiz);

        setDialogMessage(resultado.message);
        setOpenDialog(true);
    };


    return (
        <div>
            <form onSubmit={handleSubmit}>
                <Grid py={3} px={4}>
                    <Typography variant="h4" gutterBottom>
                        Criar Novo Juiz
                    </Typography>
                    <TextField
                        label="Nome Completo"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={nomeCompleto}
                        onChange={(e) => setNomeCompleto(e.target.value)}
                        required
                    />
                    <TextField
                        label="Email"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        required
                    />
                    <TextField
                        label="RF"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={rf}
                        onChange={(e) => setRf(e.target.value)}
                        required
                    />
                    <TextField
                        label="Antiguidade"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={antiguidade}
                        onChange={(e) => setAntiguidade(e.target.value)}
                        required
                    />
                    <TextField
                        label="Cargo"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={cargo}
                        onChange={(e) => setCargo(e.target.value)}
                        required
                    />
                    <Autocomplete
                        sx={{marginTop: '14px'}}
                        options={varas}
                        getOptionLabel={(vara) => vara.descricao}
                        value={opcaoSelecionada}
                        onChange={(event, newValue) => setOpcaoSelecionada(newValue)}
                        renderInput={(params) => <TextField {...params} label="Vara Pertencente"/>}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <Box mt={3}>
                        <MDButton type="submit" fullWidth color={'dark'}>
                            Criar Juiz
                        </MDButton>
                    </Box>
                </Grid>
            </form>
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Notificação</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {dialogMessage}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary" autoFocus>
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default NovoJuizForm;

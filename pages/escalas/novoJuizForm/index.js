import React, { useState } from 'react';
import { TextField, Button, Autocomplete, Box, Typography, MenuItem } from '@mui/material';
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

    const handleSubmit = (event) => {
        event.preventDefault();
        const novoJuiz = {
            nomeCompleto,
            email,
            rf,
            antiguidade,
            cargo,
            vara: opcaoSelecionada,
        };

        // Aqui você pode fazer a lógica de submissão, como enviar os dados para um back-end.
        console.log('Novo juiz criado:', novoJuiz);
    };

    return (
        <form onSubmit={handleSubmit} >
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
                label="RF (Código de 3 dígitos)"
                variant="outlined"
                fullWidth
                margin="normal"
                value={rf}
                onChange={(e) => setRf(e.target.value)}
                required
            />

            <TextField
                label="Antiguidade (Código de 3 dígitos)"
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
                renderInput={(params) => <TextField {...params} label="Vara Pertencente"  />}
                fullWidth
                margin="normal"
            />

            <Box mt={3}>
                <MDButton onClick={handleSubmit} fullWidth  color={'dark'} >
                    Criar Juiz
                </MDButton>
            </Box>
            </Grid>
        </form>
    );
};

export default NovoJuizForm;

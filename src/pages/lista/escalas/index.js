import * as React from 'react';
import {
    DataGrid,
    useGridApiContext,
    GRID_DATE_COL_DEF,
} from '@mui/x-data-grid';
import Box from "@mui/material/Box";
import {Fab} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';

const colunas = [
    { field: 'id', headerName: 'ID', width: 30 },
    { field: 'descricao', headerName: 'Descrição', width: 150 },
    { field: 'tipo', headerName: 'Tipo', width: 100 },
    { field: 'datainicio',   headerName: 'Início', width: 100 , },
    { field: 'datafim',  headerName: 'Fim', width: 100, },
    { field: 'status',  headerName: 'Status', width: 100, },
];

//TODO retorno do BD
const linhas = [
    { id: 1, descricao: 'Recesso 2023/2024', tipo: 'Regional',datainicio: '20/12/2023',datafim: '06/01/2024',status: '1' },
    { id: 2, descricao: 'Plantao Local', tipo: 'Local',datainicio: '20/12/2023',datafim: '06/01/2024',status: '1' },
    { id: 3, descricao: 'Plantao Local', tipo: 'Local',datainicio: '20/12/2023',datafim: '06/01/2024',status: '0' },
    { id: 4, descricao: 'Plantao Local', tipo: 'Local',datainicio: '20/12/2023',datafim: '06/01/2024',status: '1' },
    { id: 5, descricao: 'Plantao Local', tipo: 'Local',datainicio: '20/12/2023',datafim: '06/01/2024',status: '0' },
    { id: 6, descricao: 'Plantao Local', tipo: 'Local',datainicio: '20/12/2023',datafim: '06/01/2024',status: '1' },
    { id: 7, descricao: 'Plantao Local', tipo: 'Local',datainicio: '20/12/2023',datafim: '06/01/2024',status: '1' },
    { id: 8, descricao: 'Plantao Local', tipo: 'Local',datainicio: '20/12/2023',datafim: '06/01/2024',status: '0' },

];

const fabStyle = {
    position: 'absolute',
    bottom: 16,
    right: 16,
};

export default function Escalas() {
    return (
        <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={linhas}
                columns={colunas}
                experimentalFeatures={{ newEditingApi: true }}
                pageSize={5}
                rowsPerPageOptions={[5]}
            />
            <Fab sx={fabStyle} color="primary" aria-label="add">
                <AddIcon />
            </Fab>

        </Box>
    );
}

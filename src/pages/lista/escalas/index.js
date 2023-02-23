import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Box from "@mui/material/Box";

const columns = [
    { field: 'id', headerName: 'ID', width: 30 },
    { field: 'descricaoPlantao', headerName: 'Regional', width: 130 },
    { field: 'tipoPlantao', headerName: 'Tipo', width: 130 },
    { field: 'inicioPlantao', headerName: 'Início', width: 50 },
    { field: 'fimPlantao', headerName: 'Fim', width: 50 },
];

const rows = [
    { id: 1, descricaoPlantao: 'Recesso 2023/2024', tipoPlantao: 'Regional',inicioPlantao: '20/12/2023',fimPlantao: '06/01/2024' },
    { id: 2, descricaoPlantao: 'Plantao Local', tipoPlantao: 'Local',inicioPlantao: '20/12/2023',fimPlantao: '06/01/2024' },

];

export default function Escalas() {
    return (
        <Box sx={{ height: 500, width: '100%' }}>
            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}


            />
        </Box>
    );
}

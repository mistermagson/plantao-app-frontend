import * as React from 'react';
import {
    DataGrid,
    useGridApiContext,
    GRID_DATE_COL_DEF,
} from '@mui/x-data-grid';
import Box from "@mui/material/Box";
import {Fab} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';

const columns = [
    { field: 'id', headerName: 'ID', width: 30 },
    { field: 'descricaoPlantao', headerName: 'Regional', width: 150 },
    { field: 'tipoPlantao', headerName: 'Tipo', width: 100 },
    { field: 'inicioPlantao',   headerName: 'Início', width: 100 , },
    { field: 'fimPlantao',  headerName: 'Fim', width: 100, },
];

const rows = [
    { id: 1, descricaoPlantao: 'Recesso 2023/2024', tipoPlantao: 'Regional',inicioPlantao: '20/12/2023',fimPlantao: '06/01/2024' },
    { id: 2, descricaoPlantao: 'Plantao Local', tipoPlantao: 'Local',inicioPlantao: '20/12/2023',fimPlantao: '06/01/2024' },

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
                rows={rows}
                columns={columns}
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

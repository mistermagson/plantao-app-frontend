import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'descricaoRegional', headerName: 'Regional', width: 130 },
];

const rows = [
    { id: 1, descricaoRegional: 'Regional 1' },
    { id: 2, descricaoRegional: 'Regional 2'},

];

export default function Regional() {
    return (
        <div style={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                checkboxSelection
            />
        </div>
    );
}

import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Collapse,
    Box,
    Typography,
} from '@mui/material';
import { KeyboardArrowDown as ExpandMoreIcon, KeyboardArrowUp as ExpandLessIcon } from '@mui/icons-material';

const CollapsibleTable = ({ data }) => {
    const [openRows, setOpenRows] = useState([]);

    const toggleRow = (rowId) => {
        if (openRows.includes(rowId)) {
            setOpenRows(openRows.filter((id) => id !== rowId));
        } else {
            setOpenRows([...openRows, rowId]);
        }
    };

    return (
        <TableContainer component={Paper}>

                    <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                        <TableCell />
                        <TableCell sx={{fontWeight:"bold"}} >Nome</TableCell>
                        <TableCell>RF</TableCell>
                        <TableCell>Antiguidade</TableCell>
                        <TableCell>Cargo</TableCell>
                    </TableRow>
                    {data?.map((item) => (
                        <React.Fragment key={item.id}>
                            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                                <TableCell>
                                    <IconButton size="small" onClick={() => toggleRow(item.id)}>
                                        {openRows.includes(item.id) ? (
                                            <ExpandLessIcon />) : (<ExpandMoreIcon />
                                        )}
                                    </IconButton>
                                </TableCell>
                                <TableCell >{item.nome}</TableCell>
                                <TableCell align="center">{item.rf}</TableCell>
                                <TableCell  align="center">{item.antiguidade}</TableCell>
                                <TableCell align="left">{item.cargo}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
                                    <Collapse in={openRows.includes(item.id)} timeout="auto" unmountOnExit>
                                        <Box margin={1}>
                                            <Typography variant="h6" gutterBottom component="div">
                                                Informações Detalhadas
                                            </Typography>
                                            <Table size="small" aria-label="purchases">
                                                <TableBody>
                                                    <TableRow>
                                                        <TableCell>Nome Completo:</TableCell>
                                                        <TableCell>{item.nome}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell>Email:</TableCell>
                                                        <TableCell>{item.email || 'N/A'}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell>Criado em:</TableCell>
                                                        <TableCell>{item.createdAt}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell>Atualizado em:</TableCell>
                                                        <TableCell>{item.updatedAt}</TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        </Box>
                                    </Collapse>
                                </TableCell>
                            </TableRow>
                        </React.Fragment>
                    ))}

        </TableContainer>
    );
};

export default CollapsibleTable;

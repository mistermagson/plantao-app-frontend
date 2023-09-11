import React, { useState } from 'react';
import MDButton from "../../../components/MDButton";
import { CopyToClipboard } from 'react-copy-to-clipboard';

function Minuta({ plantoes }) {

    const tableCellStyle = {
        border: '1px solid #ccc',
        padding: '8px',
        textAlign: 'center',
        verticalAlign: 'middle',
        fontFamily: 'Times New Roman',
        fontSize: '20px',
        color: 'black',
    };

    const dataAjustada = (dateString) => {
        const dateParts = dateString.split('-');
        return `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
    };

    return (
        <div >
            <table
                id="minuta-table"
                style={{ width: '95%', borderCollapse: 'collapse', border: '1px solid #ccc' }}
            >
                <thead>
                <tr>
                    <th style={tableCellStyle}>DATA</th>
                    <th style={tableCellStyle}>JUÍZES(AS) PLANTONISTAS</th>
                </tr>
                </thead>
                <tbody>
                {plantoes.map((plantao) => (
                    <tr key={plantao.id}>
                        <td style={tableCellStyle}>{dataAjustada(plantao.data)}</td>
                        <td style={tableCellStyle}>
                            {plantao.plantonista && plantao.plantonista.data && plantao.plantonista.data.length > 0 ? (
                                <>
                                    {plantao.plantonista.data[0].attributes.nome} <br />
                                    {`${plantao.plantonista.data[0].attributes.cargo} da ${plantao.plantonista.data[0].attributes.lotacao && plantao.plantonista.data[0].attributes.lotacao.data && plantao.plantonista.data[0].attributes.lotacao.data.attributes.descricao}`}
                                </>
                            ) : (
                                'Nenhum plantonista'
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            {/*<CopyToClipboard text={tableHtml}>
                <MDButton style={{ marginBottom: '10px', marginTop: '10px', padding: '10px' }} size='small' color='secondary'>
                    Copiar Tabela
                </MDButton>
            </CopyToClipboard>
            {copied && <h5>Tabela copiada com sucesso!</h5>}*/}
        </div>
    );
}

export default Minuta;

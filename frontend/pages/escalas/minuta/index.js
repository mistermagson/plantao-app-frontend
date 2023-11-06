import React, { useState } from 'react';
import MDButton from "../../../components/MDButton";
import { CopyToClipboard } from 'react-copy-to-clipboard';

function MinutaPage({ plantoes }) {
    const tableCellStyle = {
        border: '1px solid #ccc',
        padding: '6px',
        textAlign: 'center',
        verticalAlign: 'middle',
        fontFamily: 'Times New Roman',
        fontSize: '19px',
        color: 'black',
    };

    const dataAjustada = (dateString) => {
        const dateParts = dateString.split('-');
        return `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
    };

    // Crie uma cópia dos plantões e ordene as datas em ordem crescente
    const plantoesOrdenados = [...plantoes];
    plantoesOrdenados.sort((a, b) => {
        const dateA = new Date(a.data);
        const dateB = new Date(b.data);
        return dateA - dateB;
    });

    return (
        <div>
            <table
                id="minuta-table"
                style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ccc' }}
            >
                <thead>
                <tr>
                    <th style={tableCellStyle}>DATA</th>
                    <th style={tableCellStyle}>JUÍZES(AS) PLANTONISTAS</th>
                </tr>
                </thead>
                <tbody>
                {plantoesOrdenados?.map((plantao) => (
                    <tr key={plantao.id}>
                        <td style={tableCellStyle}>{dataAjustada(plantao.data)}</td>
                        <td style={tableCellStyle}>
                            {plantao.plantonista && plantao.plantonista.data && plantao.plantonista.data.length > 0 ? (
                                <>
                                    {plantao.plantonista.data[0].attributes.nome} <br />
                                    {`${plantao.plantonista.data[0].attributes.cargo} da ${
                                        plantao.plantonista.data[0].attributes.lotacao &&
                                        plantao.plantonista.data[0].attributes.lotacao.data &&
                                        plantao.plantonista.data[0].attributes.lotacao.data.attributes.descricao
                                    }`}
                                </>
                            ) : (
                                'Nenhum plantonista'
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default MinutaPage;
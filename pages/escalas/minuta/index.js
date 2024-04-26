import React, { useState } from 'react';
import MDButton from "../../../components/MDButton";
import { CopyToClipboard } from 'react-copy-to-clipboard';

function MinutaPage({ plantoes }) {

    const mergeRows = (plantoes) => {
        const mergedRows = [];
        let currentRow = null;

        for (const plantao of plantoes) {
            if (
                currentRow &&
                currentRow.plantonista &&
                currentRow.plantonista.data &&
                currentRow.plantonista.data[0]?.attributes.nome ===
                plantao.plantonista.data[0]?.attributes.nome
            ) {
                currentRow.data.push(plantao.data);
            } else {
                if (currentRow) {
                    mergedRows.push(currentRow);
                }
                currentRow = {
                    plantonista: plantao.plantonista,
                    data: [plantao.data],
                };
            }
        }

        if (currentRow) {
            mergedRows.push(currentRow);
        }

        return mergedRows;
    };

    if (plantoes?.length > 0) {

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

        // Mescle as linhas sequenciais com o mesmo plantonista
        const mergedRows = mergeRows(plantoesOrdenados);

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
                    {mergedRows.map((row, index) => (
                        <tr key={index}>
                            <td style={tableCellStyle}>
                                {row.data.map((data, index) => (
                                    <React.Fragment key={index}>
                                        {dataAjustada(data)}
                                        <br />
                                    </React.Fragment>
                                ))}
                            </td>
                            <td style={tableCellStyle}>
                                {row.plantonista && row.plantonista.data && row.plantonista.data[0]?.attributes.nome ? (
                                    <>
                                        {row.plantonista.data[0].attributes.nome} <br />
                                        {`${row.plantonista.data[0].attributes.cargo} da ${
                                            row.plantonista.data[0].attributes.lotacao &&
                                            row.plantonista.data[0].attributes.lotacao.data &&
                                            row.plantonista.data[0].attributes.lotacao.data.attributes.descricao
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
}

export default MinutaPage;
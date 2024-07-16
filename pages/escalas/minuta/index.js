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
            fontSize: '12px',
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

        // Agrupe os plantões por mês
        const plantoesAgrupadosPorMes = {};

        plantoesOrdenados.forEach((plantao) => {
            const dateParts = plantao.data.split('-');
            const key = `${dateParts[0]}-${String(dateParts[1]).padStart(2, '0')}`; // Padronize o mês para ter 2 dígitos
            if (!plantoesAgrupadosPorMes[key]) {
                plantoesAgrupadosPorMes[key] = [];
            }
            plantoesAgrupadosPorMes[key].push(plantao);
        });

        // Mescle as linhas sequenciais com o mesmo plantonista para cada mês
        const mergedRowsPorMes = {};
        Object.keys(plantoesAgrupadosPorMes).forEach((key) => {
            mergedRowsPorMes[key] = mergeRows(plantoesAgrupadosPorMes[key]);
        });

        return (
            <div>
                <button onClick={()=>{console.log(plantoes)}}> teste</button>
                {Object.keys(mergedRowsPorMes).map((key) => {
                    const [year, month] = key.split('-');
                    const mes = new Date(parseInt(year), parseInt(month) - 1).toLocaleString('default', { month: 'long' });
                    return (
                        <div key={key}>
                            <table
                                id="minuta-table"
                                style={{width: '100%', borderCollapse: 'collapse', border: '1px solid #ccc'}}
                            >
                                <thead>
                                <tr>
                                    <th style={tableCellStyle}>PERÍODO - {(mes).toUpperCase()}</th>
                                    <th style={tableCellStyle}>JUÍZES(AS) PLANTONISTAS</th>
                                </tr>
                                </thead>
                                <tbody>
                                {mergedRowsPorMes[key].map((row, index) => (
                                    <tr key={index}>
                                        <td style={tableCellStyle}>
                                            {row.data.map((data, index) => (
                                                <React.Fragment key={index}>
                                                    {dataAjustada(data)}
                                                    <br/>
                                                </React.Fragment>
                                            ))}
                                        </td>
                                        <td style={tableCellStyle}>
                                            {row.plantonista && row.plantonista.data && row.plantonista.data[0]?.attributes.nome ? (
                                                <>
                                                    {row.plantonista.data[0].attributes.nome} <br/>
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
                            <div style={{height: '24px'}}/>
                        </div>
                    );
                })}
            </div>
        );
    }

    return null;
}

export default MinutaPage;

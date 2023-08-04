// pages/index.js

import React, { useState, useEffect } from 'react';
import DashboardLayout from "/examples/LayoutContainers/DashboardLayout";


const Participantes = () => {
  const [jsonData, setJsonData] = useState(null);

        const participantesPorItem = jsonData.data.map(item => {
      const participantesData = item.attributes.participantes.data;
      const participantes = participantesData.map(participante => {
        return {
          id: participante.id,
          nome: participante.attributes.Nome,
          email: participante.attributes.email,
          rf: participante.attributes.rf,
          createdAt: participante.attributes.createdAt,
          updatedAt: participante.attributes.updatedAt
        };
      });

      return {
        id: item.id,
        participantes: participantes
      };
    });

  if (!jsonData) {
    return <div>Carregando...</div>;
  }

  // Se jsonData estiver disponível, você pode renderizar o componente ParticipantesList
  return (
    <DashboardLayout>
      <h1>Lista de Participantes</h1>
      <div>
      {participantesPorItem.map(item => (
              <div key={item.id}>
                <h3>Item ID: {item.id}</h3>
                <ul>
                  {item.participantes.map(participante => (
                    <li key={participante.id}>
                      <strong>Nome:</strong> {participante.nome}
                      <br />
                      <strong>Email:</strong> {participante.email}
                      <br />
                      <strong>RF:</strong> {participante.rf}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
      </div>
    </DashboardLayout>
  );
};

export default Participantes;

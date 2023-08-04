import React, { useState, useEffect } from 'react';
import DashboardLayout from "/examples/LayoutContainers/DashboardLayout";

export const getStaticProps = async () => {
  const res = await fetch('http://localhost:1337/api/escalas?populate=*')
  const jsonData = await res.json()
  return { props: { jsonData } }
}

function ParticipantesList({ jsonData }){
   const [juizes, setJuizes] = useState(null);


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

  return (
    <DashboardLayout>
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
    </DashboardLayout>
  );
};

export default ParticipantesList;


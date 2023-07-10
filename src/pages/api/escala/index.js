export default function handler(req, res) {
    res.status(200).json([
        { id: 1, descricao: 'Recesso 2023/2024', tipo: 'Regional',datainicio: '20/12/2023',datafim: '06/01/2024',status: '1',
            datasplantao:[
                {

                data: '2023-07-10',
                juizplantonista:1
                },
                {

                    data: '2023-07-11',
                    juizplantonista:2
                },
                {

                    data: '2023-07-12',
                    juizplantonista:1
                },
                {

                    data: '2023-07-13',
                    juizplantonista:2
                },
                ]

        },
        { id: 2, descricao: 'Plantao Local', tipo: 'Local',datainicio: '20/12/2023',datafim: '06/01/2024',status: '1' },
        { id: 3, descricao: 'Plantao Local', tipo: 'Local',datainicio: '20/12/2023',datafim: '06/01/2024',status: '0' },
        { id: 4, descricao: 'Plantao Local', tipo: 'Local',datainicio: '20/12/2023',datafim: '06/01/2024',status: '1' },
        { id: 5, descricao: 'Plantao Local', tipo: 'Local',datainicio: '20/12/2023',datafim: '06/01/2024',status: '0' },
        { id: 6, descricao: 'Plantao Local', tipo: 'Local',datainicio: '20/12/2023',datafim: '06/01/2024',status: '1' },
        { id: 7, descricao: 'Plantao Local', tipo: 'Local',datainicio: '20/12/2023',datafim: '06/01/2024',status: '1' },
        { id: 8, descricao: 'Plantao Local', tipo: 'Local',datainicio: '20/12/2023',datafim: '06/01/2024',status: '0' }]
    )
}
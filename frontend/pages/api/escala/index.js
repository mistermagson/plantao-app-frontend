export default function handler(req, res) {
    res.status(200).json([
    {
        id: '1',
        descricao: 'Recesso 2013/2014',
        tipo: 'Regional',
        datainicio: '20/12/2023',
        datafim: '06/01/2024',
        status: '1',
        datasplantao:[
                {data: '2023-07-10', juizplantonista:1, id:'1', status: true},
                {data: '2023-07-11', juizplantonista:2, id:'2', status: false},
                {data: '2023-07-12', juizplantonista:1, id:'3', status: true},
                {data: '2023-07-13', juizplantonista:2, id:'4', status: false},
                ]
    },
    {
        id: '2', descricao: 'Recesso 3055/3055', tipo: 'Regional',datainicio: '20/12/2023',datafim: '06/01/2024',status: '0',
        datasplantao:[
                    {data: '2023-07-10', juizplantonista:1, id:'1', status: false},
                    {data: '2023-07-11', juizplantonista:2, id:'2', status: true},
                    {data: '2023-07-12', juizplantonista:1, id:'3', status: true},
                    {data: '2023-07-13', juizplantonista:2, id:'4', status: false},
                    ]
        },{
                  id: '3', descricao: 'Recesso 3023/3024', tipo: 'Regional',datainicio: '20/12/2023',datafim: '06/01/2024',status: '0',
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
              },{
                        id: '4', descricao: 'Recesso 2023/2024', tipo: 'Regional',datainicio: '20/12/2023',datafim: '06/01/2024',status: '1',
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
                    },{
                              id: '1', descricao: 'Recesso 2033/2034', tipo: 'Regional',datainicio: '20/12/2023',datafim: '06/01/2024',status: '0',
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
            ])
}
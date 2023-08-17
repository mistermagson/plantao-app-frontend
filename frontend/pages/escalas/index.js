import React, {useState} from "react";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";


export default function Escalas() {
    const [isLoading, setIsLoading] = useState(false);

    const getEscalas = async () => {
        try {
            setIsLoading(true);
            const headers = {
                'content-type': 'application/json',
                'Authorization': `Bearer ${process.env.PRIVATE_API_TOKEN}`
            };
            const requestBody = {
                query: `query GET_ESCALAS{
    escalas {
        data{
            id
            attributes{
                descricao
                plantaos{
                    data{
                        id
                        attributes{
                            data
                            plantonista{
                                data{
                                    id
                                    attributes{
                                        nome
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}`,

            };
            const options = {
                method: 'POST',
                headers,
                body: JSON.stringify(requestBody)
            };
            const response = await (await fetch(process.env.NEXT_PUBLIC_GRAPHQL_URL, options)).json();
            console.log('RESPONSE FROM FETCH REQUEST', response?.data);

        } catch (err) {
            console.log('ERROR DURING FETCH REQUEST', err);
        } finally {
            setIsLoading(false);
        }
    };
    getEscalas()

    return (
        <>
            <DashboardLayout>

                Aqui
            </DashboardLayout>
        </>
    )
}
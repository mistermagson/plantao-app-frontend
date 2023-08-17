import {gql} from 'graphql-request';

export const GRAPHQL_QUERY = gql`query GET_ESCALAS{
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
}`

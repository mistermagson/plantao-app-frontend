'use strict';

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
bootstrap (/*{ strapi }*/){
    /*strapi.db.query('api::juiz.juiz').createMany({
      data: [
        {
          "antiguidade": 30,
          "nome": "JANETE LIMA MIGUEL",
          "rf": 139,
          "cargo": "Juiz Federal"
        },
        {
          "antiguidade": 42,
          "nome": "PEDRO PEREIRA DOS SANTOS",
          "rf": 156,
          "cargo": "Juiz Federal"
        },
        {
          "antiguidade": 102,
          "nome": "DALTON IGOR KITA CONRADO",
          "rf": 234,
          "cargo": "Juiz Federal"
        },
        {
          "antiguidade": 154,
          "nome": "ROBERTO POLINI",
          "rf": 300,
          "cargo": "Juiz Federal"
        },
        {
          "antiguidade": 158,
          "nome": "RAQUEL DOMINGUES DO AMARAL CORNIGLION",
          "rf": 287,
          "cargo": "Juiz Federal"
        },
        {
          "antiguidade": 185,
          "nome": "CLORISVALDO RODRIGUES DOS SANTOS",
          "rf": 337,
          "cargo": "Juiz Federal"
        },
        {
          "antiguidade": 199,
          "nome": "RONALDO JOSÉ DA SILVA",
          "rf": 361,
          "cargo": "Juiz Federal"
        },
        {
          "antiguidade": 211,
          "nome": "DIOGO RICARDO GOES OLIVEIRA",
          "rf": 376,
          "cargo": "Juiz Federal"
        },
        {
          "antiguidade": 213,
          "nome": "MOISÉS ANDERSON COSTA RODRIGUES DA SILVA",
          "rf": 379,
          "cargo": "Juiz Federal"
        },
        {
          "antiguidade": 224,
          "nome": "LUIZ AUGUSTO IAMASSAKI FIORENTINI",
          "rf": 404,
          "cargo": "Juiz Federal"
        },
        {
          "antiguidade": 227,
          "nome": "BRUNO CEZAR DA CUNHA TEIXEIRA",
          "rf": 411,
          "cargo": "Juiz Federal"
        },
        {
          "antiguidade": 236,
          "nome": "RICARDO DAMASCENO DE ALMEIDA",
          "rf": 426,
          "cargo": "Juiz Federal"
        },
        {
          "antiguidade": 237,
          "nome": "MONIQUE MARCHIOLI LEITE",
          "rf": 441,
          "cargo": "Juiz Federal"
        },
        {
          "antiguidade": 240,
          "nome": "FERNANDO NARDON NIELSEN",
          "rf": 460,
          "cargo": "Juiz Federal"
        },
        {
          "antiguidade": 241,
          "nome": "JOÃO FELIPE MENEZES LOPES",
          "rf": 463,
          "cargo": "Juiz Federal"
        },
        {
          "antiguidade": 248,
          "nome": "NEY GUSTAVO PAES DE ANDRADE",
          "rf": 482,
          "cargo": "Juiz Federal"
        },
        {
          "antiguidade": 251,
          "nome": "FELIPE BITTENCOURT POTRICH",
          "rf": 490,
          "cargo": "Juiz Federal"
        },
        {
          "antiguidade": 258,
          "nome": "DINAMENE NASCIMENTO NUNES",
          "rf": 524,
          "cargo": "Juiz Federal"
        },
        {
          "antiguidade": 74,
          "nome": "RUBENS PETRUCCI JÚNIOR",
          "rf": 520,
          "cargo": "Juiz Federal Substituto"
        },
        {
          "antiguidade": 88,
          "nome": "LUCAS MEDEIROS GOMES",
          "rf": 536,
          "cargo": "Juiz Federal Substituto"
        },
        {
          "antiguidade": 89,
          "nome": "JULIA CAVALCANTE SILVA BARBOSA",
          "rf": 537,
          "cargo": "Juiz Federal Substituto"
        },
        {
          "antiguidade": 98,
          "nome": "FELIPE ALVES TAVARES",
          "rf": 547,
          "cargo": "Juiz Federal Substituto"
        },
        {
          "antiguidade": 99,
          "nome": "FÁBIO FISCHER",
          "rf": 548,
          "cargo": "Juiz Federal Substituto"
        },
        {
          "antiguidade": 101,
          "nome": "VITOR FIGUEIREDO DE OLIVEIRA",
          "rf": 550,
          "cargo": "Juiz Federal Substituto"
        },
        {
          "antiguidade": 102,
          "nome": "RICARDO DUARTE FERREIRA FIGUEIRA",
          "rf": 551,
          "cargo": "Juiz Federal Substituto"
        },
        {
          "antiguidade": 104,
          "nome": "DANIEL CHIARETTI",
          "rf": 553,
          "cargo": "Juiz Federal Substituto"
        },
        {
          "antiguidade": 105,
          "nome": "RODRIGO VASLIN DINIZ",
          "rf": 554,
          "cargo": "Juiz Federal Substituto"
        }
      ]
    })*/
  },
};

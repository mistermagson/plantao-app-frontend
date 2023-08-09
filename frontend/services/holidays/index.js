import NotFoundError from "../../errors/NotFoundError";

/**
 * Tabela da lua cheia de Páscoa, valida entre 1900 e 2199, inclusive.
 * Contendo mês (indexado em 0) e dia.
 */
function getPascalFullMoonDates() {
  return [
    [3, 14],
    [3, 3],
    [2, 23],
    [3, 11],
    [2, 31],
    [3, 18],
    [3, 8],
    [2, 28],
    [3, 16],
    [3, 5],
    [2, 25],
    [3, 13],
    [3, 2],
    [2, 22],
    [3, 10],
    [2, 30],
    [3, 17],
    [3, 7],
    [2, 27],
  ];
}

/**
 * @param Date date
 * @return string
 */
function formatDate(date) {
  return date.toISOString().substr(0, 10);
}

/**
 * Cálculo de feriados móveis baseados na Páscoa
 *
 * @see https://en.wikipedia.org/wiki/Computus
 */
export function getEasterHolidays(year) {
  if (year < 1900 || year > 2199) {
    throw new NotFoundError({
      name: 'NotFoundError',
      message: 'Ano fora do intervalo suportado entre 1900 e 2199.',
      type: 'feriados_range_error',
    });
  }

  const pascalFullMoonMonthDay = getPascalFullMoonDates();
  const [refMonth, refDay] = pascalFullMoonMonthDay[year % 19];
  const movingDate = new Date(year, refMonth, refDay);
  const holidays = [];
  movingDate.setDate(movingDate.getDate() + 7 - movingDate.getDay());
  holidays.push({
    date: formatDate(movingDate),
    name: 'Páscoa',
    type: 'nacional',
  });
  movingDate.setDate(movingDate.getDate() - 2);
  holidays.push({
    date: formatDate(movingDate),
    name: 'Sexta-feira Santa',
    type: 'nacional',
  });
  movingDate.setDate(movingDate.getDate() - 45);
  holidays.push({
    date: formatDate(movingDate),
    name: 'Carnaval',
    type: 'nacional',
  });
  movingDate.setDate(movingDate.getDate() + 107);
  holidays.push({
    date: formatDate(movingDate),
    name: 'Corpus Christi',
    type: 'nacional',
  });
  return holidays;
}

export function getFeriadosLegaisSemanaSanta(year) {
  if (year < 1900 || year > 2199) {
    throw new NotFoundError({
      name: 'NotFoundError',
      message: 'Ano fora do intervalo suportado entre 1900 e 2199.',
      type: 'feriados_range_error',
    });
  }

  const pascalFullMoonMonthDay = getPascalFullMoonDates();
  const [refMonth, refDay] = pascalFullMoonMonthDay[year % 19];
  const movingDate = new Date(year, refMonth, refDay);
  const holidays = [];
  // calcula a pascoa
  movingDate.setDate(movingDate.getDate() + 7 - movingDate.getDay());

  movingDate.setDate(movingDate.getDate() - 3);
  holidays.push({
    date: formatDate(movingDate),
    name: 'Feriado Legal - Quinta-feira Santa',
    type: 'legal',
  });
  movingDate.setDate(movingDate.getDate() - 1);
  holidays.push({
    date: formatDate(movingDate),
    name: 'Feriado Legal - Quarta-feira Santa',
    type: 'legal',
  });
  holidays.push({
    date: `${year}-08-11`,
    name: 'Dia do Advogado',
    type: 'legal',
  });
  holidays.push({
    date: `${year}-11-01`,
    name: 'Feriado Legal - Finados',
    type: 'legal',
  });
  holidays.push({
    date: `${year}-12-08`,
    name: 'Dia da Justiça',
    type: 'legal',
  });

  return holidays;
}
/**
 * Combina feriados móveis e fixos.
 *
 * Lei n° 6.802 de 30/06/1980
 * - Nossa Senhora Aparecida
 * Lei n° 662 de 06/04/1949
 * - Confraternização mundial
 * - Tiradentes
 * - Dia do trabalho
 * - Independência do Brasil
 * - Finados
 * - Proclamação da República
 * - Natal
 *
 * Referência de https://github.com/pagarme/business-calendar/tree/master/src/brazil
 */
export function getNationalHolidays(year) {
  const fixedHolidays = [
    ['01-01', 'Confraternização mundial'],
    ['04-21', 'Tiradentes'],
    ['05-01', 'Dia do trabalho'],
    ['09-07', 'Independência do Brasil'],
    ['10-12', 'Nossa Senhora Aparecida'],
    ['11-02', 'Finados'],
    ['11-15', 'Proclamação da República'],
    ['12-25', 'Natal'],
  ];
  return fixedHolidays.map(([date, name]) => ({
    date: `${year}-${date}`,
    name,
    type: 'nacional',
  }));
}

export function getRecesso(year) {
  const fixedHolidays = [
    ['01-01', 'Recesso do Judiciário'],
    ['01-02', 'Recesso do Judiciário'],
    ['01-03', 'Recesso do Judiciário'],
    ['01-04', 'Recesso do Judiciário'],
    ['01-05', 'Recesso do Judiciário'],
    ['01-06', 'Recesso do Judiciário'],
    ['12-20', 'Recesso do Judiciário'],
    ['12-21', 'Recesso do Judiciário'],
    ['12-22', 'Recesso do Judiciário'],
    ['12-23', 'Recesso do Judiciário'],
    ['12-24', 'Recesso do Judiciário'],
    ['12-25', 'Recesso do Judiciário'],
    ['12-26', 'Recesso do Judiciário'],
    ['12-27', 'Recesso do Judiciário'],
    ['12-28', 'Recesso do Judiciário'],
    ['12-29', 'Recesso do Judiciário'],
    ['12-30', 'Recesso do Judiciário'],
    ['12-31', 'Recesso do Judiciário'],
  ];
  return fixedHolidays.map(([date, name]) => ({
    date: `${year}-${date}`,
    name,
    type: 'recesso',
  }));
}

export function getMunicipal(year) {
  const fixedHolidays = [
    ['08-26', 'Aniversário de Campo Grande', 'MS', 'Campo Grande'],
    ['06-13', 'Padroeiro de Campo Grande', 'MS', 'Campo Grande'],
    ['12-08', 'Imaculada Conceição', 'MS', 'Dourados'],
    ['12-20', 'Aniversário de Dourados', 'MS', 'Dourados'],
    [
      '02-02',
      'Padroeira de Corumbá - Nossa Senhora da Candelária',
      'MS',
      'Corumbá',
    ],
    ['06-13', 'Retomada de Corumbá', 'MS', 'Corumbá'],
    ['09-21', 'Aniversário de Corumbá', 'MS', 'Corumbá'],
    ['04-11', 'Aniversário de Coxim', 'MS', 'Coxim'],
    ['05-13', 'Nossa Senhora de Fátima', 'MS', 'Naviraí'],
    ['11-11', 'Aniversário de Naviraí', 'MS', 'Naviraí'],
    ['07-18', 'Aniversário de Ponta Porã', 'MS', 'Ponta Porã'],
    ['06-15', 'Aniversário de Três Lagoas', 'MS', 'Três Lagoas'],
    ['06-13','Feriado Municipal','SP','Americana'],
    ['01-20','Feriado Municipal','SP','Andradina'],
    ['07-11','Feriado Municipal','SP','Andradina'],
    ['08-06','Feriado Municipal','SP','Andradina'],
    ['11-20','Feriado Municipal','SP','Andradina'],
    ['11-20','Feriado Municipal','SP','Araçatuba'],
    ['12-02','Feriado Municipal','SP','Araçatuba'],
    ['08-22','Feriado Municipal','SP','Araraquara'],
    ['11-20','Feriado Municipal','SP','Araraquara'],
    ['07-01','Feriado Municipal','SP','Assis'],
    ['10-04','Feriado Municipal','SP','Assis'],
    ['09-15','Feriado Municipal','SP','Avaré'],
    ['08-25','Feriado Municipal','SP','Barretos'],
    ['11-20','Feriado Municipal','SP','Barretos'],
    ['06-24','Feriado Municipal','SP','Barueri'],
    ['08-01','Feriado Municipal','SP','Bauru'],
    ['04-14','Feriado Municipal','SP','Botucatu'],
    ['07-26','Feriado Municipal','SP','Botucatu'],
    ['11-20','Feriado Municipal','SP','Bragança Paulista'],
    ['12-08','Feriado Municipal','SP','Bragança Paulista'],
    ['11-20','Feriado Municipal','SP','Campinas'],
    ['12-08','Feriado Municipal','SP','Campinas'],
    ['04-20','Feriado Municipal','SP','Caraguatatuba'],
    ['06-13','Feriado Municipal','SP','Caraguatatuba'],
    ['11-20','Feriado Municipal','SP','Caraguatatuba'],
    ['04-14','Feriado Municipal','SP','Catanduva'],
    ['08-08','Feriado Municipal','SP','Catanduva'],
    ['11-20','Feriado Municipal','SP','Franca'],
    ['11-28','Feriado Municipal','SP','Franca'],
    ['12-08','Feriado Municipal','SP','Franca'],
    ['04-11','Feriado Municipal','SP','Guaratinguetá'],
    ['06-13','Feriado Municipal','SP','Guaratinguetá'],
    ['10-25','Feriado Municipal','SP','Guaratinguetá'],
    ['11-20','Feriado Municipal','SP','Guarulhos'],
    ['12-08','Feriado Municipal','SP','Guarulhos'],
    ['07-26','Feriado Municipal','SP','Itapeva'],
    ['09-20','Feriado Municipal','SP','Itapeva'],
    ['04-15','Feriado Municipal','SP','Jales'],
    ['08-15','Feriado Municipal','SP','Jales'],
    ['08-15','Feriado Municipal','SP','Jaú'],
    ['11-20','Feriado Municipal','SP','Jaú'],
    ['08-15','Feriado Municipal','SP','Jundiaí'],
    ['11-20','Feriado Municipal','SP','Jundiaí'],
    ['09-15','Feriado Municipal','SP','Limeira'],
    ['11-20','Feriado Municipal','SP','Limeira'],
    ['06-13','Feriado Municipal','SP','Lins'],
    ['04-04','Feriado Municipal','SP','Marília'],
    ['12-08','Feriado Municipal','SP','Marília'],
    ['11-20','Feriado Municipal','SP','Mauá'],
    ['12-08','Feriado Municipal','SP','Mauá'],
    ['07-26','Feriado Municipal','SP','Mogi das Cruzes'],
    ['09-01','Feriado Municipal','SP','Mogi das Cruzes'],
    ['02-19','Feriado Municipal','SP','Osasco'],
    ['06-13','Feriado Municipal','SP','Osasco'],
    ['11-20','Feriado Municipal','SP','Osasco'],
    ['08-06','Feriado Municipal','SP','Ourinhos'],
    ['12-13','Feriado Municipal','SP','Ourinhos'],
    ['06-17','Feriado Municipal','SP','Piracicaba'],
    ['11-20','Feriado Municipal','SP','Piracicaba'],
    ['12-08','Feriado Municipal','SP','Piracicaba'],
    ['01-20','Feriado Municipal','SP','Presidente Prudente'],
    ['09-14','Feriado Municipal','SP','Presidente Prudente'],
    ['12-08','Feriado Municipal','SP','Presidente Prudente'],
    ['11-30','Feriado Municipal','SP','Registro'],
    ['12-03','Feriado Municipal','SP','Registro'],
    ['01-20','Feriado Municipal','SP','Ribeirão Preto'],
    ['06-19','Feriado Municipal','SP','Ribeirão Preto'],
  ];
  return fixedHolidays.map(([date, name, uf, subsecao]) => ({
    date: `${year}-${date}`,
    name,
    type: 'municipal',
    uf,
    subsecao,
  }));
}
export function getEstadual(year) {
  const fixedHolidays = [
    ['10-11', 'Divisão do Estado', 'MS'],
    ['07-09', 'Revolução Constitucionalista', 'SP'],
  ];
  return fixedHolidays.map(([date, name, uf]) => ({
    date: `${year}-${date}`,
    name,
    type: 'estadual',
    uf,
  }));
}

function sortByDate(holidays) {
  return holidays.sort((a, b) => {
    if (a.date > b.date) {
      return 1;
    }
    if (a.date < b.date) {
      return -1;
    }
    return 0;
  });
}

export default function getHolidays(year) {
  const municipal = getMunicipal(year);
  const estadual = getEstadual(year);
  const recesso = getRecesso(year);
  const easterHolidays = getEasterHolidays(year);
  const semanaSanta = getFeriadosLegaisSemanaSanta(year);
  const nationalHolidays = getNationalHolidays(year);
  return sortByDate([...municipal, ...estadual, ...recesso, ...easterHolidays, ...nationalHolidays, ...semanaSanta]);
}

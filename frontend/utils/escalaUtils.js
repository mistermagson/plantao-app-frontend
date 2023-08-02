// retorna uma lista de datas a partir de um intervalo
export const geraDatas = (start, end) => {
    const dateArray = [];
    let currentDate = new Date(start);

    while (currentDate <= new Date(end)) {
      dateArray.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dateArray;
};

// retorna uma lista de datas que caem em final de semana(sábado ou domingo)
export const geraWeekends = (start, end) => {
    const dateArray = [];
    let currentDate = new Date(start);

    while (currentDate <= new Date(end)) {
     if (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
       // Se a data for um sábado (6) ou domingo (0), adicionamos ao array
       dateArray.push(new Date(currentDate));
     }
     currentDate.setDate(currentDate.getDate() + 1);
    }

    return dateArray;
};
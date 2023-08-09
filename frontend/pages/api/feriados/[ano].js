import getHolidays from "../../../services/holidays";
import InternalError from "../../../errors/InternalError";
import BaseError from "../../../errors/BaseError";


export default function action(request, response) {
  try {
    const holidays = getHolidays(request.query.ano);

    response.status(200).json(holidays);
  } catch (error) {
    if (error instanceof BaseError) {
      throw error;
    }

    throw new InternalError({
      message: 'Erro ao calcular feriados.',
      type: 'feriados_error',
    });
  }
};


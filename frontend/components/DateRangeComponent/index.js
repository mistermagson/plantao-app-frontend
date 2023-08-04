import React from 'react';
import {geraDatas, geraWeekends} from '../../utils/escalaUtils'

const DateRangeComponent = ({ startDate, endDate }) => {

  const dateArray = geraDatas(startDate, endDate);

  return (
    <div>
      <h2>Datas entre {startDate} e {endDate}:</h2>
      <ul>
        {dateArray.map((date, index) => (
          <li key={index}>{date.toISOString().split('T')[0]}</li>
        ))}
      </ul>
    </div>
  );
};

export default DateRangeComponent;

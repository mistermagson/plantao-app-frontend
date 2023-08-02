import React from 'react';
import DashboardLayout from "/examples/LayoutContainers/DashboardLayout";
import DateRangeComponent from '../../../components/DateRangeComponent';

function Datas() {

   const startDate = '2023-08-01'; // Sua data inicial aqui
    const endDate = '2023-08-31'; // Sua data final aqui

    return (
       <DashboardLayout>
            <DateRangeComponent startDate={startDate} endDate={endDate} />
       </DashboardLayout>
      );
  }
export default Datas;
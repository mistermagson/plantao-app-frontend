import React from 'react';
import DashboardLayout from "/examples/LayoutContainers/DashboardLayout";
import DateRangeComponent from '../../../components/DateRangeComponent';
import {setDatasEscala} from "../../../utils/escalaUtils";

function Datas() {

   const startDate = '2023-09-01'; // Sua data inicial aqui
   const endDate = '2023-09-30'; // Sua data final aqui

    return (
       <DashboardLayout>
            <DateRangeComponent startDate={startDate} endDate={endDate} />
       </DashboardLayout>
      );
  }
export default Datas;
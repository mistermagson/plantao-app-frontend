import React from 'react';
import DashboardLayout from "/examples/LayoutContainers/DashboardLayout";

import {geraDatas} from "../../../utils/escalaUtils";
function Datas() {

   const startDate = '2023-09-01'; // Sua data inicial aqui
   const endDate = '2023-09-30'; // Sua data final aqui
    const jsonR = JSON.stringify(geraDatas(startDate,endDate));

    return (
       <DashboardLayout>
            <h5>---| inicio {startDate} e fim {endDate}</h5>
           <h6>datas geradas: {console.log(jsonR)}</h6>
       </DashboardLayout>
      );
  }
export default Datas;
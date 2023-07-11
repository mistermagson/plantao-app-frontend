/**
=========================================================
* NextJS Material Dashboard 2 PRO - v2.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/nextjs-material-dashboard-pro
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useRef, useEffect, useState, useMemo } from "react";

// porp-types is a library for typechecking of props
import PropTypes from "prop-types";

// react-chartjs-2 components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

// @mui material components
import Card from "@mui/material/Card";

// NextJS Material Dashboard 2 PRO components
import MDBox from "/src/components/MDBox";
import MDTypography from "/src/components/MDTypography";

// NextJS Material Dashboard 2 PRO helper functions
import gradientChartLine from "/public/assets/theme/functions/gradientChartLine";

// Chart configurations
import configs from "/src/pagesComponents/pages/rtl/components/Chart/configs";

// NextJS Material Dashboard 2 PRO base styles
import colors from "/public/assets/theme/base/colors";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

function Chart({ title, count, percentage, chart }) {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState({});
  const { data, options } = chartData;

  useEffect(() => {
    const chartDatasets = chart.datasets.map((dataset) => ({
      ...dataset,
      fill: true,
      tension: 0.4,
      pointRadius: 0,
      borderWidth: 2,
      maxBarThickness: 6,
      borderColor: colors.black.main,
      backgroundColor: "rgba(0, 0, 0, 0.1)",
    }));

    setChartData(configs(chart.labels, chartDatasets));
  }, [chart]);

  return (
    <Card
      style={{
        overflow: "hidden",
      }}
    >
      <MDBox p={2} lineHeight={1}>
        <MDTypography
          variant="button"
          textTransform="capitalize"
          fontWeight="medium"
          color="text"
        >
          {title}
        </MDTypography>
        <MDTypography variant="h5" fontWeight="bold" color="dark">
          {count}&nbsp;
          <MDTypography
            variant="button"
            fontWeight="bold"
            color={percentage.color}
          >
            {percentage.label}
          </MDTypography>
        </MDTypography>
      </MDBox>
      {useMemo(
        () => (
          <MDBox
            ref={chartRef}
            sx={{ height: "5.375rem", transform: "scale(1.02)" }}
          >
            {data && <Line data={data} options={options} />}
          </MDBox>
        ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [chartData]
      )}
    </Card>
  );
}

// Typechecking props for the Chart
Chart.propTypes = {
  title: PropTypes.string.isRequired,
  count: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  percentage: PropTypes.shape({
    color: PropTypes.oneOf([
      "primary",
      "secondary",
      "info",
      "success",
      "warning",
      "error",
      "dark",
    ]),
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  }).isRequired,
  chart: PropTypes.objectOf(PropTypes.array).isRequired,
};

export default Chart;

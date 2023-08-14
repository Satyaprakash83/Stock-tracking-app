import { useState } from "react";
import PropTypes from "prop-types";
import Chart from "react-apexcharts";

export const StockChart = ({ chartData, stockSymbol }) => {
  const [dateFormat, setDateFormat] = useState("24h");

  const { day, week, year } = chartData;

  const selectDataTime = () => {
    switch (dateFormat) {
      case "1y":
        return year;
      case "7d":
        return week;
      case "24h":
      default:
        return day;
    }
  };

  const dataTime = selectDataTime();

  const color =
    dataTime[dataTime.length - 1].y - dataTime[0].y > 0 ? "#26c281" : "#ed3419";

  const options = {
    title: {
      text: stockSymbol,
      align: "center",
      style: {
        fontSize: "24px",
      },
    },
    chart: {
      id: "Stock Data",
      animations: {
        speed: 1300,
      },
    },
    xaxis: {
      type: "datetime",
      labels: {
        datetimeUTC: false,
      },
    },
    tooltip: {
      x: {
        format: "MMM dd HH:MM",
      },
    },
    colors: [color],
  };

  const renderButtonSelect = (button) => {
    const classes = "btn m-1";
    if (button === dateFormat) return `${classes} btn-primary`;
    else return `${classes} btn-outline-primary`;
  };

  const series = [{ name: stockSymbol, data: dataTime }];

  return (
    <div className="mt-5 p-4 shadow-sm bg-white">
      <Chart options={options} series={series} type="area" width="100%" />
      <div>
        <button
          className={renderButtonSelect("24h")}
          onClick={() => setDateFormat("24h")}
        >
          24h
        </button>
        <button
          className={renderButtonSelect("7d")}
          onClick={() => setDateFormat("7d")}
        >
          7d
        </button>
        <button
          className={renderButtonSelect("1y")}
          onClick={() => setDateFormat("1y")}
        >
          1y
        </button>
      </div>
    </div>
  );
};

StockChart.propTypes = {
  chartData: PropTypes.object.isRequired,
  stockSymbol: PropTypes.string.isRequired,
};

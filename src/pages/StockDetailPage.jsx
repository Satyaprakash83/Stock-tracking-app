//Library imports
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

//custom components
import finnHub from "../apis/finnHub";
import { StockChart } from "../components/StockChart";
import { StockData } from "../components/StockData";

//utillity functions
const formatData = (data) => {
  return data.t.map((element, index) => {
    return { x: element * 1000, y: +data.c[index].toFixed(2) };
  });
};

export const StockDetailPage = () => {
  //Declaring hooks
  const [chartData, setChartData] = useState();
  const { symbol } = useParams();

  //useEffect implementations
  useEffect(() => {
    const fetchData = async () => {
      const date = new Date();
      //dividing by zero as the api needs time in seconds instead of miliseconds
      const currentTime = Math.floor(date.getTime() / 1000);

      //logic to get 'from' day value for days with edge cases of 'monday'(day value: 1) and 'sunday'(day value: 0)
      let oneDay;
      if (date.getDay() === 0) {
        oneDay = currentTime - 2 * 24 * 60 * 60;
      } else if (date.getDay() === 1) {
        oneDay = currentTime - 3 * 24 * 60 * 60;
      } else {
        oneDay = currentTime - 24 * 60 * 60;
      }

      const oneWeek = currentTime - 7 * 24 * 60 * 60;
      const oneYear = currentTime - 365 * 24 * 60 * 60;

      //setting up all promises for api request
      const responseDay = finnHub.get("/stock/candle", {
        params: {
          symbol,
          from: oneDay,
          to: currentTime,
          resolution: 30,
        },
      });

      const responseWeek = finnHub.get("/stock/candle", {
        params: {
          symbol,
          from: oneWeek,
          to: currentTime,
          resolution: 60,
        },
      });

      const responseYear = finnHub.get("/stock/candle", {
        params: {
          symbol,
          from: oneYear,
          to: currentTime,
          resolution: "W",
        },
      });

      //trying to resolve all promises and setDataChart
      try {
        const [{ data: dayData }, { data: weekData }, { data: yearData }] =
          await Promise.all([responseDay, responseWeek, responseYear]);

        //formating all responses for plotting chart
        const formatedChartDate = {
          day: formatData(dayData),
          week: formatData(weekData),
          year: formatData(yearData),
        };

        setChartData(formatedChartDate);
      } catch (error) {
        console.log(error.response);
      }
    };
    fetchData();
  }, [symbol]);

  return (
    <div>
      {chartData && <StockChart chartData={chartData} symbol={symbol} />}
      <StockData symbol={symbol} />
    </div>
  );
};

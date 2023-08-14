import finnHub from "../apis/finnHub";

import { WatchListContext } from "../context/WatchListContext";

import { useState, useEffect, useContext } from "react";
import { BsCaretDownFill, BsCaretUpFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

export const StockList = () => {
  const [stock, setStock] = useState([]);
  const { watchList, deleteStock } = useContext(WatchListContext);
  const navigate = useNavigate();

  const changeColor = (change) => (change >= 0 ? "success" : "danger");

  const renderIcon = (change) =>
    change >= 0 ? <BsCaretUpFill /> : <BsCaretDownFill />;

  const handleStockSelect = (stockSymbol) => {
    navigate(`detail/${stockSymbol}`);
  };

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const promisesList = watchList.map((stock) => {
          return finnHub.get("/quote", {
            params: {
              symbol: stock,
            },
          });
        });

        const responses = await Promise.all(promisesList);
        const data = responses.map((response) => {
          return { symbol: response.config.params.symbol, data: response.data };
        });

        if (isMounted) setStock(data);
      } catch (responseError) {
        console.log(responseError.response);
      }
    };

    fetchData();

    return () => (isMounted = false);
  }, [watchList]);

  return (
    <div>
      <table className="table table-striped table-hover mt-5">
        <thead style={{ color: "rgb(79 89 102 / 1)" }}>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Last</th>
            <th scope="col">Chg</th>
            <th scope="col">Chg%</th>
            <th scope="col">High</th>
            <th scope="col">Low</th>
            <th scope="col">Open</th>
            <th scope="col">Pclose</th>
          </tr>
        </thead>
        <tbody>
          {stock.map((stockData) => {
            return (
              <tr
                key={stockData.symbol}
                className="table-row"
                style={{ cursor: "pointer" }}
                onClick={() => handleStockSelect(stockData.symbol)}
              >
                <th scope="row">{stockData.symbol}</th>
                <td>{stockData.data.c}</td>
                <td className={`text-${changeColor(stockData.data.d)}`}>
                  {stockData.data.d ?? 0}
                  {renderIcon(stockData.data.d)}
                </td>
                <td className={`text-${changeColor(stockData.data.dp)}`}>
                  {stockData.data.dp ?? 0}%{renderIcon(stockData.data.dp)}
                </td>
                <td>{stockData.data.h}</td>
                <td>{stockData.data.l}</td>
                <td>{stockData.data.o}</td>
                <td>{stockData.data.pc} </td>
                <td>
                  {" "}
                  <button
                    className="btn btn-danger btn-sm ml-3 d-inline-block delete-button"
                    onClick={(event) => {
                      event.stopPropagation();
                      deleteStock(stockData.symbol);
                    }}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

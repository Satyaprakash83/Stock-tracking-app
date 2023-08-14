import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";

export const WatchListContext = createContext();

export const WatchListContextProvider = ({ children }) => {
  const [watchList, setWatchList] = useState(
    localStorage.getItem("WATCHLIST")?.split(",") ?? [
      "GOOGL",
      "MSFT",
      "AMZN",
      "TSLA",
      "MCD",
      "NFLX",
    ]
  );

  const addStock = (stock) => {
    if (watchList.indexOf(stock) === -1) setWatchList([...watchList, stock]);
  };

  const deleteStock = (stock) => {
    setWatchList(watchList.filter((stockItem) => stockItem !== stock));
  };

  useEffect(() => {
    localStorage.setItem("WATCHLIST", watchList);
  }, [watchList]);

  return (
    <WatchListContext.Provider
      value={{
        watchList,
        addStock,
        deleteStock,
      }}
    >
      {children}
    </WatchListContext.Provider>
  );
};

WatchListContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

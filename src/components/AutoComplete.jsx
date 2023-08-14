import { useContext, useEffect, useState } from "react";
import { WatchListContext } from "../context/WatchListContext";
import finnHub from "../apis/finnHub";

export const AutoComplete = () => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const { addStock } = useContext(WatchListContext);

  function handleSearch(event) {
    setSearch(event.target.value);
  }

  function renderDropdown() {
    const dropDownClass = search ? "show" : null;
    return (
      <ul
        className={`dropdown-menu ${dropDownClass}`}
        style={{
          height: "35rem",
          minWidth: "100%",
          overflow: "hidden scroll",
          cursor: "pointer",
        }}
      >
        {results.map((result) => {
          return (
            <li
              key={result.symbol}
              className="dropdown-item"
              onClick={() => {
                addStock(result.symbol);
                setSearch("");
              }}
            >
              {result.description} ({result.symbol})
            </li>
          );
        })}
      </ul>
    );
  }

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const {
          data: { result },
        } = await finnHub.get("/search", {
          params: {
            q: search,
          },
        });

        if (isMounted) setResults(result);
      } catch (error) {
        console.log(error.response);
      }
    };

    if (search.length >= 1) fetchData();
    else setResults([]);

    return () => (isMounted = false);
  }, [search]);

  return (
    <div className="w-50 p-5 rounded mx-auto">
      <div className="form-floating dropdown">
        <input
          className="form-control"
          id="search"
          type="text"
          style={{ backgroundColor: "rgba(145, 158, 171,0.04" }}
          autoComplete="off"
          value={search}
          onChange={handleSearch}
        />
        <label htmlFor="search">Search</label>
        {renderDropdown()}
      </div>
    </div>
  );
};

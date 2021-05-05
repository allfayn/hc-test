import React, { useEffect, useState } from "react";
import { Endpoints } from "@octokit/types";
import { ChartData } from "./types";
import "./App.css";
import Chart from "./Chart";
import { useFetch, useFetchProps } from "./useFetch";

type SearchResult = Endpoints["GET /repos/{owner}/{repo}/stats/contributors"]["response"]["data"];

const fn = async function (args: useFetchProps) {
  let result: ChartData = undefined;
  if (!args.url) {
    return result;
  }
  const res = await fetch(args.url, {
    method: "GET",
    headers: {
      Authorization: ``, // use github token
    },
  });
  if (res.status == 404) {
    throw new Error("Repo not found");
  } else {
    let response = (await res.json()) as SearchResult;
    if (Array.isArray(response)) {
      result = response.map((res) => ({
        id: res.author?.id ?? 0,
        name: res.author?.login ?? "",
        total: res.total,
        weeks: res.weeks.map((week) => ({
          time: week.w ?? 0,
          commits: week?.c ?? 0,
        })),
      }));
    }
  }
  return result;
};

function App() {
  const [search, setSearch] = useState("");
  const [url, setRepo] = useState<string>("");
  const { data, error, loading } = useFetch<useFetchProps, ChartData>({
    args: {
      url: url,
    },
    fn,
  });
  const callSearch = (e: React.MouseEvent) => {
    e.preventDefault();
    setRepo(`https://api.github.com/repos/${search}/stats/contributors`);
  };

  return (
    <div className="App">
      <header className="App-header">
        <p>
          <label>author/repo:</label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Enter github repository..."
          />
          <button onClick={callSearch}>Search</button>
        </p>
        <div className="chart-container">
          {loading && !error?.message ? (
            <span>loading... </span>
          ) : error?.message ? (
            <div className="errorMessage">{error?.message}</div>
          ) : (
            <Chart data={data}></Chart>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;

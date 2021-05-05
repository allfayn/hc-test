import React, { useEffect, useRef, useState } from "react";
import Chartjs from "chart.js/auto";
import { ChartData as ChartProp } from "./types";
import { ChartConfiguration, ChartData, ChartDataset } from "chart.js";
import "./Chart.css";
import * as dayjs from "dayjs";

const chartConfig: ChartConfiguration = {
  type: "line",
  data: { labels: [], datasets: [] },
  options: {},
};

type ChartProps = {
  data: ChartProp;
};

function Chart({ data }: ChartProps) {
  const chartContainer = useRef(null);
  const [chartInstance, setChartInstance] = useState(null);

  useEffect(() => {
    if (chartContainer && chartContainer.current) {
      let lineChartData: ChartData = { labels: [], datasets: [] };
      let lebels = new Set();
      data?.forEach((item, line) => {
        let dataset: ChartDataset = {
          label: item.name,
          data: item.weeks.reduce<Array<{ x: number; y: number }>>(
            (arr, week) => {
              const month = dayjs(week.time * 1000);
              const start = month.startOf("month").valueOf();
              const find = arr.find((item) => item.x === start);
              if (find) {
                find.y += week.commits;
              } else {
                lebels.add(month.format("MMM YY"));
                arr.push({
                  x: start,
                  y: week.commits,
                });
              }
              return arr;
            },
            []
          ),
          borderColor: "#" + Math.floor(Math.random() * 16777215).toString(16),
        };
        lineChartData.datasets[line] = dataset;
      });
      lineChartData.labels = [...lebels];
      chartConfig.data = lineChartData;
      const newChartInstance = new Chartjs(chartContainer.current, chartConfig);
      setChartInstance(newChartInstance);
    }
  }, [chartContainer]);

  return (
    <div>
      <canvas ref={chartContainer} />
    </div>
  );
}

export default Chart;

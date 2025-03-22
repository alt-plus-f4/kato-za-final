"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const GraphCard: React.FC<{
  symbol: string;
  title: string;
}> = ({ symbol, title }) => {
  const [graphData, setGraphData] = useState<any>(null);
  const [latestPrice, setLatestPrice] = useState<number | null>(null);
  const [percentageChange, setPercentageChange] = useState<number | null>(null);
  const apikey = process.env.NEXT_PUBLIC_POLYGON_API_KEY;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const today = new Date();
        const lastMonth = new Date();
        lastMonth.setMonth(today.getMonth() - 1);

        const response = await axios.get(
          `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/day/${lastMonth.toISOString().split("T")[0]}/${today.toISOString().split("T")[0]}`,
          {
            params: {
              adjusted: true,
              sort: "asc",
              apiKey: apikey,
            },
          }
        );

        const results = response.data.results || [];
        if (results.length > 0) {
          const labels = results.map((item: any) => new Date(item.t).toLocaleDateString());
          const dataPoints = results.map((item: any) => item.c);

          setGraphData({
            labels,
            datasets: [
              {
                label: `${symbol} Price (Last Month)`,
                data: dataPoints,
                borderColor: "rgba(75, 192, 192, 1)",
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderWidth: 2,
                pointRadius: 0,
              },
            ],
          });

          const latest = dataPoints[dataPoints.length - 1];
          setLatestPrice(latest);

          const earliest = dataPoints[0];
          const change = ((latest - earliest) / earliest) * 100;
          setPercentageChange(change);
        } else {
          setGraphData(null);
          setLatestPrice(null);
          setPercentageChange(null);
        }
      } catch (error) {
        setGraphData(null);
        setLatestPrice(null);
        setPercentageChange(null);
      }
    };

    fetchData();
  }, [symbol]);

  return (
    <li className="p-4 border rounded shadow flex flex-col">
      <h3 className="font-bold flex items-center">
        {title}
        {latestPrice !== null && (
          <span className="ml-2 text-gray-600">
            (${latestPrice.toFixed(2)})
          </span>
        )}
        {percentageChange !== null && (
          <span
            className={`ml-2 font-semibold ${
              percentageChange > 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            {percentageChange > 0 ? "+" : ""}
            {percentageChange.toFixed(2)}%
          </span>
        )}
      </h3>
      <div className="h-48 bg-gray-200 rounded flex items-center justify-center">
        {graphData ? (
          <Line data={graphData} options={{ responsive: true, maintainAspectRatio: false }} />
        ) : (
          <p>No data available for the last month.</p>
        )}
      </div>
    </li>
  );
};

const Market: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Market Overview</h1>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Stocks</h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <GraphCard symbol="TSLA" title="Tesla (TSLA)" />
          <GraphCard symbol="AMZN" title="Amazon (AMZN)" />
          <GraphCard symbol="AAPL" title="Apple (AAPL)" />
        </ul>
      </section>
    </div>
  );
};

export default Market;

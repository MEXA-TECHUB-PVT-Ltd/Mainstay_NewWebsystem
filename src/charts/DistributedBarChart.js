import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { BASE_URL } from "../urls/api";
import { Card } from "reactstrap";
import { useTranslation } from "react-i18next";

const DistributedBarChart = ({ coachId }) => {
  const [chartType, setChartType] = useState("monthly");
  const [chartData, setChartData] = useState({ categories: [], series: [] });
  const { t } = useTranslation();

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  useEffect(() => {
    const fetchData = async () => {
      const apiURL =
        chartType === "monthly"
          ? `${BASE_URL}payments/monthlyTransactions/${coachId}`
          : `${BASE_URL}payments/yearlyTransactions/${coachId}`;

      try {
        const response = await fetch(apiURL);
        const data = await response.json();
        if (data.status && data.result.length > 0) {
          const categories = [];
          const series = [];

          if (chartType === "monthly") {
            const seriesInit = new Array(12).fill(0);
            data.result.forEach((item) => {
              seriesInit[parseInt(item.month) - 1] = parseFloat(
                item.total_amount
              );
            });
            categories.push(...monthNames);
            series.push(...seriesInit);
          } else {
            // Yearly
            data.result.forEach((item) => {
              categories.push(item.year);
              series.push(parseFloat(item.total_amount));
            });
          }

          setChartData({
            categories,
            series,
          });
        } else {
          setChartData({
            categories: chartType === "monthly" ? monthNames : [],
            series: [],
          });
        }
      } catch (error) {
        console.error("Error fetching transaction data:", error);
      }
    };

    fetchData();
  }, [chartType]);

  const options = {
    chart: {
      id: "apexchart-bar",
      toolbar: {
        show: true,
      },
    },
    colors: ["#0F6D6A"],
    plotOptions: {
      bar: {
        horizontal: false,
        distributed: true,
        dataLabels: {
          position: "top",
        },
      },
    },
    xaxis: {
      categories: chartData.categories,
      labels: {
        style: {
          fontSize: "12px",
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return val > 0 ? `${val}` : "";
      },
      offsetY: -20,
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: function (val) {
          return `$${val}`;
        },
      },
    },
    yaxis: {
      labels: {
        formatter: function (val) {
          return `CHF-${val}`;
        },
      },
    },
    legend: {
      show: false,
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: "100%",
          },
          plotOptions: {
            bar: {
              dataLabels: {
                position: "bottom",
              },
            },
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  const seriesData = [
    {
      name:
        chartType === "monthly"
          ? "Monthly Transactions"
          : "Yearly Transactions",
      data: chartData.series,
    },
  ];

  return (
    <Card className="profile-details-card px-2 py-1 shadow-sm ">
      <div className="d-flex justify-content-between">
        <h4 style={{ color: "#312802", margin: 0 }}> {t("Turnover Chart")} </h4>
        <select
          value={chartType}
          onChange={(e) => setChartType(e.target.value)}
          style={{
            width: "auto",
            padding: ".375rem 1.75rem .375rem .75rem", // Bootstrap-like padding
            fontSize: "1rem",
            lineHeight: 1.5,
            borderRadius: ".25rem", // Bootstrap-like border-radius
            border: "1px solid #ced4da", // Bootstrap-like border color
          }}
        >
          <option value="monthly"> {t("Monthly")} </option>
          <option value="yearly"> {t("Yearly")} </option>
        </select>
      </div>
      <Chart options={options} series={seriesData} type="bar" />
    </Card>
  );
};

export default DistributedBarChart;

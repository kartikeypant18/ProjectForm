import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import drilldown from "highcharts/modules/drilldown";
import HighchartsStock from "highcharts/modules/stock";

// Initialize the modules
drilldown(Highcharts);
HighchartsStock(Highcharts);

const Dashboard = () => {
  const [userData, setUserData] = useState([]);
  const [pieChartOptions, setPieChartOptions] = useState({});
  const [lineChartOptions, setLineChartOptions] = useState({});

  useEffect(() => {
    // Fetch user data
    const fetchUserData = async () => {
      const response = await fetch("http://localhost:5000/api/users");
      const data = await response.json();
      setUserData(data);
      prepareCharts(data);
    };

    fetchUserData();
  }, []);

  const prepareCharts = (data) => {
    // Prepare data for the pie chart
    const countryCount = {};
    const createdCount = {};

    data.forEach((user) => {
      // Count users per country
      if (user.country) {
        countryCount[user.country] = (countryCount[user.country] || 0) + 1;
      }

      // Count created users over time
      const createdDate = new Date(user.created_at);
      const year = createdDate.getFullYear();
      createdCount[year] = (createdCount[year] || 0) + 1;
    });

    // Prepare pie chart data
    const pieChartData = Object.entries(countryCount).map(
      ([country, count]) => ({
        name: country,
        y: count,
      })
    );

    // Set pie chart options
    setPieChartOptions({
      chart: {
        type: "pie",
      },
      title: {
        text: "User Distribution by Country",
      },
      series: [
        {
          name: "Users",
          colorByPoint: true,
          data: pieChartData,
        },
      ],
    });

    // Prepare line chart data
    const lineChartData = Object.entries(createdCount).map(([year, count]) => [
      parseInt(year),
      count,
    ]);

    // Set line chart options
    setLineChartOptions({
      title: {
        text: "Users Created Over Time",
        align: "left",
      },
      subtitle: {
        text: "Source: User Data",
        align: "left",
      },
      yAxis: {
        title: {
          text: "Number of Users",
        },
      },
      xAxis: {
        accessibility: {
          rangeDescription: "Range: Year",
        },
      },
      legend: {
        layout: "vertical",
        align: "right",
        verticalAlign: "middle",
      },
      plotOptions: {
        series: {
          label: {
            connectorAllowed: false,
          },
          pointStart: Math.min(...lineChartData.map((item) => item[0])), // Start from the earliest year
        },
      },
      series: [
        {
          name: "Users Created",
          data: lineChartData,
        },
      ],
      responsive: {
        rules: [
          {
            condition: {
              maxWidth: 500,
            },
            chartOptions: {
              legend: {
                layout: "horizontal",
                align: "center",
                verticalAlign: "bottom",
              },
            },
          },
        ],
      },
    });
  };

  return (
    <div style={{ display: "flex" }}>
      <HighchartsReact highcharts={Highcharts} options={pieChartOptions} />
      <HighchartsReact highcharts={Highcharts} options={lineChartOptions} />
    </div>
  );
};

export default Dashboard;

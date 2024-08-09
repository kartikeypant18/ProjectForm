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
  const [totalUsers, setTotalUsers] = useState(0);
  const [maleCount, setMaleCount] = useState(0);
  const [femaleCount, setFemaleCount] = useState(0);
  const [usersCreatedToday, setUsersCreatedToday] = useState(0);

  useEffect(() => {
    // Fetch user data
    const fetchUserData = async () => {
      const response = await fetch("http://localhost:5000/api/users");
      const data = await response.json();
      setUserData(data);
      prepareCharts(data);
      calculateStatistics(data); // Call the function to calculate statistics
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

  const calculateStatistics = (data) => {
    const total = data.length;
    const male = data.filter((user) => user.user_gender === "Male").length;
    const female = data.filter((user) => user.user_gender === "Female").length;

    // Count users created today
    const today = new Date().toISOString().slice(0, 10);
    const createdToday = data.filter(
      (user) => new Date(user.created_at).toISOString().slice(0, 10) === today
    ).length;

    setTotalUsers(total);
    setMaleCount(male);
    setFemaleCount(female);
    setUsersCreatedToday(createdToday);
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* Statistics Container */}
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          gap: "20px",
          backgroundColor: "#f5f5f5", // Light background color
          padding: "15px", // Padding inside the container
          borderRadius: "8px", // Rounded corners
          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)", // Subtle shadow
        }}
      >
        <div
          style={{
            flex: 1,
            backgroundColor: "#fff", // White background for each stat box
            padding: "10px",
            borderRadius: "8px",
            textAlign: "center",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h3>Total Users</h3>
          <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{totalUsers}</p>
        </div>
        <div
          style={{
            flex: 1,
            backgroundColor: "#fff",
            padding: "10px",
            borderRadius: "8px",
            textAlign: "center",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h3>Male Users</h3>
          <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{maleCount}</p>
        </div>
        <div
          style={{
            flex: 1,
            backgroundColor: "#fff",
            padding: "10px",
            borderRadius: "8px",
            textAlign: "center",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h3>Female Users</h3>
          <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
            {femaleCount}
          </p>
        </div>
        <div
          style={{
            flex: 1,
            backgroundColor: "#fff",
            padding: "10px",
            borderRadius: "8px",
            textAlign: "center",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h3>Users Created Today</h3>
          <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
            {usersCreatedToday}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div style={{ display: "flex", gap: "20px" }}>
        <HighchartsReact highcharts={Highcharts} options={pieChartOptions} />
        <HighchartsReact highcharts={Highcharts} options={lineChartOptions} />
      </div>
    </div>
  );
};

export default Dashboard;

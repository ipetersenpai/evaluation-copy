import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import { barChart } from "../../redux/slices/Charts/BarchartSlice";
import JwtDecoder from "../JwtDecoder";
const BarGraph = () => {
  const [chartData, setChartData] = useState(null);
  const dispatch = useDispatch();
  const userData = JwtDecoder().decodedToken;
  const id = userData ? userData?.id : "";
  const barchartData = useSelector((state) => state.barChart.data);


  const {overall_rating} = barchartData
  
  useEffect(() => {
    const data = {
      labels: [],
      datasets: [
        {
          data: barchartData?.data,
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(75, 192, 192)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
          ],
          borderWidth: 1,
        },
      ],
    };

    setChartData(data);
  }, [barchartData]);

  useEffect(() => {
    if (userData) {
      dispatch(barChart(id));
    }
  }, [dispatch, userData]);

  return (
    <div className="bg-white min-h-[300px] w-full drop-shadow-xl shadow-xl lg:w-1/2 lg:h-1/2 lg:max-h-[300px]">
      {chartData && (
        <Bar
          data={chartData}
          options={{
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
              title: {
                display: true,
                text: `Over All Rating : ${overall_rating === undefined ? "0" : overall_rating}`,
                font: {
                  size: 20,
                  
                }
                
              },
            },
            scales: {
              x: {
                type: "category",
                grid: {
                  display: false,
                },
              },
              y: {
                beginAtZero: true,
                grid: {
                  display: false,
                },
              },
            },
          }}
        />
      )}
    </div>
  );
};

export default BarGraph;

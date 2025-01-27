import React, {useEffect} from "react";
import { Line } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import { barChart } from "../../redux/slices/Charts/BarchartSlice";
import JwtDecoder from "../JwtDecoder";
const LineGraph = () => {
  const dispatch = useDispatch()
  const userData = JwtDecoder().decodedToken
  const id = userData ? userData?.id : ""
  const barchartData = useSelector((state) => state.barChart.data)
 
  // Sample data
  const data = {
    labels: ["1", "2", "3", "4", "5"],
    datasets: [
      {
        data: barchartData?.data,
        fill: false,
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Configuration options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {},
    plugins: {
      legend: {
        display: false, // Remove the legend
      },
    },
  };

  useEffect(() => {
    if(userData) {
      dispatch(barChart(id))
    }
  }, [dispatch, userData])

  return (
    <div className="bg-white min-h-[300px] w-full lg:w-1/2 lg:h-1/2 drop-shadow-xl shadow-xl lg:max-h-[300px]">
      <Line data={data} options={options} />
    </div>
  );
};

export default LineGraph;

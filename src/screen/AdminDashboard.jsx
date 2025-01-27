import React, { useEffect, useState } from "react";
import Header from "../compnents/Header";
import { useNavigate } from "react-router-dom";
import CardHolder from "../compnents/CardHolder";
import JwtDecoder from "../compnents/JwtDecoder";
import Table from "../compnents/Table";
import PieCharts from "../compnents/Charts/PieCharts";
import NotYetEvaluatedCard from "../compnents/NotYetEvaluatedCard";
import { notYetEvaluated } from "../redux/slices/evaluationSlice/notYetEvaluatedSlice";
import { useDispatch, useSelector } from "react-redux";
import { totalDoneEvaluation } from "../redux/slices/evaluationSlice/totalDoneEvaluatedSlice";
import { getApprovedComments } from "../redux/slices/Comments/getApprovedCommentsSlice";
import { pieChart } from "../redux/slices/Charts/pieChartSlice";
import LoadingAnimation from "../compnents/LoadingAnimation";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import Modal from "../compnents/OfficeServices/Modal";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import QuestionScreen from "./Superadmin/QuestionScreen";
import AdminMasterListTable from "../compnents/AdminMasterListTable";

const AdminDashboard = () => {
  // initialize redux
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formType, setFormType] = useState("Admin");

  const type = "ADMINISTRATORS EVALUATION";
  // decode the JWT Token
  const userData = JwtDecoder().decodedToken;
  const firstname = userData ? userData?.first_name : "";
  const id = userData ? userData?.id : "";
  const role = userData ? userData.role : " ";

  // usestates
  const [searchQuery, setSearchQuery] = useState("");
  const [overallRatingRole, setOverallRatingRole] = useState("Teacher");
  const [isOpen, setIsOpen] = useState(false);
  const [isQuestionModal, setIsQuestionModal] = useState(false);

  // Selectors
  const notYetEvaluatedData = useSelector(
    (state) => state.notYetEvaluated.data
  );
  const notYetEvaluatedStatus = useSelector(
    (state) => state.notYetEvaluated.status
  );
  const approvedCommentsData = useSelector(
    (state) => state.getApprovedComments.data
  );
  const approvedCommentsStatus = useSelector(
    (state) => state.getApprovedComments.status
  );
  const pieChartData = useSelector((state) => state.pieChart.data);
  const pieChartLoading = useSelector((state) => state.pieChart.loading);
  const totalDoneData = useSelector((state) => state.totalDone.data);
  const totalDoneStatus = useSelector((state) => state.totalDone.status);

  const handleFormType = (event) => setFormType(event.target.value);

  // extract values from pie charts
  const extractValues = (data) => {
    return data?.pie_chart?.map((item) => ({
      values: [
        parseInt(item["1"], 10),
        parseInt(item["2"], 10),
        parseInt(item["3"], 10),
        parseInt(item["4"], 10),
        parseInt(item["5"], 10),
      ],
      question: item?.question_description,
      type: item?.type,
      overallRating: item.overall_rating_score,
    }));
  };
  const chartData = extractValues(pieChartData);

  // filter whose role is Student
  const filterNotYetEvaulatedData = notYetEvaluatedData[
    "users not Evaluated yet"
  ]?.filter((item) => item.role === "Student");

  // Greeting function (e.x Goodmorning)
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return "Good morning";
    } else if (hour >= 12 && hour < 18) {
      return "Good afternoon";
    } else {
      return "Good evening";
    }
  };

  // handle for setting Form Type
  const hanldeOverallRatingRole = (event) => setFormType(event.target.value);

  // open modal for office services
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const openQuestionModal = () => setIsQuestionModal(true);
  const closeQuestionModal = () => setIsQuestionModal(false);

  // navigate to evaluation type url
  const openEvaluation = () => navigate("/evaluation-type");

  // filter the data for search purpose, in Comments
  const filteredData =
    filterNotYetEvaulatedData?.filter((row) => {
      const searchFields = ["first_name", "last_name"];
      return searchFields?.some((field) =>
        (row[field] || "")
          .toLowerCase()
          .includes((searchQuery || "").toLowerCase())
      );
    }) || [];

  useEffect(() => {
    dispatch(notYetEvaluated());
    dispatch(totalDoneEvaluation());
  }, [dispatch]);

  useEffect(() => {
    if (id) {
      dispatch(getApprovedComments({ id: id }));
      dispatch(pieChart({ id: id, type: type }));
    }
  }, [dispatch, id]);

  return (
    <div
      className={`flex  flex-col min-h-screen bg-backgroundColor pb-10 ${
        isOpen && "max-h-screen overflow-hidden"
      }`}
    >
      <Header />
      <section className="p-4 max-w-full mb-4">
        <h1 className="text-xl font-bold ">
          {getGreeting()}, {firstname}
        </h1>
        <h1 className="border border-black mt-2"></h1>
        <div className="flex justify-start gap-4 max-w-full"></div>
      </section>
      <section className=" container w-full mx-auto min-h-screen px-4">
        <div className="flex flex-wrap gap-2 mb-10 md:justify-between max-w-[800px]">
          <button
            className="px-7 py-2 bg-primary border border-black text-white font-bold  rounded-xl  duration-100 ease-in"
            onClick={openEvaluation}
          >
            Evaluate
          </button>
          {role === "Principal" && (
            <>
              <button
                className="px-7 py-2 bg-tertiary text-black border border-black font-bold  rounded-xl  duration-100 ease-in"
                onClick={openModal}
                disabled
              >
                Office Services
              </button>
              <button className="px-7 py-2  bg-red-600 border border-black text-white font-bold  rounded-xl  duration-100 ease-in" disabled>
                Classroom Observation
              </button>
              <button
                className="px-7 py-2 bg-gray-600 text-white border border-black font-bold  rounded-xl  duration-100 ease-in"
                onClick={openQuestionModal}
              >
                Questions
              </button>
            </>
          )}
        </div>
        {/* Card holder for total evaluated */}
        <div className="flex flex-wrap justify-around lg:justify-start gap-10">
          <CardHolder
            cardName="Students Evaluated"
            count={totalDoneData?.students}
          />
          <CardHolder
            cardName="Admin Evaluated"
            count={totalDoneData?.admins}
          />

          <CardHolder
            cardName="Teacher Evaluated"
            count={totalDoneData?.teachers}
          />
          <CardHolder
            cardName="Non-Teaching Evaluated"
            count={totalDoneData?.non_teaching}
          />
        </div>
        <div className="flex flex-col lg:flex-row gap-10 mt-10 mb-10 ">
          <div className=" flex flex-col gap-10 flex-1 h-max overflow-x-auto overflow-y-hidden  rounded-lg bg-white lg:p-10 shadow-md shadow-primary drop-shadow-2xl p-4 md:p-0">
            <div className="flex justify-center items-center shadow-md bg-secondary border shadow-primary drop-shadow-lg rounded-md min-w-full min-h-[70px] max-h-[70px] p-4">
              {/* <BarGraph />
              <LineGraph /> */}
              <div className="font-bold text-2xl text-white">
                {pieChartLoading ? (
                  <LoadingAnimation />
                ) : (
                  <>
                    {chartData?.length <= 0 ||
                    chartData?.length === undefined ? (
                      <h1>No Data Available</h1>
                    ) : (
                      <h1 className="uppercase text-black">
                        {role} OVERALL RATING RESULT :{" "}
                        {pieChartData?.average_overall_rating_score}
                      </h1>
                    )}
                  </>
                )}
              </div>
            </div>
            <FormControl fullWidth size="small">
              <InputLabel id="demo-simple-select-label">Master List Type</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={formType}
                size="small"
                label="Master List Type"
                onChange={handleFormType}
              >
               
                <MenuItem value="Teacher">
                  Teacher
                </MenuItem>
                 <MenuItem value="Admin">
                  Admin
                </MenuItem>
               
              </Select>
            </FormControl>
            <div className="max-h-[100vh]">
              {formType === "Admin" ? <AdminMasterListTable /> : <Table />}
            </div>
          </div>

          <div className="flex flex-col md:flex-row lg:flex-col md:justify-evenly lg:justify-start  gap-10">
            <div className="shadow-md  shadow-primary drop-shadow-xl min-w-[300px] min-h-[400px] md:min-h-screen lg:min-h-[400px] lg:max-h-[400px] overflow-auto bg-white  rounded-lg p-4">
              <h1 className="text-center font-bold">Comments</h1>
              {approvedCommentsData["Comments & Suggestion Approved"]?.length <=
              0 ? (
                <h1 className="mt-10 text-center font-bold">
                  No Comments or Suggestion Available
                </h1>
              ) : (
                <>
                  {approvedCommentsData["Comments & Suggestion Approved"]?.map(
                    (item) => (
                      <div>
                        <div className=" border-2 border-black p-4 bg-primary text-white rounded-lg mt-4 max-h-[200px] overflow-auto font-bold text-[12px]">
                          {item?.comment}
                        </div>
                      </div>
                    )
                  )}
                </>
              )}
            </div>
            <div className="shadow-md  shadow-primary drop-shadow-xl lg:flex-1 min-w-[300px]  lg:max-h-[600px] overflow-auto bg-white rounded-lg p-4">
              <h1 className="uppercase font-bold">
                Students not yet evaluated
              </h1>
              <div className="tablet:mt-0 w-full">
                <input
                  type="text"
                  placeholder="First name or Last name"
                  className="desktop:w-[406px] tablet:w-[270px] w-full p-2 pl-10 border border-black rounded-xl shadow-sm my-2"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              {filteredData?.length <= 0 ? (
                <h1 className="mt-4 text-center font-bold text-primary">
                  No Data Available
                </h1>
              ) : (
                <>
                  {filteredData?.map((item, index) => (
                    <>
                      <NotYetEvaluatedCard
                        firstname={item.first_name}
                        lastname={item?.last_name}
                      />
                    </>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 mt-14 mb-4">
          <h1 className="uppercase font-bold ">Pie Charts</h1>
        </div>
        <div className="bg-white rounded-lg shadow-md shadow-primary">
          <div className="flex flex-auto max-h-screen  min-h-[400px]  pb-10 bg-white gap-6 overflow-auto p-10 rounded-lg border ">
            {pieChartLoading ? (
              <LoadingAnimation />
            ) : (
              <>
                {pieChartData?.length <= 0 || pieChartData === undefined ? (
                  <h1 className="mx-auto mt-10 font-bold text-2xl">
                    No Data Available
                  </h1>
                ) : (
                  <>
                    <Swiper
                      navigation={true}
                      modules={[Navigation, Pagination]}
                      style={{ margin: "10px" }}
                      pagination={{
                        type: "progressbar",
                      }}
                      slidesPerView={1}
                      centeredSlides={false} // Center active slide
                      parallax={true}
                      breakpoints={{
                        640: { slidesPerView: 2 },
                        768: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },

                        1440: { slidesPerView: 4 },
                      }}
                      className="max-h-[400px] min-h-[400px]"
                    >
                      {chartData?.map((data, index) => (
                        <SwiperSlide
                          key={index}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <div className="flex flex-col items-center max-h-[350px] select-none w-full bg-white min-h-[350px] md:max-w-60 min-w-60 drop-shadow-xl shadow-primary shadow-md rounded-lg p-2  overflow-auto">
                            <PieCharts data={data?.values} />
                            <h1 className="text-primary font-bold uppercase">
                              Rating per question: {data?.overallRating}
                            </h1>
                            <h1 className="text-sm text-center  text-primary max-h-20 min-h-20 mt-4 font-semibold">
                              {data?.question}
                            </h1>
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </section>
      {isOpen && <Modal closemodal={closeModal} />}
      {isQuestionModal && <QuestionScreen closeModal={closeQuestionModal} />}
    </div>
  );
};

export default AdminDashboard;

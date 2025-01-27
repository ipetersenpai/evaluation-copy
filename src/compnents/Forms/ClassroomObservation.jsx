import React, { useState, useEffect } from "react";
import Header from "../Header";
import Option1 from "./UI/Option1";
import Arrow from "../../assets/fast-forward-double-right-arrows-symbol.png";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { fetchQuestion } from "../../redux/slices/questionSlice/getQuestionsSlice";
import { useDispatch, useSelector } from "react-redux";
import Skeleton from "@mui/material/Skeleton";
import { evaluate } from "../../redux/slices/evaluationSlice/evaluateSlice";
import { getUserList } from "../../redux/slices/userSlice/getListOfUsersSlice";
import JwtDecoder from "../JwtDecoder";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { resetStatus } from "../../redux/slices/evaluationSlice/evaluateSlice";

const ClassroomObservation = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [pages, setPages] = useState("first-page");
  const type = "CLASSROOM OBSERVATION INSTRUMENT";

  // decoded items for JWT in JWT Decoder
  const userData = JwtDecoder().decodedToken;
  const schoolYear = userData ? userData?.school_year : "";
  const user_id = userData ? userData?.id : "";
  const session_id = userData ? userData?.session_id : "";

  // selectors
  const userList = useSelector((state) => state.userList.data);
  const loading = useSelector((state) => state.getQuestions.loading);
  const questions = useSelector((state) => state.getQuestions.data);
  const status = useSelector((state) => state.evaluate.status);

  // initialize radio states
  const [radioStates, setRadioStates] = useState({
    firstPage: [],
    secondPage: [],
    thirdPage: [],
    forthPage: [],
  });

  // initialize react hook forms
  const {
    control,
    handleSubmit,
    register,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  // initialize the watch to watch all the fields for validation purpose
  const watchAllFields = watch();

  // functions that handle next page
  const GoBackToEvaluationType = () => navigate("/evaluation-type");
  const handleSecondPage = () => {
    if (
      radioStates.firstPage.some((rating) => rating === null) ||
      Object.values(watchAllFields).some(
        (value) => value === null || value === undefined || value === ""
      )
    ) {
      toast.error("Please rate all questions.", {
        autoClose: 500,
        theme: "dark",
        pauseOnHover: false,
        closeOnClick: true,
      });
      return;
    }
    setPages("second-page");
  };
  const handleThirdPage = () => {
    if (radioStates.secondPage.some((rating) => rating === null)) {
      toast.error("Please rate all questions.", {
        autoClose: 500,
        theme: "dark",
        pauseOnHover: false,
        closeOnClick: true,
      });
      return;
    }

    setPages("third-page");
  };
  const handleForthPage = () => {
    if (radioStates.thirdPage.some((rating) => rating === null)) {
      toast.error("Please rate all questions.", {
        autoClose: 500,
        theme: "dark",
        pauseOnHover: false,
        closeOnClick: true,
      });
      return;
    }

    setPages("forth-page");
  };
  const goBackToFirstPage = () => setPages("first-page");

  // filter questions
  const organization = questions?.questions?.filter(
    (item) => item?.evaluation_type === "Organization"
  );
  const material = questions?.questions?.filter(
    (item) => item?.evaluation_type === "Materials"
  );
  const instructionalProcess = questions?.questions?.filter(
    (item) => item?.evaluation_type === "Instructional Process"
  );
  const Assessment = questions?.questions?.filter(
    (item) => item?.evaluation_type === "Assessment"
  );

  // functions for handle radio changes
  const handleRadioChange = (page, index, value) => {
    setRadioStates((prevState) => ({
      ...prevState,
      [page]: [
        ...prevState[page].slice(0, index),
        value,
        ...prevState[page].slice(index + 1),
      ],
    }));
  };

  // handle maps for every questions with ratings
  const mapItems = (items, ratings) => {
    return items.map((item, index) => ({
      question_id: item.id,
      type: item.type,
      question_group: item?.question_group,
      evaluation_type: item?.evaluation_type,
      question_description: item.question_description,
      rating: ratings[index],
    }));
  };

  // submit form
  const onSubmit = (data) => {
    if (radioStates.forthPage.some((rating) => rating === null)) {
      toast.error("Please rate all questions.", {
        autoClose: 500,
        theme: "dark",
        pauseOnHover: false,
        closeOnClick: true,
      });
      return;
    }

    const questionWithRatings = [
      ...mapItems(organization, radioStates.firstPage),
      ...mapItems(material, radioStates.secondPage),
      ...mapItems(instructionalProcess, radioStates.thirdPage),
      ...mapItems(Assessment, radioStates.forthPage),
    ];

    const teacher = userList?.users?.find(
      (item) => item.full_name === data.evaluated_full_name
    );
    console.log(teacher);
    const evaluated_id = teacher ? teacher?.id : null;

    const values = {
      ...data,
      session_id: session_id,
      user_id: user_id,
      school_year: schoolYear,
      subject_name: "N/a",
      office_services: "N/a",
      strand: "N/a",
      year_level: "N/a",
      semester: "N/a",
      gender: "N/a",
      category: "N/a",
      length_of_service: "N/a",
      evaluated_id: evaluated_id,
      questions: questionWithRatings,
    };
    dispatch(evaluate(values));
  };

  // scroll back to the top when next page
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [pages]);

  // fetching the data in redux
  useEffect(() => {
    dispatch(fetchQuestion({ type: type }));
    dispatch(getUserList());
  }, [dispatch]);

  // make all the radio button filled into null
  useEffect(() => {
    if (status === "success" || status === "") {
      setRadioStates((prevState) => ({
        ...prevState,
        firstPage: Array(organization?.length).fill(null),
      }));
      setRadioStates((prevState) => ({
        ...prevState,
        secondPage: Array(material?.length).fill(null),
      }));
      setRadioStates((prevState) => ({
        ...prevState,
        thirdPage: Array(instructionalProcess?.length).fill(null),
      }));
      setRadioStates((prevState) => ({
        ...prevState,
        forthPage: Array(Assessment?.length).fill(null),
      }));
    }
  }, [questions, status]);

  // display when success
  useEffect(() => {
    if (status === "success") {
      toast.success("Successfully Evaluated", {
        autoClose: 500,
        theme: "dark",
        pauseOnHover: false,
        closeOnClick: true,
      });
      dispatch(getUserList());
      reset();
      setPages("first-page");
    }

    setTimeout(() => {
      dispatch(resetStatus());
    }, 1000);
  }, [status, dispatch]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <section className="bg-white min-h-full p-4">
        <div className="flex items-center gap-4">
          <img
            src={Arrow}
            className="aspect-square h-7  rotate-180 cursor-pointer "
            onClick={GoBackToEvaluationType}
          />

          <h1 className="text-2xl font-bold">
            CLASSROOM OBSERVATION INSTRUMENT
          </h1>
        </div>
        <h1 className="border border-black mt-2"></h1>
        <Option1
          labelone="Very Poor"
          labeltwo="Poor"
          labelthree="Satisfactory"
          labelfour="Very Satisfactory"
          extralabel="5"
          labelfive="Excellent"
        />
      </section>
      <form className="mt-10 p-1 lg:p-4" onSubmit={handleSubmit(onSubmit)}>
        {pages === "first-page" && (
          <>
            <div className="flex flex-col sm:flex-row gap-7 outline-none  ">
              <FormControl
                fullWidth
                error={Boolean(errors.evaluated_full_name)}
              >
                <InputLabel>Teacher Observed</InputLabel>
                <Controller
                  name="evaluated_full_name"
                  control={control}
                  rules={{ required: "Teacher Observed is required!" }}
                  defaultValue=""
                  render={({ field }) => (
                    <Select
                      {...field}
                      label="Teacher Observed"
                      value={field.value || ""}
                      MenuProps={{ PaperProps: { sx: { maxHeight: 300 } } }}

                    >
                      {userList?.users?.map((item) => (
                        <MenuItem value={item?.full_name} key={item?.id}>
                          {item?.full_name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.evaluated_full_name && (
                  <p className="text-sm text-red">
                    {errors.evaluated_full_name.message}
                  </p>
                )}
              </FormControl>
              <FormControl fullWidth error={Boolean(errors.subject_name)}>
                <InputLabel>Subject</InputLabel>
                <Controller
                  name="subject_name"
                  control={control}
                  rules={{ required: "Subject is required!" }}
                  defaultValue=""
                  render={({ field }) => (
                    <Select
                      {...field}
                      label="Subject"
                      value={field.value || ""}
                      MenuProps={{ PaperProps: { sx: { maxHeight: 300 } } }}

                    >
                      <MenuItem value="SCIENCE">SCIENCE</MenuItem>
                      <MenuItem value="MATH">MATH</MenuItem>
                      <MenuItem value="ENGLISH">ENGLISH</MenuItem>
                    </Select>
                  )}
                />
                {errors.subject_name && (
                  <p className="text-sm text-red">
                    {errors.subject_name.message}
                  </p>
                )}
              </FormControl>
            </div>
            <div className="flex flex-col sm:flex-row lg:items-center w-full mt-10 lg:gap-18 gap-6 ">
              <TextField
                id="outlined-basic"
                label="No. Of students present"
                variant="outlined"
                fullWidth
                type="number"
                {...register("no_of_student_present", { required: true })}
              />
              <TextField
                id="outlined-basic"
                label="No. Of students late"
                variant="outlined"
                fullWidth
                type="number"
                {...register("no_of_student_late", { required: true })}
              />
              <TextField
                id="outlined-basic"
                label="Class size"
                variant="outlined"
                fullWidth
                type="number"
                {...register("class_size", { required: true })}
              />
            </div>
          </>
        )}
        <div className="mt-10">
          <div className="relative overflow-x-hidden shadow-md sm:rounded-lg mt-10 min-w-full">
            {pages === "first-page" ? (
              <>
                <h1 className=" text-2xl font-bold text-black uppercase">
                  Organization
                </h1>
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <thead className="text-xs uppercase bg-secondary text-white border ">
                    <tr>
                      <th
                        scope="col"
                        className="text-2xl px-6 py-3 border-2 border-black"
                      >
                        Question
                      </th>
                      <th className="text-2xl px-4 py-3  text-center border-2 border-black">
                        Rating
                        <div className="flex justify-between  mt-4 text-black ">
                          <h1>1</h1>
                          <h1>2</h1>
                          <h1>3</h1>
                          <h1>4</h1>
                          <h1>5</h1>
                        </div>
                      </th>
                    </tr>
                  </thead>

                  <tbody className="max-h-screen min-h-full ">
                    {organization?.map((item, index) => (
                      <tr key={index} className="border border-black group">
                        <td className="border border-black  text-primary p-2 group-hover:text-red-600 group-hover:font-bold max-w-52 min-w-52 ">
                          {loading ? (
                            <Skeleton
                              variant="rectangular"
                              width={700}
                              height={60}
                            />
                          ) : (
                            <>{item?.question_description}</>
                          )}
                        </td>
                        <td className="flex gap-1 justify-between min-w-full items-center p-2 ">
                          {[1, 2, 3, 4, 5].map((optionValue, optionIndex) => (
                            <label key={optionValue}>
                              <input
                                type="radio"
                                className="cursor-pointer  border border-black"
                                value={optionValue.toString()}
                                checked={
                                  radioStates.firstPage[index] === optionValue
                                }
                                onChange={() =>
                                  handleRadioChange(
                                    "firstPage",
                                    index,
                                    optionValue
                                  )
                                }
                                required
                                oninvalid={(e) => {
                                  e.preventDefault();
                                  alert("Please select an option.");
                                }}
                              />
                            </label>
                          ))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="w-full flex justify-end p-4">
                  <img
                    src={Arrow}
                    className="aspect-square h-16 mt-4 border-2 border-black p-4 rounded-full bg-tertiary hover:scale-105 cursor-pointer "
                    onClick={handleSecondPage}
                  />
                </div>
              </>
            ) : pages === "second-page" ? (
              <>
                <h1 className=" text-2xl font-bold text-black uppercase">
                  Materials
                </h1>

                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <thead className="text-xs uppercase bg-secondary text-white border ">
                    <tr>
                      <th
                        scope="col"
                        className="text-2xl px-6 py-3 border-2 border-black"
                      >
                        Question
                      </th>
                      <th className="text-2xl px-4 py-3  text-center border-2 border-black">
                        Rating
                        <div className="flex justify-between mt-4 text-black ">
                          <h1>1</h1>
                          <h1>2</h1>
                          <h1>3</h1>
                          <h1>4</h1>
                          <h1>5</h1>
                        </div>
                      </th>
                    </tr>
                  </thead>

                  <tbody className="max-h-screen min-h-full ">
                    {material?.map((item, index) => (
                      <tr key={index} className="border border-black group">
                        <td className="border border-black  text-primary p-2 group-hover:text-red-600 group-hover:font-bold max-w-52 min-w-52">
                          {loading ? (
                            <Skeleton
                              variant="rectangular"
                              width={700}
                              height={60}
                            />
                          ) : (
                            <>{item?.question_description}</>
                          )}
                        </td>
                        <td className="flex gap-1 justify-between min-w-full items-center p-2">
                          {[1, 2, 3, 4, 5].map((optionValue, optionIndex) => (
                            <label key={optionValue}>
                              <input
                                type="radio"
                                className="cursor-pointer  border border-black"
                                value={optionValue.toString()}
                                checked={
                                  radioStates.secondPage[index] === optionValue
                                }
                                onChange={() =>
                                  handleRadioChange(
                                    "secondPage",
                                    index,
                                    optionValue
                                  )
                                }
                                required
                                oninvalid={(e) => {
                                  e.preventDefault();
                                  alert("Please select an option.");
                                }}
                              />
                            </label>
                          ))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="w-full flex justify-between p-4">
                  <img
                    src={Arrow}
                    className="aspect-square h-16 mt-4 border-2 border-black p-4 rounded-full bg-tertiary hover:scale-105 cursor-pointer rotate-180"
                    onClick={goBackToFirstPage}
                  />
                  <img
                    src={Arrow}
                    className="aspect-square h-16 mt-4 border-2 border-black p-4 rounded-full bg-tertiary hover:scale-105 cursor-pointer "
                    onClick={handleThirdPage}
                  />
                </div>
              </>
            ) : pages === "third-page" ? (
              <>
                <h1 className=" text-2xl font-bold text-black uppercase">
                  Instructional Process
                </h1>
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <thead className="text-xs uppercase bg-secondary text-white border ">
                    <tr>
                      <th
                        scope="col"
                        className="text-2xl px-6 py-3 border-2 border-black"
                      >
                        Question
                      </th>
                      <th className="text-2xl px-4 py-3  text-center border-2 border-black">
                        Rating
                        <div className="flex justify-between mt-4 text-black ">
                          <h1>1</h1>
                          <h1>2</h1>
                          <h1>3</h1>
                          <h1>4</h1>
                          <h1>5</h1>
                        </div>
                      </th>
                    </tr>
                  </thead>

                  <tbody className="max-h-screen min-h-full ">
                    {instructionalProcess?.map((item, index) => (
                      <tr key={index} className="border border-black group">
                        <td className="border border-black  text-primary p-2 group-hover:text-red-600 group-hover:font-bold max-w-52 min-w-52">
                          {loading ? (
                            <Skeleton
                              variant="rectangular"
                              width={700}
                              height={60}
                            />
                          ) : (
                            <>{item?.question_description}</>
                          )}
                        </td>
                        <td className="flex gap-1 justify-between min-w-full items-center p-2">
                          {[1, 2, 3, 4, 5].map((optionValue, optionIndex) => (
                            <label key={optionValue}>
                              <input
                                type="radio"
                                className="cursor-pointer  border border-black"
                                value={optionValue.toString()}
                                checked={
                                  radioStates.thirdPage[index] === optionValue
                                }
                                onChange={() =>
                                  handleRadioChange(
                                    "thirdPage",
                                    index,
                                    optionValue
                                  )
                                }
                                required
                                oninvalid={(e) => {
                                  e.preventDefault();
                                  alert("Please select an option.");
                                }}
                              />
                            </label>
                          ))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="w-full flex justify-between p-4">
                  <img
                    src={Arrow}
                    className="aspect-square h-16 mt-4 border-2 border-black p-4 rounded-full bg-tertiary hover:scale-105 cursor-pointer rotate-180"
                    onClick={handleSecondPage}
                  />
                  <img
                    src={Arrow}
                    className="aspect-square h-16 mt-4 border-2 border-black p-4 rounded-full bg-tertiary hover:scale-105 cursor-pointer "
                    onClick={handleForthPage}
                  />
                </div>
              </>
            ) : (
              <>
                <h1 className=" text-2xl font-bold text-black uppercase">
                  Assessment
                </h1>
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <thead className="text-xs uppercase bg-secondary text-white border ">
                    <tr>
                      <th
                        scope="col"
                        className="text-2xl px-6 py-3 border-2 border-black"
                      >
                        Question
                      </th>
                      <th className="text-2xl px-4 py-3  text-center border-2 border-black">
                        Rating
                        <div className="flex justify-between mt-4 text-black ">
                          <h1>1</h1>
                          <h1>2</h1>
                          <h1>3</h1>
                          <h1>4</h1>
                          <h1>5</h1>
                        </div>
                      </th>
                    </tr>
                  </thead>

                  <tbody className=" min-h-full ">
                    {Assessment?.map((item, index) => (
                      <tr key={index} className="border border-black group">
                        <td className="border border-black  text-primary p-2 group-hover:text-red-600 group-hover:font-bold max-w-52 min-w-52">
                          {loading ? (
                            <Skeleton
                              variant="rectangular"
                              width={700}
                              height={60}
                            />
                          ) : (
                            <>{item?.question_description}</>
                          )}
                        </td>
                        <td className="flex gap-1 justify-between min-w-full items-center p-2">
                          {[1, 2, 3, 4, 5].map((optionValue, optionIndex) => (
                            <label key={optionValue}>
                              <input
                                type="radio"
                                className="cursor-pointer  border border-black"
                                value={optionValue.toString()}
                                checked={
                                  radioStates.forthPage[index] === optionValue
                                }
                                onChange={() =>
                                  handleRadioChange(
                                    "forthPage",
                                    index,
                                    optionValue
                                  )
                                }
                                required
                                oninvalid={(e) => {
                                  e.preventDefault();
                                  alert("Please select an option.");
                                }}
                              />
                            </label>
                          ))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex flex-col gap-4 mt-10">
                  <h1 className="font-bold text-sm">
                    COMMENDATIONS/RECOMMENDATIONS
                  </h1>
                  <div className="flex flex-col gap-10">
                    <div className="min-w-full">
                      <TextField
                        id="outlined-multiline-static"
                        label="Commendations"
                        multiline
                        fullWidth
                        error={Boolean(errors.comment)}
                        rows={4}
                        {...register("comment", { required: true })}
                        aria-invalid={errors.comment ? "true" : "false"}
                      />
                      {errors.comment?.type === "required" && (
                        <p role="alert" className="text-sm text-red-600">
                          Commendations is required!
                        </p>
                      )}
                    </div>
                    <div className="min-w-full">
                      <TextField
                        id="outlined-multiline-static"
                        label="Recommendations"
                        multiline
                        fullWidth
                        error={Boolean(errors.suggestion)}
                        rows={4}
                        {...register("suggestion", { required: true })}
                        aria-invalid={errors.suggestion ? "true" : "false"}
                      />
                      {errors.suggestion?.type === "required" && (
                        <p role="alert" className="text-sm text-red-600">
                          Recommendations is required!
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="w-full flex justify-between p-4">
                  <img
                    src={Arrow}
                    className="aspect-square h-16 mt-4 border-2 border-black p-4 rounded-full bg-tertiary hover:scale-105 cursor-pointer rotate-180"
                    onClick={handleThirdPage}
                  />
                  <button
                    className="min-w-[150px] py-2 px-6 mt-10  bg-primary  text-white font-bold rounded-lg hover:opacity-95 mb-6 "
                    type="submit"
                  >
                    SUBMIT
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </form>
      <ToastContainer pauseOnHover={false} />
    </div>
  );
};

export default ClassroomObservation;

import React, { useEffect, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { fetchQuestion } from "../../redux/slices/questionSlice/getQuestionsSlice";
import { evaluate, resetStatus } from "../../redux/slices/evaluationSlice/evaluateSlice";
import Skeleton from "@mui/material/Skeleton";
import JwtDecoder from "../JwtDecoder";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { getUserList } from "../../redux/slices/userSlice/getListOfUsersSlice";


const FacultyEvaluation = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = JwtDecoder().decodedToken;
  const schoolYear = userData ? userData?.school_year : "";
  const user_id = userData ? userData?.id : "";
  const session_id = userData ? userData?.session_id : "";
  const role = userData ? userData?.role : "";
  const [pages, setPages] = useState("first-page");
  const { data, loading } = useSelector((state) => state?.getQuestions);
  const status = useSelector((state) => state?.evaluate?.status);
  const type = "EVALUATION OF TEACHERS PERFORMANCE";
  const [firstPageRadioState, setFirstPageRadioState] = useState([]);
  const [secondPageRadioState, setSecondPageRadioState] = useState([]);
  const userList = useSelector((state) => state.userList.data);
  
  const {
    control,
    handleSubmit,
    register,
    reset,
    setValue,
    formState: { errors },
    watch
  } = useForm();


  const watchAllfields = watch(['evaluated_full_name'])
  console.log(watchAllfields)
  
  // filter out the questions
  const firstPageQuestion = data?.questions?.filter(
    (item) => item?.evaluation_type === "People Effectiveness"
  );
  const secondPageQuestion = data?.questions?.filter(
    (item) => item?.evaluation_type === "Organizational Effectiveness"
  );


  const handleNextPage = () => {
    if (
      firstPageRadioState.some(rating => rating === null) ||
      Object.values(watchAllfields).some(value => value === null || value === undefined || value === "")
    ) {
      toast.error("Please fill out all fields.", {
        autoClose: 500,
        theme: "dark",
        pauseOnHover: false,
        closeOnClick: true,
      });
      return;
    }
  
    setPages("second-page");
  };


  const handleFirstPage = () => {
    setPages("first-page");
  };

  const handleOnSubmit = (data) => {
    if (secondPageRadioState.some(rating => rating === null)) {
      toast.error("Please rate all questions.", {
        autoClose: 500,
        theme: "dark",
        pauseOnHover: false,
        closeOnClick: true,
      });
      return;
    }


    const teacher = userList?.users?.find(
      (item) => item.full_name === data.evaluated_full_name
    );
    
    const evaluated_id = teacher ? teacher?.id : null;

    const questionsWithRatings = [
      ...firstPageQuestion.map((item, index) => ({
        question_id: item.id,
        type: item.type,
        question_group: item?.question_group,
        evaluation_type: item?.evaluation_type,
        question_description: item.question_description,
        rating: firstPageRadioState[index],
      })),
      ...secondPageQuestion.map((item, index) => ({
        question_id: item.id,
        type: item.type,
        question_group: item?.question_group,
        evaluation_type: item?.evaluation_type,
        question_description: item.question_description,
        rating: secondPageRadioState[index],
      })),
    ];

    const values = {
      ...data,
      session_id: session_id,
      user_id: user_id,
      subject_name: "N/a",
      strand: "N/a",
      semester: "N/a",
      year_level: "N/a",
      evaluated_id: evaluated_id,
      class_size: "N/a",
      office_services: "N/a",
      no_of_student_present: "N/a",
      no_of_student_late: "N/a",
      length_of_service: "N/a",
      category:  "N/a",
      gender: "N/a",
      suggestion: "N/a",
      questions: questionsWithRatings,
    };
    dispatch(evaluate(values));

    reset({
      school_year: schoolYear,
      evaluated_full_name: "",
      comment: "",
      // Add other fields here if necessary
    });
  };
  const handleFirstPageRadioChange = (index, value) => {
    const newState = [...firstPageRadioState];
    newState[index] = value;
    setFirstPageRadioState(newState);
  };

  const handleSecondPageRadioChange = (index, value) => {
    const newState = [...secondPageRadioState];
    newState[index] = value;
    setSecondPageRadioState(newState);
  };

 
  const GoBackToEvaluationType = () => {
    if (role === "Teacher") {
      
      navigate(-1);
    } else {
      
      navigate("/evaluation-type");
    }
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [pages]);

  useEffect(() => {
    dispatch(fetchQuestion({ type: type }));
    dispatch(getUserList());
  }, [dispatch]);

  useEffect(() => {
    setValue("school_year", schoolYear);
    reset({ school_year: schoolYear });
  }, [schoolYear]);

  useEffect(() => {
    if (status === "success") {
      reset({
        school_year: schoolYear,
        evaluated_full_name: "",
        comment: "",
        // Add other fields here if necessary
      });
        toast.success("Successfully Evaluated", {
          autoClose: 500,
          theme: "dark",
          pauseOnHover: false,
          closeOnClick: true,
        });
        setPages("first-page");
        dispatch(getUserList());

    }

    if (status === "fail") {
      toast.error("Please rate all questions.", {
        autoClose: 500,
        theme: "dark",
      });
    }

    dispatch(resetStatus())
  }, [status, dispatch, reset]);

  useEffect(() => {
   if(status === "success" || status === ""){
    setFirstPageRadioState(Array(firstPageQuestion?.length).fill(null));
    setSecondPageRadioState(Array(secondPageQuestion?.length).fill(null));
   }
  }, [data, status]);

  return (
    <div className=" flex flex-col min-h-screen ">
      <Header />
      <section className="bg-white min-h-full p-4">
        <div className="flex items-center gap-4">
          <img
            src={Arrow}
            className="aspect-square h-7  rotate-180 cursor-pointer "
            onClick={GoBackToEvaluationType}
          />

          <h1 className="text-2xl font-bold">
            EVALUATION OF TEACHERS PERFORMANCE
          </h1>
        </div>
        <h1 className="border border-black mt-2"></h1>
        <Option1
          labelone="Very Poor"
          labeltwo="Poor"
          labelthree="Satisfactory"
          labelfour="Very Satisfactory"
        />
      </section>
      <form
        className="mt-10 p-1 lg:p-4 "
        onSubmit={handleSubmit(handleOnSubmit)}
      >
        <div
          className={`flex flex-col lg:flex-row gap-7  outline-none ${
            pages === "second-page" && "hidden"
          }`}
        >
          <TextField
            id="outlined-basic"
            label="School Year"
            variant="outlined"
            fullWidth
            autoFocus
            InputProps={{
              readOnly: true,
            }}
            {...register("school_year", { required: true })}
          />
          <FormControl fullWidth error={Boolean(errors.evaluated_full_name)}>
            <InputLabel>Teacher</InputLabel>
            <Controller
              name="evaluated_full_name"
              control={control}
              rules={{ required: "Teacher is required!" }}
              render={({ field }) => (
                <Select {...field} label="Teacher" value={field.value || ""}
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
              <p className="text-sm text-red-600">
                {errors.evaluated_full_name.message}
              </p>
            )}
          </FormControl>
          {/* <div className="flex flex-col w-full gap-3 tablet:-translate-y-4">
            <h1 className="font-bold  after:ml-0.5  ">Semester</h1>
            <div className="flex gap-4">
              {[
                { value: "1st Semester", label: "1st Semester" },
                { value: "2nd Semester", label: "2nd Semester" },
              ].map((semester, index) => (
                <div className="flex items-center" key={index}>
                  <input
                    className=" bg-white rounded-lg py-2 w-full pl-4 cursor-pointer "
                    id={`default-radio-${index}`}
                    type="radio"
                    value={semester.value}
                    {...register("semester", {
                      required: "Semester is required!",
                    })}
                  />
                  <label
                    htmlFor={`default-radio-${index}`}
                    className="ms-2 text-sm font-medium  text-black"
                  >
                    {semester.label}
                  </label>
                </div>
              ))}
            </div>
            {errors.semester && (
              <p className="text-sm text-red-600">{errors.semester.message}</p>
            )}
          </div> */}
        </div>
        <div className="mt-10">
          <div className="relative overflow-x-hidden shadow-md sm:rounded-lg  min-w-full">
            {pages === "first-page" ? (
              <>
                <h1 className="text-2xl font-bold">A. People Effectiveness</h1>

                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <thead className="text-xs uppercase bg-secondary text-white border ">
                    <tr>
                      <th
                        scope="col"
                        className="text-2xl px-6 py-3 border-2 border-black"
                      >
                        Question
                      </th>
                      <th className="text-2xl px-6 py-3  text-center border-2 border-black">
                        Rating
                        <div className="flex justify-between mt-4 text-black ">
                          <h1>1</h1>
                          <h1>2</h1>
                          <h1>3</h1>
                          <h1>4</h1>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="h-screen w-screen min-h-full ">
                    {firstPageQuestion?.map((item, index) => (
                      <tr key={index} className="border border-black group ">
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
                          {[1, 2, 3, 4].map((optionValue, optionIndex) => (
                            <label key={optionValue}>
                              <input
                                type="radio"
                                className="cursor-pointer  "
                                value={optionValue.toString()}
                                checked={
                                  firstPageRadioState[index] === optionValue
                                }
                                onChange={() =>
                                  handleFirstPageRadioChange(index, optionValue)
                                }
                                required
                                onInvalid={(e) => {
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
                    className="aspect-square h-16 mt-4 border-2 border-black p-4 rounded-full bg-tertiary hover:scale-105 cursor-pointer"
                    onClick={handleNextPage}
                  />
                </div>
              </>
            ) : (
              <>
                <h1 className="text-2xl font-bold">
                  B. Organizational Effectiveness
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
                      <th className="text-2xl px-6 py-3  text-center border-2 border-black">
                        Rating
                        <div className="flex justify-between mt-4 text-black ">
                          <h1>1</h1>
                          <h1>2</h1>
                          <h1>3</h1>
                          <h1>4</h1>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="h-screen w-screen min-h-full ">
                    {secondPageQuestion?.map((item, index) => (
                      <tr key={index} className="border border-black group">
                        <td className="border border-black  text-primary p-2 group-hover:text-red-600 group-hover:font-bold max-w-52 min-w-52  ">
                          {loading ? (
                            <Skeleton
                              variant="rectangular"
                              width={1000}
                              height={60}
                            />
                          ) : (
                            <>{item?.question_description}</>
                          )}
                        </td>
                        <td className="flex gap-1 justify-between min-w-full items-center p-2">
                          {[1, 2, 3, 4].map((optionValue, optionIndex) => (
                            <label key={optionValue}>
                              <input
                                type="radio"
                                className="cursor-pointer  "
                                value={optionValue.toString()}
                                checked={
                                  secondPageRadioState[index] === optionValue
                                }
                                onChange={() =>
                                  handleSecondPageRadioChange(
                                    index,
                                    optionValue
                                  )
                                }
                                required
                                onInvalid={(e) => {
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
                <div className="flex flex-col gap-2 mt-10">
                  <label className="font-semibold ">
                   Comment
                  </label>
                  <TextField
                    id="outlined-multiline-static"
                    label="Comment"
                    multiline
                    error={Boolean(errors.comment)}
                    rows={4}
                    {...register("comment", { required: true })}
                    aria-invalid={errors.comment ? "true" : "false"}
                  />
                  {errors.comment?.type === "required" && (
                    <p role="alert" className="text-sm text-red-600">
                      Comment is required!
                    </p>
                  )}
                </div>
                <div className="w-full flex justify-between p-4">
                  <img
                    src={Arrow}
                    className="aspect-square h-16 mt-4 border-2 border-black p-4 rounded-full bg-tertiary hover:scale-105 cursor-pointer rotate-180"
                    onClick={handleFirstPage}
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

export default FacultyEvaluation;

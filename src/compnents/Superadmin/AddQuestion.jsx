import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { IconButton } from "@mui/material";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { useForm, Controller } from "react-hook-form";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import { useDispatch, useSelector } from "react-redux";
import {
  addQuestion,
} from "../../redux/slices/questionSlice/addQuestionSlice";
import { resetAddQuestionStatus } from "../../redux/slices/questionSlice/addQuestionSlice";

const evaluationQuestions = {
  "STUDENT EVALUATION OF TEACHING": ["General"],
  "EVALUATION OF TEACHERS PERFORMANCE": [
    "People Effectiveness",
    "Organizational Effectiveness",
  ],
  "CLASSROOM OBSERVATION INSTRUMENT": [
    "Organization",
    "Materials",
    "Instructional Process",
    "Assessment",
  ],
  "ADMINISTRATORS EVALUATION": [
    "Empowerment Skills",
    "Intuition Skill",
    "Self-Understanding Skill",
    "Value Congruence Skill",
    "Vision Skill",
    "General",
  ],
  "EVALUATION INSTRUMENT FOR NON-TEACHING": [
    "Attendance and Punctuality",
    "Appearance",
    "Organizational skills",
    "Initiative",
    "Interpersonal Skills",
    "Work Ethics",
    "Judgment",
    "Attitude",
    "Output",
    "Religiosity",
  ],
  "EVALUATION INSTRUMENT FOR CUSTOMER": [
    "Availability",
    "Client Services",
    "Client Relations",
  ],
};

const AddQuestion = ({ isOpen, closeModal }) => {
  const [evaluationFor, setEvaluationFor] = useState("");
  const [evaluationType, setEvaluationType] = useState("");
  const [type, setType] = useState("")
  const [showSubQuestions, setShowSubQuestions] = useState(false); 
  const { status } = useSelector((state) => state.addQuestion);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
    setValue,
  } = useForm();

  const onSubmitHandler = (data) => {
    let questionGroupValue = "";
    if (evaluationFor === "ADMINISTRATORS EVALUATION" && evaluationType) {
      if (evaluationType === "General" && data.question_group) {
        
        questionGroupValue = data.question_group;
      } else {
       
        const index = evaluationQuestions[evaluationFor].indexOf(evaluationType);
        
        if (index !== -1) {
          questionGroupValue = (index + 1).toString();
        } else {
          
          questionGroupValue = "2";
        }
      }
    } else {
      questionGroupValue = "2";
    }
  
    const value = {
      ...data,
      question_group: questionGroupValue,
    };
    dispatch(addQuestion(value));
  };
  
  
  

  useEffect(() => {
    if (status === "success") {
      reset();
      closeModal();
    }

    setTimeout(() => {
      dispatch(resetAddQuestionStatus());
    }, 1000);
  }, [status, dispatch]);


  const handleGeneralChange = (value) => {
    setEvaluationType(value);
    setShowSubQuestions(value === "General" && evaluationFor === "ADMINISTRATORS EVALUATION"); 
    setValue("evaluation_type", value); 
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto"
          aria-labelledby="modal-title"
          aria-modal="true"
        >
          <div className="flex justify-center pt-10 min-h-screen">
            <div
              className="bg-black bg-opacity-30 absolute inset-0"
              onClick={closeModal}
              tabIndex="-1"
              aria-hidden="true"
            ></div>
            <div className="absolute bg-white rounded-lg p-6 tablet:w-full w-[90%] max-w-lg shadow-xl">
              <div className="modal-content">
                <div className="flex flex-row w-full justify-between items-center">
                  <h5
                    className="modal-title text-xl font-bold"
                    id="modal-title"
                  >
                    ADD QUESTION
                  </h5>

                  <IconButton
                    sx={{ marginTop: "-0.5rem" }}
                    onClick={closeModal}
                  ></IconButton>
                </div>

                <div className="flex flex-col w-full mt-5">
                  <form
                    className="flex flex-col gap-6"
                    onSubmit={handleSubmit(onSubmitHandler)}
                  >
                    <FormControl fullWidth error={Boolean(errors.type)}>
                      <InputLabel id="demo-simple-select-label">
                        Evaluation For
                      </InputLabel>
                      <Controller
                        name="type"
                        control={control}
                        rules={{ required: "Evaluation For is required!" }}
                        render={({ field }) => (
                          <Select
                            {...field}
                            label="Evaluation For"
                            value={evaluationFor}
                            onChange={(e) => {
                              setEvaluationFor(e.target.value);
                              setValue("type", e.target.value); // Set value here
                            }}
                          >
                            {Object.keys(evaluationQuestions).map(
                              (evaluation) => (
                                <MenuItem key={evaluation} value={evaluation}>
                                  {evaluation}
                                </MenuItem>
                              )
                            )}
                          </Select>
                        )}
                      />
                      {errors.type && (
                        <p className="text-sm text-red">
                          {errors.type.message}
                        </p>
                      )}
                    </FormControl>

                    {evaluationFor && (
                      <FormControl
                        fullWidth
                        error={Boolean(errors.evaluation_type)}
                      >
                        <InputLabel id="demo-simple-select-label">
                          Evaluation Type
                        </InputLabel>
                        <Controller
                          name="evaluation_type"
                          control={control}
                          rules={{ required: "Evaluation Type is required!" }}
                          render={({ field }) => (
                            <Select
                              {...field}
                              label="Evaluation Type"
                              value={evaluationType}
                              onChange={(e) =>
                                handleGeneralChange(e.target.value)
                              }
                            >
                              {evaluationQuestions[evaluationFor].map(
                                (type) => (
                                  <MenuItem key={type} value={type}>
                                    {type}
                                  </MenuItem>
                                )
                              )}
                            </Select>
                          )}
                        />
                        {errors.evaluation_type && (
                          <p className="text-sm text-red">
                            {errors.evaluation_type.message}
                          </p>
                        )}
                      </FormControl>
                    )}

                    {showSubQuestions && (
                      <FormControl fullWidth>
                        <InputLabel id="sub-questions-label">
                          Group
                        </InputLabel>
                        <Controller
                          name="question_group"
                          control={control}
                          render={({ field }) => (
                            <Select
                              {...field}
                              label="Sub Questions"
                              value={field.value || ""}
                              onChange={(e) => field.onChange(e.target.value)}
                            >
                              {[3, 4].map((num) => (
                                <MenuItem key={num} value={num}>
                                  {num}
                                </MenuItem>
                              ))}
                            </Select>
                          )}
                        />
                      </FormControl>
                    )}

                    <TextField
                      id="outlined-multiline-flexible"
                      label="Question"
                      multiline
                      error={Boolean(errors.question_description)}
                      minRows={4}
                      fullWidth
                      {...register("question_description", { required: true })}
                      aria-invalid={
                        errors.question_description ? "true" : "false"
                      }
                    />
                    {errors.question_description?.type === "required" && (
                      <p
                        role="alert"
                        className="text-sm text-red -translate-y-5"
                      >
                        Question is required!
                      </p>
                    )}
                    <Button variant="contained" type="submit">
                      ADD QUESTION
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddQuestion;

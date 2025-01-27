import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { IconButton } from "@mui/material";
import TextField from "@mui/material/TextField";
import { useForm } from "react-hook-form";
import { resetUpdateStatus } from "../../redux/slices/questionSlice/updateQuestionSlice";
import { useDispatch, useSelector } from "react-redux";
import { updateQuestion } from "../../redux/slices/questionSlice/updateQuestionSlice";
const UpdateQuestion = ({ isOpen, closeModal, selectedData }) => {
  const dispatch = useDispatch()
  const {status} = useSelector((state) => state.updateUser)
  const updateQuestionStatus = useSelector((state) => state.updateQuestion.status)
 
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();


  const onSubmitHandler = (data) => {
    const value = {...data, 
      type: selectedData?.type,
      question_group: selectedData?.question_group,
      evaluation_type: selectedData?.evaluation_type
    }
    dispatch(updateQuestion({value: value, id: selectedData?.id}))
  };

  useEffect(() => {
    if (updateQuestionStatus === "success"){
      closeModal()
    }
    setTimeout(() => {
      dispatch(resetUpdateStatus());
    }, 1000);
  }, [updateQuestionStatus, dispatch]);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto"
          aria-labelledby="modal-title"
          aria-modal="true"
        >
          <div className="flex justify-center pt-10 min-h-screen">
           
            <div className="absolute bg-white rounded-lg p-6 tablet:w-full w-[90%] max-w-lg shadow-xl">
              <div className="modal-content">
                <div className="flex flex-row w-full justify-between items-center">
                  <h5
                    className="modal-title text-xl font-bold"
                    id="modal-title"
                  >
                   UPDATE QUESTION
                  </h5>

                  <IconButton
                    sx={{ marginTop: "-0.5rem" }}
                    onClick={closeModal}
                  >
                  </IconButton>
                </div>

                <div className="flex flex-col w-full mt-5">
                  <form onSubmit={handleSubmit(onSubmitHandler)}>
                    <TextField
                      fullWidth
                      sx={{
                        marginBottom: "15px",
                      }}
                      label="Question Description"
                      name="question_description"
                      defaultValue={selectedData.question_description}
                      error={errors.question_description ? true : false}
                      {...register("question_description", {
                        required: "Question Description is required",
                  
                      })}
                    />
                    {errors.question_description && (
                      <p className="text-sm text-red w-full mt-[-0.6rem] mb-2 ml-1 text-red-600">
                        {errors.question_description.message}
                      </p>
                    )}
                   
                    <div className="modal-footer mt-4 flex justify-end gap-1">
                      <Button variant="outlined" onClick={closeModal}>
                        CLOSE
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        disableElevation
                      >
                        UPDATE
                      </Button>
                    </div>
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

export default UpdateQuestion;

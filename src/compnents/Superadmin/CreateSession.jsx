import React, { useEffect } from "react";
import { Button } from "@mui/material";
import TextField from "@mui/material/TextField";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { createSession, resetSessionStatus } from "../../redux/slices/SessionSlice/createSessionsSlice";
const CreateSession = ({ isOpen, closeModal }) => {
  const dispatch = useDispatch()
  const {status} = useSelector((state) => state.addSessions)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  const onSubmitHandler = (data) => {
    dispatch(createSession(data))
  };

  useEffect(() => {
    if(status === "success"){
      reset()
      closeModal()
    }

    setTimeout(() => {
      dispatch(resetSessionStatus())
    }, 1000)

  }, [dispatch, status])
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
                    CREATE SESSION
                  </h5>
                  <button onClick={closeModal}>close</button>
                </div>

                <div className="flex flex-col w-full mt-5">
                  <form onSubmit={handleSubmit(onSubmitHandler)}>
                    <TextField
                      fullWidth
                      sx={{
                        marginBottom: "15px",
                      }}
                      label="School Year"
                      name="school_year"
                      error={errors.school_year ? true : false}
                      {...register("school_year", {
                        required: "This is required",
                      })}
                    />
                    {errors.school_year && (
                      <p className="text-sm text-red w-full mt-[-0.6rem] mb-2 ml-1">
                        {errors.school_year.message}
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
                        CREATE
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

export default CreateSession;

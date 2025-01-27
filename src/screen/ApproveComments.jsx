import React, { useEffect, useState } from "react";
import Header from "../compnents/Header";
import ApproveCommentsCard from "../compnents/ApproveCommentsCard";
import { Button } from "@mui/material";
import TextField from "@mui/material/TextField";
import { useDispatch, useSelector } from "react-redux";
import { fetchComments } from "../redux/slices/Comments/getCommentSlice";
import LoadingAnimation from "../compnents/LoadingAnimation";
import { approveAll } from "../redux/slices/Comments/approvedAllSlice";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { useForm } from "react-hook-form";
import { updateComment } from "../redux/slices/Comments/updateCommentSlice";
import { resetStatus } from "../redux/slices/Comments/updateCommentSlice";
import { resetStatusForIndividual } from "../redux/slices/Comments/individualApprovedSlice";
import { resetApproveAllStatus } from "../redux/slices/Comments/approvedAllSlice";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { approveIndividual } from "../redux/slices/Comments/individualApprovedSlice";
import Close from "../assets/close.png";
import { recentComment } from "../redux/slices/Comments/recentCommentSlice";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const ApproveComments = () => {
  const {
    handleSubmit,
    register,
    reset,
    setValue,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const { data, loading } = useSelector((state) => state.getComment);
  console.log(data);
  const recentData = useSelector((state) => state.recentComment.data);
  const approveAllStatus = useSelector((state) => state.approveAll.status);
  const [open, setOpen] = useState(false);
  const [recentOpen, setRecentOpen] = useState(false);
  const [selectedData, setSelectedData] = useState("");

  const [choices, setChoices] = useState("Teacher");

  const handleChange = (event) => {
    setChoices(event.target.value);
  };

  console.log(choices);
  const handleApproveAllComments = () => {
    dispatch(approveAll());
  };

  const openModal = (data) => {
    setSelectedData(data);
    setOpen(true);
    reset({ suggestion: data?.suggestion });
    reset({ comment: data?.comment });
    setValue("comment", data?.comment);
    setValue("suggestion", data?.suggestion);
  };

  const closeModal = () => setOpen(false);

  const handleOnSubmit = (value) => {
    dispatch(updateComment({ data: value, id: selectedData?.id }));
    closeModal();
  };

  const handleApprove = (id) => {
    dispatch(approveIndividual(id));
  };

  const openRecent = () => {
    setRecentOpen(true);
  };

  const closeRecent = () => {
    setRecentOpen(false);
  };

  useEffect(() => {
    dispatch(fetchComments());
    dispatch(recentComment());
  }, [dispatch]);

  useEffect(() => {
    if (approveAllStatus === "success") {
      toast.success("Approve Successfully", {
        autoClose: 500,
        theme: "dark",
        pauseOnHover: false,
        closeOnClick: true,
      });
      setTimeout(() => {
        dispatch(resetApproveAllStatus());
      }, 1000);
    }
  }, [approveAllStatus, dispatch]);

  return (
    <div className="flex flex-col h-screen max-h-full overflow-hidden bg-backgroundColor pb-10 ">
      <Header />
      <div className="flex flex-col gap-10 container mx-auto flex-1 pt-10 px-4  max-h-screen overflow-auto ">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center ">
          <div className="flex gap-4  items-center ">
            <Button
              variant="contained"
              color="secondary"
              disableElevation
              onClick={openRecent}
              className="active:bg-black"
            >
              Recent Approved
            </Button>
            {recentOpen && (
              <img
                src={Close}
                className={`cursor-pointer duration-200 ease-in  aspect-square h-10 transition-transform ${
                  recentOpen ? "block" : "hidden"
                }`}
                onClick={closeRecent}
              />
            )}
          </div>
          <div className="w-80 px-5 ">
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Choice</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={choices}
                label="Type"
                onChange={handleChange}
              >
                <MenuItem value="Teacher">Teachers</MenuItem>
                <MenuItem value="Non-Teaching">Non Teaching</MenuItem>
                <MenuItem value="Admin">Admin</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
        {recentOpen ? (
          <div className="flex gap-10  flex-wrap justify-evenly items-start p-4  ">
            {recentData["Redent Approve Comments & Suggestion"]?.filter(
              (item) => {
                if (choices === "Teacher") {
                  return item?.evaluated_role === "Teacher";
                }
                if (choices === "Non-Teaching") {
                  return item?.evaluated_role === "Non-Teaching";
                }
                if (choices === "Admin") {
                  return (
                    item?.evaluated_role === "Treasurer" ||
                    item?.evaluated_role === "Principal" ||
                    item?.evaluated_role === "Coordinator" ||
                    item?.evaluated_role === "Registrar"
                  );
                }
              }
            ).length <= 0 ? (
              <h1 className="mx-auto text-4xl font-bold uppercase">
                No Recent Data
              </h1>
            ) : (
              <>
                {loading ? (
                  <LoadingAnimation />
                ) : (
                  <>
                    {recentData["Recent Approve Comments & Suggestion"]
                      ?.filter((item) => {
                        if (choices === "Teacher") {
                          return item?.evaluated_role === "Teacher";
                        }
                        if (choices === "Non-Teaching") {
                          return item?.evaluated_role === "Non-Teaching";
                        }
                        if (choices === "Admin") {
                          return (
                            item?.evaluated_role === "Treasurer" ||
                            item?.evaluated_role === "Principal" ||
                            item?.evaluated_role === "Coordinator" ||
                            item?.evaluated_role === "Registrar"
                          );
                        }
                      })
                      .map((item) => (
                        <ApproveCommentsCard
                          evaluator={item?.evaluator_full_name}
                          evaluated={item?.evaluated_full_name}
                          comment={item.comment}
                          suggestion={item.suggestion}
                          editButton={() => openModal(item)}
                        />
                      ))}
                  </>
                  
                )}
              </>
            )}
          </div>
        ) : (
          <>
            <div className="flex flex-1 gap-10 flex-wrap mb-4 justify-evenly">
              {data["Comments & Suggestion"]?.filter((item) => {
                if (choices === "Teacher") {
                  return item?.evaluated_role === "Teacher";
                }
                if (choices === "Non-Teaching") {
                  return item?.evaluated_role === "Non-Teaching";
                }
                if (choices === "Admin") {
                  return (
                    item?.evaluated_role === "Treasurer" ||
                    item?.evaluated_role === "Principal" ||
                    item?.evaluated_role === "Coordinator" ||
                    item?.evaluated_role === "Registrar"
                  );
                }
              }).length <= 0 ? (
                <h1 className="mx-auto text-2xl font-bold uppercase">
                  No Pending{" "}
                </h1>
              ) : (
                <>
                  {loading ? (
                    <LoadingAnimation />
                  ) : (
                    <>
                      {data["Comments & Suggestion"]
                        ?.filter((item) => {
                          if (choices === "Teacher") {
                            return item?.evaluated_role === "Teacher";
                          }
                          if (choices === "Non-Teaching") {
                            return item?.evaluated_role === "Non-Teaching";
                          }
                          if (choices === "Admin") {
                            return (
                              item?.evaluated_role === "Treasurer" ||
                              item?.evaluated_role === "Principal" ||
                              item?.evaluated_role === "Coordinator" ||
                              item?.evaluated_role === "Registrar"
                            );
                          }
                        })
                        .map((item) => (
                          <ApproveCommentsCard
                            evaluator={item?.evaluator_full_name}
                            evaluated={item?.evaluated_full_name}
                            comment={item.comment}
                            suggestion={item.suggestion}
                            editButton={() => openModal(item)}
                            approveClick={() => handleApprove(item?.id)}
                            isOpen={recentOpen}
                          />
                        ))}
                    </>
                  )}
                </>
              )}
            </div>
          </>
        )}
      </div>
     
      {!recentOpen && <button className={`absolute bottom-0 md:right-0  m-4 shadow-md drop-shadow-md shadow-primary text-[12px] p-2 bg-primary text-white rounded-full aspect-square h-20  font-bold`} onClick={handleApproveAllComments}   disabled={data["Comments & Suggestion"]?.length <= 0}
      >APPROVE ALL</button>}
                 
      <Modal open={open} onClose={closeModal}>
        <form onSubmit={handleSubmit(handleOnSubmit)}>
          <Box sx={style}>
            <div className="flex flex-col gap-4">
              <>
                <TextField
                  id="outlined-basic"
                  label="Comment"
                  variant="outlined"
                  multiline
                  rows={4}
                  fullWidth
                  {...register("comment", { required: true })}
                  aria-invalid={errors.comment ? "true" : "false"}
                />
                {errors.comment?.type === "required" && (
                  <p
                    role="alert"
                    className="text-sm text-red-600 -translate-y-4  "
                  >
                    Comment is required!
                  </p>
                )}
              </>
              <>
                <TextField
                  id="outlined-basic"
                  label="Suggestion"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={4}
                  {...register("suggestion", { required: true })}
                  aria-invalid={errors.suggestion ? "true" : "false"}
                />
                {errors.suggestion?.type === "required" && (
                  <p
                    role="alert"
                    className="text-sm text-red-600 -translate-y-4"
                  >
                    Suggestion is required
                  </p>
                )}
              </>
            </div>
            <button
              type="submit"
              className="border-[1px] px-2 py-2 rounded-e-xl rounded-es-xl bg-primary text-white hover:scale-105 w-full mt-4"
            >
              Done
            </button>
          </Box>
        </form>
      </Modal>
      <ToastContainer pauseOnHover={false} />
    </div>
  );
};

export default ApproveComments;

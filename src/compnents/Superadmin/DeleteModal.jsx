import React, {useEffect} from "react";
import { Button } from "@mui/material";
import { IconButton } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { deleteUser } from "../../redux/slices/SuperAdminUserSlice/deleteUserSlice";
import { deleteUserStatus } from "../../redux/slices/SuperAdminUserSlice/deleteUserSlice";
const DeleteModal = ({ isOpen, closeModal, selectedData }) => {
  const dispatch = useDispatch()
  const {status} = useSelector((state) => state.deleteUser)

  const onSubmitHandler = () => {
    dispatch(deleteUser({id: selectedData}))
  };


  useEffect(() => {
    if (status === "success") {
      closeModal();
    }

    setTimeout(() => {
      dispatch(deleteUserStatus());
    }, 1000);
  }, [status, dispatch]);
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
                    NOTIFICATION
                  </h5>

                  <IconButton
                    sx={{ marginTop: "-0.5rem" }}
                    onClick={closeModal}
                  >
                   
                  </IconButton>
                </div>

                <div className="flex flex-col w-full">
                  <p className="text-black text-[18px] my-2">
                    Are you sure you want remove it?
                  </p>
                  <div className="modal-footer mt-4 flex justify-end gap-1">
                    <Button variant="outlined" onClick={closeModal}>
                      CLOSE
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      disableElevation
                      onClick={onSubmitHandler}
                    >
                      REMOVE
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteModal;

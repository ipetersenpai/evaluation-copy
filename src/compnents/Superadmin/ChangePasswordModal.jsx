import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";
import { AsyncChangeUserPassword } from "../../redux/slices/authSlice/changeUserPasswordSlice";
import { toast } from "react-toastify";

const ChangePasswordModal = ({ isOpen, onClose, userId }) => {

    console.log(userId);
  const [newPassword, setNewPassword] = useState("");
  const dispatch = useDispatch();
  const { loading, status, error } = useSelector((state) => state.changePassword);

  const handleSubmit = () => {
    if (!newPassword.trim()) {
      toast.error("Password cannot be empty!");
      return;
    }

    dispatch(AsyncChangeUserPassword({ id: userId, newPassword }));
    onClose();
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" mb={2}>
          Change Password
        </Typography>
        <TextField
          label="New Password"
          type="password"
          fullWidth
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Changing..." : "Change Password"}
        </Button>
        {status === "failed" && <Typography color="error" mt={2}>{error}</Typography>}
      </Box>
    </Modal>
  );
};

export default ChangePasswordModal;

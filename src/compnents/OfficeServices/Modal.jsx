import React, { useState } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import close from "../../assets/close.png";
const Modal = ({ closemodal }) => {
  const [officeServiceType, setOfficeServiceType] = useState("");

  // function handle office type changes
  const handleOfficeTypeChange = (event) => {
    setOfficeServiceType(event.target.value);
  };
  return (
    <div className="flex flex-col justify-center items-center absolute  w-screen h-screen backdrop-brightness-75 overflow-hidden px-4 py-10">
      <div className="bg-white drop-shadow-2xl shadow-md shadow-primary rounded-lg flex-1 w-full lg:min-w-[1000px] lg:min-h-[600px]">
        <div className="flex justify-between p-4 ">
          <div className="min-w-[250px] lg:min-w-96 lg:max-w-96">
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                Office Services
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={officeServiceType}
                label="Office Services"
                onChange={handleOfficeTypeChange}
              >
                <MenuItem value="Business office">Business office</MenuItem>
                <MenuItem value="Receiving cashier">Receiving cashier</MenuItem>
                <MenuItem value="Store">Store </MenuItem>
                <MenuItem value="Cafeteria">Cafeteria </MenuItem>
                <MenuItem value="School Nurse">School Nurse</MenuItem>
                <MenuItem value="Home Deans">Home Deans</MenuItem>
                <MenuItem value="Security Guards">Security Guards</MenuItem>
                <MenuItem value="Guidance Counselor">
                  Guidance Counselor
                </MenuItem>
                <MenuItem value="Librarian">Librarian</MenuItem>
                <MenuItem value="Registrar">Registrar</MenuItem>
              </Select>
            </FormControl>
          </div>
          <button onClick={closemodal}>
            <img src={close} className="aspect-square h-10" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;

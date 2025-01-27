import "./App.css";
import { useState, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import JwtDecoder from "./compnents/JwtDecoder";
import ProtectedRoutes from "./NavigatorComponents/Protected";
import UnProtectedRoutes from "./NavigatorComponents/Unprotected";
function App() {
  const token = JwtDecoder().isTokenValid;
  const userData = JwtDecoder().decodedToken;
  const role = userData ? userData?.role : null;
  const [isLoading, setIsloading] = useState(true);

  useEffect(() => {
    if (token) {
      setIsloading(false);
    } else {
      setIsloading(false);
    }
  }, [token]);
  return (
    <>
      {isLoading ? undefined : (
        <BrowserRouter>
          {token ? <ProtectedRoutes role={role} /> : <UnProtectedRoutes />}
        </BrowserRouter>
      )}
    </>
  );
}

export default App;

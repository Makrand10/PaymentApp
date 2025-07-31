import {
  BrowserRouter,
  Route,
  Routes,
  Navigate
} from "react-router-dom";

import  Signup from "./pages/Signup";
import  SignIn  from "./pages/Signin";
import Dashboard  from "./pages/Dashboard";
import { SendMoney } from "./pages/SendMoney";
import UserInfo from "./pages/UserInfo";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/signin" replace />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/send" element={<SendMoney />} />
        <Route path="/userinfo" element={<UserInfo />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

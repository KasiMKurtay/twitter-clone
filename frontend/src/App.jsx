import { Route, Routes } from "react-router-dom";
import SignupPage from "./pages/auth/signup/SignupPage";
import LoginPage from "./pages/auth/login/LoginPage";
import HomePage from "./pages/home/HomePage";
import Sidebar from "./components/svgs/common/Sidebar";
import RightPanel from "./components/svgs/common/RightPanel";
const App = () => {
  return (
    <div className="flex max-w-6xl mx-auto">
      <Sidebar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
      <RightPanel />
    </div>
  );
};

export default App;

import "./App.css";
import Layout from "./layout/Layout";
import DashboardLayout from "./layout/DashboardLayout";
import Home from "./components/Home";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Dashboard from "./pages/Dashboard";
import CalendarPage from "./pages/CalendarPage";
import { Route, Routes } from "react-router";
import Medications from "./pages/Medications";
import LoginRegisterLayout from "./layout/LoginRegisterLayout";
import Refills from "./pages/Refills";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <Routes>
      {/* Public routes with main layout */}
      <Route element={<Layout />}>
        <Route index element={<Home />} path="/" />
      </Route>

      {/* Login&Register routes with differnt NavBar layout */}
      <Route element={<LoginRegisterLayout />}>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Route>

      {/* Dashboard routes with sidebar layout */}
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/calendar" element={<CalendarPage />} />
        {/* Add more dashboard routes here */}
        <Route path="/medications" element={<Medications />} />
        <Route path="/refills" element={<Refills />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}

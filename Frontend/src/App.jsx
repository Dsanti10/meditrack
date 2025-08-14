import "./App.css";
import Layout from "./layout/Layout";
import DashboardLayout from "./layout/DashboardLayout";
import Home from "./components/Home";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Dashboard from "./components/Dashboard";
import CalendarPage from "./pages/CalendarPage";
import { Route, Routes } from "react-router";

export default function App() {
  return (
    <Routes>
      {/* Public routes with main layout */}
      <Route element={<Layout />}>
        <Route index element={<Home />} path="/" />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Route>

      {/* Dashboard routes with sidebar layout */}
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/calendar" element={<CalendarPage />} />
        {/* Add more dashboard routes here */}
        <Route path="/medications" element={<div>Medications Page</div>} />
        <Route path="/refills" element={<div>Refills Page</div>} />
        <Route path="/profile" element={<div>Profile Page</div>} />
        <Route path="/settings" element={<div>Settings Page</div>} />
      </Route>
    </Routes>
  );
}

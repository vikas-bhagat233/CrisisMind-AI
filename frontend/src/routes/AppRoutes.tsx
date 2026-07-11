import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home/Home";
import Analyze from "../pages/Analyze/Analyze";
import Dashboard from "../pages/Dashboard/Dashboard";
import Report from "../pages/Report/Report";
import History from "../pages/History/History";
import Settings from "../pages/Settings/Settings";
import NotFound from "../pages/NotFound/NotFound";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/analyze" element={<Analyze />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/report/:id" element={<Report />} />
      <Route path="/history" element={<History />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

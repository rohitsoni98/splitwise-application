import React from "react";
import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import { Box, Stack, Paper } from "@mui/material";
import Navbar from "./view/navbar/Navbar";
import SidePanel from "./view/sidePanel/SidePanel";
import Dashboard from "./view/pages/dashboard/Dashboard";
import Expenses from "./view/pages/expenses/Expenses";
import Login from "./view/pages/login/Login";
import FriendExpenses from "./view/pages/friendExpenses/FriendExpenses";
import "./app.scss";

const SplitWiseLayout = () => {
  return (
    <Stack direction="row">
      <SidePanel />
      <Paper
        sx={{
          flexGrow: 2,
          maxWidth: 520,
          minWidth: 400,
          height: "calc(100vh - 50px)",
          overflowY: "scroll",
        }}
      >
        <Outlet />
      </Paper>
      <Box flexGrow={1} flexShrink={0} />
    </Stack>
  );
};

const ProtectedRoute = ({ children }) => {
  const activeUserId = localStorage.getItem("activeUserId");
  return activeUserId ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route
          element={
            <ProtectedRoute>
              <SplitWiseLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/friends/:id" element={<FriendExpenses />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;

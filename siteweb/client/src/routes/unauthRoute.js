import React, { Component, Redirect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import * as ROUTES from "./routes";
import AdminNavigation from "../components/admin/admin_navigation/adminSidebar";
import useFindUser from "../hooks/useFindUser";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import logo from "../assets/logo_final.png";
const UnauthRoute = (props) => {
  const navigate = useNavigate();

  const { user, isLoading } = useFindUser();

  console.log(user);
  console.log(isLoading);

  return isLoading ? (
    <div className="loading-page">
      <img src={logo} />
      <CircularProgress color="inherit" size={60} thickness={4} />
    </div>
  ) : !user ? (
    <Outlet />
  ) : user.role == "user" ? (
    navigate("/home")
  ) : (
    navigate("/dashboard")
  );
};
export default UnauthRoute;

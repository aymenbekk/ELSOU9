import React, { Component } from "react";
import { Navigate, Outlet } from "react-router-dom";
import useFindUser from "../hooks/useFindUser";
import * as ROUTES from "./routes";
import { useLocation, useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import logo from "../assets/logo_final.png";
const AuthRout = (props) => {
  const navigate = useNavigate();

  const { user, isLoading } = useFindUser();

  return isLoading ? (
    <div className="loading-page">
      <img src={logo} />
      <CircularProgress color="inherit" size={60} thickness={4} />
    </div>
  ) : user ? (
    <Outlet />
  ) : (
    navigate("/")
  );
};
export default AuthRout;

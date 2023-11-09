import React, { Component, Redirect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import useFindUser from "../hooks/useFindUser";
import { useLocation, useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
const ClientRoute = (props) => {
  const navigate = useNavigate();

  const { user, isLoading } = useFindUser();

  if (!user) return navigate("/");

  return isLoading ? (
    <div className="client-route-loading">
      <CircularProgress color="inherit" size={60} thickness={4} />
    </div>
  ) : user.role == "user" ? (
    <Outlet />
  ) : (
    navigate("/dashboard")
  );
};

export default ClientRoute;

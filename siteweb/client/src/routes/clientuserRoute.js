import React, { Component, Redirect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import * as ROUTES from "../routes/routes";
import AdminNavigation from "../components/admin/admin_navigation/adminSidebar";
import useFindUser from "../hooks/useFindUser";
import { useLocation, useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import "./style.css";
const ClientUserRoute = (props) => {
  const navigate = useNavigate();

  const { user, isLoading } = useFindUser();

  if (isLoading)
    return (
      <div className="client-route-loading">
        <CircularProgress color="inherit" size={60} thickness={4} />
      </div>
    );
  else if (user)
    return user.role != "admin" ? <Outlet /> : navigate("/dashboard");
  else return <Outlet />;
};
export default ClientUserRoute;

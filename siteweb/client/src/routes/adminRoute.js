import React, { Componen } from "react";
import { Navigate, Outlet } from "react-router-dom";
import * as ROUTES from "../routes/routes";
import useFindUser from "../hooks/useFindUser";
import { useLocation, useNavigate } from "react-router-dom";

function AdminRoute(props) {
  const navigate = useNavigate();
  const { user, isLoading } = useFindUser();
  if (!user) return navigate("/");

  return isLoading ? (
    <h1>LOADING</h1>
  ) : user.role == "admin" ? (
    <Outlet />
  ) : (
    navigate("/home")
  );


  {
    /*  
  if (props.user && props.role == "admin") return <Outlet />;
  else if (props.user && props.user.role == "user")
    return <Navigate to={ROUTES.HOME} />;
  else {
    return <Navigate to={ROUTES.LANDING} />;
  }
   */
  }
}
export default AdminRoute;

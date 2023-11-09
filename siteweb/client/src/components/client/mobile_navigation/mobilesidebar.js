import React, { Component, useState } from "react";
import "./mobilenav.css";
import { useNavigate } from "react-router-dom";
import * as ROUTES from "../../../routes/routes";
import useFindUser from "../../../hooks/useFindUser";
import { IoIosArrowDown } from "react-icons/io";
function MobileSidebar(props) {
  const { user, isLoading } = useFindUser();
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.open(`http://localhost:4000/auth/google/logout`, "_self");
  };
  return (
    <div>
      <div
        className={props.isOpen ? "sidemobile sidemobile--open" : "sidemobile"}
      >
        <span onClick={props.toggleSide}>X</span>

        <div className="items">
          <ul>
            <li
              onClick={() => {
                navigate("home");
                props.toggleSide();
              }}
            >
              ACCEUIL
            </li>
            <li
              onClick={() => {
                navigate("/user/shop");
                props.toggleSide();
              }}
            >
              SHOP
            </li>
            <li
              onClick={() => {
                navigate("/user/serviceDeBagages");
                props.toggleSide();
              }}
            >
              SERVICE DE BAGAGE
            </li>
            <li
              onClick={() => {
                navigate("/user/Contactez-nous");
                props.toggleSide();
              }}
            >
              NOUS-CONTACTEZ
            </li>
            {user ? (
              <>
                <li
                  onClick={() => {
                    navigate("/client/compte");
                    props.toggleSide();
                  }}
                >
                  MON COMPTE
                </li>
                <li onClick={handleLogout}>DECONNEXION</li>
              </>
            ) : (
              <li
                onClick={() => {
                  navigate(ROUTES.SIGNIN);
                }}
              >
                CONNEXION / INSCRIPTION
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
export default MobileSidebar;

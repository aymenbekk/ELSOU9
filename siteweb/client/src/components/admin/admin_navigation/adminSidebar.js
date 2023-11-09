import React, { Component } from "react";
import { Link, NavLink } from "react-router-dom";
import { AiFillHome } from "react-icons/ai";
import { IoIosArchive } from "react-icons/io";
import { BsTagFill } from "react-icons/bs";
import { BsFillInboxesFill } from "react-icons/bs";
import { MdManageAccounts } from "react-icons/md";
import { TbTypography } from "react-icons/tb";
import "./adminSidebar.css";
import * as ROUTES from "../../../routes/routes";
import log from "../../../assets/logo_final.png";
import useFindUser from "../../../hooks/useFindUser";
function AdminSidebar() {
  let activeStyle = {
    color: "#d3ad32",
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.open(`http://localhost:4000/auth/google/logout`, "_self");
  };
  return (
    <div className={`sideadmin`}>
      <div className="top-section">
        <div className="logo">
          <img src={log} />
        </div>
      </div>
      <div className="elements-container">
        <ul>
          <li>
            <NavLink
              style={({ isActive }) => (isActive ? activeStyle : undefined)}
              to="/dashboard"
              className="element"
            >
              <div className="icony">
                <AiFillHome />
              </div>
              <span> Dashboard</span>
            </NavLink>
          </li>
          <li>
            {/* <NavLink
              style={({ isActive }) => (isActive ? activeStyle : undefined)}
              to="/admin/addProduct"
              className="element"
            > */}
            <NavLink to="/admin/addProduct/add" className="element">
              <div className="icony">
                <IoIosArchive />
              </div>
              <span>Nouveau Produit </span>
            </NavLink>
          </li>
          <li>
            <NavLink
              style={({ isActive }) => (isActive ? activeStyle : undefined)}
              to="/admin/produits"
              className="element"
            >
              <div className="icony">
                <IoIosArchive />
              </div>
              <span> Produits</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              style={({ isActive }) => (isActive ? activeStyle : undefined)}
              to="/admin/categories"
              className="element"
            >
              <div className="icony">
                <BsTagFill />
              </div>
              <span> Categories</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              style={({ isActive }) => (isActive ? activeStyle : undefined)}
              to="/admin/commandes"
              className="element"
            >
              <div className="icony">
                <BsFillInboxesFill />
              </div>
              <span> Commandes</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              style={({ isActive }) => (isActive ? activeStyle : undefined)}
              to="/admin/moncompte"
              className="element"
            >
              <div className="icony">
                <MdManageAccounts />
              </div>
              <span> Mon Compte</span>
            </NavLink>
          </li>
          <button onClick={handleLogout}>Deconnexion</button>
        </ul>
      </div>
    </div>
  );
}

export default AdminSidebar;

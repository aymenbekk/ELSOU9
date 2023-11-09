import React, { Component, useState } from "react";
import { AiOutlineArrowDown } from "react-icons/ai";
import { NavLink } from "react-router-dom";
import "./categories.css";

function Category({ item, toggleFilter }) {

  const [open, setOpen] = useState(false);
  let activeStyle = {
    fontWeight: "bold",
  };

  const generateCategoriesTree = (item) => {
    if (item.children.length > 0) {
      return (
        <li>
          <div className={open ? "category open" : "category"}>
            <div className="category-title">
              <NavLink
                to={`/user/shop/${item._id}`}
                onClick={({ isActive }) =>
                  isActive ? () => setOpen(true) : undefined
                }
                style={({ isActive }) => (isActive ? activeStyle : undefined)}
                //to={item.path}
              >
                {item.name}
              </NavLink>

              <i onClick={() => setOpen(!open)}>
                <AiOutlineArrowDown />
              </i>
            </div>
            <div className="sous-category">
              {item.children.map((child, index) => (
                <NavLink
                  to={`/user/shop/${child._id}`}
                  style={({ isActive }) => (isActive ? activeStyle : undefined)}
                  onClick={() => setOpen(true)}
                >
                  {child.name}
                </NavLink>
              ))}
            </div>
          </div>
          <hr class="solid3"></hr>
        </li>
      );
    } else {
      return (
        <li>
          <NavLink className="category plain">{item.name}</NavLink>
          <hr class="solid3"></hr>
        </li>
      );
    }
  };

  return generateCategoriesTree(item);
}
export default Category;

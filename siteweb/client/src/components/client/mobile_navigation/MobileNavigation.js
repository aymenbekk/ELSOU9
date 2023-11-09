import React, { Component, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import logo from "../../../assets/elsou9.png";
import { AiOutlineShoppingCart } from "react-icons/ai";
import MobileSidebar from "./mobilesidebar";
import { FaSearch, FaShoppingCart } from "react-icons/fa";
import elsou9text from "../../../assets/elsou9text.png";
function MobileNavigation(props) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleSide = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className="nav-mobile">
      <span onClick={toggleSide}>
        <GiHamburgerMenu />
      </span>
      <div className="logo">
        <img src={logo} />
        <img src={elsou9text} />
      </div>
      <div className="shopping-cart">
        <AiOutlineShoppingCart onClick={props.toggleSideCart} />
      </div>

      <MobileSidebar isOpen={isOpen} toggleSide={toggleSide} />
    </div>
  );
}
export default MobileNavigation;

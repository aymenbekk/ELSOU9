import React, { Component, useState } from "react";
import "./style.css";
import { VscAccount } from "react-icons/vsc";
import { AiOutlineLogout } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { IoIosArrowDown } from "react-icons/io";
import user from "../../../assets/aymen.jpg";
import { useTranslation } from 'react-i18next'

function UserAvatar(props) {
  const user = props.user;

  const {t} = useTranslation()

  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.open(`http://localhost:4000/auth/google/logout`, "_self");
  };
  const show = () => {
    setIsOpen(true);
    console.log(isOpen);
  };
  return (
    <div>
      <div className="user-avatar" onClick={show}>
        <span>{user.lastName}</span>
        <div className="avatar-icon">
          <img src={user.picture} />
        </div>
        <span>
          <IoIosArrowDown />
        </span>
      </div>

      <div
        className={isOpen ? "menu-user-avatar active" : "menu-user-avatar"}
        onMouseLeave={() => setIsOpen(false)}
        onClick={() => setIsOpen(false)}
      >
        <div onClick={() => navigate("/client/compte")}>
          <span>{t('my_account')}</span>
          <span>
            <VscAccount />
          </span>
        </div>
        <div onClick={handleLogout}>
          <span>{t('logout')}</span>
          <span>
            <AiOutlineLogout />
          </span>
        </div>
      </div>
    </div>
  );
}
export default UserAvatar;

import React, { Component, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import { useTranslation } from "react-i18next";
import "./stepTracker.css";
function StepTracker(props) {
  const { t } = useTranslation();

  const [width, setWidth] = useState(window.innerWidth);
  const isMobile = width <= 630;
  let activeStyle = {
    color: "#0c1013",
  };
  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }
  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);

    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);
  if (isMobile == true)
    return (
      <div className="steptracker-mobile">
        {props.value == "1" && <span>{t("cart")}</span>}
        {props.value == "2" && <span>{t("commande_detail")}</span>}
        {props.value == "3" && <span>{t("payment")}</span>}
        {props.value == "4" && <span>{t("order_completed")}</span>}
      </div>
    );
  return (
    <div className="steptracker">
      <NavLink
        to={
          props.value > "1" && props.value != "4" ? "/client/checkoutStep1" : ""
        }
        style={props.value == "1" ? activeStyle : undefined}
      >
        {t("cart")}
      </NavLink>
      <span>
        <IoIosArrowForward />
      </span>
      <NavLink
        to={
          props.value > "2" && props.value != "4" ? "/client/checkoutStep2" : ""
        }
        style={props.value == "2" ? activeStyle : undefined}
      >
        {t("commande_detail")}
      </NavLink>
      <span>
        <IoIosArrowForward />
      </span>
      <NavLink
        to={
          props.value > "3" && props.value != "4" ? "/client/checkoutStep3" : ""
        }
        style={props.value == "3" ? activeStyle : undefined}
      >
        {t("payment")}
      </NavLink>
      <span>
        <IoIosArrowForward />
      </span>

      <NavLink style={props.value == "4" ? activeStyle : undefined}>
        {t("order_completed")}
      </NavLink>
    </div>
  );
}
export default StepTracker;

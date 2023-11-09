import React, { Component } from "react";
import { useNavigate } from "react-router-dom";
import StepTracker from "../stepTracker";
import "./step4.css";
import accept from "../../../../assets/accept.png";
import { useTranslation } from "react-i18next";
function CommandeTermine(props) {
  const navigate = useNavigate();
  props.funcNav(true);
  const { t } = useTranslation();
  return (
    <div className="step4-container">
      <StepTracker value="4" />
      <div className="sous-step4">
        <img src={accept} />
        <div className="span-payment">
          <span>{t("payment_1")}</span>
          <span>{t("payment_2")}</span>
        </div>
        <button onClick={() => navigate("/home")}> {t("home")}</button>
      </div>
    </div>
  );
}
export default CommandeTermine;

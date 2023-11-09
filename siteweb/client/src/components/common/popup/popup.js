import React, { Component, useState } from "react";
import "../landing_page/style_landing.css";
import SignIn from "../signin/signin";
function Popup(props) {
  return (
    <div className={"modal"}>
      <div className="overlay">
        <div className="modal-content">
          <SignIn toggleModal={props.toggleModal} />
          <button className="close-modal" onClick={props.toggleModal}>
            X
          </button>
        </div>
      </div>
    </div>
  );
}
export default Popup;

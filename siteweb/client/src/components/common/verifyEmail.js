import React, { Component, useEffect } from "react";
import axios from "../../helpers/axios";
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import * as ROUTES from "../../routes/routes";
import { Navigate, useNavigate } from "react-router-dom";
import "./verify.css";
import { MdOutlineMarkEmailRead } from "react-icons/md";
const VerifyEmail = () => {
  const navigate = useNavigate();

  const [validUrl, setValidUrl] = useState(false);
  const param = useParams();

  useEffect(() => {
    const verifyEmailUrl = async () => {
      try {
        const { res } = await axios.get(
          `auth/${param.id}/verify/${param.token}`
        );
        console.log("verifyEmail", res);
        setValidUrl(true);
      } catch (error) {
        console.log("verifyEmail", error);
        setValidUrl(false);
      }
    };
    verifyEmailUrl();
  }, [param]);

  const toLogin = () => {
    navigate(ROUTES.LANDING);
  };

  return (
    <div>
      {validUrl ? (
        <div className="verify-email-container">
          <div>
            <i>
              <MdOutlineMarkEmailRead />
            </i>

            <h1>Email verified successfully</h1>
            <button onClick={toLogin}>Back to Login</button>
          </div>
        </div>
      ) : (
        <h1>404 Not Found</h1>
      )}
    </div>
  );
};
export default VerifyEmail;

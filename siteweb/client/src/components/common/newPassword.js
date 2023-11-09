import React, { Component, useEffect } from "react";
import axios from "../../helpers/axios";
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import * as ROUTES from "../../routes/routes";
import { Navigate, useNavigate } from "react-router-dom";

const NewPassword = () => {
  const navigate = useNavigate();

  const [validUrl, setValidUrl] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const param = useParams();

  useEffect(() => {
    const verifyUrl = async () => {
      try {
        const { res } = await axios.get(`password/${param.id}/${param.token}`);
        console.log(res);
        setValidUrl(true);
      } catch (error) {
        console.log(error);
        setValidUrl(false);
      }
    };

    verifyUrl();
  }, [param]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`password/${param.id}/${param.token}`, {
        password,
      });
      setMsg(res.data.message);
      setError("");
      navigate(ROUTES.LANDING);
    } catch (error) {
      if (error.response) {
        if (error.response.status == 400 || error.response.status == 500) {
          setError(error.response.data.error);
        }
      }
    }
  };

  return (
    <div>
      {validUrl ? (
        <div className="verify-email-container">
          <form onSubmit={handleSubmit}>
            <h1>Modifier Votre Mot de passe</h1>
            <input
              type="password"
              placeholder="Mot de passe"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />

            {error && <div>{error}</div>}
            {msg && <div>{msg}</div>}
            <button type="submit">Submit</button>
          </form>
        </div>
      ) : (
        <div className="verify-email-container">
          <h1>404 Not Found</h1>
        </div>
      )}
    </div>
  );
};
export default NewPassword;

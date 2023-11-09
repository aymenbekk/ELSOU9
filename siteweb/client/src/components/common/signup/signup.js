import React, { Component } from "react";
import "../signin/signin.css";
import { useState } from "react";
import axios from "../../../helpers/axios";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useTranslation } from "react-i18next";
import { BiHide, BiShow } from "react-icons/bi";
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
function SignUp() {
  const { t } = useTranslation();

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [state, setState] = React.useState({
    vertical: "bottom",
    horizontal: "center",
  });
  const { vertical, horizontal } = state;
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [password2, setPassword2] = useState("");
  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  const handlePass2 = (e) => {
    setPassword2(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (data.password != password2) {
      setError("Mot de passe ne correspond pas");
      setOpen(true);
      return;
    }
    try {
      const { data: res } = await axios.post("/auth/signup", data);
      setError("");
      setMsg(res.message);
      setOpen(true);
    } catch (error) {
      if (error.response) {
        if (error.response.status == 400 || error.response.status == 500) {
          setError(error.response.data.error);
          setOpen(true);
        }
      }
    }
  };

  return (
    <div className="connexion">
      <form onSubmit={handleSubmit}>
        <div className="first-info">
          <div>
            <label for="nom">{t("landing_name")} *</label>
            <input
              type="text"
              name="firstName"
              id="nom"
              value={data.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label for="password">Prenom *</label>
            <input
              type="text"
              name="lastName"
              id="prenom"
              value={data.lastName}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="info">
          <label for="email">{t("popup_email")} *</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder=""
            value={data.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="info">
          <label for="password">{t("password")} *</label>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            id="password"
            value={data.password}
            onChange={handleChange}
            required
          />
          {showPassword ? (
            <i onClick={() => setShowPassword(!showPassword)}>
              <BiShow />
            </i>
          ) : (
            <i onClick={() => setShowPassword(!showPassword)}>
              <BiHide />
            </i>
          )}
        </div>
        <div className="info">
          <label for="confirm">Confirmer Mot de passe *</label>
          <input
            onChange={(e) => setPassword2(e.target.value)}
            type={showPassword ? "text" : "password"}
            name="confirm"
            id="confirm"
            required
          />
        </div>

        <button type="submit">{t("register")}</button>
      </form>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        key={vertical + horizontal}
        open={open}
        autoHideDuration={4000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          sx={{ width: "100%" }}
          severity={error != "" ? "error" : "success"}
        >
          {error}
          {msg}
        </Alert>
      </Snackbar>
    </div>
  );
}
export default SignUp;

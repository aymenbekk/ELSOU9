import React, { Component, useState, useEffect } from "react";
import { HiHome } from "react-icons/hi";
import { Link } from "react-router-dom";
import "./signin.css";
import logo from "../../../assets/elsou9.png";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { FcGoogle } from "react-icons/fc";
import SignUp from "../signup/signup";
import axios from "../../../helpers/axios";
import * as ROUTES from "../../../routes/routes";
import { useTranslation } from "react-i18next";
import { Navigate, useNavigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

import { BiHide, BiShow } from "react-icons/bi";
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
function SignIn(props) {
  const [state, setState] = React.useState({
    vertical: "bottom",
    horizontal: "center",
  });
  const { vertical, horizontal } = state;
  const [open, setOpen] = useState(false);

  const { t } = useTranslation();

  const [value, setValue] = React.useState("1");
  const [width, setWidth] = useState(window.innerWidth);
  const [passReset, setPassReset] = useState(false);

  const [resetEmail, setResetEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const isMobile = width <= 768;
  const navigate = useNavigate();

  const changeConnexion = () => {
    setPassReset(!passReset);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [showPassword, setShowPassword] = useState(false);
  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }
  // {
  isMobile && props.funcNav(false);
  // }
  const google = async () => {
    window.open(`${process.env.REACT_APP_URL}/auth/google`, "_self");
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("auth/signin", { email, password });
      if (res.status == 201) {
        // User not verified yet (send verification Email)
        setMsg(res.data.message);
        setOpen(true);
      } else if (res.status == 200) {
        // User verified
        console.log(res.data.token);
        console.log(res.data.user);
        localStorage.setItem("token", res.data.token);
        // if (res.data.user.role == "user") navigate(ROUTES.HOME);
        //props.toggleModal();
        window.location.reload(false);
        navigate("/home");
      }
    } catch (error) {
      if (error.response) {
        setOpen(true);
        setError(error.response.data.error);
      }
    }
  };

  const sendPasswordLink = async (e) => {
    try {
      const res = await axios.post("/password/send_password_link", {
        email: resetEmail,
      });
      setError(null);
      setResetEmail("");
      setMsg(res.data.message);
      setOpen(true);
    } catch (error) {
      if (error.response) {
        if (error.response.status == 400 || error.response.status == 500) {
          console.log(error.response.data);
          setOpen(true);
          setError(error.response.data.error);
        }
      }
    }
  };
  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  const togglePassReset = () => {
    props.toggleModal();
  };
  return (
    <div className="container_sign">
      {isMobile && (
        <div className="head">
          <span>
            <HiHome />
          </span>
          <Link to="/">
            <img src={logo}></img>
          </Link>
        </div>
      )}

      <TabContext value={value}>
        <Box
          sx={{
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <TabList
            onChange={handleChange}
            centered
            TabIndicatorProps={{ style: { background: "#d3ad32" } }}
          >
            <Tab
              label={
                <span
                  style={{
                    color: "#0c1013",
                    fontWeight: "bold",
                    fontFamily: "Poppins",
                  }}
                >
                  {t("popup_signin")}
                </span>
              }
              value="1"
            />
            <Tab
              label={
                <span
                  style={{
                    color: "#0c1013",
                    fontWeight: "bold",
                    fontFamily: "Poppins",
                  }}
                >
                  {t("popup_signup")}
                </span>
              }
              value="2"
            />
          </TabList>
        </Box>
        <TabPanel value="1">
          {passReset ? (
            <div className="pass-reset">
              <h3>{t("forget_password_title")}</h3>
              <p>{t("forget_password_body")}</p>
              <div>
                <label for="email2">{t("popup_email")}</label>
                <input
                  type="email"
                  name="email2"
                  required
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                />
                <button onClick={sendPasswordLink}>
                  {t("forget_password_title_2")}
                </button>
              </div>
              <p onClick={changeConnexion}>{t("back_to_login")}</p>
            </div>
          ) : (
            <div className="connexion">
              <form onSubmit={handleSubmit}>
                <div className="info">
                  <label for="email">{t("popup_email")} *</label>
                  <input
                    type="email"
                    id="email"
                    placeholder=""
                    required
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="info">
                  <label for="password">{t("password")} *</label>

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    required
                    onChange={(e) => setPassword(e.target.value)}
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
                <button type="submit">{t("authentication")}</button>
              </form>
              <div className="text">
                <span onClick={changeConnexion}>{t("forget_password_?")}</span>
                <h4>{t("connect_with")}</h4>
              </div>
              <div className="social">
                <button onClick={google}>
                  <i>
                    <FcGoogle />
                  </i>
                  <span>GOOGLE</span>
                </button>

                {/* <div>
                  {error && <div>{error}</div>}
                  {msg && <div>{msg}</div>}
                </div> */}
              </div>
            </div>
          )}
        </TabPanel>
        <TabPanel value="2">
          <SignUp />
        </TabPanel>
      </TabContext>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        key={vertical + horizontal}
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          sx={{ width: "100%" }}
          severity={error != null ? "error" : "success"}
        >
          {error}
          {msg}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default SignIn;

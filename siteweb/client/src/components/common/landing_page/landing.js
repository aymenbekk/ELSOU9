import React, { Component, useState, useEffect, useRef } from "react";
import "./style_landing.css";
import { TbTruckDelivery } from "react-icons/tb";
import { MdWork } from "react-icons/md";
import { FaPaypal } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { MdLock } from "react-icons/md";
import phone from "../../../assets/phone.png";
import msg from "../../../assets/msg.png";
import logo from "../../../assets/logo_final.png";
import elsou9 from "../../../assets/elsou9.png";
import Popup from "../popup/popup";
import * as ROUTES from "../../../routes/routes";
import { Navigate, NavLink, useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import PaypalCheckoutButton from "../../payment/paypal/paypalCheckoutButton";
import emailjs from "@emailjs/browser";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import i18next from "i18next";
import { useTranslation } from "react-i18next";
import fr from "../../../assets/fr3.png";
import usa from "../../../assets/usa3.png";
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
function LandingPage(props) {
  props.funcNav(false);

  const { t } = useTranslation();

  const [modal, setModal] = useState(false);
  const [width, setWidth] = useState(window.innerWidth);
  const [nav, setNav] = useState(false);
  const [test, setTest] = useState(0);
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  const navigate = useNavigate();

  const toggleSignin = () => {
    if (isMobile == false) setModal(!modal);
    else {
      navigate(ROUTES.SIGNIN);
    }
  };

  const changeBackground = () => {
    if (window.scrollY >= 50) {
      setNav(true);
    } else {
      setNav(false);
    }
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

  const isMobile = width <= 768;

  if (modal == true && isMobile == false) {
    document.body.classList.add("active-modal");
  } else {
    document.body.classList.remove("active-modal");
  }
  window.addEventListener("scroll", changeBackground);
  const switchColor = (nbr) => {
    if (nbr == 1) {
      setTest(1);
    } else if (nbr == 2) {
      setTest(2);
    }
  };
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_elsou9",
        "template_3reawxq",
        form.current,
        "nVDcFIzSwh5qyswAF"
      )
      .then(
        (result) => {
          handleClick();
          e.target.reset();
        },
        (error) => {
          console.log(error.text);
        }
      );
  };
  const [state, setState] = React.useState({
    vertical: "bottom",
    horizontal: "center",
  });
  const { vertical, horizontal } = state;
  return (
    <div className="container">
      <div className={nav ? "navbar " : "navbar active"}>
        {isMobile ? (
          <div className="nav-mobile">
            <span
              onClick={() => {
                setIsNavExpanded(!isNavExpanded);
              }}
            >
              <GiHamburgerMenu />
            </span>
            <div
              className={
                isNavExpanded ? "navigation-menu active" : "navigation-menu"
              }
            >
              <ul>
                <li>
                  <a href="#header">EL SOU9</a>
                </li>
                <li>
                  <a
                    href="#about"
                    onClick={() => switchColor(1)}
                    className={test == 1 ? "link-active" : "link"}
                  >
                    {t("about_us")}
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    onClick={() => switchColor(2)}
                    className={test == 2 ? "link-active" : "link"}
                  >
                    {t("contact_us")}
                  </a>
                </li>

                <li>
                  <div
                    className="flag"
                    onClick={() => i18next.changeLanguage("fr")}
                  >
                    <img src={fr} />
                    Fr
                  </div>
                </li>
                <li>
                  <div
                    className="flag"
                    onClick={() => i18next.changeLanguage("en")}
                  >
                    <img src={usa} />
                    Eng
                  </div>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <>
            <span>
              <a className="elsou9" href="#header">
                <img src={elsou9}></img>EL &nbsp;&nbsp;SOU9
              </a>
            </span>
            <ul>
              <li>
                <a
                  href="#about"
                  onClick={() => switchColor(1)}
                  className={test == 1 ? "link-active" : "link"}
                >
                  {t("about_us")}
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  onClick={() => switchColor(2)}
                  className={test == 2 ? "link-active" : "link"}
                >
                  {t("contact_us")}
                </a>
              </li>
              <li>
                <div
                  className="flag"
                  onClick={() => i18next.changeLanguage("fr")}
                >
                  <img src={fr} />
                  Fr
                </div>
                <div
                  className="flag"
                  onClick={() => i18next.changeLanguage("en")}
                >
                  <img src={usa} />
                  Eng
                </div>
              </li>
            </ul>
          </>
        )}
      </div>
      <header id="header">
        <img src={logo}></img>
        <div className="right">
          {/* <p onClick={() => i18next.changeLanguage("fr")}>Fr</p>
          <p onClick={() => i18next.changeLanguage("en")}>En</p> */}
          <h1>
            Au &nbsp;saveurs&nbsp; du <br />
            bled
          </h1>
          <div>
            <button className="connexion-button" onClick={toggleSignin}>
              <span>
                <MdLock />
              </span>
              {t("signin")}
            </button>
            <button onClick={() => navigate(ROUTES.HOME)} className="acheter">
              <span>
                <FaShoppingCart />
              </span>
              {t("shop")}
            </button>
          </div>
        </div>
        {isMobile == false && (
          <div className="scrolldown">
            <a href="#services">
              <span></span>
              <span></span>
              <span></span>
            </a>
          </div>
        )}
      </header>

      <section id="services" className="services">
        <h3>{t("landing_services")}</h3>
        <div>
          <div>
            <span>
              <TbTruckDelivery />
            </span>
            <h3>{t("landing_livraison_title")}</h3>
            <p>{t("landing_livraison_body")}</p>
          </div>
          <div>
            <span>
              <FaPaypal />
            </span>
            <h3>{t("landing_payment_title")}</h3>
            <p>{t("landing_payment_body")}</p>
          </div>
          <div>
            <span>
              <MdWork />
            </span>
            <h3>{t("landing_bagages_title")}</h3>
            <p>{t("landing_bagages_body")}</p>
          </div>
        </div>
      </section>
      <div className="vertical"></div>
      <section id="about" className="About-us">
        <h3>{t("landing_about_us")}</h3>
        <p>{t("landing_about_us_body")}</p>
      </section>
      <div className="vertical2"></div>
      <h3 className="contact-title">{t("landing_contact_us")}</h3>
      <section id="contact" className="contact_us">
        <div className="first-contact">
          <div>
            <img src={phone}></img>

            <span>{t('landing_telephone')}</span>
            <span>+33 767554543</span>
          </div>
          <div>
            <img src={msg}></img>
            <span>{t('landing_email')}</span>
            <span>elsou9@gmail</span>

          </div>
        </div>
        <div className="second-contact">
          <h4>{t("landing_question")}</h4>
          <form ref={form} onSubmit={sendEmail}>
            <div>
              <label for="user_nom">{t("landing_name")} *</label>
              <input type="text" name="user_nom" placeholder="" required />
            </div>
            <div>
              <label for="user_email">{t("landing_email")} *</label>
              <input type="email" name="user_email" placeholder="" required />
            </div>
            <div>
              <label for="user_phone">{t("landing_telephone")} *</label>
              <input
                inputMode="numeric"
                type="number"
                name="user_phone"
                placeholder=""
                required
              />
            </div>
            <div>
              <label for="sujet">{t("landing_subject")} *</label>
              <input type="text" name="sujet" placeholder="" required />
            </div>
            <div>
              <label for="message">{t("landing_message")} *</label>
              <textarea name="message"></textarea>
            </div>
            <button>{t("landing_send")}</button>
          </form>
        </div>
      </section>
      {modal && !isMobile && <Popup toggleModal={toggleSignin} />}
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        autoHideDuration={4000}
        onClose={handleClose}
        key={vertical + horizontal}
      >
        <Alert onClose={handleClose} sx={{ width: "250px" }} severity="info">
          {t("landing_message_sent")}
        </Alert>
      </Snackbar>
    </div>
  );
}
export default LandingPage;

import React, { Component, useRef } from "react";
import "./contact.css";
import bg from "../../../assets/bg-talya.png";
import { MdEmail } from "react-icons/md";
import { BsFillTelephoneFill } from "react-icons/bs";
import emailjs from "@emailjs/browser";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useTranslation } from 'react-i18next'
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
function Contact(props) {
  const [open, setOpen] = React.useState(false);

  const {t} = useTranslation()

  const handleClick = () => {
    setOpen(true);
  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  props.funcNav(true);
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
    <div className="contact-container">
      <div className="bg"></div>
      <div className="title-contact">
        <h1>{t('contact_informations')}</h1>
        <p>
          {t('contact_text')}
        </p>
        <a href="#main">
          {" "}
          <button>{t('contact_us')}</button>
        </a>
      </div>
      <section id="main" className="main-contact">
        <div className="email-phone">
          <div>
            <div className="cercle-icon">
              <BsFillTelephoneFill />
            </div>
            <h2>{t('call_us')}</h2>
            <span>
              {t('call_text')}
            </span>
            <span>
              0033767554543
              <br />
              0033753376780
              <br />
              <span>Joinable sur Whatsapp</span>
            </span>
          </div>
          <div>
            <div className="cercle-icon">
              <MdEmail />
            </div>
            <h2>{t('send_us_mail')}</h2>
            <span>
            {t('send_us_mail_text')}
            </span>
            <span>elsou9.2022@gmail.com</span>
          </div>
        </div>
        <div className="message">
          <h2>{t('send_message')}</h2>
          <form ref={form} onSubmit={sendEmail}>
            <div>
              <input
                name="user_nom"
                type="text"
                placeholder={t('your_name')}
                required
              />
              <input
                name="user_email"
                type="email"
                placeholder={t('landing_email')}
                required
              />
            </div>
            <div>
              <input
                name="user_phone"
                type="number"
                placeholder={t('landing_telephone')}
                inputmode="numeric"
                required
              />
              <input name="sujet" type="text" placeholder={t('landing_subject')} required />
            </div>
            <textarea name="message" placeholder={t('landing_message')} required />
            <button>{t('landing_send')}</button>
          </form>
        </div>
      </section>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        autoHideDuration={4000}
        onClose={handleClose}
        key={vertical + horizontal}
      >
        <Alert onClose={handleClose} sx={{ width: "250px" }} severity="info">
          {t('landing_message_sent')}
        </Alert>
      </Snackbar>
    </div>
  );
}
export default Contact;

import React, { Component } from "react";
import { useNavigate } from "react-router-dom";
import "./servicebagage.css";
import delivery from "../../../assets/delivery2.png";
import algeria from "../../../assets/algeria.png";
import france from "../../../assets/france.png";
import { useTranslation } from "react-i18next";

function ServiceBagage(props) {

  const { t } = useTranslation();

  const navigate = useNavigate();
  props.funcNav(true);
  return (
    <div className="service-bagage-container">
      <div>
        <img src={delivery} />
        <div className="right-bagages">
          <div>
            <h1>{t('baggage_transport')}</h1>
            <h2>{t('algeria_paris')}</h2>
          </div>
          <div>
            <p>
              {t('baggage_text')}
            </p>
            <button>
              <a href="#tarifs">{t('check_prices')}</a>
            </button>
          </div>
        </div>
      </div>
      <section id="tarifs" className="tarifs">
        <div>
          <img src={algeria} />
          <span>{t('france_to_algeria')}</span>
          <span>3.5 € {t('kilo')}</span>
        </div>
        <div>
          <img src={france} />
          <span>{t('algeria_to_france')}</span>
          <span>2 € {t('kilo')}</span>
        </div>
      </section>
      <section className="contact-bagages">
        <h2>{t('more_informations')}</h2>
        <button onClick={() => navigate("/user/Contactez-nous")}>
          {t('landing_contact_us')}
        </button>
      </section>
    </div>
  );
}
export default ServiceBagage;

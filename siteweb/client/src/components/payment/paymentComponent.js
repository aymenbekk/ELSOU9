import React, { useContext, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import CreditCardForm from "./creditCardForm";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import StepTracker from "../client/checkout/stepTracker";
import "./payment.css";

import paypal2 from "../../assets/paypal.png";
import paypal from "../../assets/paypal2.png";
import visa from "../../assets/visa.png";
import mastercard from "../../assets/mastercard.png";
import amex from "../../assets/amex.png";
import discover from "../../assets/discover.png";
import PaypalCheckoutButton from "./paypal/paypalCheckoutButton";
import { ShippingContext } from "../../hooks/ShippingContext";
import { useTranslation } from 'react-i18next'

export default function PaymentComponent(props) {
  props.funcNav(true);

  const {t} = useTranslation()

  const {shippingInfo, setShippingInfo} = useContext(ShippingContext)

  const [selectedOption, setSelectedOption] = useState("option2");
  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };
  return (
    <div className="payment-container">
      <StepTracker value="3" />
      <Elements stripe={loadStripe(props.keys.stripe)}>
        <div className="paypal-card">
          <div className="paypal">
            <div>
              <div className="radio">
                <label>
                  Paypal
                  <input
                    type="radio"
                    value="option1"
                    checked={selectedOption === "option1"}
                    onChange={handleOptionChange}
                  />
                  <span class="checkmark"></span>
                </label>
              </div>
              <div className="paypal-logo">
                <img src={paypal} />
                <img src={paypal2} />
              </div>
            </div>
            <div className="p-container">
              <p>
                {t('paypal_text')}
              </p>
            </div>
            {selectedOption == "option1" && <PaypalCheckoutButton shippingDetails={shippingInfo}/>}
          </div>
          <div className="card-payment">
            <div>
              <div className="radio">
                <label>
                  {t('credit_card')}
                  <input
                    type="radio"
                    value="option2"
                    checked={selectedOption === "option2"}
                    onChange={handleOptionChange}
                  />
                  <span class="checkmark"></span>
                </label>
              </div>
              <div className="paypal-logo">
                <img src={visa} />
                <img src={mastercard} />
                <img src={amex} />
                <img src={discover} />
              </div>
            </div>
            <div className="p-container">
              <p>
                {t('card_text')}
              </p>
            </div>
            <CreditCardForm selectedOption={selectedOption} shippingDetails={shippingInfo} />
          </div>
        </div>
      </Elements>
    </div>
  );
}

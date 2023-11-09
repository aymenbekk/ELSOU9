import React, { useState, useEffect } from "react";
import {
  CardElement,
  useElements,
  useStripe,
  Elements,
} from "@stripe/react-stripe-js";
import axios from "../../helpers/axios";
import { useNavigate } from "react-router-dom";
import "./payment.css";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useTranslation } from "react-i18next";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const CARD_OPTIONS = {
  iconStyle: "solid",
  style: {
    base: {
      fontWeight: 400,
      fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
      fontSize: "15px",
      color: "#424770",
      fontSmoothing: "antialiased",
      ":-webkit-autofill": {
        color: "#cccccc",
      },
      "::placeholder": {
        color: "#888",
      },
    },
    invalid: {
      iconColor: "red",
      color: "red",
    },
  },
};

//credit card button sub component
const CardField = ({ onChange }) => (
  <div className="card-input">
    <CardElement options={CARD_OPTIONS} onChange={onChange} />
  </div>
);

const SubmitButton = ({ processing, error, children, disabled }) => (
  <button
    className="payer-button"
    type="submit"
    disabled={processing || disabled}
  >
    {processing ? "Processing..." : children}
  </button>
);

export default function CreditCardForm(props) {
  const { t } = useTranslation();

  const shippingDetails = props.shippingDetails;
  console.log(shippingDetails);

  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const [userId, setUserId] = useState("");
  const [addressId, setAddressId] = useState("");
  const [paymentMethodType, setPaymentMethodType] = useState(""); // card or paypale

  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [billingDetails, setBillingDetails] = useState({
    email: "",
    name: "",
    address: {
      line1: "",
      line2: "",
    },
  });

  // reset states on completion
  const reset = () => {
    setError(null);
    setProcessing(false);
    setPaymentMethod("");
    setSuccess(false);
    setCardComplete(false);
    setBillingDetails({
      email: "",
      name: "",
      address: {
        line1: "",
        line2: "",
      },
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    ///if stripe api is loaded
    if (!stripe || !elements) {
      return;
    }

    //handle errors
    if (error) {
      console.log(error);
      elements.getElement("card").focus();
      return;
    }

    if (shippingDetails.price == 0) {
      return;
    }

    //start processing animation on submit button
    if (cardComplete) {
      setProcessing(true);
    } else {
      return;
    }

    const payload = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
      billing_details: billingDetails,
    });

    if (payload.error) {
      setError(payload.error);
      return;
    }

    const intentData = await axios
      .post("stripe", {
        //include the bet amount
        price: parseFloat(shippingDetails.price),
      })
      .then(
        (response) => {
          return {
            secret: response.data.client_secret,
            id: response.data.intent_id,
          };
        },
        (error) => {
          setError(error);
          return error;
        }
      );

    const result = await stripe.confirmCardPayment(intentData.secret, {
      payment_method: payload.paymentMethod.id,
    });

    if (result.error) {
      setError(result.error);
      return;
    }

    if (result.paymentIntent.status === "succeeded") {
      const confirmedPayment = await axios
        .post("stripe/confirm-payment", {
          //include id of payment
          payment_id: intentData.id,
          payment_type: "stripe",
          //send any other data here
          // for addOrder
          userId: userId,
          addressId: addressId,
          paymentMethodType,
        })
        .then(
          (response) => {
            //SUCCESS: return the response message
            return response.data.success;
          },
          (error) => {
            //ERROR:
            console.log(error);
            setError(error);
            return error;
          }
        );

      if (confirmedPayment) {
        try {
          await axios.post("order/add_order", {
            userId: shippingDetails._id,
            paymentType: "card",
            totalAmount: parseFloat(shippingDetails.price), // includes shipping and products prices (Total)
            shippingDetails: {
              firstName: shippingDetails.firstName,
              lastName: shippingDetails.lastName,
              country: shippingDetails.country,
              city: shippingDetails.city,
              address: shippingDetails.address,
              zipCode: shippingDetails.zipCode,
              email: shippingDetails.email,
              phone: shippingDetails.phone,
            },
          });

          reset();

          //We can do something here (redirect ...)
          navigate("/client/checkoutStep4")
          window.location.reload(false)

          setSuccess(true);
        } catch (error) {
          console.log(error);
        }
      }
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  useEffect(() => {
    if (error != null) setOpen(true);
  }, [error]);
  // if (error != null) {
  //   setOpen(true);
  // }
  // if (success) navigate("/client/checkoutStep4");
  console.log("success", success);
  console.log("error", error);
  if (props.selectedOption == "option2")
    return (
      <div className="payment-body">
        <form onSubmit={handleSubmit}>
          {/* FIELDS  */}
          <div>
            <label for="carte credit">{t("card_number")}</label>
            <CardField
              onChange={(event) => {
                setError(event.error);
                setCardComplete(event.complete);
              }}
              id="carte credit"
            />
          </div>

          {/* <div>
      <label for="price">Price</label>
      <input
        type="number"
        name="price"
        required
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      </div> */}

          <div>
            <label for="name">{t("card_name")}</label>
            <input
              type="text"
              name="name"
              required
              value={billingDetails.name}
              onChange={(event) => {
                setBillingDetails({
                  ...billingDetails,
                  name: event.target.value,
                });
              }}
            />
          </div>
          <div>
            <label for="email">Email</label>
            <input
              type="email"
              name="email"
              required
              value={billingDetails.email}
              onChange={(event) => {
                setBillingDetails({
                  ...billingDetails,
                  email: event.target.value,
                });
              }}
            />
          </div>
          <div>
            <label for="address-line1">{t("address_line")} 1</label>
            <input
              type="address-line1"
              name="address-line1"
              required
              value={billingDetails.address.line1}
              onChange={(event) => {
                setBillingDetails({
                  ...billingDetails,
                  address: {
                    line1: event.target.value,
                    line2: billingDetails.address.line2,
                  },
                });
              }}
            />
          </div>
          <div>
            <label for="address-line2">{t("address_line")} 2</label>
            <input
              type="address-line2"
              name="address-line2"
              required
              value={billingDetails.address.line2}
              onChange={(event) => {
                setBillingDetails({
                  ...billingDetails,
                  address: {
                    line1: billingDetails.address.line1,
                    line2: event.target.value,
                  },
                });
              }}
            />
          </div>

          {/* credit card filed */}

          <SubmitButton
            processing={processing}
            error={error}
            disabled={!stripe}
            className="payer-button"
          >
            {t("payment_validation")}
          </SubmitButton>
        </form>
        <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
          <Alert onClose={handleClose} sx={{ width: "100%" }} severity="error">
            {t("payment_error")}
          </Alert>
        </Snackbar>
      </div>
    );
  return <></>;
}

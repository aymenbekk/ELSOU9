import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import axios from "../../../helpers/axios";

const PaypalCheckoutButton = (props) => {
  const navigate = useNavigate();
  const shippingDetails = props.shippingDetails;

  console.log("paypalbutton", shippingDetails);

  const [paid, setPaid] = useState(false);
  const [error, setError] = useState(null);

  const handleApprove = async (orderId) => {
    try {
      await axios.post("order/add_order", {
        userId: shippingDetails._id,
        paymentType: "paypal",
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

      setPaid(true);
    } catch (error) {
      console.log(error);
    }
  };

  if (paid) {
    navigate("/client/checkoutStep4");
  }
  if (error) {
    alert(error);
  }

  return (
    // <PayPalScriptProvider>

    <PayPalButtons
      createOrder={(data, actions) => {
        return actions.order.create({
          purchase_units: [
            {
              amount: {
                value: shippingDetails.price, // we pass it in propse where we call PaypalCheckButton (+other details if you need) value:orderDetails.price
              },
            },
          ],
        });
      }}
      onApprove={async (data, actions) => {
        const order = await actions.order.capture();

        handleApprove(data.orderID);
      }}
      onCancel={() => {
        // navigate user to cart page or something ...
        navigate("/client/checkoutStep1");
      }}
      onError={(err) => {
        setError(err);
        console.log("Paypal onError", err);
      }}
    />

    //</PayPalScriptProvider>
  );
};

export default PaypalCheckoutButton;

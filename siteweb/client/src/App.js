import RoutesContainer from "./routes/RoutesContainer";
import React, { Component, StrictMode, useState } from "react";


import useFindUser from './hooks/useFindUser';

import {PayPalScriptProvider} from '@paypal/react-paypal-js'
import { ShippingContext } from "./hooks/ShippingContext";
import { CartContext } from "./hooks/CartContext";

const App = () => {

  const [shippingInfo, setShippingInfo] = useState({})
  const [cartContext, setCartContext] = useState([])

  return(
    <PayPalScriptProvider options= {{"client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID}}>
      <ShippingContext.Provider value={{shippingInfo, setShippingInfo}}>
      <CartContext.Provider value={{cartContext, setCartContext}}>  
      <div>
        <RoutesContainer />
      </div>
      </CartContext.Provider>
      </ShippingContext.Provider>
    </PayPalScriptProvider> 
)

}

export default App;

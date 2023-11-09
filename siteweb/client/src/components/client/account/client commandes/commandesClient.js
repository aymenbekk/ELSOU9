import React, { Component, useState, useEffect } from "react";
import "./commandes.css";
import axios from '../../../../helpers/axios'
import { useTranslation } from 'react-i18next'

function CommandesClient(props) {

  const {t} = useTranslation()

  const [orders, setOrders] = useState([])

  const token = localStorage.getItem("token");

  const getUserOrders = async () => {

    const ress = await axios.post("/auth/check_get_user", { token });

    const res = await axios.post("order/get_user_orders", {
      userId: ress.data.user._id,
    });

    console.log(res.data)

    setOrders(res.data.orders)
  }

  useEffect(() => {
    getUserOrders()
  }, [])




  return (
    <div className="client-commandes">
      <h1>{t('orders')}</h1>
      <div className="col-title">
        <span>#ID</span>
        <span>Date</span>
        <span>Total</span>
        <span>{t('status')}</span>
      </div>

      {orders.length < 0 ? <p>{t('no_orders')}</p> : 
        orders.map((order) => {
          return (
            <div className="commande" onClick={() => {
              props.setTab("tab4")
              props.setOrderId(order._id)
            }}>
            <span>#{orders.length - orders.indexOf(order)}</span>
            <span>{(order.orderStatus.date).substring(0, 10)}</span>
            <span>{order.totalAmount} €</span>
            <span>{order.orderStatus.type}</span>
          </div>
          )

        })
       }
    </div>
  );
}
export default CommandesClient;

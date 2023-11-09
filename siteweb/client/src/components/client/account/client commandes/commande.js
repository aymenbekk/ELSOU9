import React, { Component, useState, useEffect } from "react";
import shirt from "../../../../assets/shirt.jpg";
import "./commandes.css";
import axios from "../../../../helpers/axios";
import { useTranslation } from "react-i18next";

function Commande(props) {
  const orderId = props.orderId;
  const [order, setOrder] = useState(null);

  const { t } = useTranslation();

  const getOrder = async () => {
    const res = await axios.post(`order/get_order/${orderId}`);

    if (res.status == 200) {
      setOrder(res.data.order);
    } else console.log(res.error.data.error);
  };

  useEffect(() => {
    getOrder();
  }, []);

  let sousTot = 0;

  if (!order) return <h1>{t("loading")}...</h1>;
  return (
    <div className="commande-client-container">
      <div className="col-title">
        <span>{t("product_informations")}</span>

        <span>{t("subtotal")}</span>
      </div>
      {order.orderItems.map((item) => {
        sousTot = sousTot + item.price * item.quantity;
        return (
          <div className="cmd-container">
            <div>
              <div className="image">
                <img src={item.picture} />
              </div>
              <div className="groupe-info">
                <span>
                  {item.name} &nbsp; &nbsp; <i className="sizo">{item.size}</i>
                  <br /> {item.color}
                </span>
                <span className="prix">
                  {item.price} € X {item.quantity}
                </span>
              </div>
            </div>

            <div>
              <span>{(item.price * item.quantity).toFixed(2)} €</span>
            </div>
          </div>
        );
      })}

      <div className="sous-tot">
        <span>{t("subtotal")}</span>
        <span>{sousTot.toFixed(2)} €</span>
      </div>
      <div className="sous-tot">
        <span>{t("shipping")}</span>
        <span>{(order.totalAmount - sousTot).toFixed(2)} €</span>
      </div>
      <div>
        <span>Total</span>
        <span>{order.totalAmount} €</span>
      </div>
    </div>
  );
}
export default Commande;

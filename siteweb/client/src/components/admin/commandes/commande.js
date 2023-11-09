import React, { Component, useEffect, useState } from "react";
import shirt from "../../../assets/shirt2.png";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import "./commande.css";
import { useParams } from "react-router-dom";
import axios from "../../../helpers/axios";

function Commande(props) {
  props.funcNav(true);

  let sousTot = 0;

  const [value, setValue] = useState("Commandé");

  const [order, setOrder] = useState(null);
  const [position, setPosition] = useState(null);

  const params = useParams();

  const getOrder = async () => {
    const res = await axios.post(`order/get_order/${params.id}`);

    if (res.status == 200) {
      setOrder(res.data.order);
      setPosition(res.data.position);
      setValue(res.data.order.orderStatus.type);
    } else console.log(res.error.data.error);
  };

  useEffect(() => {
    getOrder();
  }, []);

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const editOrder = async () => {
    const res = await axios.post("order/edit_order", {
      orderId: params.id,
      status: value,
    });

    if (res.status == 200) {
      console.log("edited");
    } else console.log("Error while editing Order");
  };

  if (!order) return <h1>Loading</h1>;
  else
    return (
      <div className="commande-container">
        <h1>Commande : #{position}</h1>
        <div className="sous-container">
          <div className="left-command">
            <label>Produits Commandés</label>
            {order.orderItems.map((item) => {
              sousTot = sousTot + item.price * item.quantity;
              return (
                <div className="produit-commandé">
                  <div>
                    <img src={item.picture} />
                  </div>
                  <div>
                    <span>
                      {item.name} {item.size} {item.color}
                    </span>
                    <div className="quantXprix">
                      <span>{item.quantity}&nbsp;</span> {"X"}
                      <span>&nbsp;{item.price} €</span>
                    </div>
                  </div>
                </div>
              );
            })}
            <hr class="solid3"></hr>
            <div className="total">
              <span>
                Sous Total <span>{sousTot.toFixed(2)} €</span>{" "}
              </span>

              <span>
                Livraison{" "}
                <span>{(order.totalAmount - sousTot).toFixed(2)} €</span>
              </span>
              <hr class="solid3"></hr>
              <span>
                Total : <span>{order.totalAmount} €</span>
              </span>
            </div>
          </div>
          <div className="right-commande">
            <div className="statut-commande">
              <label>Statut</label>
              <RadioGroup
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                value={value}
                onChange={handleChange}
              >
                <FormControlLabel
                  value="Commandé"
                  control={<Radio size="small" />}
                  label="Commandé"
                />
                <FormControlLabel
                  value="Expedié"
                  control={<Radio size="small" />}
                  label="Expedié"
                />
              </RadioGroup>
              <button onClick={editOrder}>Submit</button>
            </div>
            <div className="client-info">
              <label>Information Client</label>
              <hr class="solid3"></hr>
              <div>
                <span className="client-titles">PERSONNEL</span>
                <span>Nom : {order.shippingDetails.firstName}</span>
                <span>Preom : {order.shippingDetails.lastName}</span>
              </div>
              <hr class="solid3"></hr>
              <div>
                <span className="client-titles">CONTACT INFORMATION </span>
                <span>{order.shippingDetails.email}</span>
                <span>{order.shippingDetails.phone}</span>
              </div>
              <hr class="solid3"></hr>
              <div>
                <span className="client-titles">ADRESSE EXPEDITION </span>
                <span>{order.shippingDetails.country}</span>
                <span>{order.shippingDetails.city}</span>
                <span>{order.shippingDetails.zipCode}</span>
                <span>{order.shippingDetails.address}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}
export default Commande;

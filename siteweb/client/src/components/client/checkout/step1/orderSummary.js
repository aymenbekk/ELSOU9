import React, { Component, useState, useEffect } from "react";
import StepTracker from "../stepTracker";
import shirt from "../../../../assets/shirt.jpg";
import "./step1.css";
import { AiFillDelete } from "react-icons/ai";
import useFindUser from "../../../../hooks/useFindUser";
import axios from "../../../../helpers/axios";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

function OrderSummary(props) {
  props.funcNav(true);

  const { t } = useTranslation();

  const [quantity, setquantity] = useState(1);
  const [width, setWidth] = useState(window.innerWidth);
  const isMobile = width <= 630;
  const [cart, setCart] = useState([]);
  const [userId, setUserId] = useState(null);
  const [sousTotal, setSousTotal] = useState(0);
  const [message, setMessage] = useState("");

  let tot = 0;

  const token = localStorage.getItem("token");

  useEffect(() => {
    getCart();
  }, []);

  const getCart = async () => {
    const ress = await axios.post("/auth/check_get_user", { token });
    setUserId(ress.data.user._id);

    const res = await axios.post("cart/get_cart_items", {
      userId: ress.data.user._id,
    });

    setCart(res.data.cart);
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
  const increment = async (index) => {
    const arr = [...cart];
    const arrr = [...cart];

    const quantity = arr[index].quantity + 1;
    const itemId = arr[index]._id;

    const res = await axios.post("cart/update_item_cart", {
      userId,
      itemId,
      quantity,
    });

    if (res.status == 201) {
      setMessage("Out of stock");
    } else {
      arr[index].quantity++;
      setCart(arr);
    }
  };
  const decrement = async (index) => {
    setMessage("");
    const arr = [...cart];

    if (arr[index].quantity > 1) {
      arr[index].quantity--;
      setCart(arr);

      const quantity = arr[index].quantity;
      const itemId = arr[index]._id;

      await axios.post("cart/update_item_cart", {
        userId,
        itemId,
        quantity,
      });
    }

    //if (quantity >= 1) setquantity(quantity - 1);
  };

  const deleteItem = async (itemId, index) => {
    const res = await axios.post("cart/delete_item_cart", {
      userId,
      itemId,
    });

    if (res.status == 200) {
      const arr = [...cart];
      arr.splice(index, 1);
      setCart(arr);
    }
  };

  return (
    <div className="step1-container">
      <StepTracker value="1" />
      {isMobile ? (
        <table>
          <thead>
            <tr>
              <th colSpan="3">{t("product")}</th>
              <th>{t("quantity")}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colspan="5">
                <hr class="solid6"></hr>
              </td>
            </tr>
            {cart.map((item, index) => {
              tot = tot + item.productId.price * item.quantity;

              return (
                <tr>
                  <td>
                    <div className="product-small-img">
                      <img src={item.productId.productPictures[0].img} />
                    </div>
                  </td>
                  <td className="product-name">
                    <div>
                      <span>
                        {item.productId.name} {item.size} {item.color}
                      </span>
                      <span className="prix">{item.productId.price} €</span>
                    </div>
                  </td>
                  <td></td>
                  <td>
                    <div className="qty-input">
                      <span className="minus" onClick={() => decrement(index)}>
                        -
                      </span>
                      <span className="num">{item.quantity}</span>
                      <span className="plus" onClick={() => increment(index)}>
                        +
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
            <tr>
              <td colspan="5">
                <hr class="solid6"></hr>
              </td>
            </tr>
            <tr>
              <td colSpan="2" className="sous-tot">
                <span>{t("subTotal_capital")}</span>
              </td>
              <td></td>
              <td>
                <span>{tot.toFixed(2)} €</span>
              </td>
            </tr>
          </tbody>
        </table>
      ) : (
        <table>
          <thead>
            <tr>
              <th colSpan="2">{t("product")}</th>
              <th>{t("price")} </th>
              <th>{t("quantity")}</th>
              <th>{t("subTotal_capital")}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colspan="5">
                <hr class="solid6"></hr>
              </td>
            </tr>
            {cart.map((item, index) => {
              tot = tot + item.productId.price * item.quantity;

              return (
                <tr key={item._id}>
                  <td>
                    <div className="product-small-img">
                      <img src={item.productId.productPictures[0].img} />
                    </div>
                  </td>
                  <td className="product-name">
                    <div>
                      <span>
                        {item.productId.name} {item.size} {item.color}
                      </span>
                    </div>
                  </td>

                  <td>
                    <div>
                      <span>{item.productId.price} €</span>
                    </div>
                  </td>

                  <td>
                    <div className="qty-input">
                      <span className="minus" onClick={() => decrement(index)}>
                        -
                      </span>
                      <span className="num">{item.quantity}</span>
                      <span className="plus" onClick={() => increment(index)}>
                        +
                      </span>
                    </div>
                  </td>

                  <td>
                    <div>
                      <span>
                        {(item.productId.price * item.quantity).toFixed(2)} €
                      </span>
                    </div>
                  </td>

                  <td>
                    <div className="delete-icon">
                      <AiFillDelete
                        onClick={() => deleteItem(item._id, index)}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}

            <tr>
              <td colspan="5">
                <hr class="solid7"></hr>
              </td>
            </tr>
            <tr>
              <td className="sous-tot">
                <span>{t("subTotal_capital")}</span>
              </td>
              <td></td>
              <td>
                <div className={message ? "show" : "hidden"}>
                  <p>{message}</p>
                </div>
              </td>
              <td></td>
              <td>
                <span>{tot.toFixed(2)} €</span>
              </td>
            </tr>
          </tbody>
        </table>
      )}
      <div>
        <NavLink to="/client/checkoutStep2">
          <button>{t("order_validation")}</button>
        </NavLink>
      </div>
    </div>
  );
}
export default OrderSummary;

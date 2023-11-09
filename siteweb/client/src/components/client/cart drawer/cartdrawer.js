import React, { Component, useState, useEffect, useContext } from "react";
import shirt from "../../../assets/shirt.jpg";
import useFindUser from "../../../hooks/useFindUser";
import "./cartdrawer.css";
import axios from "../../../helpers/axios";
import { BsCartX } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../../hooks/CartContext";
import { useTranslation } from 'react-i18next'

function CartDrawer(props) {
  const token = localStorage.getItem("token");

  const {t} = useTranslation()

  const {cartContext, setCartContext} = useContext(CartContext)


  const [cart, setCart] = useState([]);

  useEffect(() => {
    if (cartContext.length > 0) setCart(cartContext)
  }, [cartContext])

  const [userId, setUserId] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    getCartItems();
  }, []);

  const getCartItems = async () => {
    const ress = await axios.post("/auth/check_get_user", { token });

    const userId = ress.data.user._id;

    setUserId(userId);

    const res = await axios.post("cart/get_cart_items", { userId: userId });

    setCart(res.data.cart);
  };

  let sousTot = 0;

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
    <div className={props.isOpen ? "sidebar sidebar--open" : "sidebar"}>
      <span onClick={props.toggleSideCart}>X</span>
      <h2>{t('your_cart')}</h2>
      {/* <hr class="solid"></hr> */}

      {cart.length == 0 ? (
        <div>
          <span>
            <BsCartX />
          </span>
          <span>{t('no_product_cart')}</span>
        </div>
      ) : (
        <div className="panier-items">
          <ul>
            {cart.map((item, index) => {
              sousTot = sousTot + item.quantity * item.productId.price;
              return (
                <li>
                  <div className="image-product-cart">
                    <img src={item.productId.productPictures[0].img} />
                  </div>
                  <div>
                    <span>{item.productId.name} &nbsp;</span>
                    {item.size || item.color ? (
                      <span>
                        {item.size} {item.color} &nbsp;
                      </span>
                    ) : null}
                    <span>
                      {item.quantity} x {item.productId.price} &nbsp; €{" "}
                    </span>
                    {/* <span>Total: {item.quantity*item.productId.price}$</span> */}
                  </div>
                  <span
                    className="x-icon"
                    onClick={() => deleteItem(item._id, index)}
                  >
                    X
                  </span>
                </li>
              );
            })}
          </ul>
          <div className="sous-total">
            <span>{t('subtotal')} :</span>
            <span> {sousTot.toFixed(2)} €</span>
          </div>
          <button
            onClick={() => {
              navigate("/client/checkoutStep1");
              props.toggleSideCart();
            }}
          >
            {t('checkout')}
          </button>
        </div>
      )}
    </div>
  );
}
export default CartDrawer;

import React, { Component, useEffect, useState, useContext } from "react";
import StepTracker from "../stepTracker";
import "./detailscommande.css";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import axios from "../../../../helpers/axios";
import { ShippingContext } from "../../../../hooks/ShippingContext";
import { NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function DetailCommande(props) {
  props.funcNav(true);

  const { t } = useTranslation();

  const navigate = useNavigate()

  const { shippingInfo, setShippingInfo } = useContext(ShippingContext);

  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const whiteList = ["FR", "BE", "LU", "NL", "ES", "PT", "IT", "AT", "DE"];
  const selectCountry = (val) => {
    setCountry(val);
  };
  const selectRegion = (val) => {
    setRegion(val);
  };

  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [sousTot, setSousTot] = useState(0);
  const [shippingTot, setShippingTot] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [cartWeight, setCartWeight] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    getCart();
    setShippingInfo(null);
  }, []);

  const getCart = async () => {
    const ress = await axios.post("/auth/check_get_user", { token });
    setUser(ress.data.user);

    setFirstName(ress.data.user.firstName);
    setLastName(ress.data.user.lastName);

    setShippingInfo((shippingInfo) => ({
      ...shippingInfo,
      firstName: ress.data.user.firstName,
      lastName: ress.data.user.lastName,
      _id: ress.data.user._id,
    }));

    const res = await axios.post("cart/get_cart_items", {
      userId: ress.data.user._id,
    });

    setCart(res.data.cart);

    const tot = await calculateTot(res.data.cart);

    setSousTot(tot);

    const weight = await calcualteWeight(res.data.cart);

    setCartWeight(weight);
  };

  async function calculateTot(cart) {
    let tot = 0;

    cart.map((item, index) => {
      tot = tot + item.productId.price * item.quantity;
    });

    return tot;
  }

  async function calcualteWeight(cart) {
    let weight = 0;

    cart.map((item) => {
      weight = weight + item.productId.weight * item.quantity;
    });

    return weight;
  }

  const calculateShippingPricing = async (val) => {
    const res = await axios.post("shipping/get_shipping_pricing", {
      country: val,
    });

    const countryPricing = res.data.country;

    setEstimatedTime(countryPricing.days);

    console.log("countryPriceing", countryPricing);

    console.log("cartWeight", cartWeight);

    const elem = countryPricing.prices.find(
      (item) => item.weight >= cartWeight
    );

    if (elem) {
      setShippingTot(elem.price);

      setShippingInfo((shippingInfo) => ({
        ...shippingInfo,
        price: (sousTot + elem.price).toFixed(2),
      }));
    }
  };

  const handleNextStep = () => {

    if (!shippingInfo.firstName || !shippingInfo.lastName || !shippingInfo.country || !shippingInfo.city || !shippingInfo.address
      || !shippingInfo.zipCode || !shippingInfo.email || !shippingInfo.phone || !shippingInfo.price) {

        return
    } else {

      navigate('/client/checkoutStep3')

    }

  }

  console.log("shippingInfo", shippingInfo);

  if (user)
    return (
      <div className="step2-container">
        <StepTracker value="2" />
        <div className="details-commande">
          <div className="left-card">
            <h3>{t("billing_details")}</h3>
            <div className="nom-prenom">
              <div>
                <label for="nom">{t("landing_name")} *</label>
                <input
                  id="nom"
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => {
                    setShippingInfo((shippingInfo) => ({
                      ...shippingInfo,
                      firstName: e.target.value,
                    }));
                    setFirstName(e.target.value);
                  }}
                />
              </div>
              <div>
                <label for="prenom">{t("landing_prenom")} *</label>
                <input
                  id="prenom"
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => {
                    setShippingInfo((shippingInfo) => ({
                      ...shippingInfo,
                      lastName: e.target.value,
                    }));
                    setLastName(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="adresse">
              <label for="adresse">{t("address")} *</label>
              <input
                id="adresse"
                type="text"
                required
                onChange={(e) => {
                  setShippingInfo((shippingInfo) => ({
                    ...shippingInfo,
                    address: e.target.value,
                  }));
                }}
              />
            </div>
            <div className="pays-region">
              <div>
                <label for="pays">{t("country")} *</label>
                <CountryDropdown
                  defaultOptionLabel="Choisir un pays"
                  id="pays"
                  value={country}
                  onChange={(val) => {
                    setShippingInfo((shippingInfo) => ({
                      ...shippingInfo,
                      country: val,
                    }));
                    selectCountry(val);
                    calculateShippingPricing(val);
                  }}
                  whitelist={whiteList}
                  classes="country-input"
                />
              </div>
              <div>
                <label for="region">{t("region")} *</label>
                <RegionDropdown
                  defaultOptionLabel="Choisir une region"
                  blankOptionLabel="pays non sélectionné"
                  id="region"
                  country={country}
                  value={region}
                  onChange={(val) => {
                    setShippingInfo((shippingInfo) => ({
                      ...shippingInfo,
                      city: val,
                    }));
                    selectRegion(val);
                  }}
                  classes="region-input"
                />
              </div>
            </div>

            <div className="zip-code">
              <label>{t("zip_code")} *</label>
              <input
                type="number"
                required
                onChange={(e) => {
                  setShippingInfo((shippingInfo) => ({
                    ...shippingInfo,
                    zipCode: e.target.value,
                  }));
                }}
              />
            </div>
            <div className="Telephone">
              <label>{t("landing_telephone")} *</label>
              <input
                type="email"
                onChange={(e) => {
                  setShippingInfo((shippingInfo) => ({
                    ...shippingInfo,
                    phone: e.target.value,
                  }));
                }}
              />
            </div>

            <div className="E-mail">
              <label>{t("popup_email")} *</label>
              <input
                type="email"
                required
                onChange={(e) => {
                  setShippingInfo((shippingInfo) => ({
                    ...shippingInfo,
                    email: e.target.value,
                  }));
                }}
              />
            </div>
          </div>

          <div className="right-card">
            <h3>{t("your_order")}</h3>
            <table cellspacing="0">
              <thead>
                <tr>
                  <th>{t("product")}</th>
                  <th>{t("sub-total_capital")}</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => {
                  return (
                    <tr>
                      <td className="item-titre">
                        <span>{item.productId.name}</span>
                      </td>
                      <td className="price">
                        <span>
                          {(item.productId.price * item.quantity).toFixed(2)} €
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="price">
                  <td>{t("sub-total")}</td>
                  <td>
                    <span>{sousTot.toFixed(2)} €</span>
                  </td>
                </tr>
                <tr className="price">
                  <td>{t("shipping_order")}</td>
                  <td>
                    {shippingTot ? (
                      <span>{shippingTot} €</span>
                    ) : (
                      <span>----</span>
                    )}
                  </td>
                </tr>
                <tr className="price">
                  <td>{t("average")}</td>
                  <td>
                    {estimatedTime ? (
                      <span>{estimatedTime} j</span>
                    ) : (
                      <span>----</span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="price-last ">{t("total")}</td>
                  <td className="price2">
                    {shippingTot ? (
                      <span>{(sousTot + shippingTot).toFixed(2)} €</span>
                    ) : (
                      <span>{sousTot.toFixed(2)} €</span>
                    )}
                  </td>
                </tr>
              </tfoot>
            </table>
            
              <button type="submit" onClick={handleNextStep}>{t("order_validation")}</button>
            
          </div>
        </div>
      </div>
    );
}
export default DetailCommande;

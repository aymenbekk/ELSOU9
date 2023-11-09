import React, {
  Component,
  useState,
  useEffect,
  useRef,
  useContext,
} from "react";
import { NavLink, useNavigate } from "react-router-dom";
import MobileNavigation from "../mobile_navigation/MobileNavigation";
import elsou9 from "../../../assets/elsou9.png";
import elsouText from "../../../assets/elsou9text.png";
import logo from "../../../assets/logo_final.png";
import UserAvatar from "../../common/useravata/userAvatar";
import "./navigation.css";
import { FaSearch, FaShoppingCart } from "react-icons/fa";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { ImSearch } from "react-icons/im";
import Popup from "../../common/popup/popup";
import CartDrawer from "../cart drawer/cartdrawer";
import * as ROUTES from "../../../routes/routes";
import useFindUser from "../../../hooks/useFindUser";
import i18next from "i18next";
import { CartContext } from "../../../hooks/CartContext";
import axios from "../../../helpers/axios";
import { useTranslation } from "react-i18next";
import fr from "../../../assets/fr3.png";
import usa from "../../../assets/usa3.png";
function Navigation(props) {
  const token = localStorage.getItem("token");

  const { t } = useTranslation();

  const navbar = useRef(null);
  const topnav = useRef(null);
  const navigate = useNavigate();
  const [width, setWidth] = useState(window.innerWidth);
  const isMobile = width <= 768;
  const { user, isLoading } = useFindUser();
  console.log("navigation", user);
  const [modal, setModal] = useState(false);
  const [isOpen, setsisOpen] = useState(false);

  const [products, setProducts] = useState([]);
  const [result, setResult] = useState([]);
  const [input, setInput] = useState("");
  const { cartContext, setCartContext } = useContext(CartContext);
  const [cart, setCart] = useState([]);
  const [userId, setUserId] = useState();

  useEffect(() => {
    if (cartContext.length > 0) setCart(cartContext);
  }, [cartContext]);
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

  const getProducts = async () => {
    const res = await axios.get("product/get_all_products");

    setProducts(res.data.products);
  };

  useEffect(() => {
    getProducts();
  }, []);

  const handleInputChange = (e) => {
    setInput(e.target.value);

    e.preventDefault();
    const filteredData = products.filter((el) => {
      if (e.target.value != "")
        return el.name.toLowerCase().includes(e.target.value.toLowerCase());
    });

    setResult(filteredData);
  };

  console.log("result", result);

  let activeStyle = {
    color: "#d3ad32",
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

  const toggleModal = () => {
    setModal(!modal);
  };
  const toggleSideCart = () => {
    setsisOpen(!isOpen);
    console.log(true);
  };

  if (modal == true || isOpen == true) {
    document.body.classList.add("active-modal");
  } else {
    document.body.classList.remove("active-modal");
  }

  if (isMobile == true)
    return (
      <>
        {" "}
        <CartDrawer isOpen={isOpen} toggleSideCart={toggleSideCart} />
        <MobileNavigation toggleSideCart={toggleSideCart} />{" "}
      </>
    );

  return (
    <div className="nav-client">
      <nav className="top-nav">
        <ul>
          <li style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
            <img className="elsou9-logo" src={elsou9} />
            <img className="elsou9-text" src={elsouText} />
          </li>
          <li>
            <div class="search-container">
              <div>
                <input
                  type="text"
                  placeholder={t("search_product")}
                  name="search"
                  value={input}
                  onChange={handleInputChange}
                />
                <button>
                  <ImSearch />
                </button>
              </div>
              <div className="search-result">
                {result.length > 0 ? (
                  <ul>
                    {result.map((product) => {
                      return (
                        <li
                          onClick={() => {
                            setInput("");
                            setResult([]);
                            navigate(`/user/product/${product._id}`);
                          }}
                        >
                          <div>
                            <img src={product.productPictures[0].img} />
                            <span>{product.name}</span>
                          </div>

                          <span>{product.price}</span>
                        </li>
                      );
                    })}
                  </ul>
                ) : null}
              </div>
            </div>
          </li>
          <li>
            {user ? (
              user.role == "user" ? (
                <UserAvatar user={user} />
              ) : null
            ) : (
              <button className="connect" onClick={toggleModal}>
                {t("login_register")}
              </button>
            )}
          </li>
          <li onClick={toggleSideCart}>
            <span>
              <AiOutlineShoppingCart />
            </span>

            <span>Panier({cart.length})</span>
          </li>
          {/* <li className="flags">
            <div className="flag" onClick={() => i18next.changeLanguage("fr")}>
              <img src={fr} />
              Fr
            </div>
            <div className="flag" onClick={() => i18next.changeLanguage("en")}>
              <img src={usa} />
              Eng
            </div>
          </li> */}
        </ul>
      </nav>
      <nav ref={navbar} className="bottom-nav">
        <ul>
          <li>
            <NavLink
              to={ROUTES.HOME}
              style={({ isActive }) => (isActive ? activeStyle : undefined)}
            >
              {t("home")}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/user/shop"
              style={({ isActive }) => (isActive ? activeStyle : undefined)}
            >
              {t("shop")}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/user/serviceDeBagages"
              style={({ isActive }) => (isActive ? activeStyle : undefined)}
            >
              {t("landing_bagages_title")}
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/user/Contactez-nous"
              style={({ isActive }) => (isActive ? activeStyle : undefined)}
            >
              {t("contact_us")}
            </NavLink>
          </li>
        </ul>
      </nav>
      {modal && <Popup toggleModal={toggleModal} />}
      <CartDrawer isOpen={isOpen} toggleSideCart={toggleSideCart} />
    </div>
  );
}

export default Navigation;

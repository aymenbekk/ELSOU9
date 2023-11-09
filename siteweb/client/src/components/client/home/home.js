import React, { Component, useState, useEffect } from "react";
import SwiperCore, { Pagination, Autoplay } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import Filter from "../mobile filter/filter";
import axios from "../../../helpers/axios";
import "./home.css";
// swiper bundle styles
import "swiper/swiper-bundle.min.css";
// swiper bundle styles
import "swiper/swiper-bundle.min.css";
// swiper core styles
import "swiper/swiper.min.css";
// modules styles
import "swiper/modules/pagination/pagination.min.css";
import "swiper/modules/autoplay/autoplay.min.css";
// swiper core styles
import "swiper/swiper.min.css";
import shopping from "../../../assets/shopping.jpg";
import Categories from "../categories/categories";
import cyber from "../../../assets/final_cyber.png";
import { AiOutlineArrowDown } from "react-icons/ai";
import ProductCard from "../product card/productcard";
import shirt from "../../../assets/shirt2.png";
import bag from "../../../assets/bagRes.jpg";
import bag2 from "../../../assets/bagRes2.jpg";
import cart from "../../../assets/cartRes.jpg";
import cart2 from "../../../assets/cart2.jpg";
import shop from "../../../assets/shop.jpg";
import laptop from "../../../assets/laptop_final.jpg";
import CircularProgress from "@mui/material/CircularProgress";
import { FaFilter } from "react-icons/fa";
import PriceRange from "../price range/priceRange";
import useFindUser from "../../../hooks/useFindUser";
import { useNavigate } from "react-router-dom";
import logo from "../../../assets/logo_final.png";
import ShopSidebar from "../shop sidebar/shopSidebar";
import { useTranslation } from "react-i18next";

function Home(props) {
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  const topProduit = "top_produit";

  //In case user auth with google he will be redirected here , so just here where we can set the token
  const getUser = async () => {
    try {
      const res = await axios.get("auth/google/login/success", {
        withCredentials: true,
      });

      localStorage.setItem("token", res.data.user._json.token);

      if (res.data.user._json.role == "admin") navigate("/dashboard");
      else {
        setIsLoading(false);
        props.funcNav(true);
      }
    } catch (err) {
      setIsLoading(false);
      props.funcNav(true);
      // treat unauth user
      //navigate('/')
    }
  };

  const getNewestProducts = async () => {
    try {
      const res = await axios.get("product/get_newest_products");

      console.log(res.data.products);
      setNewestProducts(res.data.products);
    } catch (error) {
      if (error.response) {
        console.log(error.response.data.error);
      }
    }
  };

  useEffect(() => {
    getUser();
    getNewestProducts();
  }, []);

  const [newestProducts, setNewestProducts] = useState([]);
  const [filtredPriceProducts, setFiltredPriceProducts] = useState(null);

  SwiperCore.use([Autoplay]);

  const [width, setWidth] = useState(window.innerWidth);
  const isMobile = width <= 850;
  const [isOpen, setIsOpen] = useState(false);

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }
  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);

    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  function filterPriceProducts(products) {
    setFiltredPriceProducts(products);
  }

  const toggleFilter = () => setIsOpen(!isOpen);

  if (isLoading)
    return (
      <div className="loading-page">
        <img src={logo} />
        <CircularProgress color="inherit" size={60} thickness={4} />
      </div>
    );
  else
    return (
      <div className="home-container">
        <div className="cards">
          <Swiper
            slidesPerView={1}
            spaceBetween={30}
            loop={true}
            pagination={{
              clickable: true,
            }}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            modules={[Pagination]}
          >
            <SwiperSlide>
              <img src={cyber} />
            </SwiperSlide>
            <SwiperSlide>
              <img src={shopping} />
            </SwiperSlide>
            <SwiperSlide>
              <img src={laptop} />
            </SwiperSlide>
          </Swiper>
          <div className="right-side">
            <div onClick={() => navigate(`/user/shop/${topProduit}`)}>
              <h2>
                {t("top")}
                <br />
                {t("products")}
              </h2>
            </div>
            <div onClick={() => navigate("/user/serviceDeBagages")}>
              <h2>
                {t("service")} <br /> {t("bagages")}
              </h2>
            </div>
          </div>
        </div>
        <div className="bottom">
          <div className="new-products-container">
            <h2>{t("new_arrivals")}</h2>

            <div className="new-products">
              {filtredPriceProducts
                ? filtredPriceProducts.map((produit) => {
                    return (
                      <ProductCard
                        pic={produit.productPictures[0].img}
                        category={produit.categoryId.name}
                        nom={produit.name}
                        prix={produit.price}
                        id={produit._id}
                        reviews={produit.reviews}
                      />
                    );
                  })
                : newestProducts.map((produit) => {
                    return (
                      <ProductCard
                        pic={produit.productPictures[0].img}
                        category={produit.categoryId.name}
                        nom={produit.name}
                        prix={produit.price}
                        id={produit._id}
                        reviews={produit.reviews}
                      />
                    );
                  })}
            </div>
          </div>
        </div>
      </div>
    );
}
export default Home;

import React, { Component, useEffect, useState } from "react";
import Categories from "../categories/categories";
import PriceRange from "../price range/priceRange";
import axios from "../../../helpers/axios";
import ProductCard from "../product card/productcard";
import { NavLink, useParams } from "react-router-dom";
import "./shop.css";
import Filter from "../mobile filter/filter";
import { FaFilter } from "react-icons/fa";
import Pagination from "@mui/material/Pagination";
import ShopSidebar from "../shop sidebar/shopSidebar";
import { useTranslation } from "react-i18next";

function Shop(props) {
  props.funcNav(true);

  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [data, setData] = useState([]);
  const [filtredPriceProducts, setFiltredPriceProducts] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setpostsPerPage] = useState(10);
  const [pageNumbers, setPageNumbers] = useState(1);

  const params = useParams();

  const getProductsByCategory = async () => {
    try {
      let res;
      if (params.id) {
        if (params.id == "top_produit") {
          res = await axios.get(`product/get_top_products`);
        } else {
          res = await axios.post(
            `product/get_products_by_category/${params.id}`
          );
        }
      } else {
        res = await axios.get(`product/get_all_products`);
      }

      setProducts(res.data.products);

      if (res.data.products.length < postsPerPage) {
        if (filtredPriceProducts) setData(filtredPriceProducts);
        else setData(res.data.products);
      } else {
        if (!filtredPriceProducts) {
          setPageNumbers(Math.ceil(res.data.products.length / postsPerPage));
          setData(res.data.products.slice(0, postsPerPage));
        } else {
          setPageNumbers(Math.ceil(filtredPriceProducts.length / postsPerPage));
          setData(filtredPriceProducts.slice(0, postsPerPage));
        }
      }
    } catch (error) {
      if (error.response) {
        console.log(error.response.data.error);
      }
    }
  };
  const [width, setWidth] = useState(window.innerWidth);
  const isMobile = width <= 850;

  useEffect(() => {
    getProductsByCategory();
  }, [params.id]);
  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }
  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);

    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  const toggleFilter = () => setIsOpen(!isOpen);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;

  const handleChange = (event, currentP) => {
    setCurrentPage(currentP);
    if (!filtredPriceProducts)
      setData(
        products.slice((currentP - 1) * postsPerPage, currentP * postsPerPage)
      );
    else
      setData(
        filtredPriceProducts.slice(
          (currentP - 1) * postsPerPage,
          currentP * postsPerPage
        )
      );
  };

  function filterPriceProducts(products) {
    setFiltredPriceProducts(products);
    setPageNumbers(Math.ceil(products.length / postsPerPage));
    setData(products.slice(0, postsPerPage));
  }

  return (
    <div className="shop-container">
      <div>
        {/* <div className="left-side"> */}
        {isMobile ? (
          <div className="filter">
            <span onClick={toggleFilter}>
              <FaFilter />
              {t("filter")}
            </span>
            <Filter
              products={products}
              filterPriceProducts={filterPriceProducts}
              toggleFilter={toggleFilter}
              isOpen={isOpen}
            />
          </div>
        ) : (
          // <div className="catego-pricerange">
          //   <Categories />
          //   <PriceRange
          //     products={products}
          //     filterPriceProducts={filterPriceProducts}
          //   />
          // </div>
          <ShopSidebar
            products={products}
            filterPriceProducts={filterPriceProducts}
          />
        )}
        {/* </div> */}
        <div className="right-side">
          <div>
            {data.map((produit) => {
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
          <div className="pagination-shop">
            <Pagination
              count={pageNumbers}
              color="primary"
              siblingCount={0}
              page={currentPage}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
export default Shop;

import React, { Component } from "react";
import Categories from "../categories/categories";
import PriceRange from "../price range/priceRange";
import "./shopsidebar.css";
function ShopSidebar(props) {
  return (
    <div className="shop-sidebar">
      <Categories />
      <PriceRange
        products={props.products}
        filterPriceProducts={props.filterPriceProducts}
      />
    </div>
  );
}
export default ShopSidebar;

import React, { Component } from "react";
import Categories from "../categories/categories";
import PriceRange from "../price range/priceRange";
import "./filter.css";
function Filter(props) {
  return (
    <div>
      <div
        className={
          props.isOpen ? "filtermobile filtermobile--open" : "filtermobile"
        }
      >
        <span onClick={props.toggleFilter}>X</span>
        <Categories toggleFilter={props.toggleFilter}/>
        <PriceRange
          products={props.products}
          filterPriceProducts={props.filterPriceProducts}
        />
      </div>
    </div>
  );
}
export default Filter;

import React, { Component } from "react";
import { useNavigate } from "react-router-dom";
import "./product.css";
import { useTranslation } from 'react-i18next'
import Rating from "@mui/material/Rating";

function ProductCard(props) {

  const {t} = useTranslation()

  const navigate = useNavigate()

  let tot = 0

  console.log('props.reviews', props.reviews)

  if (props.reviews.length > 0) {
    for ( let rev of props.reviews) {

      tot = tot + rev.stars
    }
  }



  let stars = tot / props.reviews.length

  return (
    <div className="product-card" onClick={() => navigate(`/user/product/${props.id}`)}>
      <img src={props.pic}></img>
      <div className="product-info">
        <span className="category">{props.category}</span>
        <span className="nom">{props.nom}</span>
        <span className="price">{props.prix} €</span>
        <Rating
          name="simple-controlled"
          value={stars}
          readOnly
        />
      </div>
      <button>{t('view')}</button>
    </div>
  );
}
export default ProductCard;

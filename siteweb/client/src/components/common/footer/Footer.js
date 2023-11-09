import React, { Component, useState, useEffect } from "react";
import "../landing_page/style_landing.css";
import { BsInstagram } from "react-icons/bs";
import { FaFacebookSquare } from "react-icons/fa";
import useFindUser from "../../../hooks/useFindUser";
import CircularProgress from "@mui/material/CircularProgress";
import { useTranslation } from 'react-i18next'
import axios from '../../../helpers/axios'

const Footer = () => {

  const {t} = useTranslation()

  const [categories, setCategories] = useState([])

  const getCategories = async () => {
    
    try {

      const res = await axios.get('category/get_categories')
      setCategories(res.data.categories)
     
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  const { user, isLoading } = useFindUser();
  if (isLoading)
    return (
      <div className="client-route-loading">
        <CircularProgress color="inherit" size={60} thickness={4} />
      </div>
    );
  else
    return (
      <div className="footer">
        <div className="first-part">
          <div>
            <h3>{t('pages')}</h3>
            <span>{t('home')}</span>
            <span>{t('shop')}</span>
            <span>Contact</span>
          </div>
          <div>
            <h3>{t('services')}</h3>
            <span>{t('transport_bagage')}</span>
            <span>{t('clothes_sale')}</span>
            <span>{t('bled_sale')}</span>
            <span>{t('sale')}</span>
          </div>
          <div>
            <h3>{t('categories_footer')}</h3>
            {categories.map((category) => {
              return (
                <span>{category.name}</span>
              )
            })}
          </div>
          <div>
            <h3>{t('landing_contact_us')}</h3>
            <span>Tel:0033767554543</span>
            <span>elsou9.2022@gmail.com</span>
            <span>Paris, France </span>
          </div>
          <div className="sauviez-nous">
            <h3>{t('follow_us')}</h3>
            <span>
              <a style={{color: "grey"}} href="https://web.facebook.com/profile.php?id=100063707462148"><FaFacebookSquare /></a>
            </span>
          </div>
        </div>
        <hr class="thin"></hr>
        <div className="last-part">
          <span>Copyright 2022 © El SOU9 Shop. {t('copyright')}.</span>
          <span>{t('made_by')} SPLINTERS.</span>
        </div>
      </div>
    );
};
export default Footer;

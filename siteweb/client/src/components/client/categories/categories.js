import React, { Component, useEffect, useState } from "react";
import Category from "./category";
import "./categories.css";
import axios from '../../../helpers/axios'
import { useTranslation } from 'react-i18next'


function Categories(props) {

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


  console.log(categories)

  
  return (
    <div className="categories">
      <h2>{t('categories')}</h2>
      <hr class="solid2"></hr>
      {categories.length > 0 ? 
        <ul>
        {categories.map((category) => {
          return <Category item={category} toggleFilter={props.toggleFilter} />;
        })}
      </ul>: null}
      
    </div>
  );
}
export default Categories;

import React, { Component, useEffect, useState } from "react";
import Slider from "@mui/material/Slider";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import "./priceRange.css";
import { useSlotProps } from "@mui/base";
import { useTranslation } from 'react-i18next'

function PriceRange(props) {

  const {t} = useTranslation()

  const [value, setValue] = useState([0, 500]);
  const [filtredProducts, setFiltredProducts] = useState(props.products);
  const [disabled, setDisabled] = useState(true)


  const filterbyPrice = (products) => {

    var newArray = products.filter(function(el) {
      return el.price >= value[0] && el.price <= value[1];
    });

    setFiltredProducts(newArray);
  };

  const handleChange = (event, newValue) => {
    setDisabled(false)
    setValue(newValue);
    filterbyPrice(props.products);
  };
  const theme = createTheme({
    palette: {
      primary: {
        main: "#d3ad32", // very red
      },
      secondary: {
        main: "#d3ad32", // very cyan
      },
    },
  });
 
  return (
    <div className="price-range">
      <h2>{t('filter_by')}</h2>
      <hr class="solid2"></hr>
      <ThemeProvider theme={theme}>
        <Slider
          getAriaLabel={() => "Price range"}
          value={value}
          onChange={handleChange}
          size="small"
          min={0}
          max={500}
        />
      </ThemeProvider>
      <div className="spans">
        <span>min : {value[0]}</span>
        <span>max : {value[1]}</span>
      </div>

      <button disabled={disabled} onClick={() => props.filterPriceProducts(filtredProducts)}>
      {t('filter')}
      </button>
    </div>
  );
}
export default PriceRange;

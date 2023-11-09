import React, { Component, useState } from "react";
import "./swiper.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper";
import shirt from "../../../assets/shirt2.png";
import shirt2 from "../../../assets/shirt.jpg";
import shirt3 from "../../../assets/elsou9.png";
import shirt4 from "../../../assets/logo_final.png";
function SwiperImages(props) {
  const [activeThumb, setActiveThumb] = useState();
  return (
    <div className="swiper-products">
      <Swiper
        loop={true}
        spaceBetween={10}
        navigation={true}
        modules={[Navigation, Thumbs]}
        grabCursor={true}
        thumbs={{ swiper: activeThumb }}
        className="product-images-slider"
      >
        {props.images.map((item, index) => (
          <SwiperSlide>
            <img src={item.img} alt="product images" />
          </SwiperSlide>
        ))}
      </Swiper>
      <Swiper
        onSwiper={setActiveThumb}
        loop={true}
        spaceBetween={10}
        slidesPerView={3}
        modules={[Navigation, Thumbs]}
        className="product-images-slider-thumbs"
      >
        {props.images.map((item, index) => (
          <SwiperSlide>
            <img src={item.img} alt="product images" />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
export default SwiperImages;

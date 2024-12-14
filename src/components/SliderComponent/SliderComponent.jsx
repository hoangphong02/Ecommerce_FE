import Slider from "react-slick";
import React from "react";
import { Image } from "antd";
import { WrapperImage, WrapperSliderStyle } from "./style";

const SliderComponent = ({ arrImg }) => {
  function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: "block", right: "20px", zIndex: 1 }}
        onClick={onClick}
      />
    );
  }

  function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: "block", left: "20px", zIndex: 1 }}
        onClick={onClick}
      />
    );
  }

  var settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };
  return (
    <WrapperSliderStyle {...settings}>
      {arrImg?.map((image) => {
        return (
          <WrapperImage key={image} src={image} alt="Slider" preview={false} />
        );
      })}
    </WrapperSliderStyle>
  );
};

export default SliderComponent;

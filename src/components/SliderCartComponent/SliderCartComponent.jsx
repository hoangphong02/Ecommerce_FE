/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { WrapperSliderStyle } from "./style";
import CartSliderComponent from "../CartSliderComponent/CartSliderComponent";
import { useDebounce } from "../../hooks/useDebounce";
import { useSelector } from "react-redux";

const SliderCartComponent = ({ products }) => {
  const searchProduct = useSelector((state) => state?.product?.search);
  const searchDebounce = useDebounce(searchProduct, 1000); //delay thời gian tìm kiếm 1s sau khi nhập kí tự
  const [productSearch, setProductSearch] = useState([]);
  const infinited = () => {
    const product = [];
    products.filter((pro) => {
      if (searchDebounce === "") {
        product.push(pro);
      } else if (
        pro?.name?.toLowerCase()?.includes(searchDebounce?.toLowerCase())
      ) {
        product.push(pro);
      }
    });
    setProductSearch(product);
  };
  useEffect(() => {
    infinited();
  }, [searchDebounce]);

  const settings = {
    dots: false,
    infinite: productSearch.length > 3 ? true : false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
  };
  return (
    <WrapperSliderStyle {...settings}>
      {products
        ?.filter((pro) => {
          if (searchDebounce === "") {
            return pro;
          } else if (
            pro?.name?.toLowerCase()?.includes(searchDebounce?.toLowerCase())
          ) {
            return pro;
          }
        })
        .map((product) => {
          return (
            <CartSliderComponent
              key={product._id}
              countInStock={product.countInStock}
              description={product.description}
              image={product.image}
              name={product.name}
              price={product.price}
              rating={product.rating}
              type={product.type}
              discount={product.discount}
              selled={product.selled}
              id={product._id}
            />
          );
        })}
    </WrapperSliderStyle>
  );
};

export default SliderCartComponent;

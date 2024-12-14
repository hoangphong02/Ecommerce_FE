/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import moment from "moment";
import "moment/locale/vi";
import * as ProductService from "../../services/ProductService";
import * as SliderService from "../../services/SliderService";
import {
  WrapperProducts,
  Wrappertext,
  WrappertextCongratulation,
} from "./style";
import SliderComponent from "../../components/SliderComponent/SliderComponent";
import { Pagination } from "antd";
import CartSliderComponent from "../../components/CartSliderComponent/CartSliderComponent";
import { useDebounce } from "../../hooks/useDebounce";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import headerTet from "../../assets/images/factory_bg_1.png";

const TrendingProductPage = () => {
  const searchProduct = useSelector((state) => state?.product?.search);
  const searchDebounce = useDebounce(searchProduct, 1000); //delay thời gian tìm kiếm 1s sau khi nhập kí tự
  const [typeProduct, setTypeProduct] = useState("");
  const [products, setProducts] = useState([]);
  const [slider, setSlider] = useState([]);
  const [textCongratulation, setTextCongratulation] = useState("");
  const [panigate, setPanigate] = useState({
    page: 0,
    limit: 6,
    total: 1,
  });
  const getAllSlider = async () => {
    const res = await SliderService.getAllSlider();
    return res;
  };
  const querySlider = useQuery({
    queryKey: ["sliders"],
    queryFn: getAllSlider,
  });
  const { data: sliders } = querySlider;

  const today = moment();
  const startDateTimeTrungthu = moment("01/3", "DD/MM").startOf("day");
  const endDateTimeTrungthu = moment("30/9", "DD/MM").endOf("day");

  const startDateTimeHalloween = moment("01/10", "DD/MM").startOf("day");
  const endDateTimeHalloween = moment("31/10", "DD/MM").endOf("day");

  const startDateTimeNoel = moment("01/11", "DD/MM").startOf("day");
  const endDateTimeNoel = moment("31/12", "DD/MM").endOf("day");

  const startDateTimeTet = moment("01/01", "DD/MM").startOf("day");
  const endDateTimeTet = moment("31/01", "DD/MM").endOf("day");

  const startDateTimeTinhnhan = moment("01/02", "DD/MM").startOf("day");
  const endDateTimeTinhnhan = moment("28/02", "DD/MM").endOf("day");

  useEffect(() => {
    if (
      today.isBetween(startDateTimeTrungthu, endDateTimeTrungthu, null, "[]")
    ) {
      setTypeProduct("trung thu");
    }
    if (
      today.isBetween(startDateTimeHalloween, endDateTimeHalloween, null, "[]")
    ) {
      setTypeProduct("halloween");
    }
    if (today.isBetween(startDateTimeNoel, endDateTimeNoel, null, "[]")) {
      setTypeProduct("giáng sinh");
    }
    if (today.isBetween(startDateTimeTet, endDateTimeTet, null, "[]")) {
      setTypeProduct("tết");
    }
    if (
      today.isBetween(startDateTimeTinhnhan, endDateTimeTinhnhan, null, "[]")
    ) {
      setTypeProduct("tình nhân");
    }
  }, [today]);

  const fetchAllProductType = async (type, page, limit) => {
    const res = await ProductService.getProductType(type, page, limit);
    if (res?.status === "OK") {
      setProducts(res?.data);
      setPanigate({ ...panigate, total: res?.totalPage });
    } else {
    }
  };
  useEffect(() => {
    fetchAllProductType(typeProduct, panigate.page, panigate.limit);
  }, [typeProduct, panigate.page, panigate.limit]);

  const getSlider = (typeProduct) => {
    const arrImage = [];
    if (sliders?.data) {
      sliders?.data?.forEach((slider) => {
        if (slider.type === typeProduct) {
          arrImage.push(slider.image);
        }
      });
    }
    setSlider(arrImage);
  };
  const returnTextCongratulation = () => {
    if (typeProduct === "giáng sinh") {
      setTextCongratulation(
        "Chúc bạn có một mùa giáng sinh vui vẻ, an lành bên người thân và gia đình. Hãy làm cho không gian gia đình bạn trở nên ấm áp hơn với những vật phẩm decor nhé!"
      );
    }
    if (typeProduct === "tết") {
      setTextCongratulation(
        "Chúc bạn có một mùa tết vui vẻ, an lành bên người thân và gia đình. Hãy làm cho không gian gia đình bạn trở nên ấm áp hơn với những vật phẩm decor nhé!"
      );
    }
    if (typeProduct === "trung thu") {
      setTextCongratulation(
        "Chúc bạn có một mùa trung thu vui vẻ, an lành bên người thân và gia đình. Hãy làm cho không gian gia đình bạn trở nên ấm áp hơn với những vật phẩm decor nhé!"
      );
    }
    if (typeProduct === "halloween") {
      setTextCongratulation(
        "Chúc bạn có một mùa halloween vui vẻ, an lành bên người thân và gia đình. Hãy làm cho không gian gia đình bạn trở nên kinh dị hơn với những vật phẩm decor nhé!"
      );
    }
    if (typeProduct === "tình nhân") {
      setTextCongratulation(
        "Chúc bạn có một ngày valentine vui vẻ, an lành bên người bạn yêu quí nhất. Hãy làm cho không gian của bạn trở nên lãng mạn hơn với những vật phẩm decor nhé!"
      );
    }
  };

  useEffect(() => {
    getSlider(typeProduct);
    returnTextCongratulation();
  }, [typeProduct]);

  const onChange = (current, pageSize) => {
    setPanigate({ ...panigate, page: current - 1 });
  };

  return (
    <div>
      <div
        style={{
          width: "100%",
          margin: "0 auto",
          background: "rgb(130, 26, 32)",
        }}
      >
        <SliderComponent arrImg={slider} />
        <div>
          <img src={headerTet} style={{ width: "100%" }} alt="" />
        </div>
        <WrappertextCongratulation>
          <Wrappertext>{textCongratulation}</Wrappertext>
        </WrappertextCongratulation>

        <WrapperProducts>
          {products
            ?.filter((pro) => {
              if (searchDebounce === "") {
                return pro;
              } else if (
                pro?.name
                  ?.toLowerCase()
                  ?.includes(searchDebounce?.toLowerCase())
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
        </WrapperProducts>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <Pagination
            defaultCurrent={panigate.page + 1}
            total={(panigate.total / 6) * 10}
            style={{ margin: "20px 0" }}
            onChange={onChange}
          />
        </div>
      </div>
    </div>
  );
};

export default TrendingProductPage;

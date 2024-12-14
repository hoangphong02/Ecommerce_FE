import React, { useEffect, useRef, useState } from "react";
import TypeProduct from "../../components/TypeProduct/TypeProduct";
import {
  WrapperAll,
  WrapperBody,
  WrapperButtonMore,
  WrapperMic,
  WrapperPanigation,
  WrapperProducts,
  WrapperRight,
  WrapperSideBar,
  WrapperTypeProduct,
} from "./style";
import CardComponent from "../../components/CardComponent/CardComponent";
import * as ProductService from "../../services/ProductService";
import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../components/Loading/Loading";
import { useDebounce } from "../../hooks/useDebounce";
import { useLocation, useNavigate, useParams } from "react-router";
import { Pagination, message } from "antd";
import { typeProductContant } from "../../contant";
import { AudioMutedOutlined, AudioOutlined } from "@ant-design/icons";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import CartSliderComponent from "../../components/CartSliderComponent/CartSliderComponent";

import bgTypeGiangSinhHoaTuyet1 from "../../assets/images/bgHoaTuyet1.png";
import bgTypeGiangSinhHoaTuyet2 from "../../assets/images/bgHoaTuyet2.png";
import bgTypeGiangSinhHoaTuyet3 from "../../assets/images/bgHoaTuyet3.png";

import bgTypeTetHoaMai2 from "../../assets/images/bgTypeTetHoaMai5.png";
import bgTypeTetHoaMai3 from "../../assets/images/bgTypeTetHoaMai4.png";

import bgTypeTrungthu1 from "../../assets/images/bgTypeTrungthu7.jpg";
import bgTypeTrungthu5 from "../../assets/images/bgTypeTrungthu3.jpg";
import bgTypeTrungthu3 from "../../assets/images/bgTypeTrungthu3.jpg";

import bgTypeHalloween from "../../assets/images/bgTypeHalloween2.png";

import bgTypeValentine from "../../assets/images/bgTypeValentine1.png";
import { searchProduct } from "../../redux/slides/productSlide";

const TypeProductPage = () => {
  const searchProduct1 = useSelector((state) => state?.product?.search);
  const searchDebounce = useDebounce(searchProduct1, 1000); //delay thời gian tìm kiếm 1s sau khi nhập kí tự
  const { state } = useLocation();
  const { type } = useParams();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [typeProduct, setTypeProduct] = useState([]);
  const [filter, setFilter] = useState(false);
  const [value1, setValue1] = useState(0);
  const [value2, setValue2] = useState(3500000);
  const navigate = useNavigate();
  const [arrImageBackgroundAmination, setArrImageBackgroundAmination] =
    useState([]);
  const [panigate, setPanigate] = useState({
    page: 0,
    limit: 6,
    total: 1,
  });

  const dispatch = useDispatch();
  // useEffect(() => {
  //   if (stateNameProductByTextVoice !== "") {
  //     dispatch(searchProduct(stateNameProductByTextVoice));
  //   }
  // }, [stateNameProductByTextVoice]);

  const fetchAllProductType = async (type, page, limit) => {
    setLoading(true);
    const res = await ProductService.getProductType(state, page, limit);
    if (res?.status === "OK") {
      setLoading(false);
      setProducts(res?.data);
      setPanigate({ ...panigate, total: res?.totalPage });
    } else {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAllProductType(type, panigate.page, panigate.limit);
  }, [type, panigate.page, panigate.limit]);

  useEffect(() => {
    setFilter(false);
    setValue1(0);
    setValue2(3500000);
  }, [type]);

  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct();
    setTypeProduct(res.data);
  };

  useEffect(() => {
    fetchAllTypeProduct();
  }, []);

  const onChange = (current, pageSize) => {
    setPanigate({ ...panigate, page: current - 1 });
  };
  const customName = (str) => {
    const name = str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      ?.replace(/ /g, "_");
    return name;
  };

  const handleOnChange = () => {
    let range1 = document.getElementsByClassName("range1")[0];
    let range2 = document.getElementsByClassName("range2")[0];
    let slide1 = range1.value;
    let slide2 = range2.value;
    setValue1(slide1);
    setValue2(slide2);
  };

  const handleFilter = () => {
    // const filter =[]
    // productsAll.map((pro)=>{
    //   if(pro.price>= value1 && pro.price <= value2){
    //     filter.push(pro)
    //   }
    // })
    // setProductsFilter(filter)
    setFilter(true);
  };

  const getImageBgAmination = async () => {
    if (type === "giang_sinh") {
      setArrImageBackgroundAmination([
        bgTypeGiangSinhHoaTuyet1,
        bgTypeGiangSinhHoaTuyet2,
        bgTypeGiangSinhHoaTuyet3,
      ]);
    }

    if (type === "tet") {
      setArrImageBackgroundAmination([bgTypeTetHoaMai3, bgTypeTetHoaMai3]);
    }

    if (type === "trung_thu") {
      setArrImageBackgroundAmination([bgTypeTrungthu1]);
    }
    if (type === "halloween") {
      setArrImageBackgroundAmination([bgTypeHalloween, bgTypeHalloween]);
    }
    if (type === "tinh_nhan") {
      setArrImageBackgroundAmination([bgTypeValentine, bgTypeValentine]);
    }
  };

  useEffect(() => {
    getImageBgAmination();
  }, [type]);

  return (
    <Loading isLoading={loading}>
      <WrapperAll arrImageBackgoundAmination={arrImageBackgroundAmination}>
        <WrapperBody className="all">
          <WrapperSideBar>
            <div>
              <WrapperTypeProduct
                style={{ flexDirection: "column", padding: "0 20px" }}
              >
                {typeProductContant?.map(
                  (type) =>
                    typeProduct.includes(type.type) && (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "left",
                          alignItems: "center",
                          background:
                            state === type.type || state?.type === type.type
                              ? "rgb(94 19 42)"
                              : "",
                          width: "100%",
                          padding: "0 20px",
                          color: state === type.type ? "#fff" : "",
                        }}
                      >
                        <img
                          style={{ width: "20px", height: "20px" }}
                          src={type.image}
                        />
                        <TypeProduct name={type.type} key={type.type} />
                      </div>
                    )
                )}
                {typeProduct.map((type) => {
                  if (!typeProductContant.some((item) => item.type === type)) {
                    return (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          padding: "0 20px",
                          color: "#000",
                        }}
                      >
                        <TypeProduct
                          name={type}
                          key={type}
                          style={{ color: "#fff" }}
                        />
                      </div>
                    );
                  }
                })}
                {/* {typeProduct.map((item)=>{
                return (
                    <TypeProduct name={item} key={item} param={type} />
                )
            })} */}
              </WrapperTypeProduct>

              <div
                style={{
                  padding: "20px",
                  background: "#ccc",
                  borderRadius: "10px",
                  margin: "10px",
                }}
              >
                <p>Lọc theo giá</p>
                <div className="range-slider">
                  <span className="rangeValues" style={{ padding: "10px 0" }}>
                    {value1.toLocaleString()} - {value2.toLocaleString()} VND
                  </span>
                  <input
                    className="range1"
                    name="range1"
                    value={value1}
                    min="0"
                    max="3500000"
                    step="100000"
                    type="range"
                    onChange={handleOnChange}
                  />
                  <input
                    className="range2"
                    name="range2"
                    value={value2}
                    min="0"
                    max="3500000"
                    step="100000"
                    type="range"
                    onChange={handleOnChange}
                  />
                </div>
                <div style={{ margin: "20px 0" }}>
                  <ButtonComponent
                    textButton={"Lọc sản phẩm"}
                    onClick={handleFilter}
                  />
                </div>
              </div>
            </div>
          </WrapperSideBar>
          <WrapperRight className="body">
            <div
              id="container"
              style={{ width: "100%", margin: "0 auto", height: "100%" }}
            >
              <WrapperProducts>
                {state?.stateData
                  ? state?.stateData?.map((product) => {
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
                    })
                  : products
                      ?.filter((pro) => {
                        if (filter === false) {
                          if (searchDebounce === "") {
                            return pro;
                          } else if (
                            pro?.name
                              ?.toLowerCase()
                              ?.includes(searchDebounce?.toLowerCase())
                          ) {
                            return pro;
                          }
                        } else {
                          if (
                            searchDebounce === "" &&
                            pro.price >= value1 &&
                            pro.price <= value2
                          ) {
                            return pro;
                          } else if (
                            pro?.name
                              ?.toLowerCase()
                              ?.includes(searchDebounce?.toLowerCase()) &&
                            pro.price >= value1 &&
                            pro.price <= value2
                          ) {
                            return pro;
                          }
                        }
                      })
                      ?.map((product) => {
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

                {/* {products
                  ?.filter((pro) => {
                    if (filter === false) {
                      if (searchDebounce === "") {
                        return pro;
                      } else if (
                        pro?.name
                          ?.toLowerCase()
                          ?.includes(searchDebounce?.toLowerCase())
                      ) {
                        return pro;
                      }
                    } else {
                      if (
                        searchDebounce === "" &&
                        pro.price >= value1 &&
                        pro.price <= value2
                      ) {
                        return pro;
                      } else if (
                        pro?.name
                          ?.toLowerCase()
                          ?.includes(searchDebounce?.toLowerCase()) &&
                        pro.price >= value1 &&
                        pro.price <= value2
                      ) {
                        return pro;
                      }
                    }
                    // if(searchDebounce === '') {
                    //     return pro
                    // }else if(pro?.name?.toLowerCase()?.includes(searchDebounce?.toLowerCase())) {
                    //    return pro
                    // }
                  })
                  ?.map((product) => {
                    return (
                      // <CardComponent key={product._id} countInStock={product.countInStock} description={product.description} image ={product.image} name ={product.name} price={product.price} rating={product.rating} type= {product.type} discount ={product.discount} selled= {product.selled} id={product._id}/>
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
                  })} */}
              </WrapperProducts>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <WrapperPanigation
                  defaultCurrent={panigate.page + 1}
                  total={(panigate.total / 6) * 10}
                  style={{ margin: "20px 0", color: "#fff" }}
                  onChange={onChange}
                />
              </div>
            </div>
          </WrapperRight>
        </WrapperBody>
      </WrapperAll>
    </Loading>
  );
};

export default TypeProductPage;

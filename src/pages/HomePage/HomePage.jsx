/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  AnimatedImage,
  WrapperButtonComponent,
  WrapperProductTrend,
  WrapperProductTrending,
  WrapperTextProductTrending,
  WrapperTitleProductNoel,
  WrapperTitleProductTrend,
  WrapperTitleProductType,
} from "./style";
import SliderComponent from "../../components/SliderComponent/SliderComponent";
import headerTet from "../../assets/images/factory_bg_1.png";
import backgroundTet from "../../assets/images/culture_bg_1.png";
import backgroundTitleTet from "../../assets/images/culture_heading.png";
import backgroundgiangsinh from "../../assets/images/bgNoel8.png";
import backgroundgiangsinhRight from "../../assets/images/bgNoel6.png";
import backgroundValentine from "../../assets/images/bgValentine3.png";
import backgroundValentineRight from "../../assets/images/bgValentine5.png";
import backgroundHalloween from "../../assets/images/background-1298031_1280.webp";
import ImageContact from "../../assets/images/contact.png";
import * as ProductService from "../../services/ProductService";
import * as SliderService from "../../services/SliderService";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import Loading from "../../components/Loading/Loading";
import { useLocation, useNavigate } from "react-router";
import { message } from "antd";
import SliderCartComponent from "../../components/SliderCartComponent/SliderCartComponent";
import moment from "moment";
import "moment/locale/vi";
import { useMutationHook } from "../../hooks/useMutationHook";
import * as ContactService from "../../services/ContactService";
import ScrollAnimation from "react-animate-on-scroll";

const HomePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [productTypeTet, setProductTypeTet] = useState([]);
  const [productTypeNoel, setProductTypeNoel] = useState([]);
  const [productTypeTrungThu, setProductTypeTrungThu] = useState([]);
  const [productTypeHalloween, setProductTypeHalloween] = useState([]);
  const [productTypeValentine, setProductTypeValentine] = useState([]);
  const [dataSlider, setDataSlider] = useState([]);
  const [productsOutstanding, setProductsOutstanding] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const user = useSelector((state) => state.user);
  const location = useLocation();
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

  const getAllSlider = async () => {
    const res = await SliderService.getAllSlider();
    return res;
  };
  const querySlider = useQuery({
    queryKey: ["sliders"],
    queryFn: getAllSlider,
  });
  const { data: sliders } = querySlider;

  const getDataSlider = () => {
    const arrdata = [];
    if (sliders?.data) {
      sliders?.data.forEach((slider) => {
        arrdata.push(slider?.image);
      });
    }
    setDataSlider(arrdata);
  };
  useEffect(() => {
    getDataSlider();
  }, [sliders]);

  const fetchAllProductTypes = async () => {
    setLoading(true);
    const tetPromise = ProductService.getProductType("tết", 0, 100);
    const noelPromise = ProductService.getProductType("giáng sinh", 0, 100);
    const trungThuPromise = ProductService.getProductType("trung thu", 0, 100);
    const halloweenPromise = ProductService.getProductType("halloween", 0, 100);
    const valentinePromise = ProductService.getProductType("tình nhân", 0, 100);

    try {
      const [tetRes, noelRes, trungThuRes, halloweenRes, valentineRes] =
        await Promise.all([
          tetPromise,
          noelPromise,
          trungThuPromise,
          halloweenPromise,
          valentinePromise,
        ]);

      setProductTypeTet(tetRes?.data);
      setProductTypeNoel(noelRes?.data);
      setProductTypeTrungThu(trungThuRes?.data);
      setProductTypeHalloween(halloweenRes?.data);
      setProductTypeValentine(valentineRes?.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching product types:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllProductTypes();
  }, []);

  const getProductsOutstanding = (dataproduct) => {
    if (dataproduct) {
      const sortedProducts = [...dataproduct].sort(
        (a, b) => b.selled - a.selled
      );
      const topFourProducts = sortedProducts.slice(0, 4);
      setProductsOutstanding(topFourProducts);
    }
  };

  useEffect(() => {
    if (
      today.isBetween(startDateTimeTrungthu, endDateTimeTrungthu, null, "[]")
    ) {
      getProductsOutstanding(productTypeTrungThu);
    }
    if (
      today.isBetween(startDateTimeHalloween, endDateTimeHalloween, null, "[]")
    ) {
      getProductsOutstanding(productTypeHalloween);
    }
    if (today.isBetween(startDateTimeNoel, endDateTimeNoel, null, "[]")) {
      getProductsOutstanding(productTypeNoel);
    }
    if (today.isBetween(startDateTimeTet, endDateTimeTet, null, "[]")) {
      getProductsOutstanding(productTypeTet);
    }
    if (
      today.isBetween(startDateTimeTinhnhan, endDateTimeTinhnhan, null, "[]")
    ) {
      getProductsOutstanding(productTypeValentine);
    }
  }, [
    today.toDate().getDate(),
    productTypeTrungThu,
    productTypeHalloween,
    productTypeNoel,
    productTypeTet,
    productTypeValentine,
  ]);

  const onChangeName = (e) => {
    setName(e.target.value);
  };

  const onChangeEmail = (e) => {
    setEmail(e.target.value);
  };
  const onChangePhone = (e) => {
    setPhone(e.target.value);
  };
  const onChangeMessage = (e) => {
    setMessageInput(e.target.value);
  };
  const mutationAddContact = useMutationHook((data) => {
    const { token, ...rests } = data;
    const res = ContactService.createContact({ ...rests }, token);
    return res;
  });

  const { data, isSuccess: isSuccsess } = mutationAddContact;

  const handleAddContact = () => {
    // eslint-disable-next-line no-unused-expressions
    if (!user?.id) {
      navigate("/sign-in", { state: location?.pathname });
    } else {
      mutationAddContact.mutate({
        token: user?.access_token,
        name: name,
        phone: phone,
        email: email,
        message: messageInput,
        user: user?.id,
      });
    }
  };

  useEffect(() => {
    if (isSuccsess && data?.status === "OK") {
      message.success("Gửi thông tin liên hệ thành công");
      setName("");
      setEmail("");
      setPhone("");
      setMessageInput("");
    } else if (isSuccsess && data?.status === "ERR") {
      message.error(data?.message);
    }
  }, [isSuccsess]);

  return (
    <Loading isLoading={loading}>
      <div className="body" style={{ width: "100%", background: "#fff" }}>
        <div
          id="container"
          style={{ width: "100%", margin: "0 auto", height: "100%" }}
        >
          <SliderComponent arrImg={dataSlider} />

          <div style={{ backgroundColor: "#821a20", width: "100%" }}>
            <img src={headerTet} style={{ width: "100%" }} alt="" />

            <div>
              <WrapperTitleProductTrend
                style={{
                  backgroundImage: `url(${backgroundTitleTet})`,
                }}
              >
                <h2>SẢN PHẨM NỔI BẬT</h2>
              </WrapperTitleProductTrend>
              <ScrollAnimation animateIn="fadeIn" duration={2}>
                <WrapperProductTrend>
                  {productsOutstanding?.map((pro) => {
                    return (
                      <WrapperProductTrending style={{ position: "relative" }}>
                        <img
                          src={pro?.image}
                          style={{
                            width: "200px",
                            height: "200px",
                            borderRadius: "50px",
                          }}
                          alt=""
                        />
                        <WrapperTextProductTrending
                          className="nameProductTrending"
                          onClick={() =>
                            navigate(`/product-detail/${pro?._id}`)
                          }
                        >
                          <span
                            style={{
                              height: "100%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "15px",
                              fontWeight: "700",
                              color: "#821a20",
                            }}
                          >
                            {pro?.name}{" "}
                          </span>
                        </WrapperTextProductTrending>
                      </WrapperProductTrending>
                    );
                  })}
                </WrapperProductTrend>
              </ScrollAnimation>
              <div style={{ textAlign: "center" }}>
                <WrapperButtonComponent
                  className="learn-more"
                  onClick={() => navigate("/productsTrending")}
                >
                  <span className="circle" aria-hidden="true">
                    <span className="icon arrow"></span>
                  </span>
                  <span className="button-text">Xem tất cả</span>
                </WrapperButtonComponent>
              </div>
            </div>

            <div
              style={{
                backgroundColor: "#821a20",
                width: "100%",
                backgroundImage: `url(${backgroundTet})`,
                backgroundRepeat: "no-repeat", // Tùy chọn để tránh lặp lại hình nền
                backgroundPosition: "center",
                backgroundSize: "100%",
                padding: "0 0 40px 0",
              }}
            >
              <WrapperTitleProductType
                style={{
                  backgroundImage: `url(${backgroundTitleTet})`,
                }}
              >
                <h2>VẬT PHẨM TRANG TRÍ TẾT</h2>
              </WrapperTitleProductType>
              <div style={{ width: "1207px", margin: "0 auto" }}>
                <ScrollAnimation
                  animateIn="bounceInLeft"
                  animateOut="fadeIn"
                  duration={1}
                >
                  <SliderCartComponent products={productTypeTet} />
                </ScrollAnimation>
              </div>
            </div>
            <div
              style={{
                backgroundColor: "#821a20",
                backgroundImage: `url(${backgroundgiangsinh}), url(${backgroundgiangsinhRight})`, // Lặp lại hình ảnh hai lần
                backgroundRepeat: "no-repeat, no-repeat", // Không lặp lại hình ảnh
                backgroundPosition: "left top, right bottom", // Đặt vị trí của từng hình ảnh
                backgroundSize: "auto",
                padding: "20px 0 40px 0",
              }}
            >
              <WrapperTitleProductNoel
                style={{
                  backgroundImage: `url(${backgroundTitleTet})`,
                }}
              >
                <h2>
                  VẬT PHẨM TRANG TRÍ
                  <br></br>
                  GIÁNG SINH
                </h2>
              </WrapperTitleProductNoel>
              <div style={{ width: "1207px", margin: "0 auto" }}>
                <ScrollAnimation
                  animateIn="bounceInRight"
                  animateOut="fadeOut"
                  duration={1}
                >
                  <SliderCartComponent products={productTypeNoel} />
                </ScrollAnimation>
              </div>
            </div>

            <div
              style={{
                backgroundColor: "#821a20",
                backgroundImage: `url(${backgroundValentineRight}), url(${backgroundValentine})`,
                backgroundRepeat: "no-repeat, no-repeat",
                backgroundPosition: "left top, right bottom",
                backgroundSize: "auto",
                padding: "20px 0 40px 0",
              }}
            >
              <WrapperTitleProductNoel
                style={{
                  backgroundImage: `url(${backgroundTitleTet})`,
                }}
              >
                <h2>
                  VẬT PHẨM TRANG TRÍ
                  <br></br> LỄ TÌNH NHÂN
                </h2>
              </WrapperTitleProductNoel>
              <div style={{ width: "1207px", margin: "0 auto" }}>
                <ScrollAnimation
                  animateIn="bounceInLeft"
                  animateOut="fadeOut"
                  duration={1}
                >
                  <SliderCartComponent products={productTypeValentine} />
                </ScrollAnimation>
              </div>
            </div>

            <div
              style={{
                backgroundColor: "#821a20",
                width: "100%",
                backgroundImage: `url(${backgroundTet})`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "100%",
                padding: "0 0 40px 0",
              }}
            >
              <WrapperTitleProductNoel
                style={{
                  backgroundImage: `url(${backgroundTitleTet})`,
                }}
              >
                <h2>
                  VẬT PHẨM TRANG TRÍ <br></br> TRUNG THU
                </h2>
              </WrapperTitleProductNoel>
              <div style={{ width: "1207px", margin: "0 auto" }}>
                <ScrollAnimation
                  animateIn="bounceInRight"
                  animateOut="fadeOut"
                  duration={1}
                >
                  <SliderCartComponent products={productTypeTrungThu} />
                </ScrollAnimation>
              </div>
            </div>

            <div
              style={{
                backgroundColor: "#821a20",
                width: "100%",
                backgroundImage: `url(${backgroundHalloween})`,
                backgroundRepeat: "no-repeat", // Tùy chọn để tránh lặp lại hình nền
                backgroundPosition: "center",
                backgroundSize: "100%",
                padding: "0 0 40px 0",
              }}
            >
              <WrapperTitleProductNoel
                style={{
                  backgroundImage: `url(${backgroundTitleTet})`,
                }}
              >
                <h2>
                  VẬT PHẨM TRANG TRÍ <br></br> HALLOWEEN
                </h2>
              </WrapperTitleProductNoel>
              <div style={{ width: "1207px", margin: "0 auto" }}>
                <ScrollAnimation
                  animateIn="bounceInLeft"
                  animateOut="fadeOut"
                  duration={1}
                >
                  <SliderCartComponent products={productTypeHalloween} />
                </ScrollAnimation>
              </div>
            </div>

            {/* liên hệ */}
            <ScrollAnimation animateIn="fadeIn" duration={2}>
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  padding: "50px 0",
                  flexWrap: "wrap",
                }}
              >
                <AnimatedImage>
                  <img src={ImageContact} alt="" />
                </AnimatedImage>
                <div
                  style={{
                    padding: "50px",
                    border: "0.6rem solid #d0a862",
                    color: "#fff",
                    margin: "0 auto",
                    borderRadius: "50px",
                    background: "#590606",
                  }}
                >
                  <h3 style={{ color: "#d0a862" }}>
                    NHẬN TƯ VẤN TRANG TRÍ LỄ HỘI
                  </h3>
                  <div style={{ width: "100%", padding: "20px 0 0 0" }}>
                    <div style={{ width: "100%" }}>
                      <label
                        htmlFor=""
                        style={{
                          fontWeight: "500",
                          fontSize: "16px",
                          width: "100%",
                        }}
                      >
                        Name
                      </label>
                      <input
                        placeholder="Nhập họ tên"
                        style={{
                          background: "none",
                          border: "none",
                          width: "100%",
                          outline: "none",
                          borderBottom: "0.2rem solid #d0a862",
                          color: "#d0a862",
                        }}
                        value={name}
                        onChange={onChangeName}
                      />
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "50px",
                      width: "100%",
                      padding: "20px 0",
                    }}
                  >
                    <div>
                      <label
                        htmlFor=""
                        style={{ fontWeight: "500", fontSize: "16px" }}
                      >
                        Email
                      </label>
                      <input
                        placeholder="Nhập địa chỉ email"
                        style={{
                          background: "none",
                          border: "none",
                          width: "100%",
                          outline: "none",
                          borderBottom: "0.2rem solid #d0a862",
                          color: "#d0a862",
                        }}
                        value={email}
                        onChange={onChangeEmail}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor=""
                        style={{ fontWeight: "500", fontSize: "16px" }}
                      >
                        Phone
                      </label>
                      <input
                        placeholder="Nhập số điện thoại"
                        style={{
                          background: "none",
                          border: "none",
                          width: "100%",
                          outline: "none",
                          borderBottom: "0.2rem solid #d0a862",
                          color: "#d0a862",
                        }}
                        value={phone}
                        onChange={onChangePhone}
                      />
                    </div>
                  </div>
                  <div>
                    <div>
                      <label
                        htmlFor=""
                        style={{ fontWeight: "500", fontSize: "16px" }}
                      >
                        Nhập nội dung yêu cầu
                      </label>
                      <textarea
                        placeholder="Nhập nội dung yêu cầu"
                        style={{
                          background: "none",
                          border: "none",
                          width: "100%",
                          outline: "none",
                          borderBottom: "0.2rem solid #d0a862",
                          color: "#d0a862",
                          minHeight: "90px",
                        }}
                        value={messageInput}
                        onChange={onChangeMessage}
                      />
                    </div>
                  </div>
                  <div
                    style={{ textAlign: "center", paddingTop: "30px" }}
                    onClick={() => handleAddContact()}
                  >
                    <WrapperButtonComponent className="learn-more">
                      <span className="circle" aria-hidden="true">
                        <span className="icon arrow"></span>
                      </span>
                      <span className="button-text">Gửi yêu cầu</span>
                    </WrapperButtonComponent>
                  </div>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </div>
    </Loading>
  );
};

export default HomePage;

import { Badge, Col, Dropdown, Menu, Popover, Space, message } from "antd";
import {
  WrapperHeader,
  WrapperHeaderAccount,
  WrapperTextHeader,
  WrapperTextHeaderSmall,
  WrapperCartHeader,
  WrapperContentPopover,
  WrapperImgAvatar,
  WrapperButtonDropdown,
  WrapperMenuItem,
  WrapperColMenu,
  WrapperHeaderMobile,
} from "./style";
import React, { useEffect, useState } from "react";
import {
  UserOutlined,
  CaretDownOutlined,
  ShoppingCartOutlined,
  AudioOutlined,
  AudioMutedOutlined,
  SearchOutlined,
  DownOutlined,
  MenuOutlined,
  MailOutlined,
} from "@ant-design/icons";
import ButtonInputSearch from "../ButtonInputSearch/ButtonInputSearch";
import { useLocation, useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import * as UserService from "../../services/UserService";
import { resetUser } from "../../redux/slides/userSlide";
import Loading from "../Loading/Loading";
import { searchProduct } from "../../redux/slides/productSlide";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import * as ProductService from "../../services/ProductService";
import { useQuery } from "@tanstack/react-query";
import { typeProductContant } from "../../contant";
import TypeProduct from "../TypeProduct/TypeProduct";
import logo from "../../assets/images/logo-decoration.png";

const HeaderComPonent = ({ isHiddenSearch = false, isHiddenCart = false }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [userAvatar, setUserAvatar] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.user);
  const order = useSelector((state) => state.order);
  const [typeProduct, setTypeProduct] = useState([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const { id } = useParams();
  const [productOfType, setProductOfType] = useState([]);
  const [addCartHeader, setAddCartHeader] = useState(false);
  const { state } = useLocation();
  const location = useLocation();
  const openMic = location.state?.openMic || false;

  const path = window.location.pathname;
  const segments = path.split("/");
  const adminPath = segments.pop();

  const fetchAllProduct = async () => {
    const res = await ProductService.getAllProduct("", 100);
    return res.data;
  };

  const queryProduct = useQuery({
    queryKey: ["products"],
    queryFn: fetchAllProduct,
  });

  const { isLoading: isLoadingProducts, data: products } = queryProduct;

  const fetchAllProductType = async (type, page, limit) => {
    setLoading(true);
    const res = await ProductService.getProductType(type, page, limit);
    if (res?.status === "OK") {
      setLoading(false);
      setProductOfType(res?.data);
      // setPanigate({...panigate,total: res?.totalPage})
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllProductType(state, 0, 100);
  }, [state]);

  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct();
    setTypeProduct(res.data);
  };
  useEffect(() => {
    fetchAllTypeProduct();
  }, []);

  const handleNavigateLogin = () => {
    navigate("/sign-in");
  };

  const handleLogout = async () => {
    setLoading(true);
    await UserService.logoutUser();
    dispatch(resetUser());
    setLoading(false);
  };
  useEffect(() => {
    setLoading(true);
    setUsername(user?.name);
    setUserAvatar(user?.avatar);
    setLoading(false);
  }, [user?.name, user?.avatar]);
  const content = (
    <div>
      <WrapperContentPopover onClick={() => navigate("/profile-user")}>
        Thông tin người dùng
      </WrapperContentPopover>
      {user?.isAdmin && (
        <WrapperContentPopover onClick={() => navigate("/system/admin")}>
          Quản lý hệ thống
        </WrapperContentPopover>
      )}
      <WrapperContentPopover
        onClick={() =>
          navigate("/my-order", {
            state: {
              id: user?.id,
              token: user?.access_token,
            },
          })
        }
      >
        Đơn hàng của tôi
      </WrapperContentPopover>
      <WrapperContentPopover onClick={handleLogout}>
        Đăng xuất
      </WrapperContentPopover>
    </div>
  );

  const onSearch = (e) => {
    setSearch(e.target.value);
    dispatch(searchProduct(e.target.value));
  };

  useEffect(() => {
    // Lắng nghe sự kiện scroll
    const handleScroll = () => {
      // Kiểm tra vị trí scroll và cập nhật trạng thái
      setIsScrolled(window.scrollY > 50);
    };

    // Đăng ký sự kiện scroll
    window.addEventListener("scroll", handleScroll);

    // Hủy đăng ký sự kiện khi component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []); // useEffect chỉ chạy một lần sau khi component được render

  const getArrProductByText = async (str) => {
    const text = str.toLowerCase();
    const arr = [];
    if (products && Array.isArray(products)) {
      await products
        .filter(
          (product) =>
            product.name.toLowerCase() === text ||
            product.name.toLowerCase().includes(text)
        )
        .map((item) => {
          arr.push(item);
        });
      return arr?.length ? arr : [];
    } else {
      console.error(
        "productOfType is undefined or not an array",
        productOfType
      );
      return undefined;
    }
  };

  const getChecked = (num) => {
    const id = order?.orderItems[num - 1]?.product;
    return id;
  };

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  const handleRead = (text) => {
    var msg = new SpeechSynthesisUtterance();
    msg.lang = "vi-VI";
    msg.text = text;
    msg.volume = 1;
    msg.rate = 0.6;
    msg.pitch = 1;
    window.speechSynthesis.speak(msg);
  };

  const helpNavigateByVoice = async (voidValue) => {
    const text = voidValue.toLowerCase();
    let hasVatPham = false;
    let hasMuonMua = false;
    let foundIdProduct = false;
    let addCart = false;
    let seeCart = false;
    let suggest = false;
    let contact = false;
    let home = false;
    let buyNow = false;
    let chooseProductNumber = false;
    let payment = false;
    let paymentBy = false;
    let paymentOnDelivery = false;
    let booking = false;
    let order = false;
    let increaseCount = false;
    let decreaseCount = false;
    let news = false;
    let unCheckNumber = false;
    let checkAll = false;
    let cancelCheck = false;
    let changeAddress = false;
    let addressIs = false;
    let updateAddress = false;
    let followProduct = false;
    let unFollowProduct = false;
    let cancelChangeAddress = false;
    let deleteProductTocart = false;

    if (text.includes("vật phẩm")) {
      hasVatPham = true;
    }
    if (text.includes("muốn mua") || text.includes("muốn xem")) {
      hasMuonMua = true;
    }
    if (text.includes("thêm vào giỏ hàng")) {
      addCart = true;
    }
    if (text.includes("xem giỏ hàng")) {
      seeCart = true;
    }
    if (text.includes("gợi ý")) {
      suggest = true;
    }
    if (text.includes("liên hệ")) {
      contact = true;
    }
    if (text.includes("trang chủ")) {
      home = true;
    }
    if (text.includes("mua ngay")) {
      buyNow = true;
    }
    if (text.includes("chọn sản phẩm số")) {
      chooseProductNumber = true;
    }
    if (text.includes("chọn thanh toán")) {
      payment = true;
    }
    if (text.includes("ví")) {
      paymentBy = true;
    }
    if (text.includes("khi nhận hàng")) {
      paymentOnDelivery = true;
    }
    if (text.includes("đặt hàng")) {
      booking = true;
    }
    if (text.includes("xem đơn hàng")) {
      order = true;
    }
    if (text.includes("tăng số lượng lên")) {
      increaseCount = true;
    }
    if (text.includes("giảm số lượng xuống")) {
      decreaseCount = true;
    }
    if (text.includes("tin tức")) {
      news = true;
    }
    if (text.includes("xóa sản phẩm số")) {
      unCheckNumber = true;
    }
    if (text.includes("chọn tất cả sản phẩm")) {
      checkAll = true;
    }
    if (text.includes("hủy chọn tất cả")) {
      cancelCheck = true;
    }
    if (text.includes("đổi địa chỉ")) {
      changeAddress = true;
    }
    if (text.includes("địa chỉ là")) {
      addressIs = true;
    }
    if (text.includes("cập nhật")) {
      updateAddress = true;
    }
    if (text.includes("theo dõi sản phẩm")) {
      followProduct = true;
    }
    if (text.includes("bỏ theo dõi") || text.includes("hủy theo dõi")) {
      unFollowProduct = true;
    }
    if (text.includes("hủy thay đổi")) {
      cancelChangeAddress = true;
    }
    if (text.includes("loại bỏ sản phẩm số")) {
      deleteProductTocart = true;
    }
    if (hasVatPham) {
      if (text.includes("vật phẩm trang trí")) {
        const newType = text.split("trí")[1].trim();
        const findTypeProduct = typeProduct?.find((item) => item === newType);
        if (findTypeProduct) {
          handleRead(`vật phẩm trang trí ${newType}`);
          const setTimeNavi = setTimeout(() => {
            navigate(
              `/product/${newType
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                ?.replace(/ /g, "_")}`,
              { state: newType }
            );
            resetTranscript();
          }, 1500);
          return () => clearTimeout(setTimeNavi);
        } else {
          message.error(
            "Không có dữ liệu bạn yêu cầu. Yêu cầu bạn hãy nói lại!"
          );
          resetTranscript();
        }
        resetTranscript();
      }
    }
    if (hasMuonMua) {
      if (text.includes("muốn mua") || text.includes("muốn xem")) {
        let newType = "";
        if (text.includes("muốn mua")) {
          newType = text.split("mua")[1]?.trim();
        } else if (text.includes("muốn xem")) {
          newType = text.split("xem")[1]?.trim();
        }
        let getArrTest = await getArrProductByText(newType);
        if (getArrTest?.length === 1) {
          const idProduct = getArrTest[0]?._id;
          if (text.includes("muốn mua")) {
            handleRead(`tôi muốn mua ${newType}`);
          } else if (text.includes("muốn xem")) {
            handleRead(`tôi muốn xem ${newType}`);
          }
          const setTimeNavi = setTimeout(() => {
            navigate(`/product-detail/${idProduct}`, { state: idProduct });
            resetTranscript();
          }, 1500);
          return () => clearTimeout(setTimeNavi);
        } else {
          if (getArrTest?.length > 1) {
            const typeProduct = getArrTest[0]?.type;
            if (text.includes("muốn mua")) {
              handleRead(`tôi muốn mua ${newType}`);
            } else if (text.includes("muốn xem")) {
              handleRead(`tôi muốn xem ${newType}`);
            }
            const setTimeNavi = setTimeout(() => {
              navigate(
                `/product/${typeProduct
                  .normalize("NFD")
                  .replace(/[\u0300-\u036f]/g, "")
                  ?.replace(/ /g, "_")}`,
                {
                  state: {
                    type: typeProduct,
                    stateData: getArrTest,
                  },
                }
              );
              resetTranscript();
            }, 1500);
            return () => clearTimeout(setTimeNavi);
          } else {
            if (getArrTest?.length === 0) {
              message.error(
                "Không có dữ liệu bạn yêu cầu. Yêu cầu bạn hãy nói lại!"
              );
              resetTranscript();
            }
          }
        }
      }
    }
    if (addCart) {
      if (text.includes("thêm vào giỏ hàng")) {
        handleRead(`thêm vào giỏ hàng`);
        const setTimeNavi = setTimeout(() => {
          navigate("", { state: { addCartHeader: true } });
          resetTranscript();
        }, 1500);
        return () => clearTimeout(setTimeNavi);
      }
    }
    if (seeCart) {
      if (text.includes("xem giỏ hàng")) {
        handleRead(`xem giỏ hàng`);
        const setTimeNavi = setTimeout(() => {
          navigate(`/order`);
          resetTranscript();
        }, 1500);
        return () => clearTimeout(setTimeNavi);
      }
    }
    if (suggest) {
      handleRead(`gợi ý sản phẩm`);
      const setTimeNavi = setTimeout(() => {
        navigate(`/productsTrending`);
        resetTranscript();
      }, 1500);
      return () => clearTimeout(setTimeNavi);
    }
    if (contact) {
      handleRead(`liên hệ`);
      const setTimeNavi = setTimeout(() => {
        navigate(`/contact`);
        resetTranscript();
      }, 1500);
      return () => clearTimeout(setTimeNavi);
    }
    if (home) {
      handleRead(`Quay lại trang chủ`);
      const setTimeNavi = setTimeout(() => {
        navigate(`/`);
        resetTranscript();
      }, 1500);
      return () => clearTimeout(setTimeNavi);
    }
    if (buyNow) {
      handleRead(`chọn mua ngay`);
      const setTimeNavi = setTimeout(() => {
        navigate("", { state: { buyNowHeader: true } });
        resetTranscript();
      }, 1500);
      return () => clearTimeout(setTimeNavi);
    }
    if (chooseProductNumber) {
      const number = text.split("số")[1].trim();
      const id = getChecked(number);
      handleRead(`chọn sản phẩm số ${number}`);
      const setTimeNavi = setTimeout(() => {
        navigate("", { state: { idProductCheck: id } });
        resetTranscript();
      }, 1500);
      return () => clearTimeout(setTimeNavi);
    }
    if (payment) {
      handleRead(`chọn thanh toán`);
      const setTimeNavi = setTimeout(() => {
        navigate("", { state: { buy: true } });
        resetTranscript();
      }, 1500);
      return () => clearTimeout(setTimeNavi);
    }
    if (paymentBy) {
      const namePay = text.split("ví")[1].trim();
      if (namePay === "momo") {
        handleRead(`Thanh toán bằng ví mô mô`);
        const setTimeNavi = setTimeout(() => {
          navigate("", {
            state: { value: "Thanh toán bằng ví MoMo" },
          });
          resetTranscript();
        }, 1000);
        return () => clearTimeout(setTimeNavi);
      } else {
        handleRead(`Thanh toán bằng ví bây bồ`);
        const setTimeNavi = setTimeout(() => {
          navigate("", {
            state: { value: "Thanh toán bằng ví Paypal" },
          });
          resetTranscript();
        }, 1000);
        return () => clearTimeout(setTimeNavi);
      }
    }
    if (paymentOnDelivery) {
      handleRead(`Thanh toán khi nhận hàng`);
      const setTimeNavi = setTimeout(() => {
        navigate("", {
          state: { value: "Thanh toán khi nhận hàng" },
        });
        resetTranscript();
      }, 1000);
      return () => clearTimeout(setTimeNavi);
    }

    if (booking) {
      handleRead(`chọn đặt hàng`);
      const setTimeNavi = setTimeout(() => {
        navigate("", { state: { buy: true } });
        resetTranscript();
      }, 1500);
      return () => clearTimeout(setTimeNavi);
    }

    if (order) {
      handleRead(`Xem đơn hàng`);
      const setTimeNavi = setTimeout(() => {
        navigate("/my-order", {
          state: {
            id: user?.id,
            token: user?.access_token,
          },
        });
        resetTranscript();
      }, 1500);
      return () => clearTimeout(setTimeNavi);
    }
    if (increaseCount) {
      let number = text.split("lên")[1].trim();
      if (number === "một") {
        number = 1;
      }
      if (number === "ba") {
        number = 3;
      }
      handleRead(`tăng số lượng lên ${number}`);
      const setTimeNavi = setTimeout(() => {
        navigate("", {
          state: {
            numberIncrease: Number(number),
          },
        });
        resetTranscript();
      }, 1500);
      return () => clearTimeout(setTimeNavi);
      resetTranscript();
    }
    if (decreaseCount) {
      let number = text.split("xuống")[1].trim();
      if (number === "một") {
        number = 1;
      }
      if (number === "ba") {
        number = 3;
      }
      handleRead(`giảm số lượng xuống ${number}`);
      const setTimeNavi = setTimeout(() => {
        navigate("", {
          state: {
            numberDecrease: Number(number),
          },
        });
        resetTranscript();
      }, 1500);
      return () => clearTimeout(setTimeNavi);
      resetTranscript();
    }
    if (news) {
      handleRead(`Xem tin tức`);
      const setTimeNavi = setTimeout(() => {
        navigate("/blog");
        resetTranscript();
      }, 1500);
      return () => clearTimeout(setTimeNavi);
    }
    if (unCheckNumber) {
      const number = text.split("số")[1].trim();
      const id = getChecked(number);
      handleRead(`Xóa sản phẩm số ${number}`);
      const setTimeNavi = setTimeout(() => {
        navigate("", {
          state: { idProductDeleteCheck: id },
        });
        resetTranscript();
      }, 1500);
      return () => clearTimeout(setTimeNavi);
    }
    if (deleteProductTocart) {
      const number = text.split("số")[1].trim();
      const id = getChecked(number);
      handleRead(`Loại bỏ sản phẩm số ${number}`);
      const setTimeNavi = setTimeout(() => {
        navigate("", {
          state: { idProductDeleteToCart: id },
        });
        resetTranscript();
      }, 1500);
      return () => clearTimeout(setTimeNavi);
    }
    if (checkAll) {
      handleRead("Chọn tất cả sản phẩm");
      const setTimeNavi = setTimeout(() => {
        navigate("", {
          state: { isCheckAll: true },
        });
        resetTranscript();
      }, 1500);
      return () => clearTimeout(setTimeNavi);
    }
    if (changeAddress) {
      handleRead("Đổi địa chỉ");
      const setTimeNavi = setTimeout(() => {
        navigate("", {
          state: { changeAddress: true },
        });
        resetTranscript();
      }, 1500);
      return () => clearTimeout(setTimeNavi);
    }
    if (addressIs) {
      const address = text.split("là")[1].trim();
      handleRead(`địa chỉ là ${address}`);
      const setTimeNavi = setTimeout(() => {
        navigate("", {
          state: { valueAddress: address },
        });
        resetTranscript();
      }, 1000);
      return () => clearTimeout(setTimeNavi);
    }
    if (updateAddress) {
      handleRead("Chọn cập nhật");
      const setTimeNavi = setTimeout(() => {
        navigate("", {
          state: { update: true },
        });
        resetTranscript();
      }, 1000);
      return () => clearTimeout(setTimeNavi);
    }
    if (cancelChangeAddress) {
      handleRead("Hủy thay đổi");
      const setTimeNavi = setTimeout(() => {
        navigate("", {
          state: { cancelChangeAddress: true },
        });
        resetTranscript();
      }, 1500);
      return () => clearTimeout(setTimeNavi);
    }
    if (followProduct) {
      handleRead("Theo dõi sản phẩm");
      const setTimeNavi = setTimeout(() => {
        navigate("", {
          state: { follow: true },
        });
        resetTranscript();
      }, 1000);
      return () => clearTimeout(setTimeNavi);
    }
    if (unFollowProduct) {
      handleRead("Hủy theo dõi");
      const setTimeNavi = setTimeout(() => {
        navigate("", {
          state: { unFollow: true },
        });
        resetTranscript();
      }, 1000);
      return () => clearTimeout(setTimeNavi);
    }
    if (cancelCheck) {
      handleRead("Hủy chọn tất cả");
      const setTimeNavi = setTimeout(() => {
        navigate("", {
          state: {
            isCancelCheck: true,
          },
        });
        resetTranscript();
      }, 1500);
      return () => clearTimeout(setTimeNavi);
    } else {
      if (
        text &&
        !hasVatPham &&
        !hasMuonMua &&
        !foundIdProduct &&
        !addCart &&
        !seeCart &&
        !suggest &&
        !contact &&
        !home &&
        !buyNow &&
        !chooseProductNumber &&
        !payment &&
        !paymentBy &&
        !paymentOnDelivery &&
        !booking &&
        !order &&
        !increaseCount &&
        !decreaseCount &&
        !news &&
        !unCheckNumber &&
        !checkAll &&
        !cancelCheck
      ) {
        message.error("Không có dữ liệu bạn yêu cầu. Yêu cầu bạn hãy nói lại!");
      }
    }
  };

  const startListening = () => {
    SpeechRecognition.startListening({ continuous: true, language: "vi-VI" });
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (openMic === true) {
      startListening();
    }
  }, [openMic]);

  //  eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      helpNavigateByVoice(transcript);
      resetTranscript();
    }, 1500);
    return () => clearTimeout(timeoutId);
    resetTranscript();
  }, [transcript, addCartHeader]);

  const items = [
    {
      label: (
        <WrapperMenuItem
          className="news"
          style={{ color: "black" }}
          onClick={() => navigate("/")}
        >
          Trang chủ
        </WrapperMenuItem>
      ),
      key: "0",
    },
    {
      label: (
        <WrapperMenuItem
          className="news"
          style={{ color: "black" }}
          onClick={() => navigate("/order")}
        >
          Giỏ hàng
        </WrapperMenuItem>
      ),
      key: "1",
    },
    {
      type: "divider",
    },
    {
      label: (
        <WrapperButtonDropdown className="dropdown">
          <button
            style={{
              background: "none",
              color: "black",
              border: "none",
              fontFamily: "math",
              fontWeight: "bold",
            }}
          >
            Danh mục
          </button>
          <div>
            {typeProductContant?.map(
              (type, index) =>
                typeProduct?.includes(type?.type) && (
                  <div key={index}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "0 20px",
                        color: "#000",
                      }}
                    >
                      <img
                        style={{ width: "20px", height: "20px" }}
                        src={type.image}
                        alt=""
                      />
                      <TypeProduct
                        name={type.type}
                        key={type.type}
                        style={{ color: "#000" }}
                      />
                    </div>
                  </div>
                )
            )}
            {typeProduct?.forEach((type) => {
              if (!typeProductContant?.some((item) => item.type === type)) {
                return (
                  <div key={type}>
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
                        style={{ color: "#000" }}
                      />
                    </div>
                  </div>
                );
              }
            })}
          </div>
        </WrapperButtonDropdown>
      ),
      key: "2",
    },
    {
      type: "divider",
    },
    {
      label: (
        <WrapperMenuItem
          className="news"
          style={{ color: "black" }}
          onClick={() => navigate("/blog")}
        >
          Tin tức
        </WrapperMenuItem>
      ),
      key: "3",
    },

    {
      label: (
        <WrapperMenuItem
          className="trendingProducts"
          style={{ color: "black" }}
          onClick={() => navigate("/productsTrending")}
        >
          Gợi ý sản phẩm
        </WrapperMenuItem>
      ),
      key: "4",
    },
    {
      label: (
        <WrapperMenuItem
          className=""
          style={{ color: "black" }}
          onClick={() => navigate("/contact")}
        >
          Liên hệ
        </WrapperMenuItem>
      ),
      key: "5",
    },
  ];
  return (
    <>
      <div
        style={{
          width: "100%",
          background: isScrolled
            ? "rgb(255,255,255,0.6)"
            : adminPath === "admin"
            ? "none"
            : "rgb(32, 33, 38)",
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          padding: isScrolled ? "10px 30px" : "20px 30px",
          position: isScrolled ? "fixed" : "",
          zIndex: "10",
          transition: "all 0.5s",
        }}
      >
        <WrapperHeader
          gutter={16}
          style={{
            justifyContent:
              isHiddenSearch && isHiddenCart ? "space-between" : "unset",
            marginRight: "0",
            marginLeft: "0",
          }}
        >
          <Col
            span={5}
            style={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              padding: "0",
            }}
          >
            <WrapperTextHeader
              style={{
                cursor: "pointer",
                color: isScrolled ? "black" : "#fff",
              }}
              onClick={() => navigate("/")}
            >
              <img
                style={{
                  height: "65px",
                  position: "absolute",
                  top: "-23px",
                }}
                src={logo}
                alt=""
              />
            </WrapperTextHeader>

            <div style={{ position: "relative" }}>
              <span
                style={{
                  cursor: "pointer",
                  fontSize: "20px",
                  color: isScrolled
                    ? "black"
                    : adminPath === "admin"
                    ? "#000"
                    : "#fff",
                  display: "flex",
                }}
                onClick={listening === false ? startListening : stopListening}
              >
                {listening === false ? (
                  <AudioMutedOutlined />
                ) : (
                  <AudioOutlined />
                )}
              </span>
              <div
                style={{
                  width: "400px",
                  height: "30px",
                  overflow: "auto",
                  display: listening === true ? "block" : "none",
                  position: "absolute",
                  zIndex: "5",
                  background: "#fff",
                  top: isScrolled ? "40px" : "52px",
                  textAlign: "center",
                  left: "-100px",
                  borderRadius: "15px",
                }}
              >
                <span>{transcript}</span>
              </div>
            </div>
            {/* <span style={{cursor:"pointer", fontSize:"20px", color:"#fff", display:"flex"}} onClick={stopListening}><AudioMutedOutlined /> </span> */}
          </Col>
          {!isHiddenSearch && (
            <WrapperColMenu span={13}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div
                  style={{
                    display: "flex",
                    gap: "50px",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "#fff",
                    padding: "10px 0",
                    fontWeight: "bold",
                    fontFamily: "math",
                  }}
                >
                  <WrapperButtonDropdown className="dropdown">
                    <button
                      className="buttonmenu"
                      type="button"
                      id="dropdownMenuButton1"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      style={{
                        background: "none",
                        color: isScrolled ? "black" : "#fff",
                        border: "none",
                        fontFamily: "math",
                        fontWeight: "bold",
                      }}
                    >
                      Danh mục
                    </button>
                    <ul
                      className="dropdown-menu menu"
                      aria-labelledby="dropdownMenuButton1"
                    >
                      {typeProductContant?.map(
                        (type, index) =>
                          typeProduct?.includes(type?.type) && (
                            <li key={index}>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  padding: "0 20px",
                                  color: "#000",
                                }}
                              >
                                <img
                                  style={{ width: "20px", height: "20px" }}
                                  src={type.image}
                                  alt=""
                                />
                                <TypeProduct
                                  name={type.type}
                                  key={type.type}
                                  style={{ color: "#000" }}
                                />
                              </div>
                            </li>
                          )
                      )}
                      {typeProduct?.forEach((type) => {
                        if (
                          !typeProductContant?.some(
                            (item) => item.type === type
                          )
                        ) {
                          return (
                            <li key={type}>
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
                                  style={{ color: "#000" }}
                                />
                              </div>
                            </li>
                          );
                        }
                      })}
                    </ul>
                  </WrapperButtonDropdown>
                  <WrapperMenuItem
                    className="news"
                    style={{ color: isScrolled ? "black" : "#fff" }}
                    onClick={() => navigate("/blog")}
                  >
                    Tin tức
                  </WrapperMenuItem>
                  <WrapperMenuItem
                    className="trendingProducts"
                    style={{ color: isScrolled ? "black" : "#fff" }}
                    onClick={() => navigate("/productsTrending")}
                  >
                    Gợi ý sản phẩm
                  </WrapperMenuItem>
                  <WrapperMenuItem
                    className=""
                    style={{ color: isScrolled ? "black" : "#fff" }}
                    onClick={() => navigate("/contact")}
                  >
                    Liên hệ
                  </WrapperMenuItem>
                </div>

                <div className="dropdown">
                  <button
                    className="btn btn-secondary "
                    style={{ background: "none", border: "none" }}
                    type="button"
                    id="dropdownMenu2"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <SearchOutlined
                      style={{ color: isScrolled ? "black" : "#fff" }}
                    />
                  </button>
                  <ul
                    className="dropdown-menu"
                    aria-labelledby="dropdownMenu2"
                    style={{ transform: "translate(0px, 50px)" }}
                  >
                    <ButtonInputSearch
                      placeholder="input search text"
                      size="large"
                      // textButton ="Tìm kiếm"
                      // bordered={false}
                      backgroundColorInput="#fff"
                      borderRadius="0px"
                      border="none"
                      backgroundColorButton="none"
                      width="300px"
                      colorButton="#000"
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      onChange={onSearch}
                    />
                  </ul>
                </div>
              </div>
            </WrapperColMenu>
          )}
          <Col
            span={6}
            style={{
              display: "flex",
              gap: "54px",
              alignItems: "center",
              flex: "0 0 20%",
            }}
          >
            <Loading isLoading={loading}>
              <WrapperHeaderAccount>
                {user?.avatar ? (
                  <WrapperImgAvatar src={userAvatar} alt="avatar" />
                ) : (
                  <UserOutlined style={{ fontSize: "30px" }} />
                )}
                {user?.access_token ? (
                  <>
                    <Popover content={content} trigger="click">
                      <div
                        style={{
                          cursor: "pointer",
                          color: isScrolled
                            ? "black"
                            : adminPath === "admin"
                            ? "#000"
                            : "#fff",
                        }}
                      >
                        {username?.length ? username : "User"}
                      </div>
                    </Popover>
                  </>
                ) : (
                  <div
                    onClick={handleNavigateLogin}
                    style={{ cursor: "pointer" }}
                  >
                    <WrapperTextHeaderSmall>
                      Đăng nhập / Đăng ký
                    </WrapperTextHeaderSmall>
                    <div>
                      <WrapperTextHeaderSmall>Tài khoản</WrapperTextHeaderSmall>
                      <CaretDownOutlined />
                    </div>
                  </div>
                )}
              </WrapperHeaderAccount>
            </Loading>
            {!isHiddenCart && (
              <div>
                <WrapperCartHeader onClick={() => navigate("/order")}>
                  <Badge count={order?.orderItems?.length}>
                    <ShoppingCartOutlined
                      style={{
                        fontSize: "30px",
                        color: isScrolled ? "black" : "#fff",
                      }}
                    />
                  </Badge>
                  <WrapperTextHeaderSmall
                    style={{ color: isScrolled ? "black" : "#fff" }}
                  >
                    Giỏ hàng
                  </WrapperTextHeaderSmall>
                </WrapperCartHeader>
              </div>
            )}
          </Col>
        </WrapperHeader>

        {/* header mobile */}
        <WrapperHeaderMobile>
          <div style={{ display: "flex", gap: "20px" }}>
            <Dropdown
              menu={{
                items,
              }}
              trigger={["click"]}
            >
              <a onClick={(e) => e.preventDefault()}>
                <Space>
                  <MenuOutlined
                    style={{
                      fontSize: "20px",
                      color: isScrolled ? "#000" : "#fff",
                    }}
                  />
                </Space>
              </a>
            </Dropdown>
            <div style={{ position: "relative" }}>
              <span
                style={{
                  cursor: "pointer",
                  fontSize: "20px",
                  color: isScrolled
                    ? "black"
                    : adminPath === "admin"
                    ? "#000"
                    : "#fff",
                  display: "flex",
                }}
                onClick={listening === false ? startListening : stopListening}
              >
                {listening === false ? (
                  <AudioMutedOutlined />
                ) : (
                  <AudioOutlined />
                )}
              </span>
              <div
                style={{
                  width: "400px",
                  height: "30px",
                  overflow: "auto",
                  display: listening === true ? "block" : "none",
                  position: "absolute",
                  zIndex: "5",
                  background: "#fff",
                  top: isScrolled ? "40px" : "52px",
                  textAlign: "center",
                  left: "-100px",
                  borderRadius: "15px",
                }}
              >
                <span>{transcript}</span>
              </div>
            </div>
          </div>
          <div style={{ display: "flex" }}>
            <div className="dropdown">
              <button
                className="btn btn-secondary "
                style={{ background: "none", border: "none" }}
                type="button"
                id="dropdownMenu2"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <SearchOutlined
                  style={{ color: isScrolled ? "black" : "#fff" }}
                />
              </button>
              <ul
                className="dropdown-menu"
                aria-labelledby="dropdownMenu2"
                style={{ transform: "translate(0px, 50px)" }}
              >
                <ButtonInputSearch
                  placeholder="input search text"
                  size="large"
                  // textButton ="Tìm kiếm"
                  // bordered={false}
                  backgroundColorInput="#fff"
                  borderRadius="0px"
                  border="none"
                  backgroundColorButton="none"
                  width="300px"
                  colorButton="#000"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  onChange={onSearch}
                />
              </ul>
            </div>
            <WrapperHeaderAccount>
              {user?.avatar ? (
                <WrapperImgAvatar src={userAvatar} alt="avatar" />
              ) : (
                <UserOutlined style={{ fontSize: "30px" }} />
              )}
              {user?.access_token ? (
                <>
                  <Popover content={content} trigger="click">
                    <div
                      style={{
                        cursor: "pointer",
                        color: isScrolled
                          ? "black"
                          : adminPath === "admin"
                          ? "#000"
                          : "#fff",
                      }}
                    >
                      {username?.length ? username : "User"}
                    </div>
                  </Popover>
                </>
              ) : (
                <div
                  onClick={handleNavigateLogin}
                  style={{ cursor: "pointer" }}
                >
                  <WrapperTextHeaderSmall>
                    Đăng nhập / Đăng ký
                  </WrapperTextHeaderSmall>
                  <div>
                    <WrapperTextHeaderSmall>Tài khoản</WrapperTextHeaderSmall>
                    <CaretDownOutlined />
                  </div>
                </div>
              )}
            </WrapperHeaderAccount>
          </div>
        </WrapperHeaderMobile>
      </div>
    </>
  );
};

export default HeaderComPonent;

import { Col, Form, Image, Rate, Row, message } from "antd";
import React, { useEffect, useState } from "react";
// import imageProduct from '../../assets/images/test.webp'
// import imageSmallProduct from '../../assets/images/imageSmall.webp'
import {
  WrapperAddress,
  WrapperBtnAddCart,
  WrapperBtnBuyCart,
  WrapperBtnFollowProduct,
  WrapperInputNumber,
  WrapperPriceProduct,
  WrapperPriceTextProduct,
  WrapperQualityProduct,
  WrapperStyleNameProduct,
  WrapperStyleTextSell,
  WrapperTextQuality,
} from "./style";
import {
  CheckOutlined,
  MinusOutlined,
  PlusOutlined,
  PlusSquareOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import * as ProductService from "../../services/ProductService";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { addOrderProduct } from "../../redux/slides/oderSlide";
import { useMutationHook } from "../../hooks/useMutationHook";
import InputComponent from "../InputComponent/InputComponent";
import ModalComponent from "../ModalComponent/ModalComponent";
import * as UserService from "../../services/UserService";
import { updateUser } from "../../redux/slides/userSlide";

const ProductDetailComponent = ({
  idProduct,
  addCart,
  buyNow,
  numberIncrease,
  ratingDetail,
  numberDecrease,
  changeAddress,
  valueAddress,
  updateAddress,
  followProduct,
  unFollowProduct,
  cancelChangeAddress,
}) => {
  const [numberProduct, setNumberProduct] = useState(1);
  const [isFollowerProduct, setIsFollowerProduct] = useState(false);
  const [form] = Form.useForm();
  const user = useSelector((state) => state?.user);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const order = useSelector((state) => state.order);
  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false);
  const [voiceChangeAddress, setVoiceChangeAddress] = useState(
    changeAddress || false
  );
  const [voiceValueAddress, setVoiceValueAddress] = useState("");
  useEffect(() => {
    setVoiceChangeAddress(changeAddress);
  }, [changeAddress]);
  const [stateUserDetails, setStateUserDetails] = useState({
    name: "",
    address: "",
    phone: "",
    city: "",
  });

  const dataCity = [
    "hà giang",
    "cao bằng",
    "bắc kạn",
    "tuyên quang",
    "lào cai",
    "điện biên",
    "lai châu",
    "sơn la",
    "yên bái",
    "hòa bình",
    "lạng sơn",
    "quảng ninh",
    "bắc giang",
    "phú thọ",
    "vĩnh phúc",
    "bắc ninh",
    "hà nam",
    "hải dương",
    "hưng yên",
    "thái bình",
    "hà tĩnh",
    "ninh bình",
    "thanh hóa",
    "nghệ an",
    "hà tĩnh",
    "quảng bình",
    "quảng trị",
    "thừa thiên huế",
    "quảng nam",
    "quảng ngãi",
    "bình định",
    "phú yên",
    "khánh hòa",
    "ninh thuận",
    "bình thuận",
    "kon tum",
    "gia lai",
    "đắk lắk",
    "đắk nông",
    "lâm đồng",
    "bình phước",
    "tây ninh",
    "bình dương",
    "đồng nai",
    "bà rịa - vũng tàu",
    "tp. hồ chí minh",
    "long an",
    "tiền giang",
    "bến tre",
    "trà vinh",
    "vĩnh long",
    "đồng tháp",
    "an giang",
    "kiên giang",
    "cần thơ",
    "hậu giang",
    "sóc trăng",
    "bạc liêu",
    "cà mau",
    "đắk nông",
  ];

  useEffect(() => {
    form.setFieldsValue(stateUserDetails);
  }, [form, stateUserDetails]);
  useEffect(() => {
    if (isOpenModalUpdateInfo) {
      setStateUserDetails({
        name: user?.name,
        address: user?.address,
        phone: user?.phone,
        city: user?.city,
      });
    }
  }, [isOpenModalUpdateInfo]);

  // useEffect(() => {
  //   if (changeAddress) {
  //     setVoiceChangeAddress(changeAddress);
  //   }
  // }, [changeAddress]);

  useEffect(() => {
    if (voiceChangeAddress === true) {
      setIsOpenModalUpdateInfo(true);
    }
  }, [voiceChangeAddress]);

  useEffect(() => {
    if (valueAddress !== "") {
      setVoiceValueAddress(valueAddress);
    }
  }, [valueAddress]);

  useEffect(() => {
    if (voiceValueAddress !== "") {
      const city = dataCity?.find((item) => voiceValueAddress?.includes(item));
      if (city) {
        setStateUserDetails({
          ...stateUserDetails,
          address: voiceValueAddress,
          city: city,
        });
      } else {
        setStateUserDetails({
          ...stateUserDetails,
          address: voiceValueAddress,
        });
      }
    }
  }, [voiceValueAddress]);

  const handleOnchangeDetails = (e) => {
    setStateUserDetails({
      ...stateUserDetails,
      [e.target.name]: e.target.value,
    });
  };
  const handleChangeAddress = () => {
    setIsOpenModalUpdateInfo(true);
  };

  const handleCancelUpdate = () => {
    setIsOpenModalUpdateInfo(false);
  };
  const mutationUpdate = useMutationHook((data) => {
    const { id, token, ...rests } = data;
    const res = UserService.updateUser(id, { ...rests }, token);
    return res;
  });

  const handleUpdateInfoUser = () => {
    const { name, address, phone, city } = stateUserDetails;
    if (name && address && phone && city) {
      mutationUpdate.mutate(
        { id: user?.id, token: user?.access_token, ...stateUserDetails },
        {
          onSuccess: () => {
            message.success("Đổi địa chỉ thành công");
            dispatch(updateUser({ name, address, city, phone }));
            setIsOpenModalUpdateInfo(false);
            window.location.reload();
          },
        }
      );
    }
  };
  useEffect(() => {
    if (updateAddress === true) {
      handleUpdateInfoUser();
      navigate("", {
        state: {
          openMic: true,
        },
      });
    }
  }, [updateAddress]);
  useEffect(() => {
    if (cancelChangeAddress === true) {
      handleCancelUpdate();
      setVoiceChangeAddress(false);
    }
  }, [cancelChangeAddress]);

  const onChange = (value) => {
    if (value > stateProductDetails?.countInStock) {
      setNumberProduct(stateProductDetails?.countInStock);
    } else {
      setNumberProduct(value);
    }
  };

  const handleIncrease = () => {
    if (numberProduct === stateProductDetails.countInStock) {
      setNumberProduct(numberProduct);
    } else {
      setNumberProduct(numberProduct + 1);
    }
  };
  const handleDecrease = () => {
    if (numberProduct === 1) {
      setNumberProduct(numberProduct);
    } else {
      setNumberProduct(numberProduct - 1);
    }
  };

  const [stateProductDetails, setStateProductDetails] = useState({
    name: "",
    price: "",
    description: "",
    rating: "",
    image: "",
    type: "",
    countInStock: "",
    newType: "",
    discount: "",
    selled: "",
    _id: "",
    followers: [],
  });

  const fetchGetDetailsProduct = async (idProduct) => {
    const res = await ProductService.getDetailProduct(idProduct);
    if (res?.data) {
      setStateProductDetails({
        _id: res?.data?._id,
        name: res?.data?.name,
        price: res?.data?.price,
        description: res?.data?.description,
        rating: res?.data?.rating,
        image: res?.data?.image,
        type: res?.data?.type,
        countInStock: res?.data?.countInStock,
        discount: res?.data?.discount,
        selled: res?.data?.selled,
        followers: res?.data?.followers,
      });
    }
  };

  const isFollower = async () => {
    if (
      stateProductDetails?.followers &&
      Array.isArray(stateProductDetails?.followers)
    ) {
      const isFollow = await stateProductDetails?.followers.find(
        (product) => product.user === user?.id
      );
      if (isFollow) {
        setIsFollowerProduct(true);
      } else {
        setIsFollowerProduct(false);
      }
    }
  };

  useEffect(() => {
    if (idProduct) {
      //   setIsLoadingUpdate(true)
      fetchGetDetailsProduct(idProduct);
    }
  }, [idProduct]);

  useEffect(() => {
    isFollower();
  }, [stateProductDetails, user]);

  const handleAddOderProduct = () => {
    if (!user?.id) {
      navigate("/sign-in", { state: location?.pathname });
    } else {
      dispatch(
        addOrderProduct({
          orderItem: {
            name: stateProductDetails?.name,
            amount: numberProduct,
            image: stateProductDetails?.image,
            price: stateProductDetails?.price,
            product: stateProductDetails?._id,
            discount: stateProductDetails?.discount,
            countInStock: stateProductDetails?.countInStock,
          },
        })
      );
      message.success("Thêm vào giỏ hàng thành công");
    }
  };
  const handleBuyNow = () => {
    if (!user?.id) {
      navigate("/sign-in", { state: location?.pathname });
    } else {
      dispatch(
        addOrderProduct({
          orderItem: {
            name: stateProductDetails?.name,
            amount: numberProduct,
            image: stateProductDetails?.image,
            price: stateProductDetails?.price,
            product: stateProductDetails?._id,
            discount: stateProductDetails?.discount,
            countInStock: stateProductDetails?.countInStock,
          },
        })
      );
      navigate("/order");
      message.success("Thêm vào giỏ hàng thành công");
    }
  };
  const mutationDeleted = useMutationHook((data) => {
    const { id, token } = data;
    const res = ProductService.deleteFollower(id, token);
    return res;
  });

  const mutationAddFollower = useMutationHook((data) => {
    const { id, token, ...rests } = data;
    const res = ProductService.addFollower(id, token, { ...rests });
    return res;
  });
  const {
    data: dataAddFollower,
    isLoading: isLoadingUpdated,
    isSuccess: isSuccessUpdated,
    isError: isErrorUpdated,
  } = mutationAddFollower;
  const onAddFollower = () => {
    mutationAddFollower.mutate({
      id: idProduct,
      token: user?.access_token,
      followers: [
        {
          name: user?.name,
          email: user?.email,
          user: user?.id,
          product: idProduct,
        },
      ],
    });
  };

  const onDeleteFollower = () => {
    mutationDeleted.mutate({ id: user?.id, token: user?.access_token }, {});
  };

  const onHandleFollower = () => {
    if (!user?.id) {
      navigate("/sign-in", { state: location?.pathname });
    } else {
      if (isFollowerProduct === false) {
        onAddFollower();
        setIsFollowerProduct(true);
      } else {
        onDeleteFollower();
        setIsFollowerProduct(false);
      }
    }
  };

  useEffect(() => {
    if (followProduct === true && isFollowerProduct === false) {
      onHandleFollower();
    }
  }, [followProduct]);

  useEffect(() => {
    if (unFollowProduct === true && isFollowerProduct === true) {
      onHandleFollower();
    }
  }, [unFollowProduct]);

  useEffect(() => {
    if (addCart === true) {
      handleAddOderProduct();
    }
  }, [addCart]);
  useEffect(() => {
    if (buyNow === true) {
      handleBuyNow();
    }
  }, [buyNow]);

  const getAmountProductInCart = async (num) => {
    const foundProduct = await order?.orderItems?.find(
      (pro) => pro?.product === idProduct
    );
    if (foundProduct) {
      if (num + foundProduct?.amount > foundProduct?.countInStock) {
        message.error("Số lượng sản phẩm trong kho không đủ");
        setNumberProduct(foundProduct?.countInStock - foundProduct?.amount);
      }
    }
  };

  useEffect(() => {
    getAmountProductInCart(numberProduct);
  }, [numberProduct]);

  useEffect(() => {
    if (numberIncrease > 0) {
      if (numberProduct + numberIncrease <= stateProductDetails?.countInStock) {
        setNumberProduct((prev) => prev + numberIncrease);
      } else {
        setNumberProduct(stateProductDetails?.countInStock);
      }
    }
  }, [numberIncrease]);

  useEffect(() => {
    if (numberDecrease > 0) {
      if (numberProduct > numberDecrease) {
        setNumberProduct((prev) => prev - numberDecrease);
      } else {
        setNumberProduct(1);
      }
    }
  }, [numberDecrease]);

  return (
    <>
      <Row style={{ background: "#fff", padding: "16px" }}>
        <Col span={10}>
          <Image
            src={stateProductDetails?.image}
            alt="Image Product"
            preview={true}
          />
        </Col>
        <Col
          span={14}
          style={{
            paddingLeft: "10px",
            display: "flex",
            flexDirection: "column",
            flexWrap: "nowrap",
            overflow: "hidden",
          }}
        >
          <WrapperStyleNameProduct>
            {stateProductDetails?.name}
          </WrapperStyleNameProduct>
          <div>
            <Rate allowHalf defaultValue={ratingDetail} value={ratingDetail} />
            <WrapperStyleTextSell>
              {" "}
              | Đã bán{" "}
              {stateProductDetails?.selled ? stateProductDetails?.selled : 0}+
            </WrapperStyleTextSell>
          </div>
          <WrapperPriceProduct>
            <WrapperPriceTextProduct>
              {stateProductDetails?.price.toLocaleString()} VND
            </WrapperPriceTextProduct>
            <div style={{ fontSize: "16px", fontFamily: "ui-monospace" }}>
              {stateProductDetails?.description}
            </div>
          </WrapperPriceProduct>
          <WrapperAddress style={{ marginTop: "20px" }}>
            <span>Giao đến</span>
            <span className="address"> {user?.address}</span> -
            <span className="changeAddress" onClick={handleChangeAddress}>
              {" "}
              Đổi địa chỉ{" "}
            </span>
          </WrapperAddress>
          <div>
            <WrapperTextQuality>Số lượng</WrapperTextQuality>
            <WrapperQualityProduct>
              <ButtonComponent
                icon={<MinusOutlined style={{ color: "#000" }} />}
                onClick={handleDecrease}
              />
              <WrapperInputNumber
                min={1}
                max={stateProductDetails?.countInStock}
                value={numberProduct}
                onChange={onChange}
              />
              <ButtonComponent
                icon={
                  <PlusOutlined
                    style={{ color: "#000", textAlign: "center" }}
                  />
                }
                onClick={handleIncrease}
              />
            </WrapperQualityProduct>
          </div>
          <WrapperBtnBuyCart>
            <WrapperBtnAddCart
              size={20}
              textButton={
                <>
                  <ShoppingCartOutlined style={{ fontSize: "25px" }} /> Thêm vào
                  giỏ hàng
                </>
              }
              styleTextButton={{
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "5px",
              }}
              onClick={handleAddOderProduct}
            ></WrapperBtnAddCart>
            <WrapperBtnAddCart
              size={20}
              textButton={
                <>
                  <ShoppingOutlined style={{ fontSize: "25px" }} /> Mua ngay
                </>
              }
              styleTextButton={{
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "5px",
              }}
              onClick={handleBuyNow}
            ></WrapperBtnAddCart>
            <WrapperBtnFollowProduct
              isFollowerProduct={isFollowerProduct}
              size={20}
              textButton={
                isFollowerProduct === false ? (
                  <>
                    {<PlusSquareOutlined style={{ fontSize: "25px" }} />} Theo
                    dõi
                  </>
                ) : (
                  <>
                    <CheckOutlined /> Đã theo dõi
                  </>
                )
              }
              styleTextButton={{
                color:
                  isFollowerProduct === false ? "rgb(10, 104, 255)" : "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "5px",
              }}
              onClick={onHandleFollower}
            ></WrapperBtnFollowProduct>
          </WrapperBtnBuyCart>
          {/* <QRCodeComponent productId={idProduct}/> */}
        </Col>
      </Row>
      <ModalComponent
        title="Cập nhật thông tin giao hàng"
        open={isOpenModalUpdateInfo}
        onCancel={handleCancelUpdate}
        onOk={handleUpdateInfoUser}
      >
        {/* <Loading isLoading={}> */}
        <Form
          form={form}
          name="basic"
          labelCol={{
            span: 7,
          }}
          wrapperCol={{
            span: 17,
          }}
          initialValues={{
            remember: true,
          }}
          // onFinish={onUpdateUser}
          autoComplete="on"
        >
          <Form.Item
            label="Tên khách hàng"
            name="name"
            rules={[
              {
                required: true,
                message: "Please input user name!",
              },
            ]}
          >
            <InputComponent
              value={stateUserDetails.name}
              onChange={handleOnchangeDetails}
              name="name"
            />
          </Form.Item>

          <Form.Item
            label="Địa chỉ giao hàng"
            name="address"
            rules={[
              {
                required: true,
                message: "Please input user address!",
              },
            ]}
          >
            <InputComponent
              value={stateUserDetails.address}
              onChange={handleOnchangeDetails}
              name="address"
            />
          </Form.Item>
          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[
              {
                required: true,
                message: "Please input user address!",
              },
            ]}
          >
            <InputComponent
              value={stateUserDetails.phone}
              onChange={handleOnchangeDetails}
              name="phone"
            />
          </Form.Item>

          <Form.Item
            label="Thành phố"
            name="city"
            rules={[
              {
                required: true,
                message: "Please input user address!",
              },
            ]}
          >
            <InputComponent
              value={stateUserDetails.city}
              onChange={handleOnchangeDetails}
              name="city"
            />
          </Form.Item>
        </Form>
        {/* </Loading> */}
      </ModalComponent>
    </>
  );
};

export default ProductDetailComponent;

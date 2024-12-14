import { DeleteOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Checkbox, Form, message } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import {
  WrapperContent,
  WrapperInfo,
  WrapperInputComponent,
  WrapperInputNumber,
  WrapperLeft,
  WrapperProductCart,
  WrapperRight,
  WrapperSection,
  WrapperTitleProduct,
} from "./style";
import { useDispatch, useSelector } from "react-redux";
import {
  decreaseAmount,
  increaseAmount,
  orderSelected,
  removeAllOrderProduct,
  removeOrderProduct,
} from "../../redux/slides/oderSlide";
import { useQuery } from "@tanstack/react-query";
import * as DiscountService from "../../services/DiscountService";
import ModalComponent from "../../components/ModalComponent/ModalComponent";
import Loading from "../../components/Loading/Loading";
import InputComponent from "../../components/InputComponent/InputComponent";
import { useMutationHook } from "../../hooks/useMutationHook";
import * as UserService from "../../services/UserService";
import { updateUser } from "../../redux/slides/userSlide";
import StepComponent from "../../components/StepComponent/StepComponent";

const OrderPage = () => {
  const [listChecked, setListChecked] = useState([]);
  const order = useSelector((state) => state.order);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [currentDelivery, setCurrentDelivery] = useState(0);
  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false);

  const [voiceChangeAddress, setVoiceChangeAddress] = useState(false);
  const [voiceValueAddress, setVoiceValueAddress] = useState("");
  const navigate = useNavigate();
  const { state } = useLocation();
  const location = useLocation();
  const [stateUserDetails, setStateUserDetails] = useState({
    name: "",
    address: "",
    phone: "",
    city: "",
  });
  const [numCheckList, setNumCheckList] = useState("");
  const [numUnCheckList, setNumUnCheckList] = useState("");
  const [numDeleteToCart, setNumDeleteToCart] = useState("");

  const idProductDeleteCheck = location.state?.idProductDeleteCheck || "";
  const idProductCheck = location.state?.idProductCheck || "";
  const isCheckAll = location.state?.isCheckAll || false;
  const isCancelCheck = location.state?.isCancelCheck || false;
  const changeAddress = location.state?.changeAddress || false;
  const valueAddress = location.state?.valueAddress || "";
  const updateAddress = location.state?.update || false;
  const cancelChangeAddress = location.state?.cancelChangeAddress || false;
  const idProductDeleteToCart = location.state?.idProductDeleteToCart || "";

  const buyByMic = state?.buy || false;
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

  const getAllDiscounts = async () => {
    const res = await DiscountService.getAllDiscount();
    return res;
  };
  const queryDiscount = useQuery({
    queryKey: ["discounts"],
    queryFn: getAllDiscounts,
  });
  const { isLoading: isLoadingDiscount, data: discounts } = queryDiscount;

  useEffect(() => {
    if (idProductCheck !== "") {
      setNumCheckList(idProductCheck);
    }
  }, [idProductCheck]);
  useEffect(() => {
    if (idProductDeleteCheck !== "") {
      setNumUnCheckList(idProductDeleteCheck);
    }
  }, [idProductDeleteCheck]);
  useEffect(() => {
    if (idProductDeleteToCart !== "") {
      setNumDeleteToCart(idProductDeleteToCart);
    }
  }, [idProductDeleteToCart]);

  const [form] = Form.useForm();

  const handleOnchangeDetails = (e) => {
    setStateUserDetails({
      ...stateUserDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleIncrease = (idProduct, amount, countInStock) => {
    if (amount < countInStock) {
      dispatch(increaseAmount({ idProduct }));
    } else {
    }
  };

  const handleDecrease = (idProduct, amount) => {
    if (amount >= 2) {
      dispatch(decreaseAmount({ idProduct }));
    } else {
    }
  };
  const handleRemoveOrder = (idProduct) => {
    dispatch(removeOrderProduct({ idProduct }));
  };
  const handleRemoveAllOrder = () => {
    if (listChecked?.length) {
      dispatch(removeAllOrderProduct({ listChecked }));
    }
  };

  const onChange = (e) => {
    if (listChecked.includes(e.target.value)) {
      const newListChecked = listChecked.filter(
        (item) => item !== e.target.value
      );
      setListChecked(newListChecked);
    } else {
      setListChecked([...listChecked, e.target.value]);
    }
  };

  useEffect(() => {
    if (numCheckList !== "") {
      if (!listChecked.includes(numCheckList)) {
        setListChecked([...listChecked, numCheckList]);
      }
    }
    setNumCheckList("");
  }, [numCheckList]);

  useEffect(() => {
    let arrListCheckNew = [];
    if (numUnCheckList !== "") {
      if (listChecked.includes(numUnCheckList)) {
        listChecked
          ?.filter((item) => item !== numUnCheckList)
          .map((pro) => {
            arrListCheckNew.push(pro);
          });
      }
      setListChecked(arrListCheckNew);
      setNumUnCheckList("");
    }
  }, [numUnCheckList]);

  useEffect(() => {
    if (numDeleteToCart !== "") {
      handleRemoveOrder(numDeleteToCart);
      setNumDeleteToCart("");
    }
  }, [numDeleteToCart]);

  const handleCheckAll = (e) => {
    if (e.target?.checked) {
      const newListChecked = [];
      order?.orderItems?.forEach((item) => {
        newListChecked.push(item?.product);
      });
      setListChecked(newListChecked);
    } else {
      setListChecked([]);
    }
  };

  useEffect(() => {
    if (isCheckAll) {
      let arrItem = [];
      order?.orderItems?.map((item) => {
        arrItem.push(item?.product);
      });
      setListChecked(arrItem);
    }
  }, [isCheckAll]);

  useEffect(() => {
    if (isCancelCheck) {
      setListChecked([]);
    }
  }, [isCancelCheck]);

  useEffect(() => {
    dispatch(orderSelected({ listChecked }));
  }, [listChecked]);

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

  useEffect(() => {
    if (changeAddress) {
      setVoiceChangeAddress(changeAddress);
    }
  }, [changeAddress]);

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

  // order?.orderItems.forEach((item)=>{
  //     arrPrice.push({
  //         price: item.price * item.amount,

  //     })
  // })
  // const totalPrice = ()=>{
  //     let total = 0;
  //     arrPrice.forEach((item)=>{
  //         total += item.price
  //     })
  //    return total

  // }
  // useEffect(()=>{
  //     setTemporaryPrice(totalPrice())
  // },[arrPrice])

  const priceMemo = useMemo(() => {
    const result = order?.orderItemsSelected?.reduce((total, cur) => {
      return total + cur.price * cur.amount;
    }, 0);
    return result;
  }, [order]);
  const priceMemoDiscount = useMemo(() => {
    const result = order?.orderItemsSelected?.reduce((total, cur) => {
      if (discounts?.data?.find((item) => item?.product === cur?.product)) {
        return (
          total +
          (cur.price *
            cur.amount *
            discounts?.data?.find((item) => item?.product === cur?.product)
              ?.value) /
            100
        );
      } else {
        return total + (cur.price * cur.amount * cur.discount) / 100;
      }
    }, 0);
    return result;
  }, [order, discounts]);

  const priceMemoDelivery = useMemo(() => {
    if (priceMemo > 100000 && priceMemo <= 500000) {
      return 10000;
    } else {
      if (priceMemo === 0 || priceMemo > 500000) {
        return 0;
      } else {
        return 20000;
      }
    }
  }, [order]);
  const priceMemoTotal = useMemo(() => {
    return priceMemo - priceMemoDiscount + priceMemoDelivery;
  }, [priceMemo, priceMemoDelivery, priceMemoDiscount]);

  const handleCancelUpdate = () => {
    setIsOpenModalUpdateInfo(false);
  };

  const mutationUpdate = useMutationHook((data) => {
    const { id, token, ...rests } = data;
    const res = UserService.updateUser(id, { ...rests }, token);
    return res;
  });
  const { data, isLoading } = mutationUpdate;

  const handleUpdateInfoUser = () => {
    const { name, address, phone, city } = stateUserDetails;
    if (name && address && phone && city) {
      mutationUpdate.mutate(
        { id: user?.id, token: user?.access_token, ...stateUserDetails },
        {
          onSuccess: () => {
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

  const addCart = () => {
    if (!user?.id) {
      navigate("/sign-in", { state: location?.pathname });
    } else {
      if (!user?.name || !user?.phone || !user?.address || !user?.city) {
        setIsOpenModalUpdateInfo(true);
      } else if (!order?.orderItemsSelected?.length) {
        message.error("Vui lòng chọn sản phẩm");
      } else {
        navigate("/payment");
      }
    }
  };

  useEffect(() => {
    if (buyByMic === true) {
      addCart();
    }
  }, [buyByMic]);

  const handleChangeAddress = () => {
    setIsOpenModalUpdateInfo(true);
  };

  const itemsDelivery = [
    {
      title: "20.000VND",
      description: "Dưới 100.000VND",
    },
    {
      title: "10.000VND",
      description: "Từ 100.000-500.000VND",
    },
    {
      title: "0 VND",
      description: "Trên 500.000VND",
    },
  ];
  useEffect(() => {
    if (priceMemoDelivery === 20000) {
      setCurrentDelivery(1);
    } else {
      if (priceMemoDelivery === 10000) {
        setCurrentDelivery(2);
      } else {
        if (priceMemoDelivery === 0 && order?.orderItemsSelected.length) {
          setCurrentDelivery(3);
        } else {
          setCurrentDelivery(0);
        }
      }
    }
  }, [priceMemoDelivery, order?.orderItemsSelected]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "rgb(239, 239, 239)",
        padding: "0px 0 20px",
      }}
    >
      <WrapperContent>
        <h3 style={{ margin: "0", fontSize: "15px", padding: "15px 0" }}>
          <span style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
            Trang chủ
          </span>{" "}
          - Giỏ hàng
        </h3>
        <WrapperSection>
          <WrapperLeft>
            <div
              style={{
                background: "rgb(240, 248, 255)",
                border: "1px solid rgb(194, 225, 255)",
                padding: "15px",
                borderRadius: "20px",
                margin: "10px 0",
              }}
            >
              <StepComponent current={currentDelivery} items={itemsDelivery} />
            </div>
            <WrapperTitleProduct>
              <span style={{ width: "250px" }}>
                <Checkbox
                  onChange={handleCheckAll}
                  checked={listChecked?.length === order?.orderItems?.length}
                />
                <span>
                  Tất cả (<span>{order?.orderItems?.length}</span> sản phẩm )
                </span>
              </span>
              <div
                style={{
                  flex: "1",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span>Đơn giá</span>
                <span>Số lượng</span>
                <span>Thành tiền </span>
                <DeleteOutlined onClick={handleRemoveAllOrder} />
              </div>
            </WrapperTitleProduct>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "50px",
                background: "#fff",
                padding: "10px",
                flexDirection: "column",
              }}
            >
              {order?.orderItems.map((order) => {
                if (order?.name) {
                  return (
                    <WrapperProductCart className="products">
                      <span
                        style={{
                          width: "250px",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Checkbox
                          value={order?.product}
                          onChange={onChange}
                          checked={listChecked.includes(order?.product)}
                        />
                        <img
                          style={{
                            width: "80px",
                            height: "80px",
                            paddingLeft: "5px",
                          }}
                          src={order?.image}
                        ></img>
                        <span
                          style={{
                            padding: "0px 5px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {order?.name}
                        </span>
                      </span>
                      <div
                        style={{
                          flex: "1",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span>{order?.price?.toLocaleString()} VND</span>
                        <span>
                          <ButtonComponent
                            style={{ padding: "0" }}
                            icon={<MinusOutlined style={{ color: "#000" }} />}
                            onClick={() =>
                              handleDecrease(order?.product, order?.amount)
                            }
                          />
                          <WrapperInputNumber
                            min={1}
                            max={order?.orderItems?.countInStock}
                            defaultValue={order?.amount}
                            value={order?.amount}
                          />
                          <ButtonComponent
                            style={{ padding: "0" }}
                            icon={
                              <PlusOutlined
                                style={{ color: "#000", textAlign: "center" }}
                              />
                            }
                            onClick={() =>
                              handleIncrease(
                                order?.product,
                                order?.amount,
                                order?.countInStock
                              )
                            }
                          />
                        </span>
                        <span style={{ color: "red" }}>
                          {(order?.amount * order?.price)?.toLocaleString()} VND
                        </span>
                        <DeleteOutlined
                          onClick={() => handleRemoveOrder(order?.product)}
                        />
                      </div>
                    </WrapperProductCart>
                  );
                }
              })}
            </div>
          </WrapperLeft>
          <WrapperRight>
            <WrapperInfo style={{ marginBottom: "10px" }}>
              <span>Địa chỉ:</span>
              <span style={{ fontWeight: "600" }}>
                {" "}
                {`${user?.address} - ${user?.city}`}{" "}
                <span
                  style={{ color: "blue", cursor: "pointer" }}
                  onClick={handleChangeAddress}
                >
                  {" "}
                  Đổi địa chỉ
                </span>
              </span>
            </WrapperInfo>
            <WrapperInfo>
              <span
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <span>Tạm Tính</span>
                <strong>{priceMemo?.toLocaleString()} VND</strong>
              </span>
              <span>
                <span
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span>Giảm giá</span>
                  <strong>{priceMemoDiscount?.toLocaleString()} VND</strong>
                </span>
              </span>
              <span>
                <span
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span>Thuế</span>
                  <strong>0 VND</strong>
                </span>
              </span>
              <span>
                <span
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span>Phí giao hàng</span>
                  <strong>{priceMemoDelivery?.toLocaleString()} VND</strong>
                </span>
              </span>
              <span>
                <span
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div
                    style={{
                      borderTop: "1px solid #333",
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <span>Tổng tiền</span>
                    <p>
                      <strong style={{ color: "red", fontSize: "20px" }}>
                        {priceMemoTotal?.toLocaleString()} VND
                      </strong>
                    </p>
                  </div>
                </span>
              </span>
            </WrapperInfo>
            <div style={{ textAlign: "center", padding: "20px" }}>
              <ButtonComponent
                textButton={"Thanh toán"}
                style={{
                  background: "red",
                  color: "#fff",
                  height: "50px",
                  width: "200px",
                  fontWeight: "700",
                }}
                onClick={() => addCart()}
              />
            </div>
          </WrapperRight>
        </WrapperSection>
      </WrapperContent>

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
            <WrapperInputComponent
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
            <WrapperInputComponent
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
            <WrapperInputComponent
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
            <WrapperInputComponent
              value={stateUserDetails.city}
              onChange={handleOnchangeDetails}
              name="city"
            />
          </Form.Item>
        </Form>
        {/* </Loading> */}
      </ModalComponent>
    </div>
  );
};

export default OrderPage;

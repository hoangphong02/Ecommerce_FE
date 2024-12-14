import { DeleteOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import Icon from "@ant-design/icons/lib/components/Icon";
import { Checkbox, Form, Radio, Space, message } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import imagePay from "../../assets/images/pay.png";
import imageMoMo from "../../assets/images/MoMo.jpg";
import imagePayment from "../../assets/images/payment.png";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import {
  WrapperContent,
  WrapperInfo,
  WrapperInputNumber,
  WrapperLeft,
  WrapperListDelivery,
  WrapperRight,
  WrapperSection,
} from "./style";
import { useDispatch, useSelector } from "react-redux";
import {
  decreaseAmount,
  increaseAmount,
  orderSelected,
  removeAllOrderProduct,
  removeOrderProduct,
} from "../../redux/slides/oderSlide";
import ModalComponent from "../../components/ModalComponent/ModalComponent";
import Loading from "../../components/Loading/Loading";
import InputComponent from "../../components/InputComponent/InputComponent";
import { useMutationHook } from "../../hooks/useMutationHook";
import * as UserService from "../../services/UserService";
import * as OrderService from "../../services/OrderService";
import * as PaymentService from "../../services/PaymentService";
import * as DiscountService from "../../services/DiscountService";
import { updateUser } from "../../redux/slides/userSlide";
import { PayPalButton } from "react-paypal-button-v2";
import { useQuery } from "@tanstack/react-query";

const PaymentPage = () => {
  const order = useSelector((state) => state.order);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const arrPrice = [];
  const [temporaryPrice, setTemporaryPrice] = useState(0);
  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false);
  const [sdkReady, setSdkReady] = useState(false);
  const [payment, setPayment] = useState("Thanh toán khi nhận hàng");
  const [delivery, setDelivery] = useState("Fast Giao hàng tiết kiệm");
  const navigate = useNavigate();
  const { state } = useLocation();
  const [stateUserDetails, setStateUserDetails] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
  });

  const [form] = Form.useForm();

  const statePayment = state?.value ? state.value : payment;
  const stateBuy = state?.buy ? state.buy : false;

  const getAllDiscounts = async () => {
    const res = await DiscountService.getAllDiscount();
    return res;
  };
  const queryDiscount = useQuery({
    queryKey: ["discounts"],
    queryFn: getAllDiscounts,
  });
  const { isLoading: isLoadingDiscount, data: discounts } = queryDiscount;

  const handleOnchangeDetails = (e) => {
    setStateUserDetails({
      ...stateUserDetails,
      [e.target.name]: e.target.value,
    });
  };

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

  const mutationAddOrder = useMutationHook((data) => {
    const { token, ...rests } = data;
    const res = OrderService.createOrder({ ...rests }, token);
    return res;
  });

  const handleUpdateInfoUser = () => {
    const { name, address, phone, city } = stateUserDetails;
    if (name && address && phone && city) {
      mutationUpdate.mutate(
        { id: user?.id, token: user?.access_token, ...stateUserDetails },
        {
          onSuccess: () => {
            dispatch(updateUser({ name, address, city, phone }));
            setIsOpenModalUpdateInfo(false);
          },
        }
      );
    }
  };

  const {
    data: dataAdd,
    isLoading: isLoading,
    isSuccess: isSuccsess,
    isError: isError,
  } = mutationAddOrder;
  useEffect(() => {
    if (isSuccsess && dataAdd?.status === "OK") {
      const orderArr = [];
      order?.orderItemsSelected?.forEach((element) => {
        orderArr.push(element.product);
      });
      dispatch(removeAllOrderProduct({ listChecked: orderArr }));
      message.success("Đặt hàng thành công");
      navigate("/orderSuccess", {
        state: {
          delivery,
          payment,
          order: order?.orderItemsSelected,
          totalPriceMemo: priceMemoTotal?.toLocaleString(),
        },
      });
    } else if (isSuccsess && dataAdd?.status === "ERR") {
      message.error(dataAdd?.message);
    }
  }, [isSuccsess, isError]);

  //     const handleAddOrder=()=>{
  //       if(user?.access_token && order?.orderItemsSelected && user?.name && user?.address && user?.phone && user?.city && priceMemo && priceMemoDelivery && priceMemoTotal && user?.id){

  //         // eslint-disable-next-line no-unused-expressions
  //         mutationAddOrder.mutate({
  //          token:user?.access_token, orderItems: order?.orderItemsSelected, fullName: user?.name, address: user?.address, phone: user?.phone, city: user?.city, paymentMethod: payment,itemPrice: priceMemo,
  //  shippingPrice: priceMemoDelivery,totalPrice:priceMemoTotal, user:user?.id,

  //         })
  //       }
  //     }

  const handleAddOrder = () => {
    if (
      user?.access_token &&
      order?.orderItemsSelected &&
      user?.name &&
      user?.address &&
      user?.phone &&
      user?.city &&
      priceMemo &&
      user?.id
    ) {
      // eslint-disable-next-line no-unused-expressions
      mutationAddOrder.mutate({
        token: user?.access_token,
        orderItems: order?.orderItemsSelected,
        fullName: user?.name,
        address: user?.address,
        phone: user?.phone,
        city: user?.city,
        paymentMethod: payment,
        itemsPrice: priceMemo,
        shippingPrice: priceMemoDelivery,
        totalPrice: priceMemoTotal,
        user: user?.id,
        email: user?.email,
      });
    }
  };

  const handleChangeAddress = () => {
    setIsOpenModalUpdateInfo(true);
  };
  const onChangeRadioPayment = (e) => {
    // setValue(e.target.value)
    setPayment(e.target.value);
  };
  useEffect(() => {
    if (statePayment) {
      setPayment(statePayment);
    }
  }, [statePayment]);

  useEffect(() => {
    if (payment === "Thanh toán bằng ví Paypal") {
      if (stateBuy === true) {
      }
    } else {
      if (stateBuy === true) {
        handleAddOrder();
      }
    }
  }, [stateBuy]);

  const onChangeRadioDelevery = (e) => {
    // setValue(e.target.value)
    setDelivery(e.target.value);
  };

  const onSuccessPaypal = (details, data) => {
    mutationAddOrder.mutate({
      token: user?.access_token,
      orderItems: order?.orderItemsSelected,
      fullName: user?.name,
      address: user?.address,
      phone: user?.phone,
      city: user?.city,
      paymentMethod: payment,
      itemsPrice: priceMemo,
      shippingPrice: priceMemoDelivery,
      totalPrice: priceMemoTotal,
      user: user?.id,
      email: user?.email,
      isPaid: true,
      paidAt: details?.update_time,
    });
  };

  const addPayPalScript = async () => {
    const { data } = await PaymentService.getConFigPayPal();
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = `https://www.paypal.com/sdk/js?client-id=${data}`;
    script.async = true;
    script.onload = () => {
      setSdkReady(true);
    };
    document.body.appendChild(script);
  };

  useEffect(() => {
    if (!window.paypal) {
      addPayPalScript();
    } else {
      setSdkReady(true);
    }
  }, []);

  return (
    <Loading isLoading={isLoading}>
      <div
        style={{
          width: "100%",
          height: "100vh",
          background: "rgb(239, 239, 239)",
        }}
      >
        <WrapperContent>
          <h3 style={{ margin: "0", fontSize: "15px", padding: "15px 0" }}>
            <span style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
              Trang chủ
            </span>{" "}
            - Phương thức thanh toán
          </h3>
          <WrapperSection>
            <WrapperLeft>
              <div style={{ background: "#fff", padding: "20px" }}>
                <span style={{ fontSize: "20px" }}>
                  Chọn hình thức giao hàng
                </span>
                <WrapperListDelivery>
                  <Radio.Group
                    onChange={onChangeRadioDelevery}
                    defaultValue={"Fast Giao hàng tiết kiệm"}
                  >
                    <Space direction="vertical">
                      <Radio value={"Fast Giao hàng tiết kiệm"}>
                        <span style={{ color: "coral", fontWeight: "500" }}>
                          Fast
                        </span>{" "}
                        <span>Giao hàng tiết kiệm</span>
                      </Radio>
                      {/*   <Radio value={"Go_JEK Giao hàng tiết kiệm"}><span style={{color:"coral", fontWeight:"500"}}>Go_JEK</span> <span>Giao hàng tiết kiệm</span></Radio>*/}
                    </Space>
                  </Radio.Group>
                </WrapperListDelivery>
              </div>
              <div
                style={{
                  background: "#fff",
                  padding: "20px",
                  margin: "10px 0",
                }}
              >
                <span style={{ fontSize: "20px" }}>
                  Chọn hình thức thanh toán
                </span>
                <WrapperListDelivery>
                  <Radio.Group onChange={onChangeRadioPayment} value={payment}>
                    <Space direction="vertical">
                      <Radio value={"Thanh toán khi nhận hàng"}>
                        <img style={{ width: "20px" }} src={imagePay} />{" "}
                        <span>Thanh toán khi nhận hàng</span>
                      </Radio>
                      <Radio value={"Thanh toán bằng ví MoMo"}>
                        <span style={{ display: "flex" }}>
                          <img style={{ width: "20px" }} src={imageMoMo} />{" "}
                          <span>Thanh toán bằng ví MoMo</span>
                        </span>
                      </Radio>
                      <Radio value={"Thanh toán bằng ví Paypal"}>
                        <span style={{ display: "flex" }}>
                          <img style={{ width: "20px" }} src={imagePayment} />{" "}
                          <span>Thanh toán bằng ví Paypal</span>
                        </span>
                      </Radio>
                    </Space>
                  </Radio.Group>
                </WrapperListDelivery>
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
                    Thay đổi
                  </span>
                </span>
              </WrapperInfo>
              <WrapperInfo>
                <span
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span>Tạm Tính</span>
                  <strong>{priceMemo?.toLocaleString()} vnd</strong>
                </span>
                <span>
                  <span
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span>Giảm giá</span>
                    <strong>{priceMemoDiscount?.toLocaleString()} vnd</strong>
                  </span>
                </span>
                <span>
                  <span
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span>Thuế</span>
                    <strong>0</strong>
                  </span>
                </span>
                <span>
                  <span
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span>Phí giao hàng</span>
                    <strong>{priceMemoDelivery?.toLocaleString()} vnd</strong>
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
                          {priceMemoTotal?.toLocaleString()} vnd
                        </strong>
                      </p>
                    </div>
                  </span>
                </span>
              </WrapperInfo>
              <div style={{ textAlign: "center", padding: "20px" }}>
                {payment === "Thanh toán bằng ví Paypal" && sdkReady ? (
                  <PayPalButton
                    amount={Math.round(priceMemoTotal / 30000)}
                    // shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
                    onSuccess={onSuccessPaypal}
                    onError={() => {
                      alert("Error");
                    }}
                  />
                ) : (
                  <ButtonComponent
                    textButton={"Đặt hàng"}
                    style={{
                      background: "red",
                      color: "#fff",
                      height: "50px",
                      width: "200px",
                      fontWeight: "700",
                    }}
                    onClick={() => handleAddOrder()}
                  />
                )}
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
              span: 4,
            }}
            wrapperCol={{
              span: 20,
            }}
            initialValues={{
              remember: true,
            }}
            // onFinish={onUpdateUser}
            autoComplete="on"
          >
            <Form.Item
              label="Name"
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
              label="Address"
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
              label="Phone"
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
              label="City"
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
      </div>
    </Loading>
  );
};

export default PaymentPage;

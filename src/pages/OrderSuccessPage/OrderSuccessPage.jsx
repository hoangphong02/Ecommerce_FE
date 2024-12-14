import React from "react";
import { useLocation, useNavigate } from "react-router";
import { WrapperLeft, WrapperProductsOrder, WrapperValue } from "./style";

const OrderSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        background: "rgb(239, 239, 239)",
      }}
    >
      <div style={{ height: "100%", width: "1270px", margin: "0 auto" }}>
        <h3 style={{ margin: "0", fontSize: "15px", padding: "15px 0" }}>
          <span style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
            Trang chủ
          </span>{" "}
          - Đặt hàng thành công
        </h3>
        <div style={{ display: "flex" }}>
          <WrapperLeft>
            <WrapperValue>
              <span style={{ fontSize: "20px" }}>Hình thức giao hàng</span>
              <div
                style={{
                  background: "rgb(240, 248, 255)",
                  border: "1px solid rgb(194, 225, 255)",
                  width: "500px",
                  padding: "15px",
                  borderRadius: "20px",
                  margin: "10px 0",
                }}
              >
                <label htmlFor="">{location?.state?.delivery}</label>
              </div>
            </WrapperValue>
            <WrapperValue>
              <span style={{ fontSize: "20px" }}>Hình thức thanh toán</span>
              <div
                style={{
                  background: "rgb(240, 248, 255)",
                  border: "1px solid rgb(194, 225, 255)",
                  width: "500px",
                  padding: "15px",
                  borderRadius: "20px",
                  margin: "10px 0",
                }}
              >
                <label htmlFor="">{location?.state?.payment}</label>
              </div>
            </WrapperValue>

            <WrapperValue>
              <span style={{ fontSize: "20px" }}>Thông tin sản phẩm</span>
              <WrapperProductsOrder>
                {location?.state?.order.map((order) => {
                  return (
                    <div
                      style={{
                        display: "flex",
                        width: "100%",
                        gap: "20px",
                        margin: "10px 0",
                      }}
                    >
                      <span
                        style={{
                          width: "330px",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <img
                          style={{
                            width: "80px",
                            height: "80px",
                            paddingLeft: "5px",
                          }}
                          src={order?.image}
                          alt=""
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
                        <span>
                          Giá tiền: {order?.price?.toLocaleString()} vnd
                        </span>
                        <span>Số lượng: {order?.amount}</span>
                        <span style={{ color: "red" }}>
                          Giá tổng tiền:{" "}
                          {(order?.amount * order?.price)?.toLocaleString()} vnd
                        </span>
                      </div>
                    </div>
                  );
                })}
              </WrapperProductsOrder>

              <div style={{ color: "red", fontWeight: "bold" }}>
                Tổng tiền: {location?.state?.totalPriceMemo} vnd
              </div>
            </WrapperValue>
          </WrapperLeft>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;

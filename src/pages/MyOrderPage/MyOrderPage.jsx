import { useLocation, useNavigate } from "react-router";
import {
  WrapperListOrder,
  WrapperOrderItem,
  WrapperProductsOrder,
} from "./style";
import { useDispatch, useSelector } from "react-redux";
import * as OrderService from "../../services/OrderService";
import StepComponent from "../../components/StepComponent/StepComponent";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../components/Loading/Loading";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { useMutationHook } from "../../hooks/useMutationHook";
import { useEffect, useState } from "react";
import { Modal, Rate, message } from "antd";
import * as EvaluateService from "../../services/EvaluateService";

const MyOrderPage = () => {
  //  const order = useSelector((state)=> state.order)
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const location = useLocation();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [modal2Open, setModal2Open] = useState(false);
  const [valueRating, setValueRating] = useState(0);
  const [description, setDescription] = useState("");
  const [idDetailsOrder, setIdDetailsOrder] = useState("");
  const [idProduct, setIdProduct] = useState([]);
  const [idOrder, setIdOrder] = useState("");
  const [isEvaluate, setIsEvaluate] = useState(false);
  const [evaluatedProducts, setEvaluatedProducts] = useState([]);

  const fetchMyOrder = async () => {
    const res = await OrderService.getOrderByUserId(state?.id, state?.token);
    return res.data;
  };

  const queryOrder = useQuery({ queryKey: ["orders"], queryFn: fetchMyOrder });
  const { isLoading, data } = queryOrder;

  const fetchMyDetailsOrder = async (id, token) => {
    const arrIdProduct = [];
    const res = await OrderService.getDetailOrder(id, token);
    res?.data?.orderItems?.forEach((item) => {
      if (item.product) {
        arrIdProduct.push({ product: item.product, name: item?.name });
      }
    });
    setIdProduct(arrIdProduct);
    setIdOrder(res?.data?._id);
  };

  const handleSeeDetailsOrder = (id) => {
    navigate(`/order-details/${id}`, { state: { id } });
  };

  const mutation = useMutationHook((data) => {
    const { id, token, orderItems, userId } = data;
    const res = OrderService.cancelOrder(id, token, orderItems, userId);
    return res;
  });

  const handleCancelOrder = async (order) => {
    if (!order?.isConfirm && !order?.isPaid) {
      mutation.mutate(
        {
          id: order?._id,
          token: state?.token,
          orderItems: order?.orderItems,
          userId: user?.id,
        },
        {
          onSuccess: () => {
            queryOrder.refetch();
          },
        }
      );
    } else {
      if (order?.isConfirm) {
        message.error("Không thể hủy đơn hàng do đã được xác nhận");
      } else {
        message.error("Không thể hủy đơn hàng do đã thanh toán");
      }
    }
  };

  const mutationUpdate = useMutationHook((data) => {
    const { id, token, ...rests } = data;
    const res = OrderService.updateOrder(id, token, { ...rests });
    return res;
  });
  const onUpdateOrder = (id) => {
    mutationUpdate.mutate(
      { id: id, token: user?.access_token, isEvaluate: true },
      {
        onSettled: () => {
          queryOrder.refetch();
        },
      }
    );
  };

  const onChange = (e) => {
    setDescription(e.target.value);
  };

  const mutationAddEvaluate = useMutationHook((data) => {
    const { token, ...rests } = data;
    const res = EvaluateService.createEvaluate({ ...rests }, token);
    return res;
  });

  const {
    data: dataAdd,
    isLoading: isLoadingAdd,
    isSuccess: isSuccsess,
    isError: isError,
  } = mutationAddEvaluate;
  const handleAddEvaluate = (id) => {
    if (user?.access_token) {
      // eslint-disable-next-line no-unused-expressions
      mutationAddEvaluate.mutate({
        token: user?.access_token,
        name: user?.name,
        avatar: user?.avatar,
        description: description,
        rating: valueRating,
        user: user?.id,
        product: id,
      });
    }
    setEvaluatedProducts([...evaluatedProducts, id]);
    // setModal2Open(false)
    onUpdateOrder(idOrder);
  };
  useEffect(() => {
    if (dataAdd?.status === "OK") {
      message.success("Đánh giá thành công");
      if (evaluatedProducts.length === idProduct.length) {
        setModal2Open(false);
      }
    } else {
      if (dataAdd?.status === "ERR") {
        message.err("Đánh giá thất bại");
      }
    }
  }, [dataAdd]);

  const handleOnOK = () => {
    // if(user?.access_token  ) {
    //     // eslint-disable-next-line no-unused-expressions
    //     mutationAddEvaluate.mutate(
    //       { token: user?.access_token,
    //         name:user?.name,
    //         avatar:user?.avatar,
    //         description:description,
    //         rating:valueRating,
    //         user: user?.id,
    //         product: id
    //       }
    //     )
    //   }
    setModal2Open(false);
    // onUpdateOrder(idOrder)
  };

  const handleEvaluate = (id) => {
    setModal2Open(true);
    setIdDetailsOrder(id);
    fetchMyDetailsOrder(id, user?.access_token);
  };

  const {
    isLoading: isLoadingCancel,
    isSuccess: isSuccessCancel,
    isError: isErrorCancel,
    data: dataCancel,
  } = mutation;

  useEffect(() => {
    if (isSuccessCancel && dataCancel?.status === "OK") {
      message.success("Hủy đơn hàng thành công");
    } else if (isSuccessCancel && dataCancel?.status === "ERR") {
      message.error(dataCancel?.message);
    } else if (isErrorCancel) {
      message.error("Hủy đơn hàng không thành công");
    }
  }, [isErrorCancel, isSuccessCancel]);

  return (
    //  <Loading isLoading={isLoading} >
    <div style={{ width: "100%", background: "rgb(239, 239, 239)" }}>
      <WrapperListOrder>
        {data?.length > 0 ? (
          data?.map((order) => {
            return (
              <WrapperOrderItem>
                <div
                  style={{ borderBottom: "1px solid #ccc", padding: "15px 0" }}
                >
                  <span>Trạng thái</span>
                  <div>
                    <span style={{ color: "red" }}>Xác nhận đơn hàng: </span>
                    {order?.isConfirm ? "Đã xác nhận" : "Chưa xác nhận"}
                  </div>
                  <div>
                    <span style={{ color: "red" }}>Giao hàng: </span>
                    {order?.isDelivered ? "Đã vận chuyển" : "Chưa vận chuyển"}
                  </div>
                  <div>
                    <span style={{ color: "red" }}>Thanh toán: </span>
                    {order?.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
                  </div>
                </div>

                <WrapperProductsOrder>
                  {order?.orderItems.map((item) => {
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
                            src={item?.image}
                            alt={item?.name}
                          />
                          <span
                            style={{
                              padding: "0px 5px",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {" "}
                            {item?.name}
                          </span>
                        </span>
                        <div
                          style={{
                            flex: "1",
                            display: "flex",
                            justifyContent: "end",
                            alignItems: "center",
                          }}
                        >
                          <span style={{ color: "red" }}>
                            Giá tiền: {item?.price?.toLocaleString()} VND
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </WrapperProductsOrder>

                <div>
                  Tổng tiền :
                  <span style={{ fontWeight: "bold", color: "red" }}>
                    {" "}
                    {order?.totalPrice?.toLocaleString()} VND
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "end",
                    gap: "10px",
                    borderTop: "1px solid #ccc",
                    padding: "15px",
                  }}
                >
                  <ButtonComponent
                    textButton={"Đánh giá"}
                    onClick={() => handleEvaluate(order?._id)}
                    style={{
                      display:
                        order?.isReceived === true &&
                        order?.isEvaluate === false
                          ? "block"
                          : "none",
                    }}
                  />
                  <ButtonComponent
                    textButton={"Hủy đơn hàng"}
                    onClick={() => handleCancelOrder(order)}
                    style={{
                      display: order?.isReceived === true ? "none" : "block",
                    }}
                  />
                  <ButtonComponent
                    textButton={"Xem chi tiết"}
                    onClick={() => handleSeeDetailsOrder(order?._id)}
                  />
                </div>

                <Modal
                  title="Đánh giá sản phẩm"
                  centered
                  open={modal2Open}
                  onOk={() => handleOnOK()}
                  onCancel={() => setModal2Open(false)}
                >
                  {idProduct.map((product) => {
                    const isEvaluated = evaluatedProducts.includes(
                      product.product
                    );
                    // Nếu sản phẩm đã được đánh giá, không render nó
                    if (isEvaluated) {
                      return null;
                    }
                    return (
                      <div
                        class="card"
                        style={{ background: "none", border: "none" }}
                      >
                        Đánh giá sản phẩm {product?.name}
                        <div class="row">
                          <div class="col-2">
                            <img
                              src={user?.avatar}
                              width="70"
                              class="rounded-circle mt-2"
                            />
                          </div>
                          <div class="col-10">
                            <div class="comment-box ml-2">
                              <div class="rating" style={{ padding: "10px 0" }}>
                                <Rate
                                  onChange={setValueRating}
                                  value={valueRating}
                                />
                              </div>
                              <div class="comment-area">
                                <textarea
                                  class="form-control"
                                  placeholder="Your comment"
                                  rows="4"
                                  value={description}
                                  onChange={onChange}
                                />
                              </div>
                              <div>
                                <ButtonComponent
                                  onClick={() =>
                                    handleAddEvaluate(product?.product)
                                  }
                                  textButton={"Đánh giá"}
                                  disabled={
                                    valueRating > 0 && description !== ""
                                      ? false
                                      : true
                                  }
                                  style={{
                                    margin: "20px 0",
                                    background: "blue",
                                    color: "#fff",
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </Modal>
              </WrapperOrderItem>
            );
          })
        ) : (
          <div
            style={{
              textAlign: "center",
              display: "flex",
              margin: "0 auto",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              background: "#fff",
              marginTop: "40px",
            }}
          >
            Không có đơn hàng
          </div>
        )}
      </WrapperListOrder>
    </div>

    //  </Loading>
  );
};

export default MyOrderPage;

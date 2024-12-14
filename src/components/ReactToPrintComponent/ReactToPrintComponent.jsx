import React from "react";
import logoGHTK from "../../assets/images/logo_GHTK.png";
import logoExpress from "../../assets/images/express_logo.webp";
import logoWarning from "../../assets/images/logoWarning.jpg";
import moment from "moment";
import QRCode from "react-qr-code";

const ReactToPrintComponent = React.forwardRef((props, ref) => {
  const { data } = props;
  const today = moment();
  const formattedToday = today.format("DD/MM/YYYY HH:mm");
  return (
    <>
      <div ref={ref}>
        {data?.length &&
          data?.map((item) => {
            const otp = Math.floor(1000000000 + Math.random() * 9000000000);
            return (
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                    fontSize: "20px",
                  }}
                >
                  <img
                    src={logoGHTK}
                    alt="logo GHTK"
                    style={{ height: "100px", width: "auto" }}
                  />
                  <img
                    src={logoExpress}
                    alt="logo express"
                    style={{ height: "100px", width: "auto" }}
                  />
                </div>
                <div
                  style={{
                    fontSize: "20px",
                    textAlign: "center",
                    padding: "10px",
                  }}
                >
                  Ngày tạo: {formattedToday}
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    border: "1px solid #000",
                    fontSize: "20px",
                  }}
                >
                  <div style={{ padding: "0 10px" }}>
                    Người gửi:
                    <br />
                    Phạm Hoàng Phong /012****789
                    <br />
                    Đ/c: Phường An Phú, Quận Ninh Kiều, TP Cần Thơ
                    <br />
                    Người nhận:
                    <br />
                    {item?.shippingAddress?.fullName} /{" "}
                    {item?.shippingAddress?.phone}
                    <br />
                    Đ/c: {item?.shippingAddress?.address}/{" "}
                    {item?.shippingAddress?.city}
                  </div>
                  <div>
                    <img
                      src={logoWarning}
                      alt="logo express"
                      style={{ height: "auto", width: "100%" }}
                    />
                  </div>
                </div>
                <div style={{ textAlign: "center", padding: "30px" }}>
                  <h2>{otp}</h2>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    border: "1px solid #000",
                    padding: "20px",
                    fontSize: "20px",
                  }}
                >
                  <div style={{ width: "60%", padding: "0 10px" }}>
                    <div>
                      <span>Mã đơn KH</span>
                      <br />
                      <strong>{item?._id}</strong>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        borderTop: "1px solid #000",
                      }}
                    >
                      <div>
                        <span>Kho lấy</span>
                        <br />
                        <strong>Cái răng</strong>
                        <p>Kho giao</p>
                      </div>
                      <div>
                        <span>Khối lượng:</span>
                        <br />
                        <strong>3.3.kg</strong>
                        <br />
                        <span>Thu hộ</span>
                        <br />
                        <strong>{item?.totalPrice?.toLocaleString()}</strong>
                      </div>
                    </div>
                  </div>
                  <div style={{ width: "40%", textAlign: "center" }}>
                    <QRCode
                      size={256}
                      style={{
                        height: "100%",
                        maxWidth: "100%",
                        width: "auto",
                      }}
                      value={item?._id}
                      viewBox={`0 0 256 256`}
                    />
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    borderBottom: "1px solid #000",
                    fontSize: "20px",
                  }}
                >
                  <div style={{ flex: "1", padding: "10px" }}>
                    {item?.orderItems?.map((pro) => {
                      return (
                        <p>
                          {pro?.amount} x {pro?.name}
                        </p>
                      );
                    })}
                  </div>
                  <div
                    style={{
                      flex: "1",
                      borderLeft: "1px solid #000",
                      padding: "10px",
                    }}
                  >
                    Ghi chú:
                    <br />
                    <span>
                      Hàng dễ vỡ xin vui lòng nhẹ tay. Có vấn đề gọi shop. Không
                      tự ý hủy đơn, gọi khách trước khi giao hàng; gọi shop khi
                      khách không nhận hàng, không liên lạc được, sai thông tin
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </>
  );
});
export default ReactToPrintComponent;

import React from "react";
import {
  WrapperContainerLeft,
  WrapperContainerRight,
  WrapperForm,
  WrapperModal,
  WrapperTextLight,
} from "./style";
import { useState } from "react";
import InputForm from "../../components/InputForm/InputForm";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { Image } from "antd";
import logotet from "../../assets/images/logotet.png";
import { useLocation, useNavigate } from "react-router";
import * as OtpService from "../../services/OtpService";
import * as UserService from "../../services/UserService";
import { useMutationHook } from "../../hooks/useMutationHook";
import Loading from "../../components/Loading/Loading";
import * as message from "../../components/Message/Message";

const CreateNewPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [otpSent, setOtpSent] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [valueInput1, setValueInput1] = useState("");
  const [valueInput2, setValueInput2] = useState("");
  const [valueInput3, setValueInput3] = useState("");
  const [valueInput4, setValueInput4] = useState("");
  const [valueInput5, setValueInput5] = useState("");
  const [valueInput6, setValueInput6] = useState("");
  const { state } = useLocation();
  const handleNavigateSignIn = () => {
    navigate("/sign-in");
  };
  const mutation = useMutationHook((data) => OtpService.createOtp(data));
  const { data, isLoading } = mutation;

  const handleOnchangePassword = (value) => {
    setPassword(value);
  };

  const mutationUpdatePassword = useMutationHook((data) =>
    UserService.updatePassword(data)
  );

  const onUpdatePassword = () => {
    mutationUpdatePassword.mutate({ email: state, password });
  };

  const mutationDeleteOtp = useMutationHook((data) =>
    OtpService.deleteOtp(data)
  );
  const onDeleteOtp = () => {
    mutationDeleteOtp.mutate({ otp: otpSent });
  };

  const handleSendOtp = () => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    setOtpSent(otp);
    mutation.mutate({
      email: state,
      otp,
    });
    setIsModalOpen(true);
  };
  const checkOTP = () => {
    const data = [
      valueInput1,
      valueInput2,
      valueInput3,
      valueInput4,
      valueInput5,
      valueInput6,
    ];
    let value = data.join("");
    if (Number(value) === otpSent) {
      onUpdatePassword();
      message.success("Tạo mật khẩu thành công");
      onDeleteOtp();
      setIsModalOpen(false);
      navigate(`/sign-in`);
    } else {
      message.error("OTP không đúng");
    }
  };

  const handleOk = () => {
    checkOTP();
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onChangeInput1 = (e) => {
    setValueInput1(e.target.value);
  };
  const onChangeInput2 = (e) => {
    setValueInput2(e.target.value);
  };
  const onChangeInput3 = (e) => {
    setValueInput3(e.target.value);
  };
  const onChangeInput4 = (e) => {
    setValueInput4(e.target.value);
  };
  const onChangeInput5 = (e) => {
    setValueInput5(e.target.value);
  };
  const onChangeInput6 = (e) => {
    setValueInput6(e.target.value);
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#efefef",
        height: "100vh",
      }}
    >
      <div
        style={{
          width: "800px",
          height: "445px",
          background: "#fff",
          borderRadius: "20px",
          display: "flex",
        }}
      >
        <WrapperContainerLeft>
          <h4
            style={{
              margin: "0px 0px 10px",
              fontSize: "24px",
              fontWeight: "500",
            }}
          >
            Xin chào
          </h4>
          <p>Tạo mật khẩu mới</p>
          <InputForm
            placeholder="Nhập mật khẩu mới"
            style={{ marginBottom: "10px" }}
            value={password}
            onChange={handleOnchangePassword}
          />

          {data?.status === "ERR" && (
            <span style={{ color: "red", fontSize: "13px", padding: "10px 0" }}>
              {data?.message}
            </span>
          )}
          <Loading isLoading={isLoading}>
            <ButtonComponent
              disabled={!password.length}
              onClick={handleSendOtp}
              size={20}
              style={{
                background: "rgb(255, 66, 78)",
                borderRadius: "4px",
                border: "none",
                height: "48px",
                width: "100%",
                fontSize: "15px",
                margin: "30px 0px 10px",
              }}
              textButton={"Tạo"}
              styleTextButton={{ color: "#fff" }}
            ></ButtonComponent>
          </Loading>
          <p>
            Đã có tài khoản?{" "}
            <WrapperTextLight onClick={handleNavigateSignIn}>
              Đăng nhập
            </WrapperTextLight>
          </p>
        </WrapperContainerLeft>
        <WrapperContainerRight>
          <Image
            src={logotet}
            preview={false}
            alt="image logo"
            style={{ width: "250px", height: "250px" }}
          />
          <div style={{ margin: "30px 0px 0px", textAlign: "center" }}>
            <h4
              style={{
                margin: "0px 0px 5px",
                color: "rgb(255,255,255)",
                fontSize: " 17px",
                fontWeight: "500",
              }}
            >
              Mua sắm tại Decoration Shop
            </h4>
            <span
              style={{
                fontSize: "13px",
                color: "rgb(255,255,255)",
                fontWeight: "500",
              }}
            >
              Siêu ưu đãi mỗi ngày
            </span>
          </div>
        </WrapperContainerRight>

        <WrapperModal
          title="Basic Modal"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <WrapperForm className="form">
            <div className="title">OTP</div>
            <div className="title">Verification Code</div>
            <p className="message">
              We have sent a verification code to your mobile number
            </p>
            <div className="inputs">
              <input
                id="input1"
                type="text"
                maxlength="1"
                onChange={onChangeInput1}
              />
              <input
                id="input2"
                type="text"
                maxlength="1"
                onChange={onChangeInput2}
              />
              <input
                id="input3"
                type="text"
                maxlength="1"
                onChange={onChangeInput3}
              />
              <input
                id="input4"
                type="text"
                maxlength="1"
                onChange={onChangeInput4}
              />
              <input
                id="input5"
                type="text"
                maxlength="1"
                onChange={onChangeInput5}
              />
              <input
                id="input6"
                type="text"
                maxlength="1"
                onChange={onChangeInput6}
              />
            </div>
          </WrapperForm>
        </WrapperModal>
      </div>
    </div>
  );
};

export default CreateNewPassword;

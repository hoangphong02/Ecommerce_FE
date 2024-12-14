/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  WrapperContainerLeft,
  WrapperContainerRight,
  WrapperTextLight,
} from "./style";
import InputForm from "../../components/InputForm/InputForm";
import { Image, Input } from "antd";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import logotet from "../../assets/images/logotet.png";
import { useNavigate } from "react-router";
import { useMutationHook } from "../../hooks/useMutationHook";
import * as UserService from "../../services/UserService";
import Loading from "../../components/Loading/Loading";
import * as message from "../../components/Message/Message";

const SignUpPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const mutation = useMutationHook((data) => UserService.signUpUser(data));
  const { data, isLoading } = mutation;
  useEffect(() => {
    if (data?.status === "OK") {
      message.success();
      handleNavigateSignIn();
    } else {
      if (data?.status === "ERR") {
        message.error(data?.message);
      }
    }
  }, [data]);

  const handleNavigateSignIn = () => {
    navigate("/sign-in");
  };
  const handleOnchangeEmail = (value) => {
    setEmail(value);
  };
  const handleOnchangePassword = (e) => {
    const value = e.target.value;
    setPassword(value);
  };
  const handleOnchangeConfirmPassword = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
  };
  const handleSignUp = () => {
    mutation.mutate({
      email,
      password,
      confirmPassword,
    });
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
          <p>Đăng nhập hoặc tạo tài khoản</p>
          <InputForm
            placeholder="abc@gmail.com"
            style={{ marginBottom: "10px" }}
            value={email}
            onChange={handleOnchangeEmail}
          />

          <Input.Password
            placeholder="Mật khẩu"
            style={{
              margin: " 10px 0",
              borderTop: "none",
              borderLeft: "none",
              borderRight: "none",
            }}
            value={password}
            onChange={handleOnchangePassword}
          />
          <Input.Password
            placeholder="Xác nhận mật khẩu"
            style={{
              margin: " 10px 0",
              borderTop: "none",
              borderLeft: "none",
              borderRight: "none",
            }}
            value={confirmPassword}
            onChange={handleOnchangeConfirmPassword}
          />
          {data?.status === "ERR" && (
            <span style={{ color: "red", fontSize: "13px", padding: "10px 0" }}>
              {data?.message}
            </span>
          )}
          <Loading isLoading={isLoading}>
            <ButtonComponent
              disabled={
                !email.length || !password.length || !confirmPassword.length
              }
              onClick={handleSignUp}
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
              textButton={"Đăng ký"}
              styleTextButton={{ color: "#fff" }}
            ></ButtonComponent>
          </Loading>
          <p>
            Bạn đã có tài khoản?{" "}
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
                color: " rgb(255,255,255)",
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
      </div>
    </div>
  );
};

export default SignUpPage;

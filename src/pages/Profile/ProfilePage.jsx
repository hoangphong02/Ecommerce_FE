/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  WrapperAllProfile,
  WrapperAvatar,
  WrapperContentProfile,
  WrapperInfo,
  WrapperInput,
  WrapperInputForm,
  WrapperLabel,
  WrapperSidenav,
} from "./style";
import { useDispatch, useSelector } from "react-redux";
import * as UserService from "../../services/UserService";
import { useMutationHook } from "../../hooks/useMutationHook";
import * as message from "../../components/Message/Message";
import { updateUser } from "../../redux/slides/userSlide";
import { Button, Modal } from "antd";
import { EditOutlined, UploadOutlined } from "@ant-design/icons";
import { getBase64 } from "../../utils";
import icon_username from "../../assets/images/icon-username.png";
import icon_address from "../../assets/images/icon-address.png";
import icon_phone from "../../assets/images/icon-phone.png";
import icon_email from "../../assets/images/icon-email.png";

function ProfilePage() {
  const user = useSelector((state) => state.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [avatar, setAvatar] = useState("");

  const mutation = useMutationHook((data) => {
    const { id, access_token, ...rests } = data;
    UserService.updateUser(id, rests, access_token);
  });
  const dispatch = useDispatch();
  const { isSuccess, isError } = mutation;
  useEffect(() => {
    setName(user?.name);
    setEmail(user?.email);
    setPhone(user?.phone);
    setAddress(user?.address);
    setAvatar(user?.avatar);
  }, [user]);

  const handleGetDetailsUser = async (id, token) => {
    const storage = localStorage.getItem("refresh_token");
    const refreshToken = JSON.parse(storage);
    const res = await UserService.getDetailUser(id, token);
    dispatch(updateUser({ ...res?.data, access_token: token, refreshToken }));
  };

  useEffect(() => {
    if (isSuccess) {
      message.success("Cập nhật thành công");
      handleGetDetailsUser(user?.id, user?.access_token);
    } else if (isError) {
      message.error();
    }
  }, [isSuccess, isError]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleUpdate = () => {
    mutation.mutate({
      id: user?.id,
      email,
      name,
      phone,
      address,
      avatar,
      access_token: user?.access_token,
    });
  };
  const handleOk = () => {
    handleUpdate();
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setName(user?.name);
    setEmail(user?.email);
    setAddress(user?.address);
    setPhone(user?.phone);
    setAvatar(user?.avatar);
    setIsModalOpen(false);
  };
  const handleOnchangeName = (value) => {
    setName(value);
  };
  const handleOnchangeEmail = (value) => {
    setEmail(value);
  };
  const handleOnchangePhone = (value) => {
    setPhone(value);
  };
  const handleOnchangeAddress = (value) => {
    setAddress(value);
  };
  const handleOnchangeAvatar = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setAvatar(file.preview);
  };

  return (
    <div>
      <div style={{ textAlign: "center", padding: "10px" }}>
        <h3>Thông tin cá nhân</h3>
      </div>

      <WrapperAllProfile>
        <div className="sidenav">
          <div className="profile" style={{ textAlign: "center" }}>
            <img
              src={avatar}
              alt=""
              width="200"
              height="200"
              style={{ borderRadius: "50%" }}
            />
          </div>

          <WrapperSidenav className="sidenav-url">
            <div
              className="url"
              style={{ cursor: "pointer" }}
              onClick={showModal}
            >
              <p>
                <EditOutlined style={{ fontSize: "30px", color: "#9b9797" }} />
              </p>
              <hr align="center" />
            </div>
          </WrapperSidenav>

          <Modal
            title="Cập nhật thông tin cá nhân"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            <WrapperContentProfile>
              <WrapperInput>
                <WrapperLabel htmlFor="name">Name</WrapperLabel>
                <WrapperInputForm
                  id="name"
                  value={name}
                  onChange={handleOnchangeName}
                />
              </WrapperInput>
              <WrapperInput>
                <WrapperLabel htmlFor="email">Email</WrapperLabel>
                <WrapperInputForm
                  id="email"
                  value={email}
                  onChange={handleOnchangeEmail}
                />
              </WrapperInput>
              <WrapperInput>
                <WrapperLabel htmlFor="phone">Phone</WrapperLabel>
                <WrapperInputForm
                  id="phone"
                  value={phone}
                  onChange={handleOnchangePhone}
                />
              </WrapperInput>
              <WrapperInput>
                <WrapperLabel htmlFor="address">Address</WrapperLabel>
                <WrapperInputForm
                  id="address"
                  value={address}
                  onChange={handleOnchangeAddress}
                />
              </WrapperInput>
              <WrapperInput>
                <WrapperLabel htmlFor="avatar">Avatar</WrapperLabel>
                <WrapperAvatar onChange={handleOnchangeAvatar} maxCount={1}>
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </WrapperAvatar>
                {avatar && (
                  <img
                    src={avatar}
                    style={{
                      height: "60px",
                      width: "60px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                    alt="avatar"
                  />
                )}
              </WrapperInput>
            </WrapperContentProfile>
          </Modal>
        </div>

        <WrapperInfo>
          <div style={{ background: "rgb(43 42 42)", borderRadius: "30px" }}>
            <div style={{ padding: "10px 30px" }}>
              <label htmlFor="" style={{ width: "70px" }}>
                <img
                  src={icon_username}
                  style={{ width: "30px", height: "30px" }}
                  alt=""
                />
              </label>
              <input
                type="text"
                value={name}
                style={{
                  border: "none",
                  background: "none",
                  fontSize: "20px",
                  color: "#fff",
                  width: "80%",
                }}
                readOnly
              />
            </div>
            <div style={{ padding: "10px 0px 10px 30px" }}>
              <label htmlFor="" style={{ width: "70px" }}>
                <img
                  src={icon_email}
                  style={{ width: "30px", height: "30px" }}
                  alt=""
                />
              </label>
              <input
                type="text"
                value={email}
                style={{
                  border: "none",
                  background: "none",
                  fontSize: "20px",
                  color: "#fff",
                  width: "80%",
                }}
                readOnly
              />
            </div>
            <div style={{ padding: "10px 30px" }}>
              <label htmlFor="" style={{ width: "70px" }}>
                <img
                  src={icon_phone}
                  style={{ width: "30px", height: "30px" }}
                  alt=""
                />
              </label>
              <input
                type="text"
                value={phone}
                style={{
                  border: "none",
                  background: "none",
                  fontSize: "20px",
                  color: "#fff",
                  width: "80%",
                }}
                readOnly
              />
            </div>
            <div style={{ padding: "10px 30px" }}>
              <label htmlFor="" style={{ width: "70px" }}>
                <img
                  src={icon_address}
                  style={{ width: "30px", height: "30px" }}
                  alt=""
                />
              </label>
              <input
                type="text"
                value={address}
                style={{
                  border: "none",
                  background: "none",
                  fontSize: "20px",
                  color: "#fff",
                  width: "80%",
                }}
                readOnly
              />
            </div>
          </div>
        </WrapperInfo>
      </WrapperAllProfile>
    </div>
  );
}

export default ProfilePage;

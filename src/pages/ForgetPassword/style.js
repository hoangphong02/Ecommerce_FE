import { Modal } from "antd";
import styled from "styled-components";

export const WrapperContainerLeft = styled.div`
  width: 500px;
  padding: 40px 45px 24px;
  border-radius: 0px 20px 20px 0px;
`;

export const WrapperContainerRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 300px;
  background: linear-gradient(136deg, rgb(240, 248, 255) -1%, rgb(174 3 3) 85%);
  border-radius: 0px 20px 20px 0px;
`;

export const WrapperTextLight = styled.span`
  color: rgb(13, 92, 182);
  font-size: 13px;
  margin: 20px 0px 0px;
  cursor: pointer;
`;

export const WrapperForm = styled.form`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-around;
  width: 300px;
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  & .title {
    font-size: 20px;
    font-weight: bold;
    color: black;
  }
  & .message {
    color: #a3a3a3;
    font-size: 14px;
    margin-top: 4px;
    text-align: center;
  }
  & .inputs {
    margin-top: 10px;
  }
  & .inputs input {
    width: 32px;
    height: 32px;
    text-align: center;
    border: none;
    border-bottom: 1.5px solid #d2d2d2;
    margin: 0 10px;
  }
  & .inputs input:focus {
    border-bottom: 1.5px solid royalblue;
    outline: none;
  }
  & .action {
    margin-top: 24px;
    padding: 12px 16px;
    border-radius: 8px;
    border: none;
    background-color: royalblue;
    color: white;
    cursor: pointer;
    align-self: end;
  }
`;

export const WrapperModal = styled(Modal)`
  & .ant-modal-body {
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

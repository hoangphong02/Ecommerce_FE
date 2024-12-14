import { Upload } from "antd";
import styled from "styled-components";

export const WrapperHeader = styled.h1`
  color: #fff;
  font-size: 18px;
`;

export const ButtonAddUser = styled.button`
  border-color: #2d8ee1;
  background: #2d8ee1;
  color: #fff;
  font-size: 23px;
  height: 45px;
  padding: 4px 15px;
  border-radius: 6px;
  &:hover {
    background: #61a3dc;
    cursor: pointer;
  }
`;
export const WrapperAvatar = styled(Upload)`
  & .ant-upload-list-item-container {
    display: none;
  }
  & .ant-upload {
    display: flex;
    align-items: center;
  }
`;

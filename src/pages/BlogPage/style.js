import { Modal } from "antd";
import styled from "styled-components";

export const WrapperModal = styled(Modal)`
  & .ant-modal-body {
    overflow-y: scroll;
    height: 500px;
  }
`;

export const WrapperBlogItem = styled.div`
  width: 900px;
  height: 100%;
  border: 1px solid rgb(255 253 253);
  border-radius: 30px;
  background: #fff;
  filter: drop-shadow(1px 2px 2px #333);
  margin-bottom: 30px;
  @media (max-width: 768px) {
    width: 95%;
  }
`;

export const WrapperContentComment = styled.div`
  background: #f0f2f5;
  padding: 15px;
  border-radius: 15px;
  width: 689px;
  overflow: hidden;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

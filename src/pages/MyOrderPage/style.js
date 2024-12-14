import { InputNumber } from "antd";
import styled from "styled-components";
export const WrapperInputNumber = styled(InputNumber)`
  width: 50px;
`;

export const WrapperLeft = styled.div`
  width: 910px;
  padding: 0 20px 0 0;
`;

export const WrapperRight = styled.div`
  width: 320px;
`;
export const WrapperInfo = styled.div`
  display: flex;
  flex-direction: column;
  background: #fff;
  padding: 20px;
  line-height: 30px;
`;
export const WrapperProductsOrder = styled.div`
  border: 1px solid #dedbdb;
  border-radius: 15px;
  padding: 15px;
  margin: 10px 0;
`;

export const WrapperListOrder = styled.div`
  width: 1270px;
  margin: 0px auto;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const WrapperOrderItem = styled.div`
  margin-right: auto;
  margin-bottom: 10px;
  margin-left: auto;
  width: 1000px;
  background: rgb(255, 255, 255);
  padding: 15px;
  border-radius: 10px;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

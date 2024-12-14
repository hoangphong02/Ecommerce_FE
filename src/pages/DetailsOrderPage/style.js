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

export const WrapperInfoDetails = styled.div`
  background: rgb(240, 248, 255);
  border: 1px solid rgb(194, 225, 255);
  border-radius: 10px;
  padding: 10px;
  margin: 10px 0;
`;

export const WrapperDetails = styled.div`
  background: #fff;
  padding: 15px;
  border-radius: 10px;
  width: 300px;
`;

export const WrapperDetailOrder = styled.div`
  width: 1270px;
  margin: 0px auto;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const WrapperListMethodOrder = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0px auto 10px;
  width: 1000px;
  @media (max-width: 768px) {
    width: 100%;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
`;
export const WrapperListProductOrder = styled.div`
  width: 1000px;
  margin: 0px auto 10px;
  background: rgb(255, 255, 255);
  padding: 15px;
  border-radius: 10px;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

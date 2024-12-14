import { Card } from "antd";
import styled from "styled-components";

export const WrapperStyleCard = styled(Card)`
  width: 230px;
  & img {
    height: 230px;
    width: 230px;
  }
  overflow: hidden;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
`;
export const StyleNameProduct = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: rgb(56, 56, 61);
`;

export const WrapperReportText = styled.div`
  font-size: 10px;
  color: rgb(128, 128, 137);
  display: flex;
  align-items: center;
  margin: 8px 0 0;
`;

export const WrapperPriceText = styled.div`
  color: rgb(255, 66, 78);
  font-size: 16px;
  font-weight: 500;
`;

export const WrapperDiscountText = styled.span`
  font-size: 12px;
  color:color: rgb(255, 66, 78);
  font-weight: 400;
`;

export const WrapperStyleTextSell = styled.span`
  font-size: 14px;
  line-height: 24px;
  color: rgb(120, 120, 120);
`;

export const WrapperImage = styled.img`
  &:hover {
    transform: scaleX(1.1);
    overflow: hidden;
  }
`;

import { Card } from "antd";
import styled from "styled-components";

export const WrapperStyleCard = styled(Card)`
  width: 378.667px;
  margin-right: 10px;
  background: #f2e7d5;
  border: 0.4rem solid #c98648;
  height: auto;
  & img {
    height: 100%;
    width: 100%;
    padding: 20px;
  }
  overflow: hidden;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
`;
export const StyleNameProduct = styled.div`
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  text-align: left;
  font-weight: 600;
  font-size: 2rem;
  line-height: 130%;
  font-size: 25px;
  font-family: sans-serif;
  text-align: center;
`;

export const WrapperReportText = styled.div`
  font-size: 10px;
  color: #505050;
  display: flex;
  align-items: center;
  margin: 8px 0 0;
  justify-content: center;
`;

export const WrapperPriceText = styled.div`
  // color: rgb(255, 66, 78);
  // font-size: 16px;
  // font-weight: 500;
  color: #ac2c2a;
  font-size: 1rem;
  font-family: "Reem Kufi", sans-serif;
  font-weight: 500;
  // letter-spacing: 0.096rem;
  text-transform: uppercase;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  // background-image: url(../../assets/images/culture_price.png);
  padding: 0.6rem 6rem;
  text-align: center;
  margin-top: 1.6rem;
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

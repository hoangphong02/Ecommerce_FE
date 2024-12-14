import styled from "styled-components";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";

export const WrapperTypeProduct = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  justify-content: flex-start;

  height: 44px;
`;

export const WrapperButtonMore = styled(ButtonComponent)`
  &:hover {
    color: #fff;
    background: rgb(10, 104, 255);
    span {
      color: #fff;
    }
  }
  width: 100%;
  text-align: center;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
`;

export const WrapperProducts = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  gap: 14px;
  flex-wrap: wrap;
`;

export const WrapperMic = styled.div`
  width: 50px;
  height: 50px;
  font-size: 20px;
  background-color: #0000004a;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  position: fixed;
  bottom: 70px;
  left: 10px;
  cursor: pointer;
  z-index: 4;
`;

export const WrapperButtonComponent = styled.button`
  position: relative;
  display: inline-block;
  cursor: pointer;
  outline: none;
  border: 0;
  vertical-align: middle;
  text-decoration: none;
  background: transparent;
  padding: 0;
  font-size: inherit;
  font-family: inherit;

  &.learn-more {
    width: 12rem;
    height: auto;
  }
  &.learn-more .circle {
    transition: all 0.45s cubic-bezier(0.65, 0, 0.076, 1);
    position: relative;
    display: block;
    margin: 0;
    width: 3rem;
    height: 3rem;
    background: #c98648;
    border-radius: 1.625rem;
  }
  &.learn-more .circle .icon {
    transition: all 0.45s cubic-bezier(0.65, 0, 0.076, 1);
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto;
    background: #fff;
  }
  &.learn-more .circle .icon.arrow {
    transition: all 0.45s cubic-bezier(0.65, 0, 0.076, 1);
    left: 0.625rem;
    width: 1.125rem;
    height: 0.125rem;
    background: none;
  }
  &.learn-more .circle .icon.arrow::before {
    position: absolute;
    content: "";
    top: -0.29rem;
    right: 0.0625rem;
    width: 0.625rem;
    height: 0.625rem;
    border-top: 0.125rem solid #fff;
    border-right: 0.125rem solid #fff;
    transform: rotate(45deg);
  }
  &.learn-more .button-text {
    transition: all 0.45s cubic-bezier(0.65, 0, 0.076, 1);
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 0.75rem 0;
    margin: 0 0 0 1.85rem;
    color: #e6c276;
    font-weight: 700;
    line-height: 1.6;
    text-align: center;
    text-transform: uppercase;
  }

  &:hover .circle {
    width: 100%;
  }
  &:hover .circle .icon.arrow {
    background: #fff;
    transform: translate(1rem, 0);
  }

  &:hover .button-text {
    color: #fff;
  }
`;

export const WrapperProductTrending = styled.div`
  .nameProductTrending {
    display: none;
  }
  &: hover .nameProductTrending {
    cursor: pointer;
    display: block;
  }
`;
export const WrapperTextProductTrending = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba(255, 255, 255, 0.7);
  height: 100%;
  width: 100%;
  height: 100%;
  border-radius: 50px;
`;

export const AnimatedImage = styled.div`
  width: 40%;
  display: flex;
  align-items: center;
  animation: moveUpDown 2s ease-in-out infinite; /* Điều chỉnh thời gian và hiệu ứng ở đây */

  img {
    height: 450px;
  }
  @media (max-width: 768px) {
    img {
      height: 100%;
      width: auto;
      margin-left: -110px;
    }
  }
  @keyframes moveUpDown {
    0% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(
        -20px
      ); /* Điều chỉnh giá trị này để thay đổi khoảng di chuyển */
    }
    100% {
      transform: translateY(0);
    }
  }
`;
export const WrapperTitleProductTrend = styled.div`
  color: rgb(130, 26, 32);
  padding: 3.1rem 6.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;
  margin: 50px 0px;
  text-align: center;
  @media (max-width: 768px) {
    margin: 0;
    padding: 20px;
  }
`;

export const WrapperProductTrend = styled.div`
  display: flex;
  justify-content: center;
  gap: 100px;
  padding: 50px;
  flex-wrap: wrap;
  @media (max-width: 768px) {
    gap: 20px;
    padding: 20px;
  }
`;

export const WrapperTitleProductType = styled.div`
  color: rgb(130, 26, 32);
  padding: 3.1rem 6.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;
  margin: 50px 0px;
  text-align: center;
  @media (max-width: 768px) {
    margin: 0;
    padding: 40px;
  }
`;

export const WrapperTitleProductNoel = styled.div`
  color: rgb(130, 26, 32);
  padding: 3.1rem 6.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;
  margin: 0 0 40px 0;
  text-align: center;
  @media (max-width: 768px) {
    margin: 0;
    padding: 40px;
  }
`;

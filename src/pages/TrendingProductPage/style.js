import styled from "styled-components";

export const WrapperProducts = styled.div`
  display: flex;
  margin-top: 20px;
  gap: 14px;
  flex-wrap: wrap;
  width: 1270px;
  margin: 0 auto;
  justify-content: space-between;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;
export const WrappertextCongratulation = styled.div`
  padding: 20px 10px;
  font-size: 20px;
  font-weight: 700;
  font-family: "Poppins", sans-serif;
  text-align: center;
  border-radius: 10px;
  color: rgb(255, 213, 141);
`;

export const Wrappertext = styled.div`
  -webkit-animation: scale-in-hor-left 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)
    both;
  animation: scale-in-hor-left 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
  @-webkit-keyframes scale-in-hor-left {
    0% {
      -webkit-transform: scaleX(0);
      transform: scaleX(0);
      -webkit-transform-origin: 0% 0%;
      transform-origin: 0% 0%;
      opacity: 1;
    }
    100% {
      -webkit-transform: scaleX(1);
      transform: scaleX(1);
      -webkit-transform-origin: 0% 0%;
      transform-origin: 0% 0%;
      opacity: 1;
    }
  }
  @keyframes scale-in-hor-left {
    0% {
      -webkit-transform: scaleX(0);
      transform: scaleX(0);
      -webkit-transform-origin: 0% 0%;
      transform-origin: 0% 0%;
      opacity: 1;
    }
    100% {
      -webkit-transform: scaleX(1);
      transform: scaleX(1);
      -webkit-transform-origin: 0% 0%;
      transform-origin: 0% 0%;
      opacity: 1;
    }
  }
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

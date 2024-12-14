import styled from "styled-components";
import ButtonComponent from "../ButtonComponent/ButtonComponent";

export const WrapperStyledButtonComponent = styled(ButtonComponent)`
  width: 50px;
  height: 50px;
  background-color: #0000004a;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  position: fixed;
  bottom: 80px;
  right: 0px;
  cursor: pointer;
  z-index: 4;
  -webkit-animation: slide-left 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
  animation: slide-left 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;

  @-webkit-keyframes slide-left {
    0% {
      -webkit-transform: translateX(0);
      transform: translateX(0);
    }
    100% {
      -webkit-transform: translateX(-25px);
      transform: translateX(-25px);
    }
  }
  @keyframes slide-left {
    0% {
      -webkit-transform: translateX(0);
      transform: translateX(0);
    }
    100% {
      -webkit-transform: translateX(-25px);
      transform: translateX(-25px);
    }
  }
`;

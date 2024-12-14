import styled from "styled-components";
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
export const WrapperProductDetail = styled.div`
  padding: 0px 120px;
  background: rgb(239, 239, 239);
  @media (max-width: 768px) {
    padding: 0;
  }
`;

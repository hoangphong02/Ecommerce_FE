import styled from "styled-components";

export const WrapperHeaderAccount = styled.div`
  display: flex;
  align-items: center;
  color: #fff;
  gap: 10px;
  padding: 0px 20px;
`;

export const WrapperImgAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`;
export const WrapperContentPopover = styled.p`
  cursor: pointer;
  &:hover {
    color: rgb(10, 104, 255);
  }
`;
export const WrapperTextHeaderSmall = styled.span`
  font-size: 13px;
  color: #fff;
  white-space: nowrap;
`;

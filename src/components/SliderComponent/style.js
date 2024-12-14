import Slider from "react-slick";
import styled from "styled-components";

export const WrapperSliderStyle = styled(Slider)`
  &.slick-arrow .slick-prev {
    left: 12px;
    top: 50%;
    z-index: 10;
    &::before {
      font-size: 40px;
      color: #fff;
    }
  }
  &.slick-arrow .slick-next {
    right: 28px;
    top: 50%;
    z-index: 10;
    &::before {
      font-size: 40px;
      color: #fff;
    }
  }
`;

export const WrapperImage = styled.img`
  width: 100%;
  height: 600px;
  object-fit: cover;
  @media (max-width: 768px) {
    width: 100%;
    height: 200px;
  }
`;

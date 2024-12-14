import React from "react";
import { SearchOutlined } from "@ant-design/icons";
import InputComponent from "../InputComponent/InputComponent";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import { WrapperSearch } from "./style";

const ButtonInputSearch = (props) => {
  const {
    size,
    placeholder,
    textButton,
    bordered,
    backgroundColorInput,
    backgroundColorButton,
    borderRadius,
    border,
    colorButton,
    display,
    justifyContent,
    alignItems,
    width,
  } = props;

  return (
    <WrapperSearch style={{ display: "flex" }}>
      <InputComponent
        className="input"
        size={size}
        placeholder={placeholder}
        bordered={bordered}
        style={{
          background: backgroundColorInput,
          borderRadius: borderRadius,
          border: border,
          width: width,
        }}
        {...props}
      />
      <ButtonComponent
        className="search"
        size={size}
        icon={<SearchOutlined style={{ color: "#ccc" }} />}
        bordered={bordered}
        style={{
          background: backgroundColorButton,
          borderRadius: borderRadius,
          border: border,
          display: display,
          justifyContent: justifyContent,
          alignItems: alignItems,
        }}
        textButton={textButton}
        styleTextButton={{ color: colorButton }}
      ></ButtonComponent>
    </WrapperSearch>
  );
};

export default ButtonInputSearch;

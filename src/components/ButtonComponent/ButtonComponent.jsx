import { Button } from "antd";
import React from "react";

const ButtonComponent = ({
  size,
  bordered,
  style,
  textButton,
  disabled,
  styleTextButton,
  ...rest
}) => {
  return (
    <Button
      size={size}
      bordered={bordered}
      disabled={disabled}
      style={style}
      {...rest}
    >
      <span style={styleTextButton}>{textButton}</span>
    </Button>
  );
};

export default ButtonComponent;

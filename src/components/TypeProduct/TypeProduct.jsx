import React from "react";
import { useNavigate } from "react-router";

const TypeProduct = ({ name, param, style }) => {
  const navigate = useNavigate();
  const handleNavigateType = (type) => {
    navigate(
      `/product/${type
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        ?.replace(/ /g, "_")}`,
      { state: type }
    );
  };
  function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  const customName = (str) => {
    const name = str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      ?.replace(/ /g, "_");
    return name;
  };
  if (style) {
    return (
      <div
        style={{
          padding: "4px 10px",
          cursor: "pointer",
          color: style ? style.color : "",
          borderRadius: param === customName(name) ? "4px" : "",
        }}
        onClick={() => handleNavigateType(name)}
      >
        {capitalizeFirstLetter(name)}
      </div>
    );
  } else {
    return (
      <div
        style={{
          padding: "4px 10px",
          cursor: "pointer",
          color: param === customName(name) ? "#fff" : "#fff",
          borderRadius: param === customName(name) ? "4px" : "",
        }}
        onClick={() => handleNavigateType(name)}
      >
        {capitalizeFirstLetter(name)}
      </div>
    );
  }
};

export default TypeProduct;

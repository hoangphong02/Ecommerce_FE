/* eslint-disable react-hooks/exhaustive-deps */
import React, { useMemo, useState } from "react";
import Loading from "../Loading/Loading";
import { Excel } from "antd-table-saveas-excel";
import { WrapperButtonExportExcel, WrapperTable } from "./style";

const TableComponent = (props) => {
  const {
    selectionType = "checkbox",
    data: dataSource = [],
    isLoading = false,
    columns = [],
    handleDeleteMany,
  } = props;
  const [rowSelectedKeys, setRowSelectedKeys] = useState([]);

  // Do excel không xuất được action nên dùng useMemo loại bỏ action
  const newColumnsExportExcel = useMemo(() => {
    const arr = columns?.filter(
      (col) => col.dataIndex !== "action" && col.dataIndex !== "image"
    );
    return arr;
  });

  // rowSelection object indicates the need for row selection
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setRowSelectedKeys(selectedRowKeys);
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === "Disabled User",
      // Column configuration not to be checked
      name: record.name,
    }),
  };

  const handleDeleteAll = () => {
    handleDeleteMany(rowSelectedKeys);
  };

  const handleExportExcel = () => {
    const excel = new Excel();
    excel
      .addSheet("test")
      .addColumns(newColumnsExportExcel)
      .addDataSource(dataSource, {
        str2Percent: true,
      })
      .saveAs("Excel.xlsx");
  };

  return (
    <Loading isLoading={isLoading}>
      {rowSelectedKeys.length > 0 && (
        <div
          style={{
            background: "#2d8ee1",
            color: "#fff",
            width: "fit-content",
            padding: "10px",
            borderRadius: "10px",
            marginBottom: "10px",
            cursor: "pointer",
          }}
          onClick={handleDeleteAll}
        >
          Xóa tất cả
        </div>
      )}
      <WrapperButtonExportExcel onClick={handleExportExcel}>
        Export Excel
      </WrapperButtonExportExcel>
      <WrapperTable
        bordered={false}
        rowSelection={{
          type: selectionType,
          ...rowSelection,
        }}
        columns={columns}
        dataSource={dataSource}
        {...props}
      />
    </Loading>
  );
};

export default TableComponent;

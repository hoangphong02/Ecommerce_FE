import { Table } from "antd";
import styled from "styled-components";
export const WrapperButtonExportExcel = styled.button`
  padding: 7px;
  color: #fff;
  background: darkseagreen;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  margin-bottom: 10px;
`;

export const WrapperTable = styled(Table)`
  & .ant-table {
    background: linear-gradient(
        127.09deg,
        rgba(6, 11, 40, 0.94) 19.41%,
        rgb(21 39 133 / 49%) 76.65%
      )
      border-box;
    color: #fff;
  }
  // & .ant-table-row:not(:hover) .ant-table-cell {
  //   color: #fff; /* Màu chữ mặc định của các dòng */
  // }
  .ant-table-row:not(.ant-table-row-selected):not(:hover) .ant-table-cell {
    color: #fff; /* Màu chữ mặc định của các dòng */
  }
  .ant-table-row.ant-table-row-selected:not(:hover) .ant-table-cell {
    color: #000;
  }

  & .ant-table :hover {
    color: #000;
  }
  &.ant-table-row:hover .ant-table-cell {
    color: #000; /* Màu chữ khi hover */
  }
  &.ant-table-row .ant-table-row-selected .ant-table-cell {
    color: #000 !important; /* Màu chữ khi active */
  }
  & .ant-pagination {
    padding: 0 50px;
  }
  & .ant-pagination .ant-pagination-prev .ant-pagination-item-link {
    color: #fff;
  }
  & .ant-pagination .ant-pagination-item {
    color: #fff;
  }

  & .ant-pagination .ant-pagination-next .ant-pagination-item-link {
    color: #fff;
  }
  & .ant-pagination .ant-pagination-item-active {
    color: #000;
  }
`;

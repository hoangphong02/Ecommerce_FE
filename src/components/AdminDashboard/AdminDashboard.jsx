import {
  ContactsOutlined,
  DollarOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { Avatar } from "antd";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";
import * as UserService from "../../services/UserService";
import * as ProductService from "../../services/ProductService";
import * as OrderService from "../../services/OrderService";
import * as ContactService from "../../services/ContactService";
import AdminHeader from "../AdminHeader/AdminHeader";
import CustomShapeBarchart from "./CustomShapeBarchart";
import SimpleBarChart from "./SimpleBarChart";
import { WrapperTable } from "./style";
import RevenueStatisticsChart from "./RevenueStatisticsChart";
const AdminDashboard = () => {
  const user = useSelector((state) => state?.user);
  const [dataTableBestSeller, setDataTableBestSeller] = useState([]);
  const [dataTableSlowestSeller, setDataTableSlowestSeller] = useState([]);
  const getAllUsers = async () => {
    const res = await UserService.getAllUser(user?.access_token);
    return res;
  };
  const getAllProducts = async () => {
    const res = await ProductService.getAllProduct("", 1000);
    return res;
  };
  const getAllOrder = async () => {
    const res = await OrderService.getAllOrder(user?.access_token);
    return res;
  };

  const getAllContact = async () => {
    const res = await ContactService.getAllContact();
    return res;
  };

  const queryUser = useQuery({ queryKey: ["users"], queryFn: getAllUsers });
  const queryProduct = useQuery({
    queryKey: ["products"],
    queryFn: getAllProducts,
  });
  const queryOrder = useQuery({ queryKey: ["orders"], queryFn: getAllOrder });
  const queryContact = useQuery({
    queryKey: ["contacts"],
    queryFn: getAllContact,
  });

  const { data: contacts } = queryContact;
  const { data: orders } = queryOrder;
  const { data: products } = queryProduct;
  const { data: users } = queryUser;

  const totalPriceReceived = orders?.data?.reduce((total, order) => {
    if (order.isReceived) {
      return total + order.totalPrice;
    } else {
      return total;
    }
  }, 0);

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const totalPriceReceivedOfMonth = orders?.data?.reduce((total, order) => {
    const updatedAtDate = new Date(order.updatedAt);
    const orderMonth = updatedAtDate.getMonth() + 1;
    const orderYear = updatedAtDate.getFullYear();
    if (
      order.isReceived &&
      orderMonth === currentMonth &&
      orderYear === currentYear
    ) {
      return total + order.totalPrice;
    } else {
      return total;
    }
  }, 0);

  const monthlyOrders = {};
  Array.isArray(orders?.data) &&
    orders?.data?.forEach((order) => {
      const orderDate = new Date(order?.createdAt);
      const month = orderDate.getMonth() + 1;
      const monthKey = `thang${month}`;
      if (monthlyOrders[monthKey]) {
        monthlyOrders[monthKey].uv += 1;
      } else {
        monthlyOrders[monthKey] = { name: monthKey, uv: 1 };
      }
    });
  const data = Object.values(monthlyOrders);
  const monthMap = {
    thang1: "Jan",
    thang2: "Feb",
    thang3: "Mar",
    thang4: "Apr",
    thang5: "May",
    thang6: "Jun",
    thang7: "Jul",
    thang8: "Aug",
    thang9: "Sep",
    thang10: "Oct",
    thang11: "Nov",
    thang12: "Dec",
  };
  const dataNumberOrderMonth = data.map((item) => ({
    ...item,
    name: monthMap[item.name],
  }));

  const totalOrdersMonthly = {};
  Array.isArray(orders?.data) &&
    orders?.data?.forEach((order) => {
      const orderDate = new Date(order?.createdAt);
      const month = orderDate.getMonth() + 1;
      const monthKey = `thang${month}`;
      const isReceived = order?.isReceived === true;
      if (isReceived) {
        if (totalOrdersMonthly[monthKey]) {
          totalOrdersMonthly[monthKey].pv += order?.totalPrice;
        } else {
          totalOrdersMonthly[monthKey] = {
            name: monthKey,
            pv: order?.totalPrice,
          };
        }
      }
    });
  const dataTotalOrderMonth = Object.values(totalOrdersMonthly);
  const dataToTalPriceOrderMonth = dataTotalOrderMonth.map((item) => ({
    ...item,
    name: monthMap[item.name],
  }));

  //Khách hàng tiềm năng
  const userOrderTotal = {};
  Array.isArray(orders?.data) &&
    orders?.data?.forEach((order) => {
      const isReceived = order?.isReceived === true;
      if (isReceived) {
        if (order?.user) {
          // Nếu người dùng đã tồn tại trong userOrderTotal
          if (userOrderTotal[order.user]) {
            userOrderTotal[order.user].total += order.totalPrice;
          } else {
            // Nếu người dùng chưa tồn tại trong userOrderTotal, tạo mới
            userOrderTotal[order.user] = {
              name: order.user,
              total: order.totalPrice,
            };
          }
        }
      }
    });
  const dataUserOrderTotal = Object.values(userOrderTotal);
  const sorterDataOrder = [...dataUserOrderTotal].sort(
    (a, b) => b.total - a.total
  );
  const updatedDataUserOrderTotal = sorterDataOrder?.map((item) => {
    const userMatch = users?.data?.find((user) => user?._id === item?.name);
    if (userMatch) {
      return {
        ...item,
        name: userMatch?.name,
        avatar: userMatch?.avatar,
        email: userMatch?.email,
      };
    }
    return item;
  });
  /////

  const transformedDataCountInStock = products?.data?.reduce((acc, curr) => {
    const existingItem = acc.findIndex((item) => item.name === curr.type);
    if (existingItem !== -1) {
      acc[existingItem].uv += curr.countInStock;
    } else {
      acc.push({ name: curr.type, uv: curr.countInStock });
    }
    return acc;
  }, []);
  const transformedDataCountInStockAndSelled = products?.data?.reduce(
    (acc, curr) => {
      const existingItem = acc.findIndex((item) => item.name === curr.type);
      if (existingItem !== -1) {
        acc[existingItem].uv += curr.countInStock;
        acc[existingItem].pv += curr?.selled || 0;
      } else {
        acc.push({
          name: curr.type,
          uv: curr.countInStock,
          pv: curr.selled || 0,
        });
      }
      return acc;
    },
    []
  );

  const columns = [
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      // render: (text) => <a>{text}</a>,
    },
    {
      title: "Đã bán",
      dataIndex: "selled",
      key: "selled",
    },
    {
      title: "Tồn kho",
      dataIndex: "countInStock",
      key: "countInStock",
    },
  ];

  useEffect(() => {
    let arrProductsBestSeller = [];
    let arrProductsSlowestSeller = [];
    if (products?.data?.length) {
      products?.data?.forEach((pro) => {
        if (pro?.selled >= pro?.countInStock) {
          arrProductsBestSeller.push({
            name: pro?.name,
            selled: pro?.selled ? pro?.selled : 0,
            countInStock: pro?.countInStock,
          });
        } else {
          arrProductsSlowestSeller.push({
            name: pro?.name,
            selled: pro?.selled ? pro?.selled : 0,
            countInStock: pro?.countInStock,
          });
        }
      });
    }
    setDataTableBestSeller(arrProductsBestSeller);
    setDataTableSlowestSeller(arrProductsSlowestSeller);
  }, [products]);

  return (
    <div>
      <AdminHeader textHeader={"Dashboard"} />
      <div
        style={{
          margin: "0",
          padding: "0",
          backgroundColor: "none",
          color: "#9e9ea4",
          fontFamily: "'Montserrat', sans-serif",
        }}
      >
        <main className="main-container">
          <div className="main-cards">
            <div className="card">
              <div className="card-inner">
                <h3>DOANH THU</h3>
                <DollarOutlined className="card_icon" />
              </div>
              <h2>{totalPriceReceived?.toLocaleString()} </h2>
            </div>
            <div className="card">
              <div className="card-inner">
                <h3>DOANH THU THÁNG</h3>
                <DollarOutlined className="card_icon" />
              </div>
              <h2>{totalPriceReceivedOfMonth?.toLocaleString()}</h2>
            </div>
            <div className="card">
              <div className="card-inner">
                <h3>ĐƠN HÀNG</h3>
                <ShoppingCartOutlined className="card_icon" />
              </div>
              <h2>{orders?.data?.length ? orders?.data?.length : 0}</h2>
            </div>
            <div className="card">
              <div className="card-inner">
                <h3>LIÊN HỆ</h3>
                <ContactsOutlined className="card_icon" />
              </div>
              <h2>{contacts?.data?.length ? contacts?.data?.length : 0}</h2>
            </div>
          </div>
          {/* Biểu đồ thống kê doanh thu 12 tháng */}
          <div
            style={{
              padding: "30px 0",
              fontSize: "17px",
              background: "rgb(23 24 43)",
              marginTop: "20px",
              borderRadius: "15px",
              display: "flex",
              justifyContent: "flex-start",
            }}
          >
            <div style={{ flex: "1" }}>
              <p style={{ padding: "0 20px", marginBottom: "0" }}>
                Biểu đồ doanh thu theo tháng
              </p>
              <div style={{ height: "300px", marginTop: "30px" }}>
                <RevenueStatisticsChart
                  data={dataToTalPriceOrderMonth.reverse()}
                />
              </div>
            </div>
            <div style={{ flex: "1" }}>
              <p style={{ textAlign: "center" }}>Top khách hàng tiềm năng</p>
              <div style={{ padding: "0 50px" }}>
                {updatedDataUserOrderTotal?.length &&
                  updatedDataUserOrderTotal?.slice(0, 5)?.map((user) => {
                    return (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "10px ",
                          }}
                        >
                          <Avatar src={user?.avatar} />
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              lineHeight: "1",
                              padding: "10px",
                            }}
                          >
                            <p>{user?.name}</p>
                            <span>{user?.email}</span>
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          {user?.total?.toLocaleString()} VND
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>

          {/* Biểu đồ thống kê số lượng đơn hàng tháng */}
          <div
            style={{
              padding: "30px 0",
              fontSize: "17px",
              background: "rgb(23 24 43)",
              marginTop: "20px",
              borderRadius: "15px",
            }}
          >
            <p style={{ padding: "0 20px", marginBottom: "0" }}>
              Biểu đồ số lượng đơn hàng theo tháng
            </p>
            <div className="charts" style={{ marginTop: "30px" }}>
              <ResponsiveContainer>
                <AreaChart
                  data={dataNumberOrderMonth}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  {/* <CartesianGrid strokeDasharray="3 3" /> */}
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="uv"
                    stroke="#8884d8"
                    fill="#8884d8"
                  />
                </AreaChart>
              </ResponsiveContainer>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  width={500}
                  height={300}
                  data={dataNumberOrderMonth}
                  margin={{
                    top: 5,
                    right: 50,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  {/* <CartesianGrid strokeDasharray="3 3" /> */}
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="pv"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                  <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Biểu đồ thống kê sản phẩm tồn kho */}
          <div
            style={{
              padding: "30px 0",
              fontSize: "17px",
              background: "rgb(23 24 43)",
              marginTop: "20px",
              borderRadius: "15px",
            }}
          >
            <p style={{ padding: "0 20px", marginBottom: "0" }}>
              Biểu đồ số lượng sản phẩm tồn kho
            </p>
            <div className="charts" style={{ marginTop: "50px" }}>
              <CustomShapeBarchart data={transformedDataCountInStock} />
              <SimpleBarChart data={transformedDataCountInStockAndSelled} />
            </div>
          </div>

          {/* Bảng sản phẩm bán chạy bán chậm */}
          <div
            style={{
              padding: "30px 0",
              fontSize: "17px",
              background: "rgb(23 24 43)",
              marginTop: "20px",
              borderRadius: "15px",
              display: "flex",
              width: "100%",
              justifyContent: "space-around",
            }}
          >
            <div style={{ width: "40%" }}>
              <p>Sản phẩm bán chạy nhất</p>
              <WrapperTable
                columns={columns}
                dataSource={dataTableBestSeller}
              />
            </div>
            <div style={{ width: "40%" }}>
              <p>Sản phẩm bán chậm nhất</p>
              <WrapperTable
                columns={columns}
                dataSource={dataTableSlowestSeller}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;

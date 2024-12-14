// import React, { useEffect, useRef, useState } from "react";
// import { WrapperAvatar } from "./style";
// import {
//   CheckCircleOutlined,
//   CloseCircleOutlined,
//   DeleteOutlined,
//   EditOutlined,
//   SearchOutlined,
// } from "@ant-design/icons";
// import TableComponent from "../TableComponent/TableComponent";
// import { Button, Form, Radio, Space } from "antd";
// import * as message from "../../components/Message/Message";
// import InputComponent from "../InputComponent/InputComponent";
// import { getBase64 } from "../../utils";
// import * as UserService from "../../services/UserService";
// import { useMutationHook } from "../../hooks/useMutationHook";
// import Loading from "../../components/Loading/Loading";
// import { useQuery } from "@tanstack/react-query";
// import DrawerComponent from "../DrawerComponent/DrawerComponent";
// import { useSelector } from "react-redux";
// import ModalComponent from "../ModalComponent/ModalComponent";
// import PieChartComponent from "./PieChartComponent";
// import AdminHeader from "../AdminHeader/AdminHeader";

// const AdminUser = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [rowSelected, setRowSelected] = useState("");
//   const [isOpenDrawer, setIsOpenDrawer] = useState(false);
//   const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
//   const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
//   const user = useSelector((state) => state?.user);
//   const searchInput = useRef(null);

//   const [stateUserDetails, setStateUserDetails] = useState({
//     id: "",
//     name: "",
//     email: "",
//     address: "",
//     avatar: "",
//     phone: "",
//     isAdmin: false,
//   });

//   const [form] = Form.useForm();

//   const mutationUpdate = useMutationHook((data) => {
//     const { id, token, ...rests } = data;
//     const res = UserService.updateUser(id, { ...rests }, token);
//     return res;
//   });

//   const mutationDeleted = useMutationHook((data) => {
//     const { id, token } = data;
//     const res = UserService.deleteUser(id, token);
//     return res;
//   });

//   const mutationDeletedMany = useMutationHook((data) => {
//     const { token, ...ids } = data;
//     const res = UserService.deleteManyUser(ids, token);
//     return res;
//   });

//   const getAllUsers = async () => {
//     const res = await UserService.getAllUser(user?.access_token);
//     return res;
//   };

//   const fetchGetDetailsUser = async (rowSelected) => {
//     const res = await UserService.getDetailUser(rowSelected);
//     if (res?.data) {
//       setStateUserDetails({
//         _id: res?.data?._id,
//         name: res?.data?.name,
//         email: res?.data?.email,
//         address: res?.data?.address,
//         avatar: res?.data?.avatar,
//         phone: res?.data?.phone,
//         createdAt: res?.data?.createdAt,
//         updatedAt: res?.data?.updatedAt,
//         isAdmin: res?.data?.isAdmin,
//       });
//     }
//     setIsLoadingUpdate(false);
//   };

//   useEffect(() => {
//     if (!isModalOpen) {
//       form.setFieldsValue(stateUserDetails);
//     }
//   }, [form, stateUserDetails, isModalOpen]);

//   useEffect(() => {
//     if (rowSelected && isOpenDrawer) {
//       setIsLoadingUpdate(true);
//       fetchGetDetailsUser(rowSelected);
//     }
//   }, [rowSelected, isOpenDrawer]);

//   const handleDetailsUser = () => {
//     setIsOpenDrawer(true);
//   };

//   const handleDeleteManyUser = (ids) => {
//     mutationDeletedMany.mutate(
//       { ids: ids, token: user?.access_token },
//       {
//         onSettled: () => {
//           queryUser.refetch();
//         },
//       }
//     );
//   };
//   const {
//     data: dataUpdated,
//     isLoading: isLoadingUpdated,
//     isSuccess: isSuccessUpdated,
//     isError: isErrorUpdated,
//   } = mutationUpdate;
//   const {
//     data: dataDeleted,
//     isLoading: isLoadingDeleted,
//     isSuccess: isSuccessDelected,
//     isError: isErrorDeleted,
//   } = mutationDeleted;
//   const {
//     data: dataDeletedMany,
//     isLoading: isLoadingDeletedMany,
//     isSuccess: isSuccessDelectedMany,
//     isError: isErrorDeletedMany,
//   } = mutationDeletedMany;

//   const queryUser = useQuery({ queryKey: ["users"], queryFn: getAllUsers });

//   const { isLoading: isLoadingUser, data: users } = queryUser;
//   const renderAction = () => {
//     return (
//       <div>
//         <DeleteOutlined
//           style={{ color: "red", fontSize: "30px", cursor: "pointer" }}
//           onClick={() => setIsModalOpenDelete(true)}
//         />
//         <EditOutlined
//           style={{ color: "orange", fontSize: "30px", cursor: "pointer" }}
//           onClick={handleDetailsUser}
//         />
//       </div>
//     );
//   };

//   const handleSearch = (selectedKeys, confirm, dataIndex) => {
//     confirm();
//     // setSearchText(selectedKeys[0]);
//     // setSearchedColumn(dataIndex);
//   };
//   const handleReset = (clearFilters, confirm) => {
//     clearFilters();
//     // setSearchText('');
//     confirm();
//   };

//   const getColumnSearchProps = (dataIndex) => ({
//     filterDropdown: ({
//       setSelectedKeys,
//       selectedKeys,
//       confirm,
//       clearFilters,
//     }) => (
//       <div
//         style={{
//           padding: 8,
//         }}
//         onKeyDown={(e) => e.stopPropagation()}
//       >
//         <InputComponent
//           ref={searchInput}
//           placeholder={`Search ${dataIndex}`}
//           value={selectedKeys[0]}
//           onChange={(e) =>
//             setSelectedKeys(e.target.value ? [e.target.value] : [])
//           }
//           onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
//           style={{
//             marginBottom: 8,
//             display: "block",
//           }}
//         />
//         <Space>
//           <Button
//             type="primary"
//             onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
//             icon={<SearchOutlined />}
//             size="small"
//             style={{
//               width: 90,
//             }}
//           >
//             Search
//           </Button>
//           <Button
//             onClick={() => clearFilters && handleReset(clearFilters, confirm)}
//             size="small"
//             style={{
//               width: 90,
//             }}
//           >
//             Reset
//           </Button>
//         </Space>
//       </div>
//     ),
//     filterIcon: (filtered) => (
//       <SearchOutlined
//         style={{
//           color: filtered ? "#1890ff" : undefined,
//         }}
//       />
//     ),
//     onFilter: (value, record) =>
//       record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
//     onFilterDropdownOpenChange: (visible) => {
//       if (visible) {
//         setTimeout(() => searchInput.current?.select(), 100);
//       }
//     },
//   });

//   //columns and data truyền vào tablecomponent
//   const columns = [
//     {
//       title: "Tên",
//       dataIndex: "name",
//       render: (text) => <a>{text}</a>,
//       // sorter: (a, b) => a.name.length - b.name.length,
//       ...getColumnSearchProps("name"),
//     },
//     {
//       title: "email",
//       dataIndex: "email",
//       // sorter: (a, b) => a.name.length - b.name.length,
//       ...getColumnSearchProps("email"),
//     },
//     {
//       title: "Địa chỉ",
//       dataIndex: "address",
//       // sorter: (a, b) => a.name.length - b.name.length,
//       ...getColumnSearchProps("address"),
//     },
//     {
//       title: "Số điện thoại",
//       dataIndex: "phone",
//       // sorter: (a, b) => a.name - b.name,
//       ...getColumnSearchProps("phone"),
//     },
//     {
//       title: "Admin",
//       dataIndex: "isAdmin",
//       filters: [
//         {
//           text: "True",
//           value: true,
//         },
//         {
//           text: "False",
//           value: false,
//         },
//       ],
//       onFilter: (value, record) => {
//         if (value === true) {
//           return record.isAdmin.type.render.name === "CheckCircleOutlined";
//         }
//         return record.isAdmin.type.render.name === "CloseCircleOutlined";
//       },
//     },
//     {
//       title: "Hành động",
//       dataIndex: "action",
//       render: renderAction,
//     },
//   ];
//   const dataTable =
//     users?.data?.length &&
//     users?.data?.map((user) => {
//       return {
//         ...user,
//         key: user._id,
//         isAdmin: user.isAdmin ? (
//           <CheckCircleOutlined
//             style={{ fontSize: "25px", color: "rgb(70 255 74)" }}
//           />
//         ) : (
//           <CloseCircleOutlined
//             style={{ fontSize: "25px", color: "rgb(255 ,11, 11)" }}
//           />
//         ),
//       };
//     });

//   useEffect(() => {
//     if (isSuccessDelected && dataDeleted?.status === "OK") {
//       message.success();
//       handleCancelDelete();
//     } else if (isErrorDeleted) {
//       message.error();
//     }
//   }, [isSuccessDelected]);

//   const handleCloseDrawer = () => {
//     setIsOpenDrawer(false);
//     setStateUserDetails({
//       id: "",
//       name: "",
//       email: "",
//       address: "",
//       avatar: "",
//       phone: "",
//       isAdmin: "",
//     });
//     form.resetFields();
//   };

//   useEffect(() => {
//     if (isSuccessUpdated && dataUpdated?.status === "OK") {
//       message.success();
//       handleCloseDrawer();
//     } else if (isErrorUpdated) {
//       message.error();
//     }
//   }, [isSuccessUpdated]);

//   useEffect(() => {
//     if (isSuccessDelectedMany && dataDeletedMany?.status === "OK") {
//       message.success();
//       handleCancelDelete();
//     } else if (isErrorDeletedMany) {
//       message.error();
//     }
//   }, [isSuccessDelectedMany]);

//   const handleCancelDelete = () => {
//     setIsModalOpenDelete(false);
//   };

//   const handleDeleteUser = () => {
//     mutationDeleted.mutate(
//       { id: rowSelected, token: user?.access_token },
//       {
//         onSettled: () => {
//           queryUser.refetch();
//         },
//       }
//     );
//   };

//   const handleOnchangeDetails = (e) => {
//     setStateUserDetails({
//       ...stateUserDetails,
//       [e.target.name]: e.target.value,
//     });
//   };
//   const handleOnchangeIsAdminDetails = (e) => {
//     setStateUserDetails({
//       ...stateUserDetails,
//       isAdmin: e.target.value,
//     });
//   };

//   const handleOnchangeAvatarDetails = async ({ fileList }) => {
//     const file = fileList[0];
//     if (!file.url && !file.preview) {
//       file.preview = await getBase64(file.originFileObj);
//     }
//     setStateUserDetails({
//       ...stateUserDetails,
//       avatar: file.preview,
//     });
//   };
//   const onUpdateUser = () => {
//     mutationUpdate.mutate(
//       { id: rowSelected, token: user?.access_token, ...stateUserDetails },
//       {
//         onSettled: () => {
//           queryUser.refetch();
//         },
//       }
//     );
//   };

//   return (
//     <div>
//       <AdminHeader textHeader={"Quản lý người dùng"} />
//       {/* <WrapperHeader>Quản lý người dùng</WrapperHeader> */}
//       <div style={{ width: "200px", height: "200px", marginBottom: "30px" }}>
//         <PieChartComponent data={users?.data} />
//         <p
//           style={{
//             fontSize: "15px",
//             fontWeight: "bold",
//             color: "#fff",
//             display: "flex",
//             justifyContent: "center",
//           }}
//         >
//           Số lượng người dùng
//         </p>
//       </div>
//       {/* <div style={{ marginTop: '10px' }}>
//         <ButtonAddUser onClick={() => setIsModalOpen(true)}><PlusOutlined /></ButtonAddUser>
//       </div> */}
//       <div style={{ marginTop: "20px" }}>
//         <TableComponent
//           handleDeleteMany={handleDeleteManyUser}
//           columns={columns}
//           isLoading={isLoadingUser}
//           data={dataTable}
//           onRow={(record, rowIndex) => {
//             return {
//               onClick: (event) => {
//                 setRowSelected(record._id);
//               },
//             };
//           }}
//         />
//       </div>
//       <DrawerComponent
//         title="Chi tiết người dùng"
//         isOpen={isOpenDrawer}
//         onClose={() => setIsOpenDrawer(false)}
//         width="90%"
//       >
//         <Loading isLoading={isLoadingUpdate || isLoadingUpdated}>
//           <Form
//             form={form}
//             name="basic"
//             labelCol={{
//               span: 2,
//             }}
//             wrapperCol={{
//               span: 22,
//             }}
//             initialValues={{
//               remember: true,
//             }}
//             onFinish={onUpdateUser}
//             autoComplete="on"
//           >
//             <Form.Item
//               label="Id"
//               name="_id"
//               rules={[
//                 {
//                   required: true,
//                   message: "Please input user id!",
//                 },
//               ]}
//             >
//               <InputComponent
//                 value={stateUserDetails._id}
//                 onChange={handleOnchangeDetails}
//                 name="_id"
//               />
//             </Form.Item>
//             <Form.Item
//               label="Name"
//               name="name"
//               rules={[
//                 {
//                   required: true,
//                   message: "Please input user name!",
//                 },
//               ]}
//             >
//               <InputComponent
//                 value={stateUserDetails.name}
//                 onChange={handleOnchangeDetails}
//                 name="name"
//               />
//             </Form.Item>

//             <Form.Item
//               label="Email"
//               name="email"
//               rules={[
//                 {
//                   required: true,
//                   message: "Please input user email!",
//                 },
//               ]}
//             >
//               <InputComponent
//                 value={stateUserDetails.email}
//                 onChange={handleOnchangeDetails}
//                 name="email"
//               />
//             </Form.Item>

//             <Form.Item
//               label="Address"
//               name="address"
//               rules={[
//                 {
//                   required: true,
//                   message: "Please input user address!",
//                 },
//               ]}
//             >
//               <InputComponent
//                 value={stateUserDetails.address}
//                 onChange={handleOnchangeDetails}
//                 name="address"
//               />
//             </Form.Item>
//             <Form.Item
//               label="Phone"
//               name="phone"
//               rules={[
//                 {
//                   required: true,
//                   message: "Please input user address!",
//                 },
//               ]}
//             >
//               <InputComponent
//                 value={stateUserDetails.phone}
//                 onChange={handleOnchangeDetails}
//                 name="phone"
//               />
//             </Form.Item>

//             <Form.Item
//               label="CreateAt"
//               name="createdAt"
//               rules={[
//                 {
//                   required: true,
//                   message: "Please input product avatar!",
//                 },
//               ]}
//             >
//               <InputComponent
//                 value={stateUserDetails.createdAt}
//                 onChange={handleOnchangeDetails}
//                 name="createdAt"
//               />
//             </Form.Item>

//             <Form.Item
//               label="UpdatedAt"
//               name="updatedAt"
//               rules={[
//                 {
//                   required: true,
//                   message: "Please input product rating!",
//                 },
//               ]}
//             >
//               <InputComponent
//                 value={stateUserDetails.updatedAt}
//                 onChange={handleOnchangeDetails}
//                 name="UpdatedAt"
//               />
//             </Form.Item>

//             <Form.Item
//               label="Is Admin"
//               name="isAdmin"
//               rules={[
//                 {
//                   required: true,
//                   message: "Please input is Admin!",
//                 },
//               ]}
//             >
//               <Radio.Group
//                 onChange={handleOnchangeIsAdminDetails}
//                 value={stateUserDetails?.isAdmin}
//               >
//                 <Radio value={false}>False</Radio>
//                 <Radio value={true}>True</Radio>
//               </Radio.Group>
//               {/* <InputComponent value = {stateUserDetails.isAdmin} onChange ={handleOnchangeDetails} name="isAdmin"/> */}
//             </Form.Item>
//             <Form.Item
//               label="Avatar "
//               name="avatar"
//               rules={[
//                 { required: true, message: "Please input your count image!" },
//               ]}
//             >
//               <WrapperAvatar
//                 onChange={handleOnchangeAvatarDetails}
//                 maxCount={1}
//               >
//                 <Button>Select File</Button>
//                 {stateUserDetails?.avatar && (
//                   <img
//                     src={stateUserDetails?.avatar}
//                     style={{
//                       height: "60px",
//                       width: "60px",
//                       borderRadius: "50%",
//                       objectFit: "cover",
//                       marginLeft: "10px",
//                     }}
//                     alt="avatar"
//                   />
//                 )}
//               </WrapperAvatar>
//             </Form.Item>

//             <Form.Item
//               wrapperCol={{
//                 offset: 20,
//                 span: 16,
//               }}
//             >
//               <Button type="primary" htmlType="submit">
//                 Apply
//               </Button>
//             </Form.Item>
//           </Form>
//         </Loading>
//       </DrawerComponent>

//       <ModalComponent
//         title="Xóa người dùng"
//         open={isModalOpenDelete}
//         onCancel={handleCancelDelete}
//         onOk={handleDeleteUser}
//       >
//         <Loading isLoading={isLoadingDeleted}>
//           <div>Bạn có chắc xóa người dùng này không?</div>
//         </Loading>
//       </ModalComponent>
//     </div>
//   );
// };

// export default AdminUser;

import React, { useEffect, useRef, useState } from "react";
import { ButtonAddUser, WrapperAvatar } from "./style";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  FormOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import TableComponent from "../TableComponent/TableComponent";
import { Button, Form, Input, Radio, Space, Switch } from "antd";
import * as message from "../../components/Message/Message";
import InputComponent from "../InputComponent/InputComponent";
import { getBase64 } from "../../utils";
import * as UserService from "../../services/UserService";
import { useMutationHook } from "../../hooks/useMutationHook";
import Loading from "../../components/Loading/Loading";
import { useQuery } from "@tanstack/react-query";
import DrawerComponent from "../DrawerComponent/DrawerComponent";
import { useSelector } from "react-redux";
import ModalComponent from "../ModalComponent/ModalComponent";
import PieChartComponent from "./PieChartComponent";
import AdminHeader from "../AdminHeader/AdminHeader";

const AdminUser = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rowSelected, setRowSelected] = useState("");
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const user = useSelector((state) => state?.user);
  const [urlImage, setUrlImage] = useState();
  const searchInput = useRef(null);

  const [stateUserDetails, setStateUserDetails] = useState({
    id: "",
    name: "",
    email: "",
    address: "",
    avatar: "",
    phone: "",
    isAdmin: false,
  });

  const [form] = Form.useForm();

  const mutationUpdate = useMutationHook((data) => {
    const { id, token, ...rests } = data;
    const res = UserService.updateUser(id, { ...rests }, token);
    return res;
  });

  const mutationDeleted = useMutationHook((data) => {
    const { id, token } = data;
    const res = UserService.deleteUser(id, token);
    return res;
  });

  const mutationDeletedMany = useMutationHook((data) => {
    const { token, ...ids } = data;
    const res = UserService.deleteManyUser(ids, token);
    return res;
  });

  const getAllUsers = async () => {
    const res = await UserService.getAllUser(user?.access_token);
    return res;
  };

  const fetchGetDetailsUser = async (rowSelected) => {
    const res = await UserService.getDetailUser(rowSelected);
    if (res?.data) {
      setStateUserDetails({
        _id: res?.data?._id,
        name: res?.data?.name,
        email: res?.data?.email,
        address: res?.data?.address,
        avatar: res?.data?.avatar,
        phone: res?.data?.phone,
        createdAt: res?.data?.createdAt,
        updatedAt: res?.data?.updatedAt,
        isAdmin: res?.data?.isAdmin,
      });
      setUrlImage(res?.data?.avatar);
    }
    setIsLoadingUpdate(false);
  };

  useEffect(() => {
    if (!isModalOpen) {
      form.setFieldsValue(stateUserDetails);
    }
  }, [form, stateUserDetails, isModalOpen]);

  useEffect(() => {
    if (rowSelected && isOpenDrawer) {
      setIsLoadingUpdate(true);
      fetchGetDetailsUser(rowSelected);
    }
  }, [rowSelected, isOpenDrawer]);

  const handleDetailsUser = () => {
    setIsOpenDrawer(true);
  };

  const handleDeleteManyUser = (ids) => {
    mutationDeletedMany.mutate(
      { ids: ids, token: user?.access_token },
      {
        onSettled: () => {
          queryUser.refetch();
        },
      }
    );
  };
  const {
    data: dataUpdated,
    isLoading: isLoadingUpdated,
    isSuccess: isSuccessUpdated,
    isError: isErrorUpdated,
  } = mutationUpdate;
  const {
    data: dataDeleted,
    isLoading: isLoadingDeleted,
    isSuccess: isSuccessDelected,
    isError: isErrorDeleted,
  } = mutationDeleted;
  const {
    data: dataDeletedMany,
    isLoading: isLoadingDeletedMany,
    isSuccess: isSuccessDelectedMany,
    isError: isErrorDeletedMany,
  } = mutationDeletedMany;

  const queryUser = useQuery({ queryKey: ["users"], queryFn: getAllUsers });

  const { isLoading: isLoadingUser, data: users } = queryUser;
  const renderAction = () => {
    return (
      <div className="d-flex gap-2">
        <DeleteOutlined
          style={{ fontSize: "20px", cursor: "pointer" }}
          onClick={() => setIsModalOpenDelete(true)}
        />
        <FormOutlined
          style={{ fontSize: "20px", cursor: "pointer" }}
          onClick={handleDetailsUser}
        />
      </div>
    );
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    // setSearchText(selectedKeys[0]);
    // setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters, confirm) => {
    clearFilters();
    // setSearchText('');
    confirm();
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <InputComponent
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters, confirm)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });

  //columns and data truyền vào tablecomponent
  const columns = [
    {
      title: "Tên",
      dataIndex: "name",
      render: (text) => <a>{text}</a>,
      sorter: (a, b) => a.name.length - b.name.length,
      ...getColumnSearchProps("name"),
    },
    {
      title: "email",
      dataIndex: "email",
      sorter: (a, b) => a.name.length - b.name.length,
      ...getColumnSearchProps("email"),
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      sorter: (a, b) => a.name.length - b.name.length,
      ...getColumnSearchProps("address"),
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      sorter: (a, b) => a.name - b.name,
      ...getColumnSearchProps("phone"),
    },
    {
      title: "Loại người dùng",
      dataIndex: "isAdmin",
      render: (value) => {
        return <a>{value === true ? "Admin" : "Khách hàng"}</a>;
      },
    },
    {
      title: "Hành động",
      dataIndex: "action",
      render: renderAction,
    },
  ];
  const dataTable =
    users?.data?.length &&
    users?.data?.map((user) => {
      return {
        ...user,
        key: user._id,
        isAdmin: user.isAdmin ? (
          <CheckCircleOutlined
            style={{ fontSize: "25px", color: "rgb(70 255 74)" }}
          />
        ) : (
          <CloseCircleOutlined
            style={{ fontSize: "25px", color: "rgb(255 ,11, 11)" }}
          />
        ),
      };
    });

  useEffect(() => {
    if (isSuccessDelected && dataDeleted?.status === "OK") {
      message.success();
      handleCancelDelete();
    } else if (isErrorDeleted) {
      message.error();
    }
  }, [isSuccessDelected]);

  const handleCloseDrawer = () => {
    setIsOpenDrawer(false);
    setStateUserDetails({
      id: "",
      name: "",
      email: "",
      address: "",
      avatar: "",
      phone: "",
      isAdmin: "",
    });
    form.resetFields();
  };
  useEffect(() => {
    if (isSuccessUpdated && dataUpdated?.status === "OK") {
      message.success();
      handleCloseDrawer();
    } else if (isErrorUpdated) {
      message.error();
    }
  }, [isSuccessUpdated]);

  useEffect(() => {
    if (isSuccessDelectedMany && dataDeletedMany?.status === "OK") {
      message.success();
      handleCancelDelete();
    } else if (isErrorDeletedMany) {
      message.error();
    }
  }, [isSuccessDelectedMany]);

  const handleCancelDelete = () => {
    setIsModalOpenDelete(false);
  };

  const handleDeleteUser = () => {
    mutationDeleted.mutate(
      { id: rowSelected, token: user?.access_token },
      {
        onSettled: () => {
          queryUser.refetch();
        },
      }
    );
  };

  const handleOnchangeDetails = (e) => {
    setStateUserDetails({
      ...stateUserDetails,
      [e.target.name]: e.target.value,
    });
  };
  const handleOnchangeIsAdminDetails = (e) => {
    setStateUserDetails({
      ...stateUserDetails,
      isAdmin: e,
    });
  };

  const handleOnchangeAvatarDetails = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setStateUserDetails({
      ...stateUserDetails,
      avatar: file.preview,
    });
  };

  const uploadToCloudinary = async (file, uploadPreset, uploadUrl) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);

      const response = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.secure_url) {
        // Trả về URL của ảnh đã upload
        return data.secure_url;
      } else {
        throw new Error("Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };
  const handleImageUpload = async (file) => {
    const uploadPreset = "clockWeb";
    const uploadUrl = "https://api.cloudinary.com/v1_1/dhfbsejrh/image/upload";

    const imageUrl = await uploadToCloudinary(file, uploadPreset, uploadUrl);

    if (imageUrl) {
      setUrlImage(imageUrl);
    }
  };
  const onUpdateUser = () => {
    const payload = {
      id: rowSelected,
      token: user?.access_token,
      ...stateUserDetails,
    };
    if (urlImage) {
      payload.avatar = urlImage;
    }
    mutationUpdate.mutate(payload, {
      onSettled: () => {
        queryUser.refetch();
      },
    });
  };

  return (
    <div>
      <AdminHeader textHeader={"Quản lý người dùng"} />
      {/* <WrapperHeader>Quản lý người dùng</WrapperHeader> */}
      <div style={{ width: "200px", height: "200px", marginBottom: "30px" }}>
        <PieChartComponent data={users?.data} />
      </div>
      {/* <div style={{ marginTop: "10px" }}>
        <ButtonAddUser onClick={() => setIsModalOpen(true)}>
          <PlusOutlined />
        </ButtonAddUser>
      </div> */}
      <div style={{ marginTop: "20px" }}>
        <TableComponent
          handleDeleteMany={handleDeleteManyUser}
          columns={columns}
          isLoading={isLoadingUser}
          data={dataTable}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                setRowSelected(record._id);
              },
            };
          }}
        />
      </div>
      <DrawerComponent
        title="Chi tiết người dùng"
        // isOpen={isOpenDrawer}
        onClose={() => setIsOpenDrawer(false)}
        width="90%"
      >
        <Loading isLoading={isLoadingUpdate || isLoadingUpdated}>
          <Form
            form={form}
            name="basic"
            labelCol={{
              span: 2,
            }}
            wrapperCol={{
              span: 22,
            }}
            initialValues={{
              remember: true,
            }}
            onFinish={onUpdateUser}
            autoComplete="on"
          >
            <Form.Item
              label="Id"
              name="_id"
              rules={[
                {
                  required: true,
                  message: "Please input user id!",
                },
              ]}
            >
              <InputComponent
                value={stateUserDetails._id}
                onChange={handleOnchangeDetails}
                name="_id"
              />
            </Form.Item>
            <Form.Item
              label="Name"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Please input user name!",
                },
              ]}
            >
              <InputComponent
                value={stateUserDetails.name}
                onChange={handleOnchangeDetails}
                name="name"
              />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please input user email!",
                },
              ]}
            >
              <InputComponent
                value={stateUserDetails.email}
                onChange={handleOnchangeDetails}
                name="email"
              />
            </Form.Item>

            <Form.Item
              label="Address"
              name="address"
              rules={[
                {
                  required: true,
                  message: "Please input user address!",
                },
              ]}
            >
              <InputComponent
                value={stateUserDetails.address}
                onChange={handleOnchangeDetails}
                name="address"
              />
            </Form.Item>
            <Form.Item
              label="Phone"
              name="phone"
              rules={[
                {
                  required: true,
                  message: "Please input user address!",
                },
              ]}
            >
              <InputComponent
                value={stateUserDetails.phone}
                onChange={handleOnchangeDetails}
                name="phone"
              />
            </Form.Item>

            <Form.Item
              label="CreateAt"
              name="createdAt"
              rules={[
                {
                  required: true,
                  message: "Please input product avatar!",
                },
              ]}
            >
              <InputComponent
                value={stateUserDetails.createdAt}
                onChange={handleOnchangeDetails}
                name="createdAt"
              />
            </Form.Item>

            <Form.Item
              label="UpdatedAt"
              name="updatedAt"
              rules={[
                {
                  required: true,
                  message: "Please input product rating!",
                },
              ]}
            >
              <InputComponent
                value={stateUserDetails.updatedAt}
                onChange={handleOnchangeDetails}
                name="UpdatedAt"
              />
            </Form.Item>

            <Form.Item
              label="Is Admin"
              name="isAdmin"
              rules={[
                {
                  required: true,
                  message: "Please input is Admin!",
                },
              ]}
            >
              <Radio.Group
                onChange={handleOnchangeIsAdminDetails}
                value={stateUserDetails?.isAdmin}
              >
                <Radio value={false}>False</Radio>
                <Radio value={true}>True</Radio>
              </Radio.Group>
              {/* <InputComponent value = {stateUserDetails.isAdmin} onChange ={handleOnchangeDetails} name="isAdmin"/> */}
            </Form.Item>
            <Form.Item
              label="Avatar "
              name="avatar"
              rules={[
                { required: true, message: "Please input your count image!" },
              ]}
            >
              <WrapperAvatar
                onChange={handleOnchangeAvatarDetails}
                maxCount={1}
              >
                <Button>Select File</Button>
                {stateUserDetails?.avatar && (
                  <img
                    src={stateUserDetails?.avatar}
                    style={{
                      height: "60px",
                      width: "60px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      marginLeft: "10px",
                    }}
                    alt="avatar"
                  />
                )}
              </WrapperAvatar>
            </Form.Item>

            <Form.Item
              wrapperCol={{
                offset: 20,
                span: 16,
              }}
            >
              <Button type="primary" htmlType="submit">
                Apply
              </Button>
            </Form.Item>
          </Form>
        </Loading>
      </DrawerComponent>

      <ModalComponent
        title="Xóa người dùng"
        open={isModalOpenDelete}
        onCancel={handleCancelDelete}
        onOk={handleDeleteUser}
      >
        <Loading isLoading={isLoadingDeleted}>
          <div>Bạn có chắc xóa người dùng này không?</div>
        </Loading>
      </ModalComponent>

      <ModalComponent
        title="Chi tiết người dùng"
        open={isOpenDrawer}
        onCancel={() => setIsOpenDrawer(false)}
        footer={null}
        width={1000}
      >
        <Loading isLoading={isLoadingUpdate || isLoadingUpdated}>
          <Form
            form={form}
            name="basic"
            labelCol={{
              span: 4,
            }}
            wrapperCol={{
              span: 20,
            }}
            initialValues={{
              remember: true,
            }}
            onFinish={onUpdateUser}
            autoComplete="on"
          >
            {/* <Form.Item
              label="Id"
              name="_id"
              rules={[
                {
                  required: true,
                  message: "Please input user id!",
                },
              ]}
            >
              <InputComponent
                value={stateUserDetails._id}
                onChange={handleOnchangeDetails}
                name="_id"
              />
            </Form.Item> */}
            <Form.Item
              label="Tên"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Please input user name!",
                },
              ]}
            >
              <InputComponent
                value={stateUserDetails.name}
                onChange={handleOnchangeDetails}
                name="name"
              />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please input user email!",
                },
              ]}
            >
              <InputComponent
                value={stateUserDetails.email}
                onChange={handleOnchangeDetails}
                name="email"
              />
            </Form.Item>

            <Form.Item
              label="Địa chỉ"
              name="address"
              rules={[
                {
                  required: true,
                  message: "Please input user address!",
                },
              ]}
            >
              <InputComponent
                value={stateUserDetails.address}
                onChange={handleOnchangeDetails}
                name="address"
              />
            </Form.Item>
            <Form.Item
              label="Số điện thoại"
              name="phone"
              rules={[
                {
                  required: true,
                  message: "Please input user address!",
                },
              ]}
            >
              <InputComponent
                value={stateUserDetails.phone}
                onChange={handleOnchangeDetails}
                name="phone"
              />
            </Form.Item>

            {/* <Form.Item
              label="CreateAt"
              name="createdAt"
              rules={[
                {
                  required: true,
                  message: "Please input product avatar!",
                },
              ]}
            >
              <InputComponent
                value={stateUserDetails.createdAt}
                onChange={handleOnchangeDetails}
                name="createdAt"
              />
            </Form.Item> */}

            {/* <Form.Item
              label="UpdatedAt"
              name="updatedAt"
              rules={[
                {
                  required: true,
                  message: "Please input product rating!",
                },
              ]}
            >
              <InputComponent
                value={stateUserDetails.updatedAt}
                onChange={handleOnchangeDetails}
                name="UpdatedAt"
              />
            </Form.Item> */}

            <Form.Item
              label="Admin"
              name="isAdmin"
              rules={[
                {
                  required: true,
                  message: "Please input is Admin!",
                },
              ]}
            >
              <Switch
                checked={stateUserDetails?.isAdmin}
                onChange={handleOnchangeIsAdminDetails}
              />
              {/* <InputComponent value = {stateUserDetails.isAdmin} onChange ={handleOnchangeDetails} name="isAdmin"/> */}
            </Form.Item>

            <Form.Item label="Avatar " name="avatar">
              <Input
                type="file"
                id="exampleCustomFileBrowser1"
                name="image"
                onChange={(e) => handleImageUpload(e.target.files[0])}
              />

              {urlImage && (
                <div
                  className="image-preview"
                  style={{
                    marginTop: "40px",
                  }}
                >
                  <img
                    src={urlImage}
                    alt=""
                    style={{ height: "100px", width: "auto" }}
                  />
                  <div
                    className="image-preview-remove"
                    onClick={() => {
                      setUrlImage("");
                    }}
                  >
                    x
                  </div>
                </div>
              )}
            </Form.Item>
            <Form.Item
              wrapperCol={{
                offset: 20,
                span: 16,
              }}
            >
              <Button type="primary" htmlType="submit">
                Cập nhật
              </Button>
            </Form.Item>
          </Form>
        </Loading>
      </ModalComponent>
    </div>
  );
};

export default AdminUser;

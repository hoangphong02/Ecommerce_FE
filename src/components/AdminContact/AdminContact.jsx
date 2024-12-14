// import React, { useEffect, useRef, useState } from "react";
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
// import { useMutationHook } from "../../hooks/useMutationHook";
// import Loading from "../../components/Loading/Loading";
// import { useQuery } from "@tanstack/react-query";
// import DrawerComponent from "../DrawerComponent/DrawerComponent";
// import { useSelector } from "react-redux";
// import ModalComponent from "../ModalComponent/ModalComponent";
// import * as ContactService from "../../services/ContactService";
// import PieChartComponent from "./PieChartComponent";
// import AdminHeader from "../AdminHeader/AdminHeader";

// // import PieChartComponent from './PieChartComponent'

// const AdminContact = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [rowSelected, setRowSelected] = useState("");
//   const [isOpenDrawer, setIsOpenDrawer] = useState(false);
//   const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
//   const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
//   const user = useSelector((state) => state?.user);
//   const [valueIsExplain, setValueIsExplain] = useState("false");

//   const searchInput = useRef(null);

//   const [stateContactsDetails, setStateContactDetails] = useState({
//     id: "",
//     name: "",
//     email: "",
//     phone: "",
//     message: "",
//     isExplain: "",
//     createdAt: "",
//   });

//   const [form] = Form.useForm();

//   const mutationUpdate = useMutationHook((data) => {
//     const { id, token, ...rests } = data;
//     const res = ContactService.updateContact(id, token, { ...rests });
//     return res;
//   });

//   const mutationDeleted = useMutationHook((data) => {
//     const { id, token } = data;
//     const res = ContactService.deleteContact(id, token);
//     return res;
//   });

//   const handleDeleteContact = async (rowSelected) => {
//     mutationDeleted.mutate(
//       { id: rowSelected, token: user?.access_token },
//       {
//         onSuccess: () => {
//           queryContact.refetch();
//         },
//       }
//     );
//   };

//   // const mutationDeletedMany = useMutationHook(
//   //   (data) => {
//   //     const {
//   //       token, ...ids
//   //     } = data
//   //     const res = UserService.deleteManyUser(
//   //       ids,
//   //       token)
//   //     return res
//   //   },
//   // )

//   const getAllContact = async () => {
//     const res = await ContactService.getAllContact();
//     return res;
//   };

//   const fetchGetDetailsContact = async (rowSelected) => {
//     const res = await ContactService.getDetailContact(rowSelected);
//     if (res?.data) {
//       setStateContactDetails({
//         _id: res?.data?._id,
//         name: res?.data?.name,
//         email: res?.data?.email,
//         phone: res?.data?.phone,
//         message: res?.data?.message,
//         isExplain: res?.data?.isExplain,
//         createdAt: res?.data?.createdAt,
//       });
//       setValueIsExplain(res?.data?.isExplain);
//     }
//     setIsLoadingUpdate(false);
//   };

//   useEffect(() => {
//     if (!isModalOpen) {
//       form.setFieldsValue(stateContactsDetails);
//     }
//   }, [form, stateContactsDetails, isModalOpen]);

//   useEffect(() => {
//     if (rowSelected && isOpenDrawer) {
//       setIsLoadingUpdate(true);
//       fetchGetDetailsContact(rowSelected);
//     }
//   }, [rowSelected, isOpenDrawer]);

//   const handleDetailsOrder = () => {
//     setIsOpenDrawer(true);
//   };

//   const handleDeleteManyUser = (ids) => {
//     // mutationDeletedMany.mutate({ ids: ids, token: user?.access_token }, {
//     //   onSettled: () => {
//     //     queryUser.refetch()
//     //   }
//     // })
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
//   //  const { data: dataDeletedMany, isLoading: isLoadingDeletedMany, isSuccess: isSuccessDelectedMany, isError: isErrorDeletedMany } = mutationDeletedMany

//   const queryContact = useQuery({
//     queryKey: ["contacts"],
//     queryFn: getAllContact,
//   });

//   const { isLoading: isLoadingOrder, data: contacts } = queryContact;

//   const renderAction = () => {
//     return (
//       <div>
//         <DeleteOutlined
//           style={{ color: "red", fontSize: "30px", cursor: "pointer" }}
//           onClick={() => setIsModalOpenDelete(true)}
//         />
//         <EditOutlined
//           style={{ color: "orange", fontSize: "30px", cursor: "pointer" }}
//           onClick={handleDetailsOrder}
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
//       title: "Tên ",
//       dataIndex: "name",
//       render: (text) => <a>{text}</a>,
//       // sorter: (a, b) => a.name.length - b.name.length,
//       ...getColumnSearchProps("name"),
//     },
//     {
//       title: "Điện thoại",
//       dataIndex: "phone",
//       // sorter: (a, b) => a.phone.length - b.phone.length,
//       ...getColumnSearchProps("phone"),
//     },
//     {
//       title: "Nội dung",
//       dataIndex: "message",
//       // sorter: (a, b) => a.message.length - b.message.length,
//       ...getColumnSearchProps("message"),
//     },
//     {
//       title: "Đã giải quyết",
//       dataIndex: "isExplain",
//       // sorter: (a, b) => a.isExplain - b.isExplain,
//       // ...getColumnSearchProps("isExplain"),
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
//           return record.isExplain.type.render.name === "CheckCircleOutlined";
//         }
//         return record.isExplain.type.render.name === "CloseCircleOutlined";
//       },
//     },
//     {
//       title: "Hành động",
//       dataIndex: "action",
//       render: renderAction,
//     },
//   ];
//   const dataTable =
//     contacts?.data?.length &&
//     contacts?.data?.map((contact) => {
//       return {
//         ...contact,
//         key: contact._id,
//         isExplain: contact?.isExplain ? (
//           <CheckCircleOutlined
//             style={{ fontSize: "25px", color: "rgb(70 255 74)" }}
//           />
//         ) : (
//           <CloseCircleOutlined
//             style={{ fontSize: "25px", color: "rgb(255 ,11, 11)" }}
//           />
//         ),
//         name: contact?.name,
//         phone: contact?.phone,
//         message: contact?.message,
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

//   // useEffect(() => {
//   //   if (isSuccessDelectedMany && dataDeletedMany?.status === 'OK') {
//   //     message.success()
//   //     handleCancelDelete()
//   //   } else if (isErrorDeletedMany) {
//   //     message.error()
//   //   }
//   // }, [isSuccessDelectedMany])

//   const handleCancelDelete = () => {
//     setIsModalOpenDelete(false);
//   };

//   // const handleOnchangeDetails = (e) => {
//   //   setStateContactDetails({
//   //     ...stateContactsDetails,
//   //     [e.target.name]: e.target.value,
//   //   });
//   // };

//   const onUpdateContact = () => {
//     mutationUpdate.mutate(
//       { id: rowSelected, token: user?.access_token, isExplain: valueIsExplain },
//       {
//         onSettled: () => {
//           queryContact.refetch();
//         },
//       }
//     );
//   };
//   const onChange = (e) => {
//     setValueIsExplain(e.target.value);
//   };

//   return (
//     <div>
//       <AdminHeader textHeader={"Quản lý liên hệ"} />
//       {/* <WrapperHeader>Quản lý liên hệ</WrapperHeader> */}
//       <div style={{ width: "200px", height: "200px" }}>
//         <PieChartComponent data={contacts?.data} />
//       </div>
//       {/* <div style={{ marginTop: '10px' }}>
//         <ButtonAddUser onClick={() => setIsModalOpen(true)}><PlusOutlined /></ButtonAddUser>
//       </div> */}
//       <div style={{ marginTop: "20px" }}>
//         <TableComponent
//           handleDeleteMany={handleDeleteManyUser}
//           columns={columns}
//           isLoading={isLoadingOrder}
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
//         title="Chi tiết liên hệ"
//         isOpen={isOpenDrawer}
//         onClose={() => setIsOpenDrawer(false)}
//         width="90%"
//       >
//         <Loading isLoading={isLoadingUpdate || isLoadingUpdated}>
//           <Form
//             form={form}
//             name="basic"
//             labelCol={{
//               span: 4,
//             }}
//             wrapperCol={{
//               span: 20,
//             }}
//             initialValues={{
//               remember: true,
//             }}
//             onFinish={onUpdateContact}
//             autoComplete="on"
//           >
//             <Form.Item
//               label="Mã liên hệ"
//               name="_id"
//               rules={[
//                 {
//                   required: true,
//                   message: "Please input user id!",
//                 },
//               ]}
//             >
//               {/* <InputComponent value = {stateOrdersDetails._id} onChange ={handleOnchangeDetails} name="_id"/> */}
//               <span>{stateContactsDetails._id}</span>
//             </Form.Item>
//             <Form.Item
//               label="Tên người gửi"
//               name="name"
//               rules={[
//                 {
//                   required: true,
//                   message: "Please input user name!",
//                 },
//               ]}
//             >
//               {/* <InputComponent value = {stateOrdersDetails.name} onChange ={handleOnchangeDetails} name="name"/> */}
//               <span>{stateContactsDetails.name}</span>
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
//               {/* <InputComponent value = {stateOrdersDetails.address} onChange ={handleOnchangeDetails} name="address"/> */}
//               <span>{stateContactsDetails.email}</span>
//             </Form.Item>

//             <Form.Item
//               label="Điện thoại"
//               name="phone"
//               rules={[
//                 {
//                   required: true,
//                   message: "Please input user address!",
//                 },
//               ]}
//             >
//               {/* <InputComponent value = {stateOrdersDetails.phone} onChange ={handleOnchangeDetails} name="phone"/> */}
//               <span>{stateContactsDetails.phone}</span>
//             </Form.Item>

//             <Form.Item
//               label="Nội dung"
//               name="message"
//               rules={[
//                 {
//                   required: true,
//                   message: "Please input user address!",
//                 },
//               ]}
//             >
//               {/* <InputComponent value = {(stateOrdersDetails.totalPrice).toLocaleString()} onChange ={handleOnchangeDetails} name="totalPrice"/> */}
//               <span>{stateContactsDetails.message}</span>
//             </Form.Item>

//             <Form.Item
//               label="Giải quyết"
//               name="isExplain"
//               rules={[
//                 {
//                   required: true,
//                   message: "Please input isExplain!",
//                 },
//               ]}
//             >
//               {/* <InputComponent
//                 value={stateContactsDetails.isExplain}
//                 onChange={handleOnchangeDetails}
//                 name="isExplain"
//               /> */}
//               <Radio.Group onChange={onChange} value={valueIsExplain}>
//                 <Radio value={false}>False</Radio>
//                 <Radio value={true}>True</Radio>
//               </Radio.Group>
//             </Form.Item>

//             <Form.Item
//               label="Ngày gửi"
//               name="createdAt"
//               rules={[
//                 {
//                   required: true,
//                   message: "Please input is Admin!",
//                 },
//               ]}
//             >
//               {/* <InputComponent value = {stateOrdersDetails.createdAt} onChange ={handleOnchangeDetails} name="createdAt"/> */}
//               <span>{stateContactsDetails?.createdAt}</span>
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
//         title="Xóa liên hệ"
//         open={isModalOpenDelete}
//         onCancel={handleCancelDelete}
//         onOk={() => handleDeleteContact(rowSelected)}
//       >
//         <Loading isLoading={isLoadingDeleted}>
//           <div>Bạn có chắc xóa liên hệ này không?</div>
//         </Loading>
//       </ModalComponent>
//     </div>
//   );
// };

// export default AdminContact;

import React, { useEffect, useRef, useState } from "react";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  FormOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import TableComponent from "../TableComponent/TableComponent";
import { Button, Form, Radio, Space, Switch } from "antd";
import * as message from "../../components/Message/Message";
import InputComponent from "../InputComponent/InputComponent";
import { useMutationHook } from "../../hooks/useMutationHook";
import Loading from "../../components/Loading/Loading";
import { useQuery } from "@tanstack/react-query";
import DrawerComponent from "../DrawerComponent/DrawerComponent";
import { useSelector } from "react-redux";
import ModalComponent from "../ModalComponent/ModalComponent";
import * as ContactService from "../../services/ContactService";
import PieChartComponent from "./PieChartComponent";
import AdminHeader from "../AdminHeader/AdminHeader";
import moment from "moment";

const AdminContact = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rowSelected, setRowSelected] = useState("");
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const user = useSelector((state) => state?.user);
  const [valueIsExplain, setValueIsExplain] = useState("false");

  const searchInput = useRef(null);

  const [stateContactsDetails, setStateContactDetails] = useState({
    id: "",
    name: "",
    email: "",
    phone: "",
    message: "",
    isExplain: "",
    createdAt: "",
  });

  const [form] = Form.useForm();

  const mutationUpdate = useMutationHook((data) => {
    const { id, token, ...rests } = data;
    const res = ContactService.updateContact(id, token, { ...rests });
    return res;
  });

  const mutationDeleted = useMutationHook((data) => {
    const { id, token } = data;
    const res = ContactService.deleteContact(id, token);
    return res;
  });

  const handleDeleteContact = async (rowSelected) => {
    mutationDeleted.mutate(
      { id: rowSelected, token: user?.access_token },
      {
        onSuccess: () => {
          queryContact.refetch();
        },
      }
    );
  };

  // const mutationDeletedMany = useMutationHook(
  //   (data) => {
  //     const {
  //       token, ...ids
  //     } = data
  //     const res = UserService.deleteManyUser(
  //       ids,
  //       token)
  //     return res
  //   },
  // )

  const getAllContact = async () => {
    const res = await ContactService.getAllContact();
    return res;
  };

  const fetchGetDetailsContact = async (rowSelected) => {
    const res = await ContactService.getDetailContact(rowSelected);
    if (res?.data) {
      setStateContactDetails({
        _id: res?.data?._id,
        name: res?.data?.name,
        email: res?.data?.email,
        phone: res?.data?.phone,
        message: res?.data?.message,
        isExplain: res?.data?.isExplain,
        createdAt: res?.data?.createdAt,
      });
      setValueIsExplain(res?.data?.isExplain);
    }
    setIsLoadingUpdate(false);
  };

  useEffect(() => {
    if (!isModalOpen) {
      form.setFieldsValue(stateContactsDetails);
    }
  }, [form, stateContactsDetails, isModalOpen]);

  useEffect(() => {
    if (rowSelected && isOpenDrawer) {
      setIsLoadingUpdate(true);
      fetchGetDetailsContact(rowSelected);
    }
  }, [rowSelected, isOpenDrawer]);

  const handleDetailsOrder = () => {
    setIsOpenDrawer(true);
  };

  const handleDeleteManyUser = (ids) => {
    // mutationDeletedMany.mutate({ ids: ids, token: user?.access_token }, {
    //   onSettled: () => {
    //     queryUser.refetch()
    //   }
    // })
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
  //  const { data: dataDeletedMany, isLoading: isLoadingDeletedMany, isSuccess: isSuccessDelectedMany, isError: isErrorDeletedMany } = mutationDeletedMany

  const queryContact = useQuery({
    queryKey: ["contacts"],
    queryFn: getAllContact,
  });

  const { isLoading: isLoadingOrder, data: contacts } = queryContact;

  const renderAction = () => {
    return (
      <div className="d-flex gap-2">
        <DeleteOutlined
          style={{ fontSize: "20px", cursor: "pointer" }}
          onClick={() => setIsModalOpenDelete(true)}
        />
        <FormOutlined
          style={{ fontSize: "20px", cursor: "pointer" }}
          onClick={handleDetailsOrder}
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
      title: "Tên ",
      dataIndex: "name",
      render: (text) => <a>{text}</a>,
      sorter: (a, b) => a.name.length - b.name.length,
      ...getColumnSearchProps("name"),
    },
    {
      title: "Điện thoại",
      dataIndex: "phone",
      sorter: (a, b) => a.phone.length - b.phone.length,
      ...getColumnSearchProps("phone"),
    },
    {
      title: "Nội dung",
      dataIndex: "message",
      sorter: (a, b) => a.message.length - b.message.length,
      ...getColumnSearchProps("message"),
    },
    {
      title: "Đã giải quyết",
      dataIndex: "isExplain",
      sorter: (a, b) => a.isExplain - b.isExplain,
      ...getColumnSearchProps("isExplain"),
      filters: [
        {
          text: "True",
          value: true,
        },
        {
          text: "False",
          value: false,
        },
      ],
      onFilter: (value, record) => {
        if (value === true) {
          return record.isExplain.type.render.name === "CheckCircleOutlined";
        }
        return record.isExplain.type.render.name === "CloseCircleOutlined";
      },
    },
    {
      title: "Hành động",
      dataIndex: "action",
      render: renderAction,
    },
  ];
  const dataTable =
    contacts?.data?.length &&
    contacts?.data?.map((contact) => {
      return {
        ...contact,
        key: contact._id,
        isExplain: contact?.isExplain ? (
          <CheckCircleOutlined style={{ fontSize: "20px" }} />
        ) : (
          <CloseCircleOutlined style={{ fontSize: "20px" }} />
        ),
        name: contact?.name,
        phone: contact?.phone,
        message: contact?.message,
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

  // useEffect(() => {
  //   if (isSuccessDelectedMany && dataDeletedMany?.status === 'OK') {
  //     message.success()
  //     handleCancelDelete()
  //   } else if (isErrorDeletedMany) {
  //     message.error()
  //   }
  // }, [isSuccessDelectedMany])

  const handleCancelDelete = () => {
    setIsModalOpenDelete(false);
  };

  // const handleOnchangeDetails = (e) => {
  //   setStateContactDetails({
  //     ...stateContactsDetails,
  //     [e.target.name]: e.target.value,
  //   });
  // };

  const onUpdateContact = () => {
    mutationUpdate.mutate(
      { id: rowSelected, token: user?.access_token, isExplain: valueIsExplain },
      {
        onSettled: () => {
          queryContact.refetch();
        },
      }
    );
  };
  const onChange = (e) => {
    setValueIsExplain(e);
  };

  return (
    <div>
      <AdminHeader textHeader={"Quản lý liên hệ"} />
      <div style={{ width: "200px", height: "200px" }}>
        <PieChartComponent data={contacts?.data} />
      </div>

      <div style={{ marginTop: "20px" }}>
        <TableComponent
          handleDeleteMany={handleDeleteManyUser}
          columns={columns}
          isLoading={isLoadingOrder}
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
        title="Chi tiết liên hệ"
        // isOpen={isOpenDrawer}
        onClose={() => setIsOpenDrawer(false)}
        width="90%"
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
            onFinish={onUpdateContact}
            autoComplete="on"
          >
            <Form.Item
              label="Mã liên hệ"
              name="_id"
              rules={[
                {
                  required: true,
                  message: "Please input user id!",
                },
              ]}
            >
              {/* <InputComponent value = {stateOrdersDetails._id} onChange ={handleOnchangeDetails} name="_id"/> */}
              <span>{stateContactsDetails._id}</span>
            </Form.Item>
            <Form.Item
              label="Tên người gửi"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Please input user name!",
                },
              ]}
            >
              {/* <InputComponent value = {stateOrdersDetails.name} onChange ={handleOnchangeDetails} name="name"/> */}
              <span>{stateContactsDetails.name}</span>
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
              {/* <InputComponent value = {stateOrdersDetails.address} onChange ={handleOnchangeDetails} name="address"/> */}
              <span>{stateContactsDetails.email}</span>
            </Form.Item>

            <Form.Item
              label="Điện thoại"
              name="phone"
              rules={[
                {
                  required: true,
                  message: "Please input user address!",
                },
              ]}
            >
              {/* <InputComponent value = {stateOrdersDetails.phone} onChange ={handleOnchangeDetails} name="phone"/> */}
              <span>{stateContactsDetails.phone}</span>
            </Form.Item>

            <Form.Item
              label="Nội dung"
              name="message"
              rules={[
                {
                  required: true,
                  message: "Please input user address!",
                },
              ]}
            >
              {/* <InputComponent value = {(stateOrdersDetails.totalPrice).toLocaleString()} onChange ={handleOnchangeDetails} name="totalPrice"/> */}
              <span>{stateContactsDetails.message}</span>
            </Form.Item>

            <Form.Item
              label="Giải quyết"
              name="isExplain"
              rules={[
                {
                  required: true,
                  message: "Please input isExplain!",
                },
              ]}
            >
              {/* <InputComponent
                value={stateContactsDetails.isExplain}
                onChange={handleOnchangeDetails}
                name="isExplain"
              /> */}
              <Radio.Group onChange={onChange} value={valueIsExplain}>
                <Radio value={false}>False</Radio>
                <Radio value={true}>True</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              label="Ngày gửi"
              name="createdAt"
              rules={[
                {
                  required: true,
                  message: "Please input is Admin!",
                },
              ]}
            >
              {/* <InputComponent value = {stateOrdersDetails.createdAt} onChange ={handleOnchangeDetails} name="createdAt"/> */}
              <span>{stateContactsDetails?.createdAt}</span>
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
        title="Xóa liên hệ"
        open={isModalOpenDelete}
        onCancel={handleCancelDelete}
        onOk={() => handleDeleteContact(rowSelected)}
      >
        <Loading isLoading={isLoadingDeleted}>
          <div>Bạn có chắc xóa liên hệ này không?</div>
        </Loading>
      </ModalComponent>

      <ModalComponent
        title="Chi tiết liên hệ"
        open={isOpenDrawer}
        onCancel={() => setIsOpenDrawer(false)}
        footer={null}
      >
        <Loading isLoading={isLoadingUpdate || isLoadingUpdated}>
          <Form
            form={form}
            name="basic"
            labelCol={{
              span: 6,
            }}
            wrapperCol={{
              span: 18,
            }}
            initialValues={{
              remember: true,
            }}
            onFinish={onUpdateContact}
            autoComplete="on"
          >
            <Form.Item label="Tên người gửi" name="name">
              {/* <InputComponent value = {stateOrdersDetails.name} onChange ={handleOnchangeDetails} name="name"/> */}
              <span>{stateContactsDetails.name}</span>
            </Form.Item>

            <Form.Item label="Email" name="email">
              {/* <InputComponent value = {stateOrdersDetails.address} onChange ={handleOnchangeDetails} name="address"/> */}
              <span>{stateContactsDetails.email}</span>
            </Form.Item>

            <Form.Item label="Điện thoại" name="phone">
              {/* <InputComponent value = {stateOrdersDetails.phone} onChange ={handleOnchangeDetails} name="phone"/> */}
              <span>{stateContactsDetails.phone}</span>
            </Form.Item>

            <Form.Item label="Nội dung" name="message">
              {/* <InputComponent value = {(stateOrdersDetails.totalPrice).toLocaleString()} onChange ={handleOnchangeDetails} name="totalPrice"/> */}
              <span>{stateContactsDetails.message}</span>
            </Form.Item>

            <Form.Item label="Giải quyết" name="isExplain">
              {/* <InputComponent
                value={stateContactsDetails.isExplain}
                onChange={handleOnchangeDetails}
                name="isExplain"
              /> */}
              <Switch checked={valueIsExplain} onChange={onChange} />
            </Form.Item>

            <Form.Item
              label="Ngày gửi"
              name="createdAt"
              rules={[
                {
                  message: "Please input is Admin!",
                },
              ]}
            >
              {/* <InputComponent value = {stateOrdersDetails.createdAt} onChange ={handleOnchangeDetails} name="createdAt"/> */}
              <span>
                {" "}
                {moment(stateContactsDetails?.createdAt).format(
                  "hh:mm DD/MM/YYYY"
                )}
              </span>
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

export default AdminContact;

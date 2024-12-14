/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { ButtonAddUser, WrapperAvatar } from "./style";
import {
  DeleteOutlined,
  FormOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import TableComponent from "../TableComponent/TableComponent";
import { Button, Form, Input, Select, Space } from "antd";
import * as message from "../../components/Message/Message";
import InputComponent from "../InputComponent/InputComponent";
import { renderOptions } from "../../utils";
import * as ProductService from "../../services/ProductService";
import * as SliderService from "../../services/SliderService";
import { useMutationHook } from "../../hooks/useMutationHook";
import Loading from "../../components/Loading/Loading";
import { useQuery } from "@tanstack/react-query";
import DrawerComponent from "../DrawerComponent/DrawerComponent";
import { useSelector } from "react-redux";
import ModalComponent from "../ModalComponent/ModalComponent";
import PieChartComponent from "./PieChartComponent";
import AdminHeader from "../AdminHeader/AdminHeader";

const AdminSlider = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rowSelected, setRowSelected] = useState("");
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const [urlImage, setUrlImage] = useState();
  const user = useSelector((state) => state?.user);
  const searchInput = useRef(null);
  const [stateProduct, setStateProduct] = useState({
    image: "",
    type: "",
    newType: "",
  });
  const [stateProductDetails, setStateProductDetails] = useState({
    id: "",
    image: "",
    type: "",
    createdAt: "",
  });

  const [form] = Form.useForm();

  const mutation = useMutationHook((data) => {
    const { token, ...rests } = data;
    const res = SliderService.createSlider(token, { ...rests });
    return res;
  });
  const mutationUpdate = useMutationHook((data) => {
    const { id, token, ...rests } = data;
    const res = SliderService.updateImageSlider(id, token, { ...rests });
    return res;
  });

  const mutationDeleted = useMutationHook((data) => {
    const { id, token } = data;
    const res = SliderService.deleteSlider(id, token);
    return res;
  });

  const mutationDeletedMany = useMutationHook((data) => {
    const { token, ...ids } = data;
    const res = ProductService.deleteManyProduct(ids, token);
    return res;
  });

  const getAllSlider = async () => {
    const res = await SliderService.getAllSlider();
    return res;
  };

  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct();
    return res;
  };

  const fetchGetDetailSlider = async (rowSelected) => {
    const res = await SliderService.getDetailImageSlider(rowSelected);
    if (res?.data) {
      setStateProductDetails({
        _id: res?.data?._id,
        image: res?.data?.image,
        type: res?.data?.type,
      });
      setUrlImage(res?.data?.image);
    }
    setIsLoadingUpdate(false);
  };

  useEffect(() => {
    if (!isModalOpen) {
      form.setFieldsValue(stateProductDetails);
    } else {
      form.setFieldsValue(stateProduct);
    }
  }, [form, stateProductDetails, isModalOpen]);

  useEffect(() => {
    if (rowSelected && isOpenDrawer) {
      setIsLoadingUpdate(true);
      fetchGetDetailSlider(rowSelected);
    }
  }, [rowSelected, isOpenDrawer]);

  const handleDetailsProduct = () => {
    setIsOpenDrawer(true);
  };

  const { data, isLoading, isSuccess, isError } = mutation;
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
    isSuccess: isSuccessDelectedMany,
    isError: isErrorDeletedMany,
  } = mutationDeletedMany;

  const typeProduct = useQuery({
    queryKey: ["type-product"],
    queryFn: fetchAllTypeProduct,
  });
  const querySlider = useQuery({
    queryKey: ["sliders"],
    queryFn: getAllSlider,
  });

  const { isLoading: isLoadingProducts, data: sliders } = querySlider;
  const renderAction = () => {
    return (
      <div className="d-flex gap-2">
        <DeleteOutlined
          style={{ fontSize: "20px", cursor: "pointer" }}
          onClick={() => setIsModalOpenDelete(true)}
        />
        <FormOutlined
          style={{ fontSize: "20px", cursor: "pointer" }}
          onClick={handleDetailsProduct}
        />
      </div>
    );
  };

  const handleSearch = (confirm, dataIndex) => {
    confirm();
  };
  const handleReset = (clearFilters, confirm) => {
    clearFilters();
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

  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "image",
      render: (text, record) => (
        <img
          src={record.image}
          alt="Product "
          style={{ width: "50px", height: "50px" }}
        />
      ),
    },

    {
      title: "Loại",
      dataIndex: "type",
      sorter: (a, b) => a.type.length - b.type.length,
      ...getColumnSearchProps("type"),
    },
    {
      title: "Hành động",
      dataIndex: "action",
      render: renderAction,
    },
  ];
  const dataTable =
    sliders?.data?.length &&
    sliders?.data?.map((slider) => {
      return {
        ...slider,
        key: slider._id,
        image: slider.image,
        type: slider.type,
      };
    });

  useEffect(() => {
    if (!isModalOpen && !isOpenDrawer) {
      setUrlImage();
    }
  }, [isModalOpen, isOpenDrawer]);

  useEffect(() => {
    if (isSuccess && data?.status === "OK") {
      message.success();
      handleCancel();
    } else if (isError) {
      message.error();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isSuccessDelected && dataDeleted?.status === "OK") {
      message.success();
      handleCancelDelete();
    } else if (isErrorDeleted) {
      message.error();
    }
  }, [isSuccessDelected]);

  useEffect(() => {
    if (isSuccessDelectedMany && dataDeletedMany?.status === "OK") {
      message.success();
      handleCancelDelete();
    } else if (isErrorDeletedMany) {
      message.error();
    }
  }, [isSuccessDelectedMany]);

  const handleCloseDrawer = () => {
    setIsOpenDrawer(false);
    setStateProductDetails({
      _id: "",
      image: "",
      type: "",
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

  const handleCancelDelete = () => {
    setIsModalOpenDelete(false);
  };

  const handleDeleteImage = () => {
    mutationDeleted.mutate(
      { id: rowSelected, token: user?.access_token },
      {
        onSettled: () => {
          querySlider.refetch();
        },
      }
    );
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setStateProduct({
      image: "",
      type: "",
    });
    form.resetFields();
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

  const onFinish = () => {
    mutation.mutate(
      {
        token: user?.access_token,
        type:
          stateProduct.type === "add_type"
            ? stateProduct.newType
            : stateProduct.type,
        image: urlImage,
      },
      {
        onSettled: () => {
          querySlider.refetch();
        },
      }
    );
  };

  const handleOnchange = (e) => {
    setStateProduct({
      ...stateProduct,
      [e.target.name]: e.target.value,
    });
  };

  const handleOnchangeDetails = (e) => {
    setStateProductDetails({
      ...stateProductDetails,
      [e.target.name]: e.target.value,
    });
  };

  const onUpdateProduct = () => {
    mutationUpdate.mutate(
      {
        id: rowSelected,
        token: user?.access_token,
        ...stateProductDetails,
        image: urlImage,
      },
      {
        onSettled: () => {
          querySlider.refetch();
        },
      }
    );
  };

  const handleChangeSelect = (value) => {
    setStateProduct({
      ...stateProduct,
      type: value,
    });
  };
  const handleChangeSelectDetails = (value) => {
    setStateProductDetails({
      ...stateProductDetails,
      type: value,
    });
  };

  return (
    <div>
      <AdminHeader textHeader={"Quản lý hình ảnh"} />
      <div style={{ width: "200px", height: "200px" }}>
        <PieChartComponent data={sliders?.data} />
      </div>
      <div style={{ marginTop: "10px" }}>
        <ButtonAddUser onClick={() => setIsModalOpen(true)}>
          <PlusOutlined />
        </ButtonAddUser>
      </div>
      <div style={{ marginTop: "20px" }}>
        <TableComponent
          columns={columns}
          isLoading={isLoadingProducts}
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
      <ModalComponent
        forceRender
        title="Tạo slider"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Loading isLoading={isLoading}>
          <Form
            name="basic"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            onFinish={onFinish}
            autoComplete="on"
            form={form}
          >
            <Form.Item
              label="Loại hình ảnh"
              name="type"
              rules={[{ required: true, message: "Please input your type!" }]}
            >
              <Select
                name="type"
                value={stateProduct.type}
                onChange={handleChangeSelect}
                options={renderOptions(typeProduct?.data?.data)}
              />
            </Form.Item>
            {stateProduct.type === "add_type" && (
              <Form.Item
                label="New type"
                name="newType"
                rules={[{ required: true, message: "Please input your type!" }]}
              >
                <InputComponent
                  value={stateProduct.newType}
                  onChange={handleOnchange}
                  name="newType"
                />
              </Form.Item>
            )}

            <Form.Item label="Hình ảnh">
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
            <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Thêm
              </Button>
            </Form.Item>
          </Form>
        </Loading>
      </ModalComponent>
      <DrawerComponent
        title="Chi tiết hình ảnh"
        onClose={() => setIsOpenDrawer(false)}
        width="90%"
      >
        <Loading isLoading={isLoadingUpdate || isLoadingUpdated}>
          <Form
            name="basic"
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 22 }}
            onFinish={onUpdateProduct}
            autoComplete="on"
            form={form}
          >
            <Form.Item
              label="Mã hình ảnh"
              name="_id"
              rules={[{ required: true, message: "Please input your name!" }]}
            >
              <InputComponent
                value={stateProductDetails?._id}
                onChange={handleOnchangeDetails}
                name="_id"
              />
            </Form.Item>

            <Form.Item
              label="Loại hình ảnh"
              name="type"
              rules={[{ required: true, message: "Please input your type!" }]}
            >
              <Select
                name="type"
                value={stateProductDetails.type}
                onChange={handleChangeSelectDetails}
                options={renderOptions(typeProduct?.data?.data)}
              />
            </Form.Item>
            <Form.Item
              label="Hình ảnh"
              name="image"
              rules={[
                { required: true, message: "Please input your count image!" },
              ]}
            >
              <WrapperAvatar onChange={handleImageUpload} maxCount={1}>
                <Button>Select File</Button>
                {stateProductDetails?.image && (
                  <img
                    src={stateProductDetails?.image}
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
            <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Apply
              </Button>
            </Form.Item>
          </Form>
        </Loading>
      </DrawerComponent>
      <ModalComponent
        title="Xóa hình ảnh"
        open={isModalOpenDelete}
        onCancel={handleCancelDelete}
        onOk={handleDeleteImage}
      >
        <Loading isLoading={isLoadingDeleted}>
          <div>Bạn có chắc xóa hình ảnh này không?</div>
        </Loading>
      </ModalComponent>

      <ModalComponent
        title="Chi tiết hình ảnh"
        open={isOpenDrawer}
        onCancel={() => setIsOpenDrawer(false)}
        footer={null}
      >
        <Loading isLoading={isLoadingUpdate || isLoadingUpdated}>
          <Form
            name="basic"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            onFinish={onUpdateProduct}
            autoComplete="on"
            form={form}
          >
            <Form.Item
              label="Loại hình ảnh"
              name="type"
              rules={[{ required: true, message: "Please input your type!" }]}
            >
              <Select
                name="type"
                value={stateProductDetails.type}
                onChange={handleChangeSelectDetails}
                options={renderOptions(typeProduct?.data?.data)}
              />
            </Form.Item>
            <Form.Item label="Hình ảnh">
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
            <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
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

export default AdminSlider;

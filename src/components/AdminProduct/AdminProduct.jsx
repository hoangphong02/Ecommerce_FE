/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { ButtonAddUser, WrapperAvatar } from "./style";
import {
  DeleteOutlined,
  FormOutlined,
  PlusOutlined,
  SearchOutlined,
  TagOutlined,
} from "@ant-design/icons";
import moment from "moment";
import TableComponent from "../TableComponent/TableComponent";
import { Button, Form, Select, Space, Badge, Input } from "antd";
import * as message from "../../components/Message/Message";
import InputComponent from "../InputComponent/InputComponent";
import { getBase64, renderOptions } from "../../utils";
import * as ProductService from "../../services/ProductService";
import * as DiscountService from "../../services/DiscountService";
import { useMutationHook } from "../../hooks/useMutationHook";
import Loading from "../../components/Loading/Loading";
import { useQuery } from "@tanstack/react-query";
import DrawerComponent from "../DrawerComponent/DrawerComponent";
import { useSelector } from "react-redux";
import ModalComponent from "../ModalComponent/ModalComponent";
import PieChartComponent from "./PieChartComponent";
import AdminHeader from "../AdminHeader/AdminHeader";

const AdminProduct = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rowSelected, setRowSelected] = useState("");
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const [isOpenModalDiscount, setIsOpenModalDiscount] = useState(false);
  const [valueDiscount, setValueDiscount] = useState(0);
  const [dateStart, setDateStart] = useState(new Date());
  const [dateEnd, setDateEnd] = useState(new Date());
  const [dataTable, setDataTable] = useState([]);
  const user = useSelector((state) => state?.user);
  const [urlImage, setUrlImage] = useState();
  const searchInput = useRef(null);
  const inittial = () => ({
    name: "",
    price: "",
    description: "",
    rating: "",
    image: "",
    type: "",
    countInStock: "",
    newType: "",
    discount: "",
    followers: [],
  });
  const [stateProduct, setStateProduct] = useState(inittial());
  const [stateProductDetails, setStateProductDetails] = useState(inittial());
  const [dataProductDiscount, setDataProductDiscount] = useState({
    name: "",
    image: "",
    followers: [],
  });

  const [form] = Form.useForm();

  const mutation = useMutationHook((data) => {
    const {
      name,
      price,
      description,
      rating,
      image,
      type,
      countInStock,
      discount,
    } = data;
    const res = ProductService.createProduct({
      name,
      price,
      description,
      rating,
      image,
      type,
      countInStock,
      discount,
    });
    return res;
  });

  const mutationCreateDiscount = useMutationHook((data) => {
    const { token, ...rests } = data;
    const res = DiscountService.createDiscount(token, { ...rests });
    return res;
  });
  const mutationUpdate = useMutationHook((data) => {
    const { id, token, ...rests } = data;
    const res = ProductService.updateProduct(id, token, { ...rests });
    return res;
  });
  const mutationUpdateDiscount = useMutationHook((data) => {
    const { id, token, ...rests } = data;
    const res = DiscountService.updateDiscount(id, token, { ...rests });
    return res;
  });

  const mutationDeleted = useMutationHook((data) => {
    const { id, token } = data;
    const res = ProductService.deleteProduct(id, token);
    return res;
  });

  const mutationDeletedMany = useMutationHook((data) => {
    const { token, ...ids } = data;
    const res = ProductService.deleteManyProduct(ids, token);
    return res;
  });

  const mutationDeleteDiscount = useMutationHook((data) => {
    const { ...ids } = data;
    const res = DiscountService.deleteManyDiscount(ids);
    return res;
  });

  const getAllProducts = async () => {
    const res = await ProductService.getAllProduct("", 1000);
    return res;
  };
  const getAllDiscounts = async () => {
    const res = await DiscountService.getAllDiscount();
    return res;
  };
  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct();
    return res;
  };

  const fetchGetDetailsProduct = async (rowSelected) => {
    const res = await ProductService.getDetailProduct(rowSelected);
    if (res?.data) {
      setStateProductDetails({
        name: res?.data?.name,
        price: res?.data?.price,
        description: res?.data?.description,
        rating: res?.data?.rating,
        image: res?.data?.image,
        type: res?.data?.type,
        countInStock: res?.data?.countInStock,
        discount: res?.data?.discount,
        followers: res?.data?.followers,
      });
      setUrlImage(res?.data?.image);
    }
    setIsLoadingUpdate(false);
  };

  const fetchGetDetailsProductDiscount = async (rowSelected) => {
    const res = await ProductService.getDetailProduct(rowSelected);
    if (res?.data) {
      setDataProductDiscount({
        name: res?.data?.name,
        image: res?.data?.image,
        followers: res?.data?.followers,
      });
      setUrlImage(res?.data?.image);
    }
  };

  useEffect(() => {
    if (!isModalOpen) {
      form.setFieldsValue(stateProductDetails);
    } else {
      form.setFieldsValue(inittial());
    }
  }, [form, stateProductDetails, isModalOpen]);

  useEffect(() => {
    if (rowSelected && isOpenDrawer) {
      setIsLoadingUpdate(true);
      fetchGetDetailsProduct(rowSelected);
    }
  }, [rowSelected, isOpenDrawer]);
  useEffect(() => {
    if (rowSelected && isOpenModalDiscount) {
      fetchGetDetailsProductDiscount(rowSelected);
    }
  }, [rowSelected, isOpenModalDiscount]);

  const handleDetailsProduct = () => {
    setIsOpenDrawer(true);
  };

  const handleDeleteManyProduct = (ids) => {
    mutationDeletedMany.mutate(
      { ids: ids, token: user?.access_token },
      {
        onSettled: () => {
          queryProduct.refetch();
        },
      }
    );
  };
  const autoDeleteManyDiscount = (ids) => {
    mutationDeleteDiscount.mutate(
      { ids: ids },
      {
        onSettled: () => {
          queryDiscount.refetch();
        },
      }
    );
  };

  const { data, isLoading, isSuccess } = mutation;
  const { isSuccess: isSuccessCreateDiscount, isError: isErrorCreateDiscount } =
    mutationCreateDiscount;

  const {
    data: dataUpdated,
    isLoading: isLoadingUpdated,
    isSuccess: isSuccessUpdated,
    isError: isErrorUpdated,
  } = mutationUpdate;
  const { isSuccess: isSuccessUpdateDiscount, isError: isErrorUpdateDiscount } =
    mutationUpdateDiscount;
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
  const queryProduct = useQuery({
    queryKey: ["products"],
    queryFn: getAllProducts,
  });

  const { isLoading: isLoadingProducts, data: products } = queryProduct;
  const queryDiscount = useQuery({
    queryKey: ["discounts"],
    queryFn: getAllDiscounts,
  });

  const { data: discounts } = queryDiscount;

  useEffect(() => {
    let arrDiscount = [];
    const currentDate = new Date();
    if (discounts?.data?.length) {
      discounts?.data?.forEach((item) => {
        const endDiscountDate = new Date(item.endDiscount);
        if (currentDate > endDiscountDate) {
          arrDiscount.push(item._id);
        }
      });
    }
    if (arrDiscount?.length) {
      autoDeleteManyDiscount(arrDiscount);
    }
  }, [discounts?.data]);

  const renderAction = (id) => {
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

        {discounts?.data?.length &&
        discounts?.data?.find((item) => item?.product === id) ? (
          <Badge
            count={discounts?.data?.find((item) => item?.product === id)?.value}
          >
            <TagOutlined
              style={{ fontSize: "20px", cursor: "pointer" }}
              onClick={() => setIsOpenModalDiscount(true)}
            />
          </Badge>
        ) : (
          <TagOutlined
            style={{ fontSize: "20px", cursor: "pointer" }}
            onClick={() => setIsOpenModalDiscount(true)}
          />
        )}
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
      title: "Tên",
      dataIndex: "name",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      render: (text, record) => (
        <img
          src={record.image}
          alt="Product img"
          style={{ width: "50px", height: "50px" }}
        />
      ),
    },
    {
      title: "Giá",
      dataIndex: "price",
      sorter: (a, b) => a.price - b.price,
      filters: [
        {
          text: ">= 50.000",
          value: ">=",
        },
        {
          text: "<= 50.000",
          value: "<=",
        },
      ],
      onFilter: (value, record) => {
        if (value === ">=") {
          return record.price >= 50000;
        }
        return record.price <= 50000;
      },
    },
    {
      title: "Tồn kho",
      dataIndex: "countInStock",
    },
    {
      title: "Loại",
      dataIndex: "type",
    },
    {
      title: "Hành động",
      dataIndex: "action",
      render: (text, record) => renderAction(record?._id),
    },
  ];

  useEffect(() => {
    if (products?.data?.length) {
      const data = products?.data?.map((product) => {
        return { ...product, key: product._id };
      });
      setDataTable(data);
    }
  }, [products]);

  useEffect(() => {
    if (isSuccess && data?.status === "OK") {
      message.success();
      handleCancel();
    } else if (data?.status === "ERR") {
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
      name: "",
      price: "",
      description: "",
      rating: "",
      image: "",
      type: "",
      countInStock: "",
      discount: "",
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

  const handleCancelDelete = () => {
    setIsModalOpenDelete(false);
  };
  const handleCancelDiscount = () => {
    setIsOpenModalDiscount(false);
    setDateStart(new Date());
    setDateEnd(new Date());
    setValueDiscount(0);
  };
  const handleDeleteProduct = () => {
    mutationDeleted.mutate(
      { id: rowSelected, token: user?.access_token },
      {
        onSettled: () => {
          queryProduct.refetch();
        },
      }
    );
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setStateProduct({
      name: "",
      price: "",
      description: "",
      rating: "",
      image: "",
      type: "",
      countInStock: "",
      discount: "",
    });
    form.resetFields();
  };

  const onFinish = () => {
    const params = {
      name: stateProduct.name,
      price: stateProduct.price,
      description: stateProduct.description,
      rating: 5,
      image: urlImage,
      type:
        stateProduct.type === "add_type"
          ? stateProduct.newType
          : stateProduct.type,
      countInStock: stateProduct.countInStock,
      discount: stateProduct.discount,
    };
    mutation.mutate(params, {
      onSettled: () => {
        queryProduct.refetch();
      },
    });
  };
  const onFinishDiscount = () => {
    if (discounts?.data?.find((pro) => pro?.product === rowSelected)) {
      if (valueDiscount <= 0) {
        message.error("Phần trăm phải lớn hơn 0");
      } else {
        mutationUpdateDiscount.mutate(
          {
            id: discounts?.data?.find((pro) => pro?.product === rowSelected)
              ?._id,
            token: user?.access_token,
            value: valueDiscount,
            name: dataProductDiscount?.name,
            image: dataProductDiscount?.image,
            followers: dataProductDiscount?.followers,
            startDiscount: dateStart,
            endDiscount: dateEnd,
          },
          {
            onSettled: () => {
              queryDiscount.refetch();
            },
          }
        );
      }
    } else {
      mutationCreateDiscount.mutate(
        {
          token: user?.access_token,
          product: rowSelected,
          name: dataProductDiscount?.name,
          image: dataProductDiscount?.image,
          followers: dataProductDiscount?.followers,
          value: valueDiscount,
          startDiscount: dateStart,
          endDiscount: dateEnd,
        },
        {
          onSettled: () => {
            queryDiscount.refetch();
          },
        }
      );
    }
  };
  useEffect(() => {
    if (isSuccessUpdateDiscount) {
      message.success("Cập nhật giảm giá thành công");
      handleCancelDiscount();
    }
  }, [isSuccessUpdateDiscount]);
  useEffect(() => {
    if (isSuccessCreateDiscount) {
      message.success("Tạo giảm giá thành công");
      handleCancelDiscount();
    }
  }, [isSuccessCreateDiscount]);
  useEffect(() => {
    if (isErrorCreateDiscount) {
      message.error("Tạo giảm giá thất bại");
    }
  }, [isErrorCreateDiscount]);

  useEffect(() => {
    if (isErrorUpdateDiscount) {
      message.error("Cập nhật thất bại");
    }
  }, [isErrorUpdateDiscount]);

  useEffect(() => {
    if (!isModalOpen && !isOpenDrawer) {
      setUrlImage();
    }
  }, [isModalOpen, isOpenDrawer]);

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

  const handleOnchangeAvatarDetails = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setStateProductDetails({
      ...stateProductDetails,
      image: file.preview,
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
          queryProduct.refetch();
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
  useEffect(() => {
    if (isOpenModalDiscount === true) {
      if (discounts?.data?.find((pro) => pro?.product === rowSelected)) {
        const startDiscount = discounts?.data?.find(
          (pro) => pro?.product === rowSelected
        )?.startDiscount;
        const endDiscount = discounts?.data?.find(
          (pro) => pro?.product === rowSelected
        )?.endDiscount;
        setValueDiscount(
          discounts?.data?.find((pro) => pro?.product === rowSelected)?.value
        );
        setDateStart(moment(startDiscount).format("YYYY-MM-DD"));
        setDateEnd(moment(endDiscount).format("YYYY-MM-DD"));
      }
    }
  }, [isOpenModalDiscount, discounts]);
  return (
    <div>
      <AdminHeader textHeader={"Quản lý sản phẩm"} />
      <div
        style={{
          width: "200px",
          height: "200px",
          textAlign: "center",
          marginBottom: "30px",
        }}
      >
        <PieChartComponent data={products?.data} />
        <p style={{ fontSize: "15px", fontWeight: "bold", color: "#fff" }}>
          Số lượng sản phẩm
        </p>
      </div>

      <div style={{ marginTop: "10px" }}>
        <ButtonAddUser onClick={() => setIsModalOpen(true)}>
          <PlusOutlined />
        </ButtonAddUser>
      </div>
      <div style={{ marginTop: "20px" }}>
        <TableComponent
          handleDeleteMany={handleDeleteManyProduct}
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
        title="Tạo sản phẩm"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={1000}
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
              label="Tên sản phẩm"
              name="name"
              rules={[{ required: true, message: "Please input your name!" }]}
            >
              <InputComponent
                value={stateProduct["name"]}
                onChange={handleOnchange}
                name="name"
              />
            </Form.Item>

            <Form.Item
              label="Loại sản phẩm"
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
            <Form.Item
              label="Số lượng "
              name="countInStock"
              rules={[
                { required: true, message: "Please input your count inStock!" },
              ]}
            >
              <InputComponent
                value={stateProduct.countInStock}
                onChange={handleOnchange}
                name="countInStock"
              />
            </Form.Item>
            <Form.Item
              label="Giá"
              name="price"
              rules={[
                { required: true, message: "Please input your count price!" },
              ]}
            >
              <InputComponent
                value={stateProduct.price}
                onChange={handleOnchange}
                name="price"
              />
            </Form.Item>
            <Form.Item
              label="Mô tả"
              name="description"
              rules={[
                {
                  required: true,
                  message: "Please input your description!",
                },
              ]}
            >
              <InputComponent
                value={stateProduct.description}
                onChange={handleOnchange}
                name="description"
              />
            </Form.Item>
            <Form.Item
              label="Giảm giá"
              name="discount"
              rules={[
                {
                  required: true,
                  message: "Please input your discount of product!",
                },
              ]}
            >
              <InputComponent
                value={stateProduct.discount}
                onChange={handleOnchange}
                name="discount"
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
            <Form.Item
              wrapperCol={{ offset: 20, span: 16 }}
              style={{ marginTop: "16px" }}
            >
              <Button type="primary" htmlType="submit">
                Thêm
              </Button>
            </Form.Item>
          </Form>
        </Loading>
      </ModalComponent>
      <DrawerComponent
        title="Chi tiết sản phẩm"
        onClose={() => setIsOpenDrawer(false)}
        width="90%"
      >
        <Loading isLoading={isLoadingUpdate || isLoadingUpdated}>
          <Form
            name="basic"
            labelCol={{ span: 3 }}
            wrapperCol={{ span: 21 }}
            onFinish={onUpdateProduct}
            autoComplete="on"
            form={form}
          >
            <Form.Item
              label="Tên sản phẩm"
              name="name"
              rules={[{ required: true, message: "Please input your name!" }]}
            >
              <InputComponent
                value={stateProductDetails["name"]}
                onChange={handleOnchangeDetails}
                name="name"
              />
            </Form.Item>

            <Form.Item
              label="Loại sản phẩm"
              name="type"
              rules={[{ required: true, message: "Please input your type!" }]}
            >
              <InputComponent
                value={stateProductDetails["type"]}
                onChange={handleOnchangeDetails}
                name="type"
              />
            </Form.Item>
            <Form.Item
              label="Số lượng trong kho"
              name="countInStock"
              rules={[
                { required: true, message: "Please input your count inStock!" },
              ]}
            >
              <InputComponent
                value={stateProductDetails.countInStock}
                onChange={handleOnchangeDetails}
                name="countInStock"
              />
            </Form.Item>
            <Form.Item
              label="Giá"
              name="price"
              rules={[
                { required: true, message: "Please input your count price!" },
              ]}
            >
              <InputComponent
                value={stateProductDetails.price}
                onChange={handleOnchangeDetails}
                name="price"
              />
            </Form.Item>
            <Form.Item
              label="Mô tả"
              name="description"
              rules={[
                {
                  required: true,
                  message: "Please input your count description!",
                },
              ]}
            >
              <InputComponent
                value={stateProductDetails.description}
                onChange={handleOnchangeDetails}
                name="description"
              />
            </Form.Item>

            <Form.Item
              label="Giảm giá"
              name="discount"
              rules={[
                {
                  required: true,
                  message: "Please input your discount of product!",
                },
              ]}
            >
              <InputComponent
                value={stateProductDetails.discount}
                onChange={handleOnchangeDetails}
                name="discount"
              />
            </Form.Item>
            <Form.Item
              label="Hình ảnh"
              name="image"
              rules={[
                { required: true, message: "Please input your count image!" },
              ]}
            >
              <WrapperAvatar
                onChange={handleOnchangeAvatarDetails}
                maxCount={1}
              >
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
                Cập nhật
              </Button>
            </Form.Item>
          </Form>
        </Loading>
      </DrawerComponent>
      <ModalComponent
        title="Xóa sản phẩm"
        open={isModalOpenDelete}
        onCancel={handleCancelDelete}
        onOk={handleDeleteProduct}
      >
        <Loading isLoading={isLoadingDeleted}>
          <div>Bạn có chắc xóa sản phẩm này không?</div>
        </Loading>
      </ModalComponent>

      <ModalComponent
        title="Chi tiết sản phẩm"
        open={isOpenDrawer}
        onCancel={() => setIsOpenDrawer(false)}
        footer={null}
        width={1000}
      >
        <Loading isLoading={isLoadingUpdate || isLoadingUpdated}>
          <Form
            name="basic"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            onFinish={onUpdateProduct}
            autoComplete="on"
            form={form}
          >
            <Form.Item
              label="Tên sản phẩm"
              name="name"
              rules={[{ required: true, message: "Please input your name!" }]}
            >
              <InputComponent
                value={stateProductDetails["name"]}
                onChange={handleOnchangeDetails}
                name="name"
              />
            </Form.Item>

            <Form.Item
              label="Loại sản phẩm"
              name="type"
              rules={[{ required: true, message: "Please input your type!" }]}
            >
              <InputComponent
                value={stateProductDetails["type"]}
                onChange={handleOnchangeDetails}
                name="type"
              />
            </Form.Item>
            <Form.Item
              label="Số lượng trong kho"
              name="countInStock"
              rules={[
                { required: true, message: "Please input your count inStock!" },
              ]}
            >
              <InputComponent
                value={stateProductDetails.countInStock}
                onChange={handleOnchangeDetails}
                name="countInStock"
              />
            </Form.Item>
            <Form.Item
              label="Giá"
              name="price"
              rules={[
                { required: true, message: "Please input your count price!" },
              ]}
            >
              <InputComponent
                value={stateProductDetails.price}
                onChange={handleOnchangeDetails}
                name="price"
              />
            </Form.Item>
            <Form.Item
              label="Mô tả"
              name="description"
              rules={[
                {
                  required: true,
                  message: "Please input your count description!",
                },
              ]}
            >
              <InputComponent
                value={stateProductDetails.description}
                onChange={handleOnchangeDetails}
                name="description"
              />
            </Form.Item>

            <Form.Item
              label="Giảm giá"
              name="discount"
              rules={[
                {
                  required: true,
                  message: "Please input your discount of product!",
                },
              ]}
            >
              <InputComponent
                value={stateProductDetails.discount}
                onChange={handleOnchangeDetails}
                name="discount"
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

      <ModalComponent
        title="Tạo giảm giá"
        open={isOpenModalDiscount}
        onCancel={handleCancelDiscount}
        onOk={onFinishDiscount}
      >
        <div style={{ display: "flex", gap: "10px" }}>
          <label htmlFor="">Phần trăm giảm giá:</label>
          <input
            type="number"
            min={0}
            max={100}
            value={valueDiscount}
            onChange={(e) => setValueDiscount(e.target.value)}
          />
        </div>
        <div style={{ display: "flex", gap: "30px", padding: " 30px 0" }}>
          <div style={{ display: "flex", gap: "5px" }}>
            <label htmlFor="">Ngày bắt đầu:</label>
            <input
              type="date"
              value={dateStart}
              onChange={(e) => setDateStart(e?.target?.value)}
            />
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <label htmlFor="">Ngày kết thúc:</label>
            <input
              type="date"
              value={dateEnd}
              onChange={(e) => setDateEnd(e?.target?.value)}
            />
          </div>
        </div>
      </ModalComponent>
    </div>
  );
};

export default AdminProduct;

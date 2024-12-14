/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { ButtonAddUser } from "./style";
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
import * as PostService from "../../services/PostService";
import { useMutationHook } from "../../hooks/useMutationHook";
import Loading from "../../components/Loading/Loading";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import ModalComponent from "../ModalComponent/ModalComponent";
import AdminHeader from "../AdminHeader/AdminHeader";

const AdminPost = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rowSelected, setRowSelected] = useState("");
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const [imageUpload, setImageUpload] = useState([]);
  const [imageUploadDetail, setImageUploadDetail] = useState([]);
  const user = useSelector((state) => state?.user);
  const searchInput = useRef(null);
  const [statePost, setStatePost] = useState({
    title: "",
    content: "",
    type: "",
    likeCount: [],
    image: [],
    imageUL: "",
  });
  const [statePostDetails, setStatePostDetails] = useState({
    id: "",
    title: "",
    content: "",
    type: "",
    likeCount: [],
    image: [],
    imageUL: "",
    createAt: "",
  });
  const [statePostDetailsUpdate, setStatePostDetailsUpdate] = useState({
    title: "",
    content: "",
    type: "",
    likeCount: [],
    image: [],
  });

  useEffect(() => {
    setStatePostDetailsUpdate({
      title: statePostDetails?.title,
      content: statePostDetails?.content,
      type: statePostDetails?.type,
      likeCount: statePostDetails?.likeCount,
      image: imageUploadDetail,
    });
  }, [statePostDetails, imageUploadDetail]);

  const [form] = Form.useForm();

  const mutation = useMutationHook((data) => {
    const { token, ...rests } = data;
    const res = PostService.createPost(token, { ...rests });
    return res;
  });
  const mutationUpdate = useMutationHook((data) => {
    const { id, token, ...rests } = data;
    const res = PostService.updatePost(id, token, { ...rests });
    return res;
  });

  const mutationDeleted = useMutationHook((data) => {
    const { id, token } = data;
    const res = PostService.deletePost(id, token);
    return res;
  });
  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct();
    return res;
  };

  const typeProduct = useQuery({
    queryKey: ["type-product"],
    queryFn: fetchAllTypeProduct,
  });

  const getAllPost = async () => {
    const res = await PostService.getAllPost();
    return res;
  };

  const fetchGetDetailPost = async (rowSelected) => {
    const res = await PostService.getDetailPost(rowSelected);
    if (res?.data) {
      setStatePostDetails({
        _id: res?.data?._id,
        title: res?.data?.title,
        content: res?.data?.content,
        type: res?.data?.type,
        image: res?.data?.image,
      });
      setImageUploadDetail(res?.data?.image);
    }
    setIsLoadingUpdate(false);
  };

  useEffect(() => {
    if (!isModalOpen) {
      form.setFieldsValue(statePostDetails);
    } else {
      form.setFieldsValue(statePost);
    }
  }, [form, statePostDetails, isModalOpen]);

  useEffect(() => {
    if (rowSelected && isOpenDrawer) {
      setIsLoadingUpdate(true);
      fetchGetDetailPost(rowSelected);
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

  const queryPost = useQuery({ queryKey: ["posts"], queryFn: getAllPost });

  const { isLoading: isLoadingProducts, data: posts } = queryPost;
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
      title: "Tiêu đề",
      dataIndex: "title",
    },

    {
      title: "Nội dung",
      dataIndex: "content",
      ...getColumnSearchProps("content"),
    },
    {
      title: "Loại bài đăng",
      dataIndex: "type",
      ...getColumnSearchProps("type"),
    },
    {
      title: "Hành động",
      dataIndex: "action",
      render: renderAction,
    },
  ];
  const dataTable =
    posts?.data?.length &&
    posts?.data?.map((post) => {
      return {
        ...post,
        key: post._id,
        title: post?.title,
        content: post?.content,
      };
    });

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

  const handleCloseDrawer = () => {
    setIsOpenDrawer(false);
    setStatePostDetails({
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
          queryPost.refetch();
        },
      }
    );
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setStatePost({
      title: "",
      content: "",
    });
    setImageUpload([]);
    form.resetFields();
  };

  const onFinish = () => {
    mutation.mutate(
      {
        token: user?.access_token,
        title: statePost?.title,
        content: statePost?.content,
        type: statePost?.type,
        likeCount: statePost?.likeCount,
        image: imageUpload,
      },
      {
        onSettled: () => {
          queryPost.refetch();
        },
      }
    );
  };

  const handleOnchange = (e) => {
    setStatePost({
      ...statePost,
      [e.target.name]: e.target.value,
    });
  };

  const handleOnchangeDetails = (e) => {
    setStatePostDetails({
      ...statePostDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleOnchangeAvatar = async (fileList) => {
    const uploadPreset = "clockWeb";
    const uploadUrl = "https://api.cloudinary.com/v1_1/dhfbsejrh/image/upload";

    const images = [];
    for (const file of fileList) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);

      try {
        const response = await fetch(uploadUrl, {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        if (data.secure_url) {
          images.push({ urlImage: data.secure_url });
        }
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }

    setImageUpload(images);
  };

  const handleOnchangeAvatarDetails = async (fileList) => {
    const uploadPreset = "clockWeb";
    const uploadUrl = "https://api.cloudinary.com/v1_1/dhfbsejrh/image/upload";

    const images = [];
    for (const file of Array.from(fileList)) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);

      try {
        const response = await fetch(uploadUrl, {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        if (data.secure_url) {
          images.push({ urlImage: data.secure_url });
        }
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }

    setImageUploadDetail([...imageUploadDetail, ...images]);
  };

  const handleRemoveImage = (url) => {
    setImageUpload((imageUpload) =>
      imageUpload?.filter((item) => item.urlImage !== url)
    );
  };
  const onUpdatePost = () => {
    mutationUpdate.mutate(
      { id: rowSelected, token: user?.access_token, ...statePostDetailsUpdate },
      {
        onSettled: () => {
          queryPost.refetch();
        },
      }
    );
  };

  const handleDeleteImageUploadDetail = (url) => {
    let ArrImage = [];
    ArrImage = imageUploadDetail.filter((image) => image?.urlImage !== url);
    setImageUploadDetail(ArrImage);
  };

  const handleChangeSelect = (value) => {
    setStatePost({
      ...statePost,
      type: value,
    });
  };
  const handleChangeSelectDetail = (value) => {
    setStatePostDetails({
      ...statePostDetails,
      type: value,
    });
  };

  useEffect(() => {
    if (!isModalOpen && !isOpenDrawer) {
      setImageUpload([]);
    }
  }, [isOpenDrawer, isModalOpen]);

  return (
    <div>
      <AdminHeader textHeader={"Quản lý bài đăng"} />
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
        title="Tạo bài đăng"
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
              label="Tiêu đề"
              name="title"
              rules={[{ required: true, message: "Please input your title!" }]}
            >
              <InputComponent
                value={statePost.title}
                onChange={handleOnchange}
                name="title"
              />
            </Form.Item>
            <Form.Item
              label="Nội dung"
              name="content"
              rules={[
                { required: true, message: "Please input your content!" },
              ]}
            >
              <InputComponent
                value={statePost.content}
                onChange={handleOnchange}
                name="content"
              />
            </Form.Item>
            <Form.Item
              label="Loại bài đăng"
              name="type"
              rules={[{ required: true, message: "Please input your type!" }]}
            >
              <Select
                name="type"
                // defaultValue="lucy"
                // style={{ width: 120 }}
                value={statePost.type}
                onChange={handleChangeSelect}
                options={renderOptions(typeProduct?.data?.data)}
              />
            </Form.Item>
            {statePost.type === "add_type" && (
              <Form.Item
                label="New type"
                name="newType"
                rules={[{ required: true, message: "Please input your type!" }]}
              >
                <InputComponent
                  value={statePost.newType}
                  onChange={handleOnchange}
                  name="newType"
                />
              </Form.Item>
            )}

            <Form.Item label="Thêm hình ảnh">
              <Input
                type="file"
                id="exampleCustomFileBrowser1"
                name="image"
                multiple
                onChange={(e) => handleOnchangeAvatar(e.target.files)}
              />
            </Form.Item>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {!!imageUpload?.length &&
                imageUpload.map((item, index) => {
                  return (
                    <div
                      className="image-preview"
                      style={{
                        marginTop: "40px",
                      }}
                    >
                      <img
                        src={item.urlImage}
                        alt=""
                        style={{ height: "100px", width: "auto" }}
                      />
                      <div
                        className="image-preview-remove"
                        onClick={() => handleRemoveImage(item.urlImage)}
                      >
                        x
                      </div>
                    </div>
                  );
                })}
            </div>

            <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
              <Button
                type="button"
                onClick={onFinish}
                style={{ background: "blue", color: "#fff" }}
              >
                Thêm
              </Button>
            </Form.Item>
          </Form>
        </Loading>
      </ModalComponent>
      <ModalComponent
        title="Xóa bài đăng"
        open={isModalOpenDelete}
        onCancel={handleCancelDelete}
        onOk={handleDeleteImage}
      >
        <Loading isLoading={isLoadingDeleted}>
          <div>Bạn có chắc xóa bài đăng này không?</div>
        </Loading>
      </ModalComponent>

      <ModalComponent
        forceRender
        title="Chi tiết bài đăng"
        open={isOpenDrawer}
        onCancel={() => setIsOpenDrawer(false)}
        footer={null}
      >
        <Loading isLoading={isLoadingUpdate || isLoadingUpdated}>
          <Form
            name="basic"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            onFinish={onUpdatePost}
            autoComplete="on"
            form={form}
          >
            <Form.Item
              label="Tiêu đề"
              name="title"
              rules={[{ required: true, message: "Please input your title!" }]}
            >
              <InputComponent
                value={statePostDetails?.title}
                onChange={handleOnchangeDetails}
                name="title"
              />
            </Form.Item>
            <Form.Item
              label="Nội dung"
              name="content"
              rules={[
                { required: true, message: "Please input your content!" },
              ]}
            >
              <InputComponent
                value={statePostDetails?.content}
                onChange={handleOnchangeDetails}
                name="content"
              />
            </Form.Item>

            <Form.Item
              label="Loại bài đăng"
              name="type"
              rules={[{ required: true, message: "Please input your type!" }]}
            >
              <Select
                name="type"
                value={statePostDetails.type}
                onChange={handleChangeSelectDetail}
                options={renderOptions(typeProduct?.data?.data)}
              />
            </Form.Item>
            {statePostDetails.type === "add_type" && (
              <Form.Item
                label="New type"
                name="newType"
                rules={[{ required: true, message: "Please input your type!" }]}
              >
                <InputComponent
                  value={statePostDetails.newType}
                  onChange={handleOnchangeDetails}
                  name="newType"
                />
              </Form.Item>
            )}

            <Form.Item label="Thêm hình ảnh">
              <Input
                type="file"
                id="exampleCustomFileBrowser2"
                multiple
                onChange={(e) => handleOnchangeAvatarDetails(e.target.files)}
              />
            </Form.Item>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {!!imageUploadDetail?.length &&
                imageUploadDetail.map((item, index) => {
                  return (
                    <div
                      className="image-preview"
                      style={{
                        marginTop: "40px",
                      }}
                    >
                      <img
                        src={item.urlImage}
                        alt=""
                        style={{ height: "100px", width: "auto" }}
                      />
                      <div
                        className="image-preview-remove"
                        onClick={() =>
                          handleDeleteImageUploadDetail(item.urlImage)
                        }
                      >
                        x
                      </div>
                    </div>
                  );
                })}
            </div>
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

export default AdminPost;

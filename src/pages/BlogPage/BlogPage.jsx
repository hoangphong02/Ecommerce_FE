import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import * as PostService from "../../services/PostService";
import { Button, Image, Input, message } from "antd";
import {
  CommentOutlined,
  HeartFilled,
  HeartOutlined,
  MessageFilled,
  SendOutlined,
} from "@ant-design/icons";
import { WrapperBlogItem, WrapperContentComment, WrapperModal } from "./style";
import logo from "../../assets/images/logo-decoration.png";
import { useMutationHook } from "../../hooks/useMutationHook";
import { useSelector } from "react-redux";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { useLocation, useNavigate } from "react-router";

const BlogPage = () => {
  const user = useSelector((state) => state?.user);
  const [postLiked, setPostLiked] = useState([]);
  const [likeCount, setLikeCount] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [idPostByOpenModal, setIdPostByOpenModal] = useState("");
  const [numberComments, setNumberComments] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const getAllPost = async () => {
    const res = await PostService.getAllPost();
    return res;
  };

  //like
  const queryPost = useQuery({ queryKey: ["posts"], queryFn: getAllPost });
  const { data: posts } = queryPost;

  useEffect(() => {
    const newLikeCount = [];
    posts?.data?.forEach((post) => {
      newLikeCount.push({
        id: post?._id,
        like: post?.likeCount?.length,
      });
    });
    setLikeCount(newLikeCount);
  }, [posts]);

  const custumDay = (dateTimeStr) => {
    const dateTime = new Date(dateTimeStr);
    const day = dateTime.getDate();
    const month = dateTime.getMonth() + 1;
    const year = dateTime.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const mutationGetPostLiked = useMutationHook((data) => {
    const { token, ...rests } = data;
    const res = PostService.getPostLiked(token, { ...rests });
    return res;
  });
  const {
    data: dataGet,
    isLoading: isLoadingGet,
    isSuccess: isSuccessGet,
    isError: isErrorGet,
  } = mutationGetPostLiked;

  const getPostLiked = () => {
    mutationGetPostLiked.mutate({
      token: user?.access_token,
      userId: user?.id,
    });
  };
  useEffect(() => {
    getPostLiked();
  }, [user?.id]);

  useEffect(() => {
    if (dataGet?.status === "OK") {
      setPostLiked(dataGet?.data);
    }
  }, [dataGet]);
  useEffect(() => {}, [postLiked]);

  const mutationDeletedLike = useMutationHook((data) => {
    const { id, token } = data;
    const res = PostService.deleteLike(id, token);
    return res;
  });
  const {
    data: dataDeleteLike,
    isLoading: isLoadingDelete,
    isSuccess: isSuccessDelete,
    isError: isErrorDelete,
  } = mutationDeletedLike;
  const mutationAddLike = useMutationHook((data) => {
    const { id, token, ...rests } = data;
    const res = PostService.addLike(id, token, { ...rests });
    return res;
  });
  const {
    data: dataAddLike,
    isLoading: isLoadingUpdated,
    isSuccess: isSuccessUpdated,
    isError: isErrorUpdated,
  } = mutationAddLike;

  const onAddLike = (idPost) => {
    mutationAddLike.mutate({
      id: idPost,
      token: user?.access_token,
      likeCount: [
        {
          name: user?.name,
          user: user?.id,
        },
      ],
    });
  };
  const onDeleteLike = () => {
    mutationDeletedLike.mutate({ id: user?.id, token: user?.access_token }, {});
  };
  const isPostLike = (postId) => {
    if (postLiked?.includes(postId)) {
      return true;
    } else {
      return false;
    }
  };
  const likePost = (postId) => {
    setLikeCount((prev) => {
      const updatedLikeCount = prev?.map((item) => {
        if (item.id === postId) {
          return { ...item, like: item.like + 1 };
        }
        return item;
      });
      return updatedLikeCount;
    });
  };
  const deleteLikePost = (postId) => {
    setLikeCount((prev) => {
      const updatedLikeCount = prev?.map((item) => {
        if (item.id === postId) {
          return { ...item, like: item?.like > 0 ? item?.like - 1 : 0 };
        }
        return item;
      });
      return updatedLikeCount;
    });
  };

  const onHandleLike = (idPost) => {
    if (!user?.id) {
      navigate("/sign-in", { state: location?.pathname });
    } else {
      if (isPostLike(idPost) === false) {
        onAddLike(idPost);
        likePost(idPost);
      } else {
        onDeleteLike();
        deleteLikePost(idPost);
      }
    }
  };

  useEffect(() => {
    if (dataAddLike?.status === "OK" || dataDeleteLike?.status === "OK") {
      getPostLiked();
    }
  }, [dataAddLike, dataDeleteLike]);

  //Comment
  const fetchMyComments = async () => {
    if (idPostByOpenModal) {
      const res = await PostService.getCommentByIdPost(
        idPostByOpenModal,
        user?.access_token
      );
      return res.data;
    }
  };

  const queryComment = useQuery({
    queryKey: ["comment"],
    queryFn: fetchMyComments,
  });
  const { isLoading, data: commentQuery } = queryComment;

  const fetchCommentByIdPost = async (id) => {
    const res = await PostService.getCommentByIdPost(id, user?.access_token);
    if (res?.data) {
      setComments(res?.data);
    }
  };

  const handleComment = (id) => {
    fetchCommentByIdPost(id);
    setIsModalOpen(true);
    setIdPostByOpenModal(id);
  };
  const handleCancel = () => {
    setContent("");
    setIsModalOpen(false);
  };
  const mutationCreateComment = useMutationHook((data) => {
    const { token, ...rests } = data;
    const res = PostService.createComment({ ...rests }, token);
    return res;
  });
  const {
    data: dataAdd,
    isLoading: isLoadingAdd,
    isSuccess: isSuccsess,
    isError: isError,
  } = mutationCreateComment;

  const onChangeContentComment = (e) => {
    setContent(e.target.value);
  };
  const handleCreateComment = () => {
    if (!user?.id) {
      navigate("/sign-in", { state: location?.pathname });
    } else {
      if (user?.access_token) {
        mutationCreateComment.mutate({
          token: user?.access_token,
          name: user?.name,
          avatar: user?.avatar,
          content: content,
          user: user?.id,
          post: idPostByOpenModal,
        });
      }
    }
  };

  useEffect(() => {
    if (dataAdd?.status === "OK") {
      message.success("Bình luận thành công");
      setContent("");
      fetchCommentByIdPost(idPostByOpenModal);
    } else {
      if (dataAdd?.status === "ERR") {
        message.error("Bình luận thất bại");
      }
    }
  }, [dataAdd, isSuccsess, isError]);
  useEffect(() => {
    if (idPostByOpenModal) {
      fetchMyComments();
    }
  }, [idPostByOpenModal]);
  useEffect(() => {
    if (commentQuery) {
      fetchCommentByIdPost(idPostByOpenModal);
    }
  }, [commentQuery]);

  const mutationDeletedComment = useMutationHook((data) => {
    const { id, token } = data;
    const res = PostService.deleteComment(id, token);
    return res;
  });
  const {
    data: dataDeletedComment,
    isLoading: isLoadingDeleted,
    isSuccess: isSuccessDelectedComment,
    isError: isErrorDeletedComment,
  } = mutationDeletedComment;
  const handleDeleteComment = (id) => {
    mutationDeletedComment.mutate(
      { id: id, token: user?.access_token },
      {
        onSettled: () => {
          queryComment.refetch();
        },
      }
    );
  };
  useEffect(() => {
    if (dataDeletedComment?.status === "OK") {
      message.success("Xóa bình luận thành công");
    } else {
      if (dataDeletedComment?.status === "ERR") {
        message.error("Xóa bình luận thất bại");
      }
    }
  }, [dataDeletedComment, isSuccessDelectedComment, isErrorDeletedComment]);

  const getAllComment = async () => {
    const res = await PostService.getAllComment();
    return res;
  };
  const queryGetAllComments = useQuery({
    queryKey: ["allComment"],
    queryFn: getAllComment,
  });
  const { isLoading: isLoadingOrder, data: allComment } = queryGetAllComments;

  useEffect(() => {
    const postCounts = {};
    allComment?.data?.forEach((comment) => {
      const postId = comment.post;
      postCounts[postId] = (postCounts[postId] || 0) + 1;
    });

    // Chuyển đổi đối tượng postCounts thành mảng kết quả
    const result = Object.entries(postCounts).map(([id, count]) => ({
      id,
      count,
    }));

    setNumberComments(result);
  }, [allComment]);

  const getNumberCommentById = (id) => {
    const data = numberComments?.find((item) => item?.id === id);
    return data?.count;
  };

  const handleNavigateType = (type) => {
    navigate(
      `/product/${type
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        ?.replace(/ /g, "_")}`,
      { state: type }
    );
  };
  return (
    <>
      <div style={{ background: "#fff" }}>
        <div style={{ width: "100%" }}>
          <div style={{ textAlign: "center" }}>
            <img src={logo} style={{ height: "200px" }} />
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            {posts?.data &&
              posts?.data?.map((post) => {
                return (
                  <WrapperBlogItem key={post?.type} className="container">
                    <div>
                      <div style={{ padding: "20px" }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <p
                            style={{
                              fontSize: "25px",
                              fontWeight: "bold",
                              fontFamily: "inherit",
                            }}
                          >
                            {post.title}
                          </p>{" "}
                          <p>
                            <em>{custumDay(post?.createdAt)}</em>
                          </p>
                        </div>
                        <div>{post?.content}</div>
                        <div
                          onClick={() => handleNavigateType(post?.type)}
                          style={{
                            cursor: "pointer",
                            color: "rgb(18 103 160)",
                          }}
                        >
                          Xem vật phẩm {post?.type}
                        </div>
                      </div>
                      {post?.image?.length ? (
                        <div
                          style={{
                            height: "500px",
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          {post?.image && post?.image?.length === 1 ? (
                            <Image
                              src={post.image[0]?.urlImage}
                              style={{ width: "100%", height: "100%" }}
                              preview={true}
                            />
                          ) : (
                            post?.image && (
                              <>
                                <Image
                                  key={post.image[0]?.id}
                                  src={post.image[0]?.urlImage}
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                  }}
                                />
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                  }}
                                >
                                  {post?.image
                                    ?.slice(1)
                                    ?.map((image, index) => (
                                      <Image
                                        key={image?.id}
                                        src={image?.urlImage}
                                        style={{
                                          width: "100%",
                                          height: `calc(500px / ${
                                            post?.image?.length - 1
                                          })`,
                                          objectFit: "cover",
                                        }}
                                      />
                                    ))}
                                </div>
                              </>
                            )
                          )}
                        </div>
                      ) : null}

                      <div style={{ padding: "30px" }}>
                        <div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <p
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                fontSize: "20px",
                              }}
                            >
                              {likeCount?.length
                                ? likeCount?.find(
                                    (item) => item?.id === post?._id
                                  )?.like
                                : post?.likeCount?.length}{" "}
                              <HeartFilled
                                style={{ padding: "0 4px", color: "#d60055" }}
                              />
                            </p>
                            <p
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                fontSize: "20px",
                              }}
                            >
                              {getNumberCommentById(post?._id) > 0
                                ? getNumberCommentById(post?._id)
                                : 0}{" "}
                              <MessageFilled
                                style={{ padding: "0 4px", color: "#1f82f3" }}
                              />
                            </p>
                          </div>
                          <div
                            style={{
                              borderTop: "1px solid #333",
                              paddingTop: "20px",
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Button
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                fontSize: "30px",
                                border: "none",
                                background: "none",
                              }}
                              onClick={() => onHandleLike(post?._id)}
                            >
                              {isPostLike(post?._id) === false ? (
                                <HeartOutlined />
                              ) : (
                                <HeartFilled style={{ color: "#d60055" }} />
                              )}
                            </Button>
                            <Button
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                fontSize: "30px",
                                border: "none",
                                background: "none",
                              }}
                              onClick={() => handleComment(post?._id)}
                            >
                              <CommentOutlined />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </WrapperBlogItem>
                );
              })}
          </div>
        </div>
      </div>
      <WrapperModal
        title="Bình luận"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={false}
        width={900}
      >
        <div style={{ paddingBottom: "100px" }}>
          {comments?.length > 0 &&
            comments?.map((comment) => {
              return (
                <div
                  style={{
                    margin: " 10px 0 ",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <img
                      src={comment?.avatar}
                      alt="avatar"
                      style={{
                        height: "40px",
                        width: "40px",
                        borderRadius: "50%",
                        margin: "0 10px",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      background: "#f0f2f5",
                      padding: "15px",
                      borderRadius: "15px",
                      width: "689px",
                      overflow: "hidden",
                    }}
                  >
                    <span style={{ fontWeight: "800" }}>{comment?.name}</span>{" "}
                    <span>{custumDay(comment?.createdAt)}</span>
                    <div>{comment?.content} </div>
                    <div style={{ display: "flex", float: "right" }}>
                      {/* {user?.isAdmin ? <ButtonComponent textButton={"Xóa"} onClick={()=>handleDeleteEvaluate(evaluate?._id)}/>:("")} */}
                      <ButtonComponent
                        textButton={"Xóa"}
                        onClick={() => handleDeleteComment(comment?._id)}
                        style={{
                          display:
                            user?.isAdmin === true || user?.id === comment?.user
                              ? "block"
                              : "none",
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
        </div>

        <div
          style={{
            margin: " 10px 0 ",
            display: "flex",
            alignItems: "center",
            position: "absolute",
            bottom: "0",
            background: "#fff",
          }}
        >
          <div>
            <img
              src={user?.avatar}
              alt="avatar"
              style={{
                height: "40px",
                width: "40px",
                borderRadius: "50%",
                margin: "0 10px",
              }}
            />
          </div>
          <WrapperContentComment>
            <Input
              placeholder="Nhập bình luận"
              style={{ background: "none", outline: "none", border: "none" }}
              onChange={onChangeContentComment}
              value={content}
            />
            <div style={{ display: "flex", float: "right" }}>
              {/* {user?.isAdmin ? <ButtonComponent textButton={"Xóa"} onClick={()=>handleDeleteEvaluate(evaluate?._id)}/>:("")} */}
              <ButtonComponent
                disabled={content !== "" ? false : true}
                textButton={<SendOutlined />}
                onClick={handleCreateComment}
              />
            </div>
          </WrapperContentComment>
        </div>
      </WrapperModal>
    </>
  );
};

export default BlogPage;

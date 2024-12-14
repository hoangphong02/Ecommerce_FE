import axios from "axios";
import { axiosJWT } from "./UserService";
export const createPost = async (access_token, data) => {
  const res = await axiosJWT.post(
    `${process.env.REACT_APP_API_URL}/post/create`,
    data,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const getAllPost = async () => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}/post/get-all-post`
  );
  return res.data;
};

export const deletePost = async (id, access_token) => {
  const res = await axiosJWT.delete(
    `${process.env.REACT_APP_API_URL}/post/delete-post/${id}`,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const updatePost = async (id, access_token, data) => {
  const res = await axiosJWT.put(
    `${process.env.REACT_APP_API_URL}/post/update-post/${id}`,
    data,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const getDetailPost = async (id) => {
  const res = await axiosJWT.get(
    `${process.env.REACT_APP_API_URL}/post/get-details-post/${id}`
  );
  return res.data;
};

export const addLike = async (id, access_token, data) => {
  const res = await axiosJWT.put(
    `${process.env.REACT_APP_API_URL}/post/addLike/${id}`,
    data,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const deleteLike = async (id, access_token) => {
  const res = await axiosJWT.delete(
    `${process.env.REACT_APP_API_URL}/post/deleteLike/${id}`,

    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const getPostLiked = async (access_token, data) => {
  const res = await axiosJWT.post(
    `${process.env.REACT_APP_API_URL}/post/get-post-liked`,
    data,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const getLikePost = async (id) => {
  const res = await axiosJWT.get(
    `${process.env.REACT_APP_API_URL}/post/get-like-post/${id}`
  );
  return res.data;
};

export const createComment = async (data, access_token) => {
  const res = await axiosJWT.post(
    `${process.env.REACT_APP_API_URL}/comment/create/${data.user}`,
    data,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const getCommentByIdPost = async (id, access_token) => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}/comment/get-all-comment/${id}`,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const deleteComment = async (id, access_token) => {
  const res = await axiosJWT.delete(
    `${process.env.REACT_APP_API_URL}/comment/delete-comment/${id}`,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const getAllComment = async () => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}/comment/get-all-comment`
  );
  return res.data;
};


import axios from "axios";
import { axiosJWT } from "./UserService";

export const createSlider = async (access_token, data) => {
  const res = await axiosJWT.post(
    `${process.env.REACT_APP_API_URL}/slider/create`,
    data,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const getAllSlider = async () => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}/slider/get-all-slider`
  );
  return res.data;
};

export const deleteSlider = async (id, access_token) => {
  const res = await axiosJWT.delete(
    `${process.env.REACT_APP_API_URL}/slider/delete-image-slider/${id}`,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const getDetailImageSlider = async (id) => {
  const res = await axiosJWT.get(
    `${process.env.REACT_APP_API_URL}/slider/get-details-image/${id}`
  );
  return res.data;
};
export const updateImageSlider = async (id, access_token, data) => {
  const res = await axiosJWT.put(
    `${process.env.REACT_APP_API_URL}/slider/update-image/${id}`,
    data,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

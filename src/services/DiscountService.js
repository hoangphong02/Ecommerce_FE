import axios from "axios";
import { axiosJWT } from "./UserService";

export const createDiscount = async (access_token, data) => {
  const res = await axiosJWT.post(
    `${process.env.REACT_APP_API_URL}/discount/create`,
    data,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const getAllDiscount = async () => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}/discount/get-all-discount`
  );
  return res.data;
};

export const deleteManyDiscount = async (data) => {
  const res = await axiosJWT.post(
    `${process.env.REACT_APP_API_URL}/discount/delete-many-discount`,
    data
  );
  return res.data;
};

export const updateDiscount = async (id, access_token, data) => {
  const res = await axiosJWT.put(
    `${process.env.REACT_APP_API_URL}/discount/update-discount/${id}`,
    data,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};
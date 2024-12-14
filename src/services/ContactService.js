import axios from "axios";
import { axiosJWT } from "./UserService";
export const createContact = async (data, access_token) => {
  const res = await axiosJWT.post(
    `${process.env.REACT_APP_API_URL}/contact/create`,
    data,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const getAllContact = async () => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}/contact/get-all-contact`
  );
  return res.data;
};

export const getDetailContact = async (id) => {
  const res = await axiosJWT.get(
    `${process.env.REACT_APP_API_URL}/contact/get-contact-details/${id}`
    // {
    //   headers: {
    //     token: `Bearer ${access_token}`,
    //   },
    // }
  );
  return res.data;
};

export const updateContact = async (id, access_token, data) => {
  const res = await axiosJWT.put(
    `${process.env.REACT_APP_API_URL}/contact/update-contact/${id}`,
    data,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const deleteContact = async (id, access_token) => {
  const res = await axiosJWT.delete(
    `${process.env.REACT_APP_API_URL}/contact/delete/${id}`,

    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

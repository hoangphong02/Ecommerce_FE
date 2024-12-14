import axios from "axios";
export const axiosJWT = axios.create();
export const createOtp = async (data) => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}/otp/create`,
    data
  );
  return res.data;
};

export const deleteOtp = async (data) => {
  const res = await axiosJWT.post(
    `${process.env.REACT_APP_API_URL}/otp/delete-otp`,
    data
  );
  return res.data;
};

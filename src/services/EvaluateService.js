import { axiosJWT } from "./UserService";
export const createEvaluate = async (data, access_token) => {
  const res = await axiosJWT.post(
    `${process.env.REACT_APP_API_URL}/evaluate/create/${data.user}`,
    data,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const getEvaluateByProductId = async (id, access_token) => {
  const res = await axiosJWT.get(
    `${process.env.REACT_APP_API_URL}/evaluate/get-all-evaluate/${id}`,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const deleteEvaluate = async (id, access_token) => {
  const res = await axiosJWT.delete(
    `${process.env.REACT_APP_API_URL}/evaluate/delete-evaluate/${id}`,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

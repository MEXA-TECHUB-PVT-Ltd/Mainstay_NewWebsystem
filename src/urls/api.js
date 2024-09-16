import axios from "axios";

// * LOCAL SERVER
// export const SOCKET_URL = "http://localhost:5019/";
// export const BASE_URL = "http://localhost:5019/api/";
// export const SOCKET_URL = "https://mainstays-be-new.caprover-demo.mtechub.com/";
// export const BASE_URL =
//   "https://mainstays-be-new.caprover-demo.mtechub.com/api/";

// * HOSTED SERVER
// export const SOCKET_URL = "https://mainstays-be.mtechub.com/";
// export const BASE_URL = "https://mainstays-be.mtechub.com/api/";
export const SOCKET_URL = "https://backend.mainstays.ch/";
export const BASE_URL = "https://backend.mainstays.ch/api/";
// const BASE_URL = 'https://reqsign-be.mtechub.com/'; // Your API base URL
export const SDK = "SNmy_l4VZQ";
export const sdkSECRET = "fQaxd36AZdZPvhJii3wYHzIB36YQsh7MUDrY";

export const get = async (url = {}) => {
  // const queryParams = new URLSearchParams(params);
  const response = await axios.get(`${BASE_URL}${url}`);

  if (!response.data.success) {
    throw new Error(`Error fetching data: ${response.statusText}`);
  }

  // const data = await response.json();

  return response.data;
};

const registerToken = JSON.parse(localStorage.getItem("userData"))?.accessToken;
const loginToken =
  JSON.parse(localStorage.getItem("loginUserData"))?.accessToken || undefined;
const authToken = loginToken;

// console.log("Login Token: ", loginToken);

export const authGet = async (url = {}) => {
  try {
    const response = await axios.get(`${BASE_URL}${url}`, {
      headers: {
        Authorization: `${authToken}`,
      },
    });

    if (!response.data.success) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }

    return response.data;
  } catch (error) {
    throw new Error(`Error fetching data: ${error.message}`);
  }
};

export const universalLinkPost = async (url, data) => {
  // const queryParams = new URLSearchParams(params);
  try {
    const response = await axios.post(`${url}`, data);
    return response.data;
  } catch (error) {
    throw new Error(`Error posting data: ${error.message}`);
  }
};

export const post = async (url, data) => {
  try {
    const response = await axios.post(`${BASE_URL}${url}`, data);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const authPost = async (url, data, token) => {
  const newToken = authToken ? authToken : token;

  try {
    const headers = {
      Authorization: `${newToken}`,
      "Content-Type": "application/json", // Adjust content type if needed
    };
    const response = await axios.post(`${BASE_URL}${url}`, data, { headers });
    return response?.data;
  } catch (error) {
    console.log(error);
    return error.response.data;
  }
};

export const put = async (url, data, token) => {
  const newToken = authToken ? authToken : token;
  try {
    const headers = {
      Authorization: `${newToken}`,
      "Content-Type": "application/json", // Adjust content type if needed
    };
    const response = await axios.put(`${BASE_URL}${url}`, data, { headers });
    return response?.data;
  } catch (error) {
    console.log(error);
    return error.response.data;
  }
};

export const imgPut = async (url, data) => {
  try {
    const headers = {
      Authorization: `${authToken}`,
      "Content-Type": "multipart/form-data", // Adjust content type if needed
    };
    const response = await axios.put(`${BASE_URL}${url}`, data, { headers });
    return response?.data;
  } catch (error) {
    console.log(error);
    return error.response.data;
  }
};

export const deleteReq = async (url, data) => {
  try {
    const response = await axios.delete(`${BASE_URL}${url}`);
    return response.data;
  } catch (error) {
    throw new Error(`Error posting data: ${error.message}`);
  }
};

export const authDelete = async (url, data) => {
  try {
    const headers = {
      Authorization: `${authToken}`,
      "Content-Type": "multipart/form-data", // Adjust content type if needed
    };
    const response = await axios.delete(`${BASE_URL}${url}`, { headers });
    return response.data;
  } catch (error) {
    throw new Error(`Error posting data: ${error.message}`);
  }
};
export const postFormData = async (data) => {
  const formData = new FormData();
  formData.append("image", data.image);

  try {
    const response = await axios.post(`${BASE_URL}upload-image`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    throw new Error(`Error posting data: ${error.message}`);
  }
};

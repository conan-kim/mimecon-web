import axios from "axios";
import Logger from "../utils/logger";
import config from "../utils/config";

const axiosInstance = axios.create({
  baseURL: config.API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json;charset=UTF-8",
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    Logger.network(">>>>>>>>>>>>>>> REQUEST", config.baseURL + config.url, config.data);
    return config;
  },
  (error) => {
    console.log("error");
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    Logger.network(
      "<<<<<<<<<<<<<<<< DATA",
      response.request.responseURL,
      response.data
    );
    const { data } = response;
    if (data.result === "fail") {
      return Promise.reject();
    }
    return data?.data;
  },
  (error) => {
    if (error.response) {
      console.log("Response data:", error.response.data);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

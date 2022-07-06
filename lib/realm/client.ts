import axios from "axios";
import pino from "pino";

const logger = pino();

export const createClient = (options = {}) => {
  const instance = axios.create(options);

  instance.interceptors.request.use(
    (config) => {
      const { method, baseURL, url, params, data } = config;

      logger.debug("realm req:", {
        method,
        url: `${baseURL}/${url}`,
        params,
        data,
      });

      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => response.data,
    (error) => Promise.reject(error)
  );

  return instance;
};

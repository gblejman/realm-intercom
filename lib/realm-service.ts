import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import logger from "@/lib/logger";

export const createRealmService = (options: AxiosRequestConfig) => {
  const instance = axios.create(options);

  instance.interceptors.request.use(
    (config) => {
      const { method, baseURL, url, params, data, headers } = config;

      logger.debug(
        {
          method,
          url: `${baseURL}${url}`,
          params,
          data,
          headers,
        },
        "realm req"
      );

      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => response.data,
    (error) => Promise.reject(error)
  );

  const users = {
    me: () =>
      instance.request({
        method: "get",
        url: "/users/me",
      }) as unknown as RealmUser,
    update: ({
      id,
      ...data
    }: {
      id: number | string;
      [key: string]: unknown;
    }) =>
      instance.request({
        method: "post",
        url: `/users/${id}`,
        data,
      }) as unknown as RealmUser,
  };

  const api = {
    users,
  };

  return api;
};

export type RealmService = ReturnType<typeof createRealmService>;

export type RealmUser = {
  id: number;
  email: string;
  full_name: string;
  phone_number: string;
  profile_image: string;
  // will use to JSON.stringify({ intercom_contact_id, intercom_conversation_id }) until actually added
  social_facebook: string;
  intercom_contact_id: string;
  intercom_conversation_id: string;
};

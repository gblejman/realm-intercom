import axios, { AxiosRequestConfig } from "axios";
import pino from "pino";

const logger = pino();

export const createRealmService = (options: AxiosRequestConfig) => {
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

  const users = {
    me: () => instance.request<RealmUser>({ method: "get", url: "/users/me" }),
    update: ({ id, ...data }: { id: number | string; data: unknown }) =>
      instance.request<RealmUser>({
        method: "post",
        url: `/users/${id}`,
        data,
      }),
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

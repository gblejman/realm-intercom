import { createClient } from "./client";
import { TUser } from "./types";

export const createApi = (options = {}) => {
  const instance = createClient(options);

  const users = {
    me: () => instance.request<TUser>({ method: "get", url: "/users/me" }),
    update: ({ id, ...data }: { id: number | string; data: unknown }) =>
      instance.request({ method: "post", url: `/users/${id}`, data }),
  };

  const api = {
    users,
  };

  return api;
};

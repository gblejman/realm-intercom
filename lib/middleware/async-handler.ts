import type { NextApiRequest, NextApiResponse } from "next";
import * as createError from "http-errors";

// @ts-ignore
const buildError = (e) => {
  console.log("handler error", e);

  let error = new createError.InternalServerError();

  if (e.response) {
    // request made, response received with status outside 2xx
    const { statusText, status, data } = e.response;
    error = { status, statusText, ...data };
  } else if (e.request) {
    // request made, no response
    const { statusText, status, data } = e.request;
    error = { status, statusText, ...data };
  } else if (createError.isHttpError(e)) {
    // http error
    // @ts-ignore
    error = e;
  } else {
    // regular exception, use default error
  }

  return error;
};

export const asyncHandler =
  (
    handler: (req: NextApiRequest, res: NextApiResponse) => unknown,
    {
      method,
    }: { method?: "get" | "post" | "put" | "patch" | "delete" | undefined }
  ) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      if (method && method !== req.method?.toLowerCase()) {
        throw new createError.MethodNotAllowed();
      }

      const data = await handler(req, res);
      res.status(200).json(data);
    } catch (e) {
      const error = buildError(e);
      res.status(error.status).json(error);
    }
  };

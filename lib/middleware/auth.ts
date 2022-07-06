import type { NextApiRequest, NextApiResponse } from "next";
import * as jwt from "jsonwebtoken";
import { Unauthorized, InternalServerError, isHttpError } from "http-errors";
import pino from "pino";
import config from "@/config/index";
import { createApi } from "@/lib/realm/api";

const logger = pino();

// Quick check for existing sub claim in decoded token, no verify
export const authN =
  (handler: (req: NextApiRequest, res: NextApiResponse) => unknown) =>
  async (
    req: NextApiRequest & { ctx: { [key: string]: any } },
    res: NextApiResponse
  ) => {
    try {
      const [_scheme, token] = (req.headers.authorization ?? "").split(
        "Bearer "
      );

      if (!token) {
        throw new Unauthorized("Missing Bearer Token");
      }

      let decodedToken;
      try {
        decodedToken = jwt.decode(token);
      } catch (err) {
        throw new Unauthorized("Invalid Token");
      }

      if (!decodedToken || !decodedToken.sub) {
        throw new Unauthorized("Missing claims");
      }

      const realm = createApi({
        baseURL: config.realm.url,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      let user;
      try {
        user = await realm.users.me();
      } catch (e) {
        throw new Unauthorized("Invalid user");
      }

      const defaultValue = JSON.stringify({
        intercom_contact_id: null,
        intercom_conversation_id: null,
      });

      // @ts-ignore
      const mockedUserFields = JSON.parse(user.social_facebook ?? defaultValue);

      // set some context accesible though the request
      req.ctx = {};
      req.ctx.logger = pino();
      req.ctx.realm = realm;
      req.ctx.user = { ...user, ...mockedUserFields };

      return handler(req, res);
    } catch (e) {
      logger.error("auth error", e);

      let error = new InternalServerError();

      if (isHttpError(e)) {
        // @ts-ignore
        error = e;
      }

      return res.status(error.status).json({ message: error.message });
    }
  };

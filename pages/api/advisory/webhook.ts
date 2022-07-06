import type { NextApiRequest, NextApiResponse } from "next";
import pino from "pino";

const logger = pino();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    url,
    method,
    query: { paths = [], ...restQuery },
    body,
  } = req;

  logger.info({ url, method, paths, restQuery, body }, "webhook");

  res.status(200).json({});
};

export default handler;

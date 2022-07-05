import type { NextApiRequest, NextApiResponse } from "next";
import config from "@/config/index";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { env, realm } = config;

  res.status(200).json({ env, realm });
};

export default handler;

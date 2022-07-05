import type { NextApiRequest, NextApiResponse } from "next";
import intercom from "@/lib/intercom";
import { asyncHandler } from "@/lib/middleware/async-handler";
import { authN } from "@/lib/middleware/auth";
import { TUser } from "@/lib/realm/types";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { intercom_conversation_id }: TUser = req.ctx.user;

  return intercom.conversations.find({ id: intercom_conversation_id });
};

export default authN(asyncHandler(handler, { method: "get" }));

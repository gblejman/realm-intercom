import type { NextApiRequest, NextApiResponse } from "next";
import intercom from "@/lib/intercom";
import { asyncHandler } from "@/lib/middleware/async-handler";
import { authN } from "@/lib/middleware/auth";
import { TUser } from "@/lib/realm/types";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id, intercom_conversation_id }: TUser = req.ctx.user;
  const { body, attachment_urls } = req.body;

  return intercom.conversations.replyByIdAsUser({
    id: intercom_conversation_id,
    userId: String(id),
    body,
    attachmentUrls: attachment_urls,
  });
};

export default authN(asyncHandler(handler, { method: "post" }));

import type { NextApiRequest, NextApiResponse } from "next";
import { asyncHandler } from "@/lib/middleware/async-handler";
import { authN } from "@/lib/middleware/auth";
import { RealmUser } from "@/lib/realm-service";
import { AdvisoryService } from "@/lib/advisory-service";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // @ts-ignore
  const user: RealmUser = req.ctx.user;
  // @ts-ignore
  const advisoryService: AdvisoryService = req.ctx.advisoryService;
  const { body, attachment_urls } = req.body;

  return advisoryService.reply({ user, body, attachmentUrls: attachment_urls });
};

export default authN(asyncHandler(handler, { method: "post" }));

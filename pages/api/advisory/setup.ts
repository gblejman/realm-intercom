import type { NextApiRequest, NextApiResponse } from "next";
import { authN } from "@/lib/middleware/auth";
import { asyncHandler } from "@/lib/middleware/async-handler";
import { RealmUser } from "@/lib/realm-service";
import { AdvisoryService } from "@/lib/advisory-service";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // @ts-ignore
  const user: RealmUser = req.ctx.user;
  // @ts-ignore
  const advisoryService: AdvisoryService = req.ctx.advisoryService;

  return advisoryService.setup({ user });
};

export default authN(asyncHandler(handler, { method: "get" }));

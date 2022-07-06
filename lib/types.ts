import type { NextApiRequest } from "next";

export type ExtendedNextApiRequest = NextApiRequest & {
  ctx: { [key: string]: unknown };
};

import { Client } from "intercom-client";
import config from "@/config/index";

/** Authenticated Intercom Client  */
export default new Client({
  tokenAuth: { token: config.intercom.token },
});

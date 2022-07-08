import pino from "pino";
import config from "@/config/index";

export default pino(config.logger);

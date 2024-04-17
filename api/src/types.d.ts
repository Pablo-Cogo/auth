import * as http from "http";
import { userRole } from "./enums/user_role.ts";

declare module "express-serve-static-core" {
  export interface Request extends http.IncomingMessage, Express.Request {
    context: {
      sub?: string;
      role?: userRole;
    };
  }
}

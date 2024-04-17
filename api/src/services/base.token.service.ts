import { userRole } from "@src/enums/user_role";

export interface JwtToken {
  sub?: string;
  role: userRole;
}

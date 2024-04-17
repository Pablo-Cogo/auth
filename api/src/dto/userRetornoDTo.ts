import { TokenDTo } from "./retornoTokenDTo";

type UserDTo = {
  logged?: boolean;
  user_email: string;
  user_name: string;
  avatar_url: string | null;
};

export type RetornoTokenDTo = {
  access_token?: TokenDTo;
  refresh_token?: TokenDTo;
  user: UserDTo;
};

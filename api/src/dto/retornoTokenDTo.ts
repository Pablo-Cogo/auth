enum TypeToken {
  access_token = "access_token",
  refresh_token = "refresh_token",
}

export type TokenDTo = {
  token: string;
  expires_in: string;
};

export interface LoginProps {
  user_email: string;
  user_password: string;
}

export type TokenProps = {
  token: string;
  expires_in: string;
};

export type UserProps = {
  logged?: boolean;
  user_email: string;
  user_name: string;
  avatar_url: string | null;
};

export interface AuthProps {
  access_token: TokenProps;
  refresh_token: TokenProps;
  user: UserProps;
}

export interface ResponseAuthProps {
  userName: string;
  userEmail: string;
  userImage: string | null;
  isLogged: boolean;
}

export interface SignUpMailProps {
  userName: string;
  userEmail: string;
  personPhone?: string;
  userCpf?: string;
  userDate?: string;
  userPassword?: string;
  userConfirmPassword?: string;
  userImage?: string;
}

export interface SignUpMailMasksProps {
  userCpf?: string;
}

export enum UserRole {
  admin = 0,
  employee = 1,
  user = 2,
}

export interface User {
  id?: string;
  userName: string;
  userEmail: string;
  userPassword: string | null;
  userRole: UserRole;
  userImage?: string;
}

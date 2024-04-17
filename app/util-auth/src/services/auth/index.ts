import { ServiceLocator } from "@app/util-common";
import { Http } from "@app/util-request";
import {
  LoginProps,
  AuthProps,
  UserProps,
  ResponseAuthProps,
  SignUpMailProps,
  User,
} from "./types";

export class AuthService {
  private static http = new Http("https://707b-177-69-47-5.ngrok-free.app");
  static async login({
    user_email,
    user_password,
  }: LoginProps): Promise<UserProps | null> {
    const toastService = ServiceLocator.getToastService();

    const response = await this.http
      .post<AuthProps>("/auth/login", {
        user_email,
        user_password,
      })
      .then((response) => {
        const { access_token, refresh_token, user } = response.dados[0];
        sessionStorage.setItem("token", access_token.token);
        sessionStorage.setItem("refresh_token", refresh_token.token);
        toastService.addSuccessToast(`Seja bem vindo ${user.user_name}!!`);
        return user;
      })
      .catch(() => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("refresh_token");
        return null;
      });
    return response;
  }

  static async validateToken(): Promise<boolean> {
    const token = sessionStorage.getItem("token");
    if (!token) {
      sessionStorage.removeItem("refresh_token");
      return false;
    }
    this.http.addNotExceptionStatusCode([401]);
    try {
      await this.http.post<[]>("/auth/validate-token", { token });
      this.http.clearNotException();
      return true;
    } catch (error) {
      this.http.clearNotException();

      if (error instanceof Error) {
        if (error.message.includes("Erro de autenticação")) {
          try {
            const rtoken = sessionStorage.getItem("refresh_token");
            const response = await this.http.post<AuthProps>(
              "/auth/refresh-token",
              { token: rtoken }
            );
            const { access_token, refresh_token } = response.dados[0];
            sessionStorage.setItem("token", access_token.token);
            sessionStorage.setItem("refresh_token", refresh_token.token);
            return true;
          } catch (refreshError) {}
        }
      }
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("refresh_token");
      return false;
    }
  }

  //   static async encodeMailSignUp(user: SignUpMailProps): Promise<void> {
  //     console.log(user);
  //     const token = await this.encodeJsonToken<SignUpMailProps>(user);
  //     if (token) sessionStorage.setItem("mailSignUp", token);
  //   }

  //   static async decodeMailSignUp(): Promise<SignUpMailProps | null> {
  //     const token = sessionStorage.getItem("mailSignUp");
  //     return await this.decodeJsonToken<SignUpMailProps>(token);
  //   }

  //   static async registerUser(user: User): Promise<User> {
  //     const response = await this.http.post<User>("/user", user);
  //     console.log(response);
  //     return response;
  //     // userName: string;
  //     // userEmail: string;
  //     // userPassword: string;
  //     // userRole: userRole;
  //     // userImage?: string;
  //   }

  //   static async getUrlGoogleLogin(redirect: string): Promise<string> {
  //     const { url } = await this.http.get<{ url: string }>(
  //       `/user/auth/google/url?redirect=${redirect}`
  //     );
  //     return url;
  //   }

  //   static async googleLogin(code: string): Promise<ResponseAuthProps | null> {
  //     const toastService = ServiceLocator.getToastService();
  //     const locationBefore = sessionStorage.getItem("location");
  //     const response = await this.http
  //       .post<AuthProps>("/user/auth/google", {
  //         code,
  //       })
  //       .then((response) => {
  //         const { access_token, user } = response;
  //         if (user.logged) {
  //           localStorage.setItem("token", access_token.token);
  //           sessionStorage.removeItem("mailSignUp");
  //           sessionStorage.removeItem("google-user");
  //           toastService.addSuccessToast("Seja bem vindo!!");
  //         } else {
  //           if (locationBefore === "/login") {
  //             toastService.addInfoToast("Usuário ainda não cadastrado.");
  //           }
  //         }
  //         sessionStorage.removeItem("location");
  //         return user;
  //       })
  //       .catch(() => {
  //         localStorage.removeItem("user");
  //         sessionStorage.removeItem("location");
  //         return null;
  //       });
  //     return response;
  //   }

  //   static async encodeJsonToken<T>(json: T): Promise<string | null> {
  //     const response = await this.http.post<string | null>(
  //       "/user/auth/google/encode",
  //       json
  //     );
  //     return response;
  //   }

  //   static async decodeJsonToken<T>(token: string | null): Promise<T | null> {
  //     if (token) {
  //       const response = await this.http.post<T>("/user/auth/google/decode", {
  //         token,
  //       });
  //       return response;
  //     }
  //     return null;
  //   }

  //   static async isLogged(): Promise<UserProps | boolean> {
  //     const token = localStorage.getItem("user");
  //     if (token) {
  //       this.http.addHeader("x-access-token", token);
  //     } else {
  //       this.http.addHeader("x-access-token", "");
  //     }
  //     const hasUser = await this.http.get<UserProps | boolean>("/user/validate");
  //     return hasUser;
  //   }
}

import { SetupServer } from "./server";
import { SessionService } from "./services/Auth/API/session.service";
import { AccessTokenService } from "./services/Auth/Token/access-token.service";
import { RefrershTokenService } from "./services/Auth/Token/refresh-token.service";
import UserService from "./services/User/user.service";
import { setupSwagger } from "./swagger";

(async (): Promise<void> => {
  const userService = new UserService();
  const accessTokenService = new AccessTokenService();
  const refreshTokenService = new RefrershTokenService();
  const sessionService = new SessionService(
    accessTokenService,
    refreshTokenService
  );
  const server = new SetupServer(
    userService,
    sessionService,
    accessTokenService,
    refreshTokenService
  );
  await server.init();
  server.start();
  const app = server.getApp();
  setupSwagger(app);
})();

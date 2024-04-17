import bodyParser from "body-parser";
import cors from "cors";
import "./util/module-alias";
import { Server } from "@overnightjs/core";
import { Application } from "express";
import config from "config";

import * as database from "./database/prisma.client";
import { UserController } from "./controllers/user.controller";
import { AuthController } from "./controllers/auth.controller";
import UserService from "./services/User/user.service";
import { AuthMiddleware } from "./middleware/auth";
import { AccessTokenService } from "./services/Auth/Token/access-token.service";
import { RefrershTokenService } from "./services/Auth/Token/refresh-token.service";
import { JobScheduler } from "./jobs/setup.job";
import { RemoveInactiveSessionsJob } from "./jobs/jobs/remove-inactive-sessions.job";
import { SessionService } from "./services/Auth/API/session.service";

export class SetupServer extends Server {
  constructor(
    private userService: UserService,
    private sessionService: SessionService,
    private accessTokenService: AccessTokenService,
    private refreshTokenService: RefrershTokenService,
    private port = config.get("App.port")
  ) {
    super();
  }

  public async init(): Promise<void> {
    this.setupExpress();
    this.setupControllers();
    this.setupJobs();
    await this.setupDatabase();
  }

  private setupExpress(): void {
    this.app.use(bodyParser.json());
    this.app.use(
      cors({
        origin: config.get("App.cross-origin"),
        methods: ["GET", "POST", "DELETE", "PUT"],
        credentials: true,
      })
    );
  }

  private setupControllers(): void {
    const userController = new UserController(
      this.userService,
      this.accessTokenService
    );
    const authController = new AuthController(
      this.userService,
      this.sessionService,
      this.accessTokenService
    );
    AuthMiddleware.initialize({ accessTokenService: this.accessTokenService });
    this.addControllers([userController, authController]);
  }

  private setupJobs(): void {
    const removeInactiveSessionsJob = new RemoveInactiveSessionsJob(
      this.refreshTokenService
    );
    const jobScheduler = new JobScheduler(this.app, removeInactiveSessionsJob);
    jobScheduler.setupJobs();
  }

  private async setupDatabase(): Promise<void> {
    await database.connect();
  }

  public async close(): Promise<void> {
    await database.disconnect();
  }

  public getApp(): Application {
    return this.app;
  }

  public start(): void {
    this.app.listen(this.port, () => {
      console.info("Server listening on port: " + this.port);
    });
  }
}

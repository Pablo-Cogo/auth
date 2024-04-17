"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetupServer = void 0;
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
require("./util/module-alias");
const core_1 = require("@overnightjs/core");
const config_1 = __importDefault(require("config"));
const database = __importStar(require("./database/prisma.client"));
const user_controller_1 = require("./controllers/user.controller");
const auth_controller_1 = require("./controllers/auth.controller");
const auth_1 = require("./middleware/auth");
const setup_job_1 = require("./jobs/setup.job");
const remove_inactive_sessions_job_1 = require("./jobs/jobs/remove-inactive-sessions.job");
class SetupServer extends core_1.Server {
    constructor(userService, sessionService, accessTokenService, refreshTokenService, port = config_1.default.get("App.port")) {
        super();
        this.userService = userService;
        this.sessionService = sessionService;
        this.accessTokenService = accessTokenService;
        this.refreshTokenService = refreshTokenService;
        this.port = port;
    }
    async init() {
        this.setupExpress();
        this.setupControllers();
        this.setupJobs();
        await this.setupDatabase();
    }
    setupExpress() {
        this.app.use(body_parser_1.default.json());
        this.app.use((0, cors_1.default)({
            origin: config_1.default.get("App.cross-origin"),
            methods: ["GET", "POST", "DELETE", "PUT"],
            credentials: true,
        }));
    }
    setupControllers() {
        const userController = new user_controller_1.UserController(this.userService, this.accessTokenService);
        const authController = new auth_controller_1.AuthController(this.userService, this.sessionService, this.accessTokenService);
        auth_1.AuthMiddleware.initialize({ accessTokenService: this.accessTokenService });
        this.addControllers([userController, authController]);
    }
    setupJobs() {
        const removeInactiveSessionsJob = new remove_inactive_sessions_job_1.RemoveInactiveSessionsJob(this.refreshTokenService);
        const jobScheduler = new setup_job_1.JobScheduler(this.app, removeInactiveSessionsJob);
        jobScheduler.setupJobs();
    }
    async setupDatabase() {
        await database.connect();
    }
    async close() {
        await database.disconnect();
    }
    getApp() {
        return this.app;
    }
    start() {
        this.app.listen(this.port, () => {
            console.info("Server listening on port: " + this.port);
        });
    }
}
exports.SetupServer = SetupServer;
//# sourceMappingURL=server.js.map
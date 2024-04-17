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
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobScheduler = void 0;
const schedule = __importStar(require("node-schedule"));
class JobScheduler {
    constructor(app, removeInactiveSessionsJob) {
        this.app = app;
        this.removeInactiveSessionsJob = removeInactiveSessionsJob;
        this.jobs = [];
    }
    setupJobs() {
        this.jobs.push({
            name: "teste",
            job: schedule.scheduleJob("* * * * *", () => {
                console.log(`Teste em: ${new Date().toLocaleString()}`);
            }),
        });
        this.jobs.push({
            name: "remover-sessões-inativas",
            job: schedule.scheduleJob("0 * * * *", async () => {
                try {
                    await this.removeInactiveSessionsJob.handle();
                }
                catch (err) {
                    console.error(`Error in removeInactiveSessionsJob: ${err}`);
                }
            }),
        });
        this.app.get("/jobs", (_, res) => {
            const jobsReturn = [];
            this.jobs.forEach((job) => {
                jobsReturn.push({
                    name: job.name,
                    nextInvocation: job.job.nextInvocation(),
                });
            });
            res.json({ jobs: jobsReturn });
        });
        process.on("SIGINT", () => {
            this.jobs.forEach((job) => job.job.cancel());
            process.exit();
        });
    }
}
exports.JobScheduler = JobScheduler;
//# sourceMappingURL=config.js.map
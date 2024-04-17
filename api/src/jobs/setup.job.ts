import { Application } from "express";
import * as schedule from "node-schedule";
import { RemoveInactiveSessionsJob } from "./jobs/remove-inactive-sessions.job";
import { StatusJobEnum } from "@prisma/client";

interface ScheduledJobInfo {
  name: string;
  nextInvocation: Date | null;
}

export class JobScheduler {
  private jobs: { name: string; job: schedule.Job }[] = [];

  constructor(
    private readonly app: Application,
    private readonly removeInactiveSessionsJob: RemoveInactiveSessionsJob
  ) {}

  setupJobs() {
    this.jobs.push({
      name: "Teste",
      job: schedule.scheduleJob("* * * * *", () => {
        console.log(`Teste em: ${new Date().toLocaleString()}`);
      }),
    });

    this.jobs.push({
      name: `Remove ${this.removeInactiveSessionsJob.getClassName()}`,
      job: schedule.scheduleJob("0 0 */12 * *", async () => {
        await this.removeInactiveSessionsJob.clear();
      }),
    });

    this.jobs.push({
      name: this.removeInactiveSessionsJob.getClassName(),
      job: schedule.scheduleJob("0 0 */12 * *", async () => {
        await this.removeInactiveSessionsJob.handle();
      }),
    });

    this.app.get("/jobs", (_, res) => {
      const jobsReturn: ScheduledJobInfo[] = [];
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

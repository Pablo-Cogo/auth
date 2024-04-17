import { Job, PrismaClient, StatusJobEnum } from "@prisma/client";
import { client } from "@src/database/prisma.client";

export abstract class BaseJob {
  protected client: PrismaClient;
  private classname: string;

  constructor() {
    this.client = client;
    this.classname = this.constructor.name;
  }

  public abstract handle(): Promise<void>;

  public getClassName(): string {
    return this.classname;
  }

  public async clear(): Promise<void> {
    const thirdyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    await this.client.job.deleteMany({
      where: {
        AND: [
          { name: this.classname },
          {
            executed_at: {
              lt: thirdyDaysAgo,
            },
          },
        ],
      },
    });
  }

  protected async save(message: string, status: StatusJobEnum): Promise<Job> {
    const jobCreated = await this.client.job.create({
      data: {
        name: this.classname,
        message,
        status,
      },
    });
    return jobCreated;
  }
}

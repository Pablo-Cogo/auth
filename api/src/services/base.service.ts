import { PrismaClient } from "@prisma/client";
import { client } from "@src/database/prisma.client";

export abstract class BaseService {
  protected client: PrismaClient;

  constructor() {
    this.client = client;
  }
}

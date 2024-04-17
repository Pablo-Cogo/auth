import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

const offsetKey = Symbol("key");

function fixPrismaReadDate(d: Date): Date {
  return new Date(
    `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d
      .getDate()
      .toString()
      .padStart(2, "0")}T${d.getHours().toString().padStart(2, "0")}:${d
      .getMinutes()
      .toString()
      .padStart(2, "0")}:${d.getSeconds().toString().padStart(2, "0")}.${d
      .getMilliseconds()
      .toString()
      .padStart(2, "0")}Z`
  );
}
client.$use(async (params, next) => {
  const setOffsetTime = (obj: any, fn: any) => {
    if (obj === undefined || obj === null || obj[obj] || !isNaN(obj)) return;
    for (const key in obj) {
      if (obj[key] instanceof Date) {
        obj[key] = fn(obj[key]);
      } else if (typeof obj[key] === "object") {
        setOffsetTime(obj[key], fn);
      }
    }
    obj[offsetKey] = true;
  };
  const res = await next(params);
  setOffsetTime(res, fixPrismaReadDate);
  return res;
});

const connect = async (): Promise<void> => await client.$connect();

const disconnect = async (): Promise<void> => await client.$disconnect();

export { client, connect, disconnect };

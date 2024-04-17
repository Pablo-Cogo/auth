"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnect = exports.connect = exports.client = void 0;
const client_1 = require("@prisma/client");
const client = new client_1.PrismaClient();
exports.client = client;
const offsetKey = Symbol("key");
function fixPrismaReadDate(d) {
    return new Date(`${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d
        .getDate()
        .toString()
        .padStart(2, "0")}T${d.getHours().toString().padStart(2, "0")}:${d
        .getMinutes()
        .toString()
        .padStart(2, "0")}:${d.getSeconds().toString().padStart(2, "0")}.${d
        .getMilliseconds()
        .toString()
        .padStart(2, "0")}Z`);
}
client.$use(async (params, next) => {
    const setOffsetTime = (obj, fn) => {
        if (obj === undefined || obj === null || obj[obj] || !isNaN(obj))
            return;
        for (const key in obj) {
            if (obj[key] instanceof Date) {
                obj[key] = fn(obj[key]);
            }
            else if (typeof obj[key] === "object") {
                setOffsetTime(obj[key], fn);
            }
        }
        obj[offsetKey] = true;
    };
    const res = await next(params);
    setOffsetTime(res, fixPrismaReadDate);
    return res;
});
const connect = async () => await client.$connect();
exports.connect = connect;
const disconnect = async () => await client.$disconnect();
exports.disconnect = disconnect;
//# sourceMappingURL=prisma.client.js.map
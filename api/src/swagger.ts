import { Application } from "express";
import * as path from "path";
import swaggerUI from "swagger-ui-express";
import * as fs from "fs";

export function setupSwagger(app: Application) {
  const files = path.resolve(__dirname, "../..");
  const apiDocsFile = path.join(files, "api-docs.json");
  console.log(apiDocsFile);

  const apiDocsJson = JSON.parse(fs.readFileSync(apiDocsFile, "utf8"));
  app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(apiDocsJson));
}

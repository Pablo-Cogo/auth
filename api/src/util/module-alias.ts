import * as path from "path";
import alias from "module-alias";

const files = path.resolve(__dirname, "../..");

alias.addAliases({
  "@src": path.join(files, "src"),
  "@test": path.join(files, "test"),
});

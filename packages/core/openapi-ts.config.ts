import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "https://api.savvycal.app/v1/spec",
  output: { format: "prettier", lint: "eslint", path: "./src/client" },
  plugins: ["@hey-api/client-fetch"],
});

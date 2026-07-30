import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["./src/index.ts", "./src/worker.ts"],
  format: "esm",
  outDir: "./dist",
  clean: true,
  noExternal: [/@echo\/.*/],
});

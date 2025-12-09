import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  root: __dirname, // ← forces Vitest to treat mealslot/ as project root
  test: {
    environment: "happy-dom",
    setupFiles: ["./tests/setupTests.ts"],
    globals: true,
    include: ["tests/AllTests.ts"],
    coverage: {
      reporter: ["text", "lcov"],
      reportsDirectory: path.resolve(__dirname, "coverage"),
    },
  },
});

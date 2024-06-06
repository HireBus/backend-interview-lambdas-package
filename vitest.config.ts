import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    include: ["**/*.test.ts"],
    exclude: ["api-tests/**", "**/node_modules/**"], // exclude API tests and node_modules from default tests
    coverage: {
      all: true,
      provider: "v8",
      reporter: ["lcov", "text-summary"],
    },
  },
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const databasePath = fileURLToPath(new URL("./db", import.meta.url));

const databaseFilePlugin = {
  name: "serve-root-database-file",
  configureServer(server) {
    server.middlewares.use(
      "/database-file",
      async (_request, response, next) => {
        try {
          const database = await readFile(databasePath);
          response.setHeader("Content-Type", "application/octet-stream");
          response.setHeader("Content-Length", database.length);
          response.end(database);
        } catch (error) {
          next(error);
        }
      },
    );
  },
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), databaseFilePlugin],
  assetsInclude: ["**/db"],
});

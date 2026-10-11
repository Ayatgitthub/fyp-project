import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const databasePath = fileURLToPath(new URL("./db", import.meta.url));

const databaseFilePlugin = {
  name: "serve-root-database-file",
  configureServer(server) {
    const handler = async (_request, response, next) => {
      try {
        const database = await readFile(databasePath);
        response.setHeader("Content-Type", "application/octet-stream");
        response.setHeader("Content-Length", database.length);
        response.end(database);
      } catch (error) {
        next(error);
      }
    };

    server.middlewares.use("/database-file", handler);
    server.middlewares.use("/database.sqlite", handler);
    server.middlewares.use("/quraan.sqlite", handler);
  },
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), databaseFilePlugin],
  assetsInclude: ["**/db"],
});

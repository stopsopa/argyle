import { defineConfig, UserConfig } from "vite";
import react from "@vitejs/plugin-react";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(__dirname, "..", ".env"),
});

const th = (msg: string) => new Error(`vite.config.ts error: ${msg}`);

if (typeof process.env.NODE_PORT !== "string") {
  throw th("NODE_PORT is not defined");
}

const config: UserConfig = {
  plugins: [react()],
  server: {
    proxy: {
      // https://vitejs.dev/config/server-options.html#server-proxy
      "^/api/.*": {
        target: `http://0.0.0.0:${process.env.NODE_PORT}`,
        changeOrigin: true,
      },
    },
  },
};

// https://vitejs.dev/config/
export default defineConfig(config);

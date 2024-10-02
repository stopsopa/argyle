import "dotenv/config";

import path from "path";

import express, { Request, Response } from "express";

import env, { envInt } from "./functions/env";

import checkDir from "./functions/checkDir";
import checkFile from "./functions/checkFile";

import { setupPino, getLogger } from "./modules/logger";

import { setupPool } from "./modules/mysql";

import api from "./api";

/**
 * Setting up server and not allowing it to run if there is something missing
 */
(async function () {
  try {
    setupPino();

    const port = envInt("NODE_PORT", "3000");

    setupPool({
      port: envInt("MYSQL_PORT"),
      host: env("MYSQL_HOST"),
      user: env("MYSQL_USER"),
      database: env("MYSQL_DB"),
      password: env("MYSQL_PASS"),
    });

    const app = express();

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    const directory = await checkDir(
      path.resolve(__dirname, "..", "vite", "dist"),
    );
    const index = await checkFile(path.resolve(directory, "index.html"));

    app.use("/api", api);

    // serve statics
    app.use(express.static(directory));

    /**
     * and if request was not handled by any other route and reached the end
     * serve default index.html for vite if request 'accept' header has text/html
     * for any other continue which will result in 404
     */
    app.get("*", (req: Request, res: Response, next) => {
      if (req.headers?.accept?.includes("text/html")) {
        res.sendFile(index);
      } else {
        next();
      }
    });

    app.listen(port, () => {
      getLogger().info(`Server is running at http://localhost:${port}`);

      // readiness prompt for humans
      console.log(`  
    🌎 Server is running at http://localhost:${port}
  `);
    });
  } catch (e) {
    // I'm deliberately rethrowing the errors which might occure during server setup
    // and unhandled exception or unhandled promise in modern node will crash the server
    // at this point that exactly what I want
    // I will log it to kibana first though

    const logger = getLogger();

    logger.fatal({ err: e, xray: "server" }, "Server setup error");

    logger.flush(() => {
      throw e;
    });
  }
})();

import "dotenv/config";

import path from "path";

import express, { Express, Request, Response } from "express";

import env, { envInt } from "./lib/env";

import checkDir from "./lib/checkDir";
import checkFile from "./lib/checkFile";

import { fileURLToPath } from "url";

import getPool, { setupPool } from "./modules/mysql";

import { PaymentsType } from "./model/payments";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async function () {
  // deliberately not using try catch here, errors happening during server setup should crash the server

  setupPool({
    port: envInt("MYSQL_PORT"),
    host: env("MYSQL_HOST"),
    user: env("MYSQL_USER"),
    database: env("MYSQL_DB"),
    password: env("MYSQL_PASS"),
  });

  const app: Express = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const directory = await checkDir(path.resolve(__dirname, "..", "vite", "dist"));
  const index = await checkFile(path.resolve(directory, "index.html"));

  app.use(express.static(directory));

  const port = envInt("PORT", "3000");

  app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server");
  });

  app.get("/sql", async (req: Request, res: Response) => {
    try {
      const pool = getPool();

      const [results, fields] = await pool.execute<PaymentsType[]>("SELECT * FROM payments");

      res.json(results);
    } catch (e) {}
  });

  /**
   * and if request was not handled by any other route and reached the end
   * serve default index.html for vite if request 'accept' header has text/html
   */
  app.get("*", (req: Request, res: Response, next) => {
    if (req.headers?.accept?.includes("text/html")) {
      res.sendFile(index);
    } else {
      next();
    }
  });

  app.listen(port, () => {
    console.log(`  
  🌎 Server is running at http://localhost:${port}
`);
  });
})();

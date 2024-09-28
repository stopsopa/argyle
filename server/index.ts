import "dotenv/config";

import express, { Express, Request, Response } from "express";

import { setupPool } from "./modules/mysql";

setupPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database
});

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.listen(port, () => {
  console.log(`\n  🌎 Server is running at http://localhost:${port}\n`);
});

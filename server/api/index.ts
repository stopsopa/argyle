import express, { Express, Request, Response } from "express";

import getPool, { setupPool } from "../modules/mysql";

import { Count } from "../model/payments";

const router = express.Router();

router.get("/healthcheck", async (req: Request, res: Response) => {
  try {
    const pool = getPool();

    const [results] = await pool.execute<Count[]>("SELECT count(*) count FROM payments");

    const count = results?.[0]?.count;

    res.send(count > 0 ? "true" : "false");
  } catch (e) {}
});

router.get("/test", (req: Request, res: Response) => {
  res.json({ all: new Date().getTime() });
});

router.get("/timeout", (req: Request, res: Response) => {
//   res.json({ all: new Date().getTime() });
});

export default router;

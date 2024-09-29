import express, { Request, Response } from "express";

import { getPool } from "../modules/mysql";

import healthcheck from "./healthcheck";

import { PaymentsType } from "../model/payments";

const router = express.Router();

import { getLogger } from "../modules/logger";

router.get("/sql", async (req: Request, res: Response) => {
  try {
    const pool = getPool();

    const [results] = await pool.execute<PaymentsType[]>("SELECT * FROM payments");

    res.json(results);
  } catch (e) {
    res.status(500).json(`Server error`);

    getLogger().error({ err: e, xray: "api-sql" }, "SQL error");
  }
});

router.get("/healthcheck", healthcheck);

export default router;

import express, { Request, Response } from "express";

import { getPool } from "../modules/mysql";

import healthcheck from "./healthcheck";

import { PaymentsType } from "../model/payments";

import { getLogger } from "../modules/logger";

import { SearchRequest } from "../types/search";

import nlp, { NlpReturnType } from "../modules/nlp";

const router = express.Router();

router.post("/search", async (req: Request, res: Response) => {
  let body: SearchRequest | null = null;

  try {
    body = req.body as SearchRequest;

    let error: string;

    let parsed: NlpReturnType;

    try {
      parsed = nlp(body.query);

      const pool = getPool();

      const query = `SELECT * FROM payments WHERE `;

      const [results] = await pool.execute<PaymentsType[]>("SELECT * FROM payments");
    } catch (err) {
      const e = err as Error;

      error = e.message;
    }

    // res.json(results);
  } catch (e) {
    res.status(500).json(`Server error`);

    getLogger().error({ err: e, xray: "api-sql" }, "SQL error");
  }
});

router.get("/healthcheck", healthcheck);

export default router;

import express, { Request, Response } from "express";

import { getPool } from "../modules/mysql";

import healthcheck from "./healthcheck";

import { PaymentsType } from "../model/payments";

import { getLogger } from "../modules/logger";

import { SearchRequest, SearchResponse } from "../types/search";

import nlp, { NlpReturnType } from "../modules/nlp";

const router = express.Router();

router.post("/search", async (req: Request, res: Response) => {
  let body: SearchRequest | null = null;

  try {
    body = req.body as SearchRequest;

    let error: string | null = null;

    let parsed: NlpReturnType;

    try {
      parsed = nlp(body.query);

      const pool = getPool();

      // it is safe to combine comperator from nlp with the query, it can only return '=', '<' or '>'
      // and only when it will not throw an error
      const query = `SELECT * FROM payments WHERE ${parsed.comparator} ?`;

      const [results] = await pool.execute<PaymentsType[]>(query, [parsed.number]);
    } catch (err) {
      const e = err as Error;

      error = e.message;
    }

    res.json({
      error,
      results: [],
    } as SearchResponse);
  } catch (e) {
    res.status(500).json(`Server error`);

    getLogger().error({ err: e, xray: "api-sql" }, "SQL error");
  }
});

router.get("/healthcheck", healthcheck);

export default router;

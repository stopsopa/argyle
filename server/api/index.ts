import express, { Request, Response } from "express";

import { getPool } from "../modules/mysql";

import healthcheck from "./healthcheck";

import { PaymentsType } from "../model/payments";

import { getLogger } from "../modules/logger";

import { SearchRequest, SearchResponse } from "../types/search";

import nlp, { NlpReturnType } from "../modules/nlp";

const router = express.Router();

/**
 * This function is little too open regarding information what is happening in this endpoint
 * But I wanted to power debug mode
 *
 * In real scenario I would return 200 with list and 500 or 404 with generic error
 * and I would gather as much infor as possible in logs
 */
router.post("/search", async (req: Request, res: Response) => {
  let body: SearchRequest | null = null;

  try {
    body = req.body as SearchRequest;

    let error: string | null = null;

    let parsed: NlpReturnType | null = null;

    let query: string | null = null;

    let results: PaymentsType[] = [];

    try {
      parsed = nlp(body.query);

      const pool = getPool();

      // it is safe to combine comperator from nlp with the query, it can only return '=', '<' or '>'
      // and only when it will not throw an error
      query = `SELECT * FROM payments WHERE amount ${parsed.comparator} ?`;

      [results] = await pool.execute<PaymentsType[]>(query, [parsed.number]);
    } catch (err) {
      const e = err as Error;

      error = e.message;
    }

    res.json({
      error,
      results,
      nlp: parsed,
      query,
    } as SearchResponse);
  } catch (e) {
    res.status(500).json(`Server error`);

    getLogger().error({ err: e, xray: "api-search" }, "Search error");
  }
});

router.get("/healthcheck", healthcheck);

export default router;

import { Request, Response } from "express";

import { getPool } from "../modules/mysql";

import { getLogger } from "../modules/logger";

import { Count } from "../model/payments";

export default async function (req: Request, res: Response) {
  try {
    const pool = getPool();

    // It's probably not the best condition to check if table is not empty for healthcheck
    // And to to real requst on every healthcheck ping
    // But I'm checking what I need to check in the scope of this task.
    //
    // This is later consumed by
    // TIMEOUTSEC="1000" node .github/healtcheck.js in the pipeline
    // and in the docker compose file too
    const [results] = await pool.execute<Count[]>("SELECT count(*) count FROM payments");

    const count = results?.[0]?.count;

    if (count > 0) {
      res.send("true");

      return;
    }

    res.status(500).send("false"); // 500 since this is server issue
  } catch (e) {
    getLogger().error({ err: e, xray: "healthcheck" }, "Healthcheck error");
  }
}

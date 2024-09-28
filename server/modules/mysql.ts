import mysql, { PoolOptions, Pool } from "mysql2";

const th = (msg: string) => new Error(`mysql.ts error: ${msg}`);

let pool: Pool;

export const setupPool = (config: PoolOptions): void => {
  pool = mysql.createPool(config);
};

export default (): Pool => {
  if (typeof pool === "undefined") {
    throw th(`mysql2 pool is not initialized, use setupPool() first`);
  }

  return pool;
};

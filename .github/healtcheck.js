/**
 * Simple healthcheck script waiting for given amount of time for server to return "true" on /api/healthcheck
 *
 * Run
 *
 *    node .github/healtcheck.js api
 *
 * or
 *
 *    TIMEOUTSEC="10" node .github/healtcheck.js
 *
 */

const path = require("path");

const fs = require("fs");

const dotenv = require("dotenv");

const th = (msg) => new Error(`healtcheck.js error: ${msg}`);

const env = path.resolve(__dirname, "..", ".env");

if (!fs.existsSync(env)) {
  throw th(`file '${env}' doesn't exist`);
}

dotenv.config({
  path: env,
});

if (typeof process.env.MYSQL_DB !== "string") {
  throw th(`MYSQL_DB is undefined`);
}

if (typeof process.env.NODE_PORT !== "string") {
  throw th(`NODE_PORT is undefined`);
}

if (typeof process.env.NODE_HOST !== "string") {
  throw th(`NODE_HOST is undefined`);
}

if (typeof process.env.NODE_PROTOCOL !== "string") {
  throw th(`NODE_PROTOCOL is undefined`);
}

const logger = (...args) => console.log(new Date().toISOString(), ...args);

let healthcheckTimeoutMilliseconds = 10 * 1000;

// override default TIMEOUTSEC if needed
if (process.env.TIMEOUTSEC) {
  if (/^\d+$/.test(process.env.TIMEOUTSEC) && process.env.TIMEOUTSEC > 1) {
    logger(`valid process.env.TIMEOUTSEC found >${process.env.TIMEOUTSEC}<`);
    healthcheckTimeoutMilliseconds = parseInt(process.env.TIMEOUTSEC, 10) * 1000;
  } else {
    logger(`WARNING: invalid process.env.TIMEOUTSEC found >${process.env.TIMEOUTSEC}<`);
  }
}

logger(`healthcheckTimeoutMilliseconds: ${healthcheckTimeoutMilliseconds}`);

(async () => {
  try {
    setTimeout(() => {
      logger(
        `healthcheck timeout error after ${healthcheckTimeoutMilliseconds} miliseconds (${parseFloat(
          healthcheckTimeoutMilliseconds / 1000,
        ).toFixed(2)} sec)`,
      );

      process.exit(1);
    }, healthcheckTimeoutMilliseconds);

    const endpoint = `${process.env.NODE_PROTOCOL}://${process.env.NODE_HOST}:${process.env.NODE_PORT}/api/healthcheck`;

    function runner() {
      return new Promise((resolve) => {
        async function loop() {
          logger(`attempt to ping front healthcheck endpoint: ${endpoint}`);

          try {
            const res = await fetch(endpoint, {
              signal: AbortSignal.timeout(5000),
            });

            if (!res.ok) {
              throw new Error(`status is not 200 >${res.status}<`);
            }

            logger(`success`);

            resolve();
          } catch (e) {
            logger(`failure: ${e}`);

            setTimeout(loop, 1000);
          }
        }
        loop();
      });
    }

    await runner();

    logger(`all tests passed - service healthy`);

    process.exit(0);
  } catch (e) {
    logger(`
    
Global catch:     
    
    `);

    throw e;
  }
})();

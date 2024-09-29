const path = require("path");

const fs = require("fs");

const dotenv = require("dotenv");

const knex = require("knex");

const getDbName = require("./getDbName.js");

const env = path.resolve(__dirname, "..", ".env");

const th = (msg) => new Error(`mysql-test.js error: ${msg}`);

const log = (msg) => process.stdout.write(`${msg}\n`);

async function notExist(file) {
  try {
    await fsPromises.stat(file);
    return false;
  } catch (e) {
    return e;
  }
}

(async () => {
  try {
    if (!fs.existsSync(env)) {
      throw th(`file '${env}' doesn't exist (${nExist.message})`);
    }

    dotenv.config({
      path: env,
    });

    if (typeof process.env.MYSQL_HOST !== "string") {
      throw th(`MYSQL_HOST is undefined`);
    }

    if (typeof process.env.MYSQL_PORT !== "string") {
      throw th(`MYSQL_PORT is undefined`);
    }

    if (typeof process.env.MYSQL_USER !== "string") {
      throw th(`MYSQL_USER is undefined`);
    }

    if (typeof process.env.MYSQL_PASS !== "string") {
      throw th(`MYSQL_PASS is undefined`);
    }

    log(`mysql-test.js: connecting to knex database: >${getDbName()}<`);

    const connection = knex({
      client: "mysql",
      connection: {
        host: process.env.MYSQL_HOST,
        port: process.env.MYSQL_PORT,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASS,
        database: getDbName(),
      },
    });

    const row = await connection.raw("show databases");

    const databases = row[0];

    log(JSON.stringify(databases, null, 4));

    connection.destroy();
  } catch (e) {
    log(`
    
Global catch:     
    
    `);

    throw e;
  }
})();

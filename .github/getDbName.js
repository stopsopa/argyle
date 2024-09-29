const th = (msg) => new Error(`getDbName error: ${msg}`);

module.exports = function getDbName() {
  let MYSQL_DB = "MYSQL_DB";

  if (typeof process.env.MYSQL_DB_CHANGE === "string") {
    MYSQL_DB = process.env.MYSQL_DB_CHANGE;
  }

  if (typeof process.env[MYSQL_DB] === "undefined") {
    throw th(`${MYSQL_DB} specified with MYSQL_DB_CHANGE or regular MYSQL_DB is undefined`);
  }

  return process.env[MYSQL_DB];
};

import os from "os";

import pino from "pino";

const th = (msg: string) => new Error(`logger.ts error: ${msg}`);

let logger: pino.Logger;

export const setupPino = (): void => {
  logger = pino({
    timestamp: pino.stdTimeFunctions.isoTime,
    base: { hostname: os.hostname() }, // this will be faster - called only once https://github.com/pinojs/pino/blob/master/docs/api.md#base-object
    messageKey: "message", // https://github.com/pinojs/pino/blob/master/docs/api.md#messagekey-string
    level: "trace",
  });
};

export const getLogger = (): pino.Logger => {
  if (typeof logger === "undefined") {
    throw th("Logger is not initialized, use setupPino() first");
  }

  return logger;
};

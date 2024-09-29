/**
 * This library here is to make sure all necessary env vars are set
 * I would consider the best to make sure all envs are extracted
 * when server is still starting and immediately crash it if any env is missing.
 *
 * Good idea would be also to validate envs if we expect particular type of value
 * and if something is off then also throw to stop server at start
 */
const th = (msg: string) => new Error(`env.ts error: ${msg}`);

type EnvType = [string, string?];

export default function env(...args: EnvType): string {
  const [env, def] = args;

  if (typeof process.env[env] === "undefined") {
    if (typeof def === "string") {
      return def;
    }

    throw th(`process.env.${env} is not defined`);
  }

  const val = process.env[env];

  if (!val.trim()) {
    throw th(`process.env.${env} is empty`);
  }

  return val;
}

export const envInt = (...args: EnvType): number => {
  const int = parseInt(env(...args), 10);

  if (typeof int !== "number") {
    throw th(`process.env.${args[0]} conversion to int failed`);
  }

  return int;
};

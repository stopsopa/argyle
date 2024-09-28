const th = (msg: string) => new Error(`env.ts error: ${msg}`);

type EnvType = [string, any];

export default (...args: EnvType) => {
  const [env, def] = args;

  if (typeof process.env[env] === "undefined") {
    if (args.length === 2) {
      return def;
    }

    throw th(`process.env.${env} is not defined`);
  }

  return process.env[env];
};

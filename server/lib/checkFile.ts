import { promises as fs } from "fs";

const th = (msg: string) => new Error(`checkDir.ts error: ${msg}`);
/**
 * Make sure the path points to a file, if not then throw
 * if ok return path
 */
export default async function checkFile(path: string): Promise<string> {
  const stats = await fs.stat(path);

  if (!stats.isFile()) {
    throw th(`Path ${path} is not a file`);
  }

  return path;
}

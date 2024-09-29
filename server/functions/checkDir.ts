import { promises as fs } from "fs";

const th = (msg: string) => new Error(`checkDir.ts error: ${msg}`);
/**
 * Make sure the path points to directory, if not then throw
 * if ok return path
 */
export default async function checkDir(path: string): Promise<string> {
  const stats = await fs.stat(path);

  if (!stats.isDirectory()) {
    throw th(`Path ${path} is not a directory`);
  }

  return path;
}

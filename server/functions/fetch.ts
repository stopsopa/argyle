import isObject from "./isObject";

import { JSONType } from "../types/JSONType";

/**
 * By default is's just native fetch
 */
let fetchMockedInstance = fetch;

// found deep in ts-node
export type FetchType = (input: string | URL | Request, init?: RequestInit) => Promise<Response>;

/**
 * But it can be overriden for testing purposes
 */
export const mockFetch = (fetch: FetchType) => {
  fetchMockedInstance = fetch;
};

const fetchDataThrow = (msg: string) => new Error(`fetch.ts fetchData error: ${msg}`);

type FetchDataType = RequestInit & {
  valid?: (res: Response) => boolean;
};

function defaultValid(res: Response) {
  return res.ok;
}
/**
 * Throws exception when status code not in range 200-299
 *
 * Internally uses res.ok but behaviour can be customized
 */
export const fetchData = async (path: string, options?: FetchDataType) => {
  if (typeof path !== "string" || !path.trim()) {
    throw fetchDataThrow(`path parameter should be a string, it is >${typeof path}<`);
  }

  const { valid = defaultValid, ...rest } = options || {};

  const res = await fetchMockedInstance(path, rest);

  if (valid(res)) {
    return res;
  }

  throw fetchDataThrow(`valid function returned false for response ${options?.method ?? "GET"}:${path}`);
};

type FetchJsonType = Omit<FetchDataType, "body"> & {
  raw?: boolean;
  body?: BodyInit | JSONType;
};

/**
 * fetchJson is using internally fetchData and automatically does a few things:
 *
 * 1) Adds the following headers:
 *    - "Content-Type": 'application/json; charset=utf-8'
 *    - Accept: 'application/json'
 *
 * 2) Additionally serializes the request body to JSON if an array or object is given.
 *
 * 3) If the body is an object or array, it sets the method to "POST" automatically
 *    (but you can set it explicitly too).
 *
 * 4) Unwraps response.json() unless the raw: true parameter is given.
 */
export const fetchJson = async (path: string, options?: FetchJsonType) => {
  options = {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Accept: "application/json",
      ...options?.headers,
    },
    ...options,
  };

  if (isObject(options.body) || Array.isArray(options.body)) {
    options.body = JSON.stringify(options.body);

    options.method = options.method || "POST";
  }

  const { raw, ...rest } = options;

  const res = await fetchData(path, rest as FetchDataType);

  // clone here is to avoid issues with
  //     Uncaught (in promise) TypeError: Already read
  if (raw) {
    return res.clone();
  }

  return res.clone().json();
};

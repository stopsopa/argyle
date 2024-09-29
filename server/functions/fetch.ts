import isObject from "./isObject";

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

  if (defaultValid(res)) {
    return res;
  }

  throw fetchDataThrow(`valid function returned false for response ${(options?.method ?? "GET")}:${path}`);
};

type FetchJsonType = FetchDataType & {
  raw?: boolean;
  body?: BodyInit | any[] | Record<string, any>;
};

// fetchJson is using internally fetchData and automatically do few things
//
// 1) adds
//        "Conten-type": 'application/json; charset=utf-8'
//        Accept: 'application/json'
//    headers
//
// 2) Additionally serializes request body to json if array or object given
//
// 3) if body is object or array then it sets method "POST" automatically
//    (but you can set it explicitly too)
//
// 4) unwraps response.json() untless raw: true param given
//
//
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

  const res = await fetchData(path, rest);

  // clone here is to avoid issues with
  //     Uncaught (in promise) TypeError: Already read
  if (raw) {
    return res.clone();
  }

  return res.clone().json();
};

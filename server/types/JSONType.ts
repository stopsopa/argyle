

type JSONValue = 
  | string
  | number
  | boolean
  | null
  | JSONArray
  | JSONObject;

type JSONArray = Array<JSONValue>;

interface JSONObject {
  [key: string]: JSONValue;
}

export type JSONType = JSONArray | JSONObject;
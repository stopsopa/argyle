import { useState, FormEvent, MouseEvent } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { fetchJson } from "../../server/functions/fetch";
import formatNumber from "../../server/functions/formatNumber";
import { SearchRequest, SearchResponse } from "../../server/types/search";
import "./App.css";

function App() {
  const [start, setStart] = useState<boolean>(true);

  const [loading, setLoading] = useState<boolean>(false);

  const [error, setError] = useState<null | string>(null);

  const [response, setResponse] = useState<SearchResponse | null>(null);

  const [debug, setDebug] = useState<boolean>(false);

  const [input, setInput] = useState<string>("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const normalized = input.trim();

    if (!normalized) {
      // don't process if input.value empty after trim
      return;
    }

    try {
      setStart(false);

      setLoading(true);

      setError(null);

      const body: SearchRequest = { query: normalized, debug };

      const json = (await fetchJson("/api/search", {
        body,
      })) as SearchResponse;

      setResponse(json);
    } catch (err) {
      const e = err as Error;

      setError(e.message);
    }

    setLoading(false);
  }
  function onButton(e: MouseEvent<HTMLButtonElement>, input: string) {
    e.preventDefault();

    setInput(input);
  }

  return (
    <>
      <div className="main">
        <div className="flex">
          <img src={viteLogo} className="logo" alt="Vite logo" />
          <img src={reactLogo} className="logo react" alt="React logo" />

          {loading && (
            <span className="flex flex-v-center loading">Loading...</span>
          )}

          {error && <div className="flex flex-v-center error">{error}</div>}
        </div>
        <form onSubmit={onSubmit}>
          <div className="flex">
            <div className="flex-grow flex">
              <input
                type="text"
                className="search"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </div>
            <div>
              <button>🔎 search</button>
            </div>
          </div>
          <hr />
          <label>
            <input
              type="checkbox"
              checked={debug}
              onChange={() => setDebug(!debug)}
            />
            debug mode
          </label>
          <button
            className="small"
            onClick={(e) => onButton(e, `over fifty four`)}
          >
            case 1
          </button>
          <button
            className="small"
            onClick={(e) => onButton(e, `equal two thousand and forty five`)}
          >
            case 2
          </button>
          <button
            className="small"
            onClick={(e) =>
              onButton(e, `under three million one hundred thousand and ninety`)
            }
          >
            case 3
          </button>
          <button className="small" onClick={(e) => onButton(e, `asdasd`)}>
            case 4
          </button>
          <button className="small" onClick={(e) => onButton(e, `one one`)}>
            case 5
          </button>
          <button
            className="small"
            onClick={(e) => onButton(e, `equal to $2045`)}
          >
            case 6
          </button>
          <button className="small" onClick={(e) => onButton(e, `over zero`)}>
            list all
          </button>
          {debug && (
            <pre>
              {JSON.stringify(
                (function (r) {
                  const copy = { ...r };

                  delete copy.results;

                  return copy;
                })(response),
                null,
                4,
              )}
            </pre>
          )}
          {!debug && response?.error && (
            <div className="error">Incorrect input</div>
          )}
          <hr />
          {response?.results && response?.results?.length > 0 ? (
            <>
              <table className="payments">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>amount</th>
                    <th>created</th>
                    <th>updated</th>
                  </tr>
                </thead>
                <tbody>
                  {response?.results.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{formatNumber(item.amount, ", ")}</td>
                      <td>{item.created}</td>
                      <td>{item.updated}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : (
            <div>
              {start
                ? `⌨️ type what you are looking for and press search`
                : `📁 No results`}
            </div>
          )}
        </form>
      </div>
    </>
  );
}

export default App;

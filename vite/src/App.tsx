import { useState, FormEvent } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { fetchJson } from "../../server/functions/fetch";
import formatNumber from "../../server/functions/formatNumber";
import { SearchRequest } from "../../server/types/search";
import "./App.css";

import { PaymentsType } from "../../server/model/payments";

function App() {
  const [start, setStart] = useState<boolean>(true);

  const [loading, setLoading] = useState<boolean>(false);

  const [error, setError] = useState<null | string>(null);

  const [list, setList] = useState<PaymentsType[]>([]);

  const [search, setSearch] = useState<string>("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const normalized = search.trim();

    if (!normalized) {
      // don't process if empty after trim
      return;
    }

    try {
      setStart(false);

      setLoading(true);

      setError(null);

      const body: SearchRequest = { query: normalized };

      const json = (await fetchJson("/api/search", {
        body,
      })) as PaymentsType[];

      setList(json);
    } catch (err) {
      const e = err as Error;

      setError(e.message);
    }

    setLoading(false);
  }

  return (
    <>
      <div className="main">
        <div className="flex">
          <img src={viteLogo} className="logo" alt="Vite logo" />
          <img src={reactLogo} className="logo react" alt="React logo" />

          {loading && <span className="flex flex-v-center loading">Loading...</span>}

          {error && <div className="flex flex-v-center error">{error}</div>}
        </div>
        <form onSubmit={onSubmit}>
          <div className="flex">
            <div className="flex-grow flex">
              <input type="text" className="search" onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div>
              <button>🔎 search</button>
            </div>
          </div>
          <hr />
          {list && list.length > 0 ? (
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
                  {list.map((item) => (
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
            <div>{start ? `⌨️ type what you are looking for and press search` : `📁 No results`}</div>
          )}
        </form>
      </div>
    </>
  );
}

export default App;

import { fetchData, fetchJson, mockFetch, FetchType } from "./fetch";

describe("fetch.js", () => {
  describe("fetchData", () => {
    it("basic", (done) => {
      (async function () {
        try {
          const mock: FetchType = async () =>
            new Response(null, { status: 200 });

          mockFetch(mock);

          await fetchData("/abc");

          done();
        } catch (e) {
          done(`Shouldn't happen ${e}`);
        }
      })();
    });

    it("not string", (done) => {
      (async function () {
        try {
          /* @ts-ignore */
          await fetchData(7);

          done(`Shouldn't happen`);
        } catch (e) {
          expect(String(e)).toEqual(
            "Error: fetch.ts fetchData error: path parameter should be a string, it is >number<",
          );
          done();
        }
      })();
    });

    it("500", (done) => {
      (async function () {
        try {
          const mock: FetchType = async (
            _input: string | URL | Request,
            init?: RequestInit,
          ) => new Response(null, { status: 500 });

          mockFetch(mock);

          await fetchData("/abc", { method: "POST" });

          done(`Shouldn't happen`);
        } catch (e) {
          expect(String(e)).toEqual(
            "Error: fetch.ts fetchData error: valid function returned false for response POST:/abc",
          );
          done();
        }
      })();
    });
  });
  describe("fetchJson", () => {
    it("basic", (done) => {
      (async function () {
        try {
          /* @ts-ignore */
          mockFetch((...args) => ({
            ok: true,
            clone: () => ({ json: () => [...args] }),
          }));

          const data = await fetchJson("/abc");

          expect(data).toEqual([
            "/abc",
            {
              headers: {
                "Content-Type": "application/json; charset=utf-8",
                Accept: "application/json",
              },
            },
          ]);

          done();
        } catch (e) {
          done(`Shouldn't happen ${e}`);
        }
      })();
    });
    it("custom header", (done) => {
      (async function () {
        try {
          /* @ts-ignore */
          mockFetch((...args) => ({
            ok: true,
            clone: () => ({ json: () => [...args] }),
          }));

          const data = await fetchJson("/abc", {
            headers: { "Content-Type": "text/html", Accept: "xxx" },
          });

          expect(data).toEqual([
            "/abc",
            {
              headers: {
                "Content-Type": "text/html",
                Accept: "xxx",
              },
            },
          ]);

          done();
        } catch (e) {
          done(`Shouldn't happen ${e}`);
        }
      })();
    });
    it("json", (done) => {
      (async function () {
        try {
          /* @ts-ignore */
          mockFetch((...args) => ({
            ok: true,
            clone: () => ({ json: () => [...args] }),
          }));

          const data = await fetchJson("/abc", {
            headers: { "Content-Type": "text/html", Accept: "xxx" },
            /* @ts-ignore */
            body: { a: 1 },
          });

          expect(data).toEqual([
            "/abc",
            {
              headers: {
                "Content-Type": "text/html",
                Accept: "xxx",
              },
              body: '{"a":1}',
              method: "POST",
            },
          ]);

          done();
        } catch (e) {
          done(`Shouldn't happen ${e}`);
        }
      })();
    });
    it("raw", (done) => {
      (async function () {
        try {
          /* @ts-ignore */
          mockFetch((...args) => ({ ok: true, clone: () => [...args] }));

          const data = await fetchJson("/abc", { raw: true });

          expect(data).toEqual([
            "/abc",
            {
              headers: {
                "Content-Type": "application/json; charset=utf-8",
                Accept: "application/json",
              },
            },
          ]);

          done();
        } catch (e) {
          done(`Shouldn't happen ${e}`);
        }
      })();
    });
  });
});

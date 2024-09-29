(async function () {
  try {
    const resp = await fetch("http://localhost:4299/api/timeout", {
      signal: AbortSignal.timeout(2000),
    });

    console.log("resp: ", resp);
  } catch (e) {
    console.log("catch: ", e);
  }
})();

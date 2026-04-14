import "@testing-library/jest-dom";
import "whatwg-fetch";

// Polyfill for Request, Response, Headers if not available (Next.js server side needs these)
if (typeof Request === "undefined") {
  global.Request = require("node-fetch").Request as any;
  global.Response = require("node-fetch").Response as any;
  global.Headers = require("node-fetch").Headers as any;
}

// Polyfill for Response.json if not available
if (typeof Response.json === "undefined") {
  (Response as any).json = (data: any, init?: any) => {
    const body = JSON.stringify(data);
    return new Response(body, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers || {}),
      },
    });
  };
}

import { ensureShareMeta } from "./bip-share-meta.mjs";

function shareMiddleware(req, res, next) {
  const pathOnly = String(req.url ?? "/").split("?", 1)[0] ?? "/";
  const method = (req.method ?? "GET").toUpperCase();
  // Vite would otherwise serve api/subscribe.js for this URL. POST stays on the app route.
  if (pathOnly === "/api/subscribe" && method === "GET") {
    res.statusCode = 405;
    res.setHeader("content-type", "application/json; charset=utf-8");
    res.end(JSON.stringify({ error: "Method not allowed." }));
    return;
  }
  const accept = String(req.headers.accept ?? "");
  const isDoc =
    method === "GET" &&
    (accept.includes("text/html") || accept.includes("*/*") || accept === "") &&
    !pathOnly.startsWith("/api/") &&
    !/\.[a-z0-9]+$/i.test(pathOnly);
  if (!isDoc) {
    next();
    return;
  }

  const chunks = [];
  const originalWrite = res.write.bind(res);
  const originalEnd = res.end.bind(res);
  const push = (chunk, encoding) => {
    if (!chunk) return;
    chunks.push(
      Buffer.isBuffer(chunk)
        ? chunk
        : Buffer.from(chunk, typeof encoding === "string" ? encoding : "utf8"),
    );
  };
  res.write = (chunk, encoding, cb) => {
    push(chunk, encoding);
    const done = typeof encoding === "function" ? encoding : cb;
    if (typeof done === "function") done();
    return true;
  };
  res.end = (chunk, encoding, cb) => {
    let done = cb;
    let enc = encoding;
    if (typeof chunk === "function") {
      done = chunk;
      chunk = undefined;
      enc = undefined;
    } else if (typeof enc === "function") {
      done = enc;
      enc = undefined;
    }
    push(chunk, enc);
    const body = Buffer.concat(chunks);
    const type = String(res.getHeader("content-type") ?? "");
    if (!type.includes("text/html")) {
      if (body.length) originalWrite(body);
      return originalEnd(undefined, undefined, done);
    }
    const html = ensureShareMeta(body.toString("utf8"));
    const out = Buffer.from(html);
    if (!res.headersSent) {
      res.setHeader("content-length", String(out.length));
    }
    return originalEnd(out, undefined, done);
  };
  next();
}

export function bipSharePlugin() {
  return {
    name: "bip-share-meta",
    configureServer(server) {
      server.middlewares.use(shareMiddleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use(shareMiddleware);
    },
  };
}

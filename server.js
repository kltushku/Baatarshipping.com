const http = require("http");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");

const port = process.env.PORT || 3000;
const publicDir = path.join(__dirname, "public");

const mimeTypes = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
};

const send = (res, statusCode, body, contentType = "text/plain") => {
  res.writeHead(statusCode, { "Content-Type": contentType });
  res.end(body);
};

const sendJson = (res, statusCode, payload) => {
  send(res, statusCode, JSON.stringify(payload), "application/json");
};

const serveStatic = (res, filePath) => {
  fs.readFile(filePath, (error, content) => {
    if (error) {
      send(res, 500, "Server error");
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    send(res, 200, content, mimeTypes[ext] || "application/octet-stream");
  });
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === "/api/status" && req.method === "GET") {
    sendJson(res, 200, {
      status: "ok",
      service: "Baatar Shipping",
      timestamp: new Date().toISOString(),
    });
    return;
  }

  if (url.pathname === "/api/quote" && req.method === "POST") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      let payload = {};

      try {
        payload = body ? JSON.parse(body) : {};
      } catch (error) {
        sendJson(res, 400, { error: "Invalid JSON payload." });
        return;
      }

      const { origin, destination, weight, mode } = payload;
      const weightNum = Number(weight) || 0;
      const modeFactor = mode === "air" ? 2.2 : mode === "sea" ? 1.4 : 1.0;
      const estimate = Math.round((50 + weightNum * 1.5) * modeFactor);

      sendJson(res, 200, {
        origin: origin || "TBD",
        destination: destination || "TBD",
        mode: mode || "road",
        weight: weightNum,
        estimate,
      });
    });
    return;
  }

  if (req.method !== "GET") {
    send(res, 405, "Method not allowed");
    return;
  }

  const safePath = path
    .normalize(url.pathname)
    .replace(/^\.\.(\/|\\|$)+/, "");
  const filePath = path.join(publicDir, safePath === "/" ? "index.html" : safePath);

  fs.stat(filePath, (error, stats) => {
    if (!error && stats.isFile()) {
      serveStatic(res, filePath);
      return;
    }

    const fallback = path.join(publicDir, "index.html");
    serveStatic(res, fallback);
  });
});

server.listen(port, () => {
  console.log(`Baatar Shipping server running on port ${port}`);
});

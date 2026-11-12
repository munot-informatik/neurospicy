// Kleiner lokaler Server ohne Abhängigkeiten: `node server.js` → http://localhost:5173
const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 5173;
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".svg": "image/svg+xml" };

http.createServer((req, res) => {
  const name = decodeURIComponent(req.url.split("?")[0]);
  const file = path.join(__dirname, name === "/" ? "index.html" : path.normalize(name).replace(/^([/\\]|\.\.)+/, ""));
  if (!file.startsWith(__dirname) || !TYPES[path.extname(file)]) { res.writeHead(404); return res.end("Not found"); }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); return res.end("Not found"); }
    res.writeHead(200, { "Content-Type": TYPES[path.extname(file)], "Cache-Control": "no-store" });
    res.end(data);
  });
}).listen(PORT, "127.0.0.1", () => console.log("Neurospicy läuft auf http://localhost:" + PORT));

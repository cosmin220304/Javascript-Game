const express = require("express");
const path = require("path");
const server = express();
const PORT = 8080;

server.use(express.static(path.join(__dirname, "build")));
server.use("/", express.static(path.join(__dirname, "build", "index.html")));

server.listen(PORT, () =>
  console.log(`Listening on http://localhost:${PORT}/`)
);

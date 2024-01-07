const express = require("express");

// Create a new express application instance
host = "localhost";
port = 3001;

const app = express();

app.get("/", (req, res) => {
  res.send("Hello Home!");
  // RESTE DU FONCTIONNEMENT DE LA ROUTE /
});

app.get("/api", (req, res) => {
  res.send("Hello Api!");
  // RESTE DU FONCTIONNEMENT DE LA ROUTE /api
});

app.listen(port, host, () => {
  console.log(`Example app listening at http://${host}:${port}`);
});

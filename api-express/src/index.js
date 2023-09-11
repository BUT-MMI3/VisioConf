const express = require("express");

// Create a new express application instance
host = "localhost";
port = 3000;

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, host, () => {
  console.log(`Example app listening at http://${host}:${port}`);
});

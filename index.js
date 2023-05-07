const express = require("express");
const connectToMongo = require("./db");
var cors = require("cors");
const app = express();

app.use(cors());

// to deal requests in json format
app.use(express.json());

connectToMongo();

const port = 5000;

// Available routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/items", require("./routes/items"));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

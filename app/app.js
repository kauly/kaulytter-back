const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const routes = require("./routes/index");
require("dotenv").config();

const app = express();
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true });

//MIDDLEWARES
app.use(cors());
app.use(logger("dev"));
app.use(bodyParser.urlencoded({ limit: "150mb", extended: true }));
app.use(bodyParser.json({ limit: "150mb", extended: true }));

//ROTAS
app.use("/api", routes);

const port = process.env.PORT || 3003;

app.listen(port, function() {
  console.log(`Server is running at port ${port}.`);
});

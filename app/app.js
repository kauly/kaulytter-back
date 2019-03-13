const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const cloud = require("cloudinary");
const fileUpload = require("express-fileupload");
const routes = require("./routes/index");
require("dotenv").config();

const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

//THIRD
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true });
cloud.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET
});

//MIDDLEWARES
app.use(cors());
app.use(logger("dev"));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/"
  })
);
app.use(bodyParser.urlencoded({ limit: "150mb", extended: true }));
app.use(bodyParser.json({ limit: "150mb", extended: true }));

//ROTAS
app.use("/api", routes);

const port = process.env.PORT || 3003;
io.on("connection", function(socket) {
  console.log("a user connected");
});
http.listen(port, function() {
  console.log(`Server is running at port ${port}.`);
});

module.exports.io = io;

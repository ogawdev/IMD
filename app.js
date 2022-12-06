const fs = require("fs");
const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const mongo = require("./src/modules/db");
const fileUpload = require("express-fileupload");
const morgan = require("morgan");
const main = require("./src/bot/main");
const app = express();

mongo();

(async () => {  
  await main() 
})();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src", "views"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "src", "public")));
app.use(cookieParser());
app.use(fileUpload());
app.use(morgan("tiny"));

const pathToRoutes = path.join(__dirname, "src", "routes");
fs.readdir(pathToRoutes, (err, files) => {
  if (err) throw new Error(err);

  files.forEach((file) => {
    const Route = require(path.join(pathToRoutes, file));
    if (Route.path && Route.router) app.use(Route.path, Route.router);
  });

  app.get("*", (req, res) => {
    res.render("404");
  });
});

module.exports = app;

var express     = require("express");
var urlmodule   = require("url");
var pathmodule  = require("path");
var fs          = require("fs");
var less        = require("less-middleware");

var app = express();
app.engine("hbs", require("express-handlebars")({}));
app.set("view engine", "hbs");
app.set("views", pathmodule.join(__dirname, "frontend", "views"));
app.use(require("morgan")('dev'));
app.use(less(pathmodule.join(__dirname, "frontend", "public"),
{
  dest: pathmodule.join(__dirname, "frontend", "public"),
  preprocess: {
    path: function(lessPath, req) {
      console.log(lessPath);
      return lessPath.replace(pathmodule.join(__dirname, "frontend", "public", "assets", "css"), pathmodule.join(__dirname, "frontend", "public", "assets", "less"));
    }
  }
}));
app.use(express.static(pathmodule.join(__dirname, "frontend", "public")));

app.all(/^([^.]+)$/, function(req, res) {
  var path = urlmodule.parse(req.url).pathname.substr(1);
  var json = {};
  try {
    json = JSON.parse(fs.readFileSync(pathmodule.join(__dirname, "data", path + ".json")));
  } catch (err) {
  }
  res.render(path, json);
});

app.listen(8080);

var express     = require("express");
var urlmodule   = require("url");
var pathmodule  = require("path");
var fs          = require("fs");
var less        = require("less-middleware");
var helpers     = require("Handlebars-Helpers");
var hbsexpress  = require("hbs");

var app = express();
app.engine("hbs", hbsexpress.__express);
app.set("view engine", "hbs");

helpers.register(hbsexpress.handlebars, { include: {
  lookup: function (path) {
    return (new (app.get("view"))(path, {
      defaultEngine: app.get("view engine"),
      root: app.get("views"),
      engines: app.engines
    })).path;
  },
  cache: hbsexpress.cache
}});

app.set("views", pathmodule.join(__dirname, "frontend", "views"));
app.use(require("morgan")('dev'));
app.use(less(pathmodule.join(__dirname, "frontend", "public"),
{
  dest: pathmodule.join(__dirname, "frontend", "public"),
  preprocess: {
    path: function(lessPath, req) {
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

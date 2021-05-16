let express = require('express');
let app = express();
const ejs = require("ejs");
const bodyParser = require("body-parser");
const routes = require('./routes');

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.use(express.static('./views'));

//  Connect all our routes to our application
app.use('/', routes);

let server = app.listen(3000, function () {
   let host = server.address().address
   let port = server.address().port
   console.log("Example app listening at %s", port)
})
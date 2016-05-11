var koa = require('koa')
var handlebars = require('koa-handlebars')
var route = require('koa-route')
var serve = require('koa-static')

var bcp = require('./rites/bcp.js')

var app = koa()

app.use(handlebars({
  defaultLayout: 'main',
  cache: app.env !== "development",
  helpers: {
    'drop':  function(text) {
      textList = text.split(" ");
      return `<span class="dropcap">${textList[0][0]}</span>${textList[0].substring(1).toUpperCase()} ${textList.slice(1).join(" ")}`;
    }
  }
}))

app.use(serve('public'));

// route middleware
app.use(route.get('/', function* () {
  yield this.render('index', {
    title: 'test page',
    name: 'world'
  })
}))

app.use(route.get('/compline', function *(){
  yield this.render('compline', bcp.compline());
}))

app.listen(3000)

// combine:
// Base (sunday?)
// Weekday
// Season
// Sunday+day OR
// Date?

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
  },
  partials: {
    'verse': `<p class="verse"><span>{{V}}</span>  <span>{{R}}</span></p>`,
    'psalm': `<section>
                <h3>
                  <span class="title">Psalm {{hebrewNumber}}. </span>
                  <span class="subtitle">{{incipit}}</span>
                </h3>
                {{#each verses}}
                  {{#if @first}}
                    <p class="drop">{{{drop this}}}</p>
                  {{else}}
                    <p>{{{this}}}</p>
                  {{/if}}
                {{/each}}
              </section>`,
    'chapter': `<h3>
                  <span class="title">Chapter. </span>
                  <span class="subtitle">{{citation}}</span>
                </h3>
                <p class="drop">{{{drop text}}}&emsp;{{response}}</p>`,
    'hymn': `<section>
              <h3>
                <span class="title">Hymn.</span>
                <span class="subtitle">{{incipit}}</span>
              </h3>
              {{#each stanzas}}
                <div class="stanza">
                  {{#each this}}
                    {{#if @../first}}
                      {{#if @first}}
                        <p>{{{drop this}}}</p>
                      {{else}}
                        <p>{{this}}</p>
                      {{/if}}
                    {{else}}
                      <p>{{this}}</p>
                    {{/if}}
                  {{/each}}
                </div>
              {{/each}}
            </section>`
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

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
      if (textList[0].length == 1) {
        textList[1] = '&ensp;' + textList[1].toUpperCase();
      }
      return `<span class="dropcap">${textList[0][0]}</span>${textList[0].substring(1).toUpperCase()} ${textList.slice(1).join(" ")}`;
    },
    'inc': function(value) {
      return parseInt(value) +1;
    }
  },
  partials: {
    'inNomine': `<p>✠ In the Name <i>&c.</i> Our Father <i>&c.</i> Hail, Mary <i>&c.</i></p>`,
    'deusInAdjutorium': `<p class="drop">{{{drop deusInAdjutorium}}}</p>
    {{#unless septuagesima}}
    <p>Alleluya.</p>
    {{else}}
    <p>{{lausTibiDomine}}</p>
    {{/unless}}
    `,
    'amen': `<span class="response">Amen.</span>`,
    'verse': `<p class="verse"><span>{{V}}</span>  <span>{{R}}</span></p>`,
    'psalm': `<section>
                <h3>
                  <span class="title">Psalm {{hebrewNumber}}. </span>
                  <span class="subtitle">{{incipit}}</span>
                </h3>
                {{#each verses}}
                  {{#if @first}}
                    <p class="drop">{{{drop this.[0]}}} * {{{this.[1]}}}</p>
                  {{else}}
                    <p>{{inc @index}}. {{{this.[0]}}} * {{{this.[1]}}}</p>
                  {{/if}}
                {{/each}}
              </section>`,
    'chapter': `<h3>
                  <span class="title">Chapter. </span>
                  <span class="subtitle">{{citation}}</span>
                </h3>
                <p class="drop">{{{drop text}}}&emsp;{{response}}</p>`,
    'hymn': `<section>
              {{#if this}}
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
              {{else}}
              <h3>No hymn provided.</h3>
              {{/if}}
            </section>`,
      'dropcap': `<p class="drop">{{{drop this}}}</p>`,
      'preces': `
        <h3>
          <span class="title">The Preces</span>
        </h3>
        <p>{{kyries}}</p>
        {{>dropcap paterNoster}}
        {{#each verses}}
          {{> verse this}}
        {{/each}}`,
      'collect': `
        {{#if this}}
          {{#if title}}
            <h4>{{title}}</h4>
          {{/if}}
          <p class="drop">{{{drop text}}} {{{doxology}}}&ensp;{{> amen}}</p>
        {{else}}
         No collect.
        {{/if}}
      `
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

app.use(route.get('/evensong', function *(){
  yield this.render('evensong', bcp.evensong());
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

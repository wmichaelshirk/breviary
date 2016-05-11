var low = require('lowdb')
var storage = require('lowdb/file-sync')

var verses = low('en/verses.json', { storage })
var psalms = low('en/psalms.json', { storage })
var canticles = low('en/canticles.json', { storage })
var hymns = low('en/hymns.json', { storage })

module.exports = {
  compline() {
    'use strict';
    let sacerdotalVerse = verses('converteNos').value()
    let dominusVobiscum = verses('dominusVobiscum').value()
    let benedicamusDomino = verses('benedicamusDomino').value()
    let hymnVerse = verses('custodiNos').value()
    let lausTibiDomine = verses('lausTibiDomine').value()
    let domineExaudi = verses('domineExaudi').value()
    let gloriaPatri = psalms('gloriaPatri').value()
    let preces = verses('preces').find({office: 'compline'})
    let hymn = hymns('hymns').find({incipit: 'Jesu nostra redempcio'})

    return {
      sacerdotalVerse,
      lausTibiDomine,
      deusInAdjutorium: 'O God, ✠ make speed to save me.  ℟. O Lord, make haste to help me.  Glory be to the Father, and to the Son : and to the Holy Ghost.  As it was in the beginning, is now, and ever shall be : world without end.  Amen.',
      psalms: [
        psalms('psalms').find({incipit: 'Cum invocarem'}),
        psalms('psalms').find({hebrewNumber: 91}),
        psalms('psalms').find({hebrewNumber: 134})
      ].map(psalm => {
        return Object.assign({}, psalm, {verses: [...psalm.verses, ...gloriaPatri]})
      }),
      chapter: {
        citation: "Jeremiah xiv.",
        text: "Thou, O Lord, art in the midst of us, and we are called by thy name. Leave us not, O Lord our God."
      },
      chapterResponse: "℟. Thanks be to God.",
      hymn,
      hymnVerse,
      canticle: canticles('canticles').find({incipit: 'Nunc dimittis'}),
      paterNoster: 'Our Father, which art in heaven, Hallowed be thy Name. Thy kingdom come. Thy will be done in earth, As it is in heaven. Give us this day our daily bread. And forgive us our trespasses, As we forgive them that trespass against us. And lead us not into temptation, But deliver us from evil. Amen.',
      preces: preces.verses,
      preces2: preces.verses2,
      collect: 'Lighten our darkness, we beseech thee, O Lord, and by thy great mercy defend us from all perils and dangers of this night, for the love thy only Son, our Saviour Jesus Christ.',
      amen: '℟. Amen.',
      kyries: '℣. Kyrie eleyson.  ℟. Christe eleyson.  Kyrie eleyson.',
      domineExaudi,
      dominusVobiscum,
      benedicamusDomino,
      septuagesima: false
    }
  }
}

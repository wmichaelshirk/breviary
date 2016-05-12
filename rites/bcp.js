var low = require('lowdb')
var storage = require('lowdb/file-sync')

var verses = low('en/verses.json', { storage })
var psalms = low('en/psalms.json', { storage })
var canticles = low('en/canticles.json', { storage })
var hymns = low('en/hymns.json', { storage })

module.exports = {
  compline() {
    'use strict';
    let dominusVobiscum = verses('verses').find({incipit: 'dominusVobiscum'})
    let benedicamusDomino = verses('verses').find({incipit: 'benedicamusDomino'})
    let lausTibiDomine = verses('verses').find({incipit: 'lausTibiDomine'})
    let domineExaudi = verses('verses').find({incipit: 'domineExaudi'})
    let gloriaPatri = psalms('gloriaPatri').value()
    let preces = verses('preces').find({office: 'compline'})

    return {
      sacerdotalVerse: verses('verses').find({incipit: 'converteNos'}),
      lausTibiDomine,
      deusInAdjutorium: 'O &nbsp;God, ✠ make speed to save me.  ℟. O Lord, make haste to help me.  Glory be to the Father, and to the Son : and to the Holy Ghost.  As it was in the beginning, is now, and ever shall be : world without end.  Amen.',
      psalms: [
        psalms('psalms').find({incipit: 'Cum invocarem'}),
        psalms('psalms').find({hebrewNumber: 91}),
        psalms('psalms').find({hebrewNumber: 134})
      ].map(psalm => {
        return Object.assign({}, psalm, {verses: [...psalm.verses, ...gloriaPatri]})
      }),
      chapter: {
        citation: "Jeremiah xiv.",
        text: "Thou, O Lord, art in the midst of us, and we are called by thy name. Leave us not, O Lord our God.",
        response: "℟. Thanks be to God."
      },
      hymn: hymns('hymns').find({incipit: 'Jesu nostra redempcio'}),
      hymnVerse: verses('verses').find({incipit: 'custodiNos'}),
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

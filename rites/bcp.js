;(function() {
'use strict'
var low = require('lowdb')
var storage = require('lowdb/file-sync')

let bcp = low('rites/bcp.json', { storage })

var verses = low('en/verses.json', { storage })
var psalmDb = low('en/psalms.json', { storage })
var canticles = low('en/canticles.json', { storage })
var hymns = low('en/hymns.json', { storage })
var collectDb = low('en/collects.json', { storage })

let dominusVobiscum = verses('verses').find({incipit: 'dominusVobiscum'})
let benedicamusDomino = verses('verses').find({incipit: 'benedicamusDomino'})
let lausTibiDomine = verses('verses').find({incipit: 'lausTibiDomine'})
let gloriaPatri = psalmDb('gloriaPatri').value()
let deusInAdjutorium = 'O God, ✠ make speed to save me.  ℟. O Lord, make haste to help me.  Glory be to the Father, and to the Son : and to the Holy Ghost.  As it was in the beginning, is now, and ever shall be : world without end.  Amen.'
let paterNoster = 'Our Father, which art in heaven, Hallowed be thy Name. Thy kingdom come. Thy will be done in earth, As it is in heaven. Give us this day our daily bread. And forgive us our trespasses, As we forgive them that trespass against us. And lead us not into temptation, But deliver us from evil. Amen.'

module.exports = {
  evensong() {
    const date = (new Date).getDate()
    const psalms = bcp('date')
        .find({day: date})
        .evensong
        .map(ps => {
          let [psalm, number] = ps.split('@')
          return psalmDb(psalm).find({hebrewNumber: number})
        })
        .map(psalm => {
          return Object.assign({}, psalm, {verses: [...psalm.verses, ...gloriaPatri]})
        })
    return {
      deusInAdjutorium,
      psalms,
      preces: {
        kyries: '℣. Kyrie eleyson.  ℟. Christe eleyson.  Kyrie eleyson.',
        paterNoster,
        verses: [
          {
            V: "O Lord, shew thy mercy upon ús.",
            R: "And grant us thy salvátion."
          }, {
            V: "O Lord, save the Státe.",
            R: "And mercifully hear us when we call upon thée."
          }, {
            V: "Endue thy Ministers with ríghteousness.",
            R: "And make thy chosen people jóyful."
          }, {
            V: "O Lord, save thy péople.",
            R: "And bless thine inhéritance."
          }, {
            V: "Give peace in our time, O Lórd.",
            R: "Because there is none other that fighteth for us, but only thou, O Gód."
          }, {
            V: "O God, make clean our hearts within ús.",
            R: "And take not thy Holy Spirit from ús."
          }
        ]
      },
      collect: collectDb('collect').find({feast: "Sunday after Ascension"}),
      forPeace: collectDb('collect').find({title: "The Collect for Peace"}),
      forAid: collectDb('collect').find({title: "The Collect for Aid against all Perils"}),
      dominusVobiscum,
      benedicamusDomino
    }
  },

  compline() {

    let domineExaudi = verses('verses').find({incipit: 'domineExaudi'})
    let preces = verses('preces').find({office: 'compline'})

    return {
      sacerdotalVerse: verses('verses').find({incipit: 'converteNos'}),
      lausTibiDomine,
      deusInAdjutorium,
      psalms: [
        psalmDb('psalm').find({incipit: 'Cum invocarem'}),
        psalmDb('psalm').find({hebrewNumber: "91"}),
        psalmDb('psalm').find({hebrewNumber: "134"})
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
      paterNoster,
      preces: preces.verses,
      preces2: preces.verses2,
      collect: Object.assign({},
        collectDb('collect').find({title: "At Compline"}),
        {title: null}),
      kyries: '℣. Kyrie eleyson.  ℟. Christe eleyson.  Kyrie eleyson.',
      domineExaudi,
      dominusVobiscum,
      benedicamusDomino,
      septuagesima: false
    }
  }
}
})()

const localization = require('../../../../../index.js')

module.exports = {
  get: async (req) => {
    if (!req.query || !req.query.languageid) {
      throw new Error('invalid-languageid')
    }
    if (!localization.languageIndex[req.query.languageid]) {
      throw new Error('invalid-languageid')
    }
    const translation = require(`../../../../../translations-cache-${req.query.languageid}`)
    const copy = JSON.parse(JSON.stringify(translation))
    const correctionsRaw = await localization.Storage.read(`corrections/${req.query.languageid}`)
    if (!correctionsRaw || !correctionsRaw.length) {
      return copy
    }
    const corrections = JSON.parse(correctionsRaw)
    for (const phrase in corrections) {
      copy[phrase].corrections = corrections[phrase]
    }
    return copy
  }
}

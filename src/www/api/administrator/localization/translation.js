const localization = require('../../../../../index.js')

module.exports = {
  get: async (req) => {
    if (!req.query || !req.query.languageid) {
      throw new Error('invalid-languageid')
    }
    for (const language of localization.languageList) {
      if (language.languageid !== req.query.languageid) {
        continue
      }
      const translation = require(`../../../../../translations-cache-${req.query.languageid}`)
      translation.object = 'translation'
      const correctionsRaw = await localization.Storage.read(`corrections/${req.query.languageid}`)
      if (!correctionsRaw || !correctionsRaw.length) {
        return translation
      }
      const corrections = JSON.parse(correctionsRaw)
      for (const phrase in corrections) {
        translation[phrase].corrections = corrections[phrase]
      }
      return translation
    }
    throw new Error('invalid-languageid')
  }
}

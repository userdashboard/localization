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
      const activeLanguages = await localization.StorageList.listAll(`${req.appid}/activeLanguages`)
      if (activeLanguages && activeLanguages.length) {
        language.active = activeLanguages.indexOf(language.languageid) > -1
      }
      if (!language.active) {
        throw new Error('invalid-language')
      }
      return JSON.parse(JSON.stringify(language))
    }
    throw new Error('invalid-languageid')
  }
}

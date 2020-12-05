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
      const copy = JSON.parse(JSON.stringify(language))
      const activeLanguages = await localization.StorageList.listAll(`${req.appid}/activeLanguages`)
      if (activeLanguages && activeLanguages.length) {
        copy.active = activeLanguages.indexOf(language.languageid) > -1
      } else {
        copy.active = false
      }
      return copy
    }
    throw new Error('invalid-languageid')
  }
}

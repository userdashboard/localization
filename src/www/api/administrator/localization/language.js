const localization = require('../../../../../index.js')

module.exports = {
  get: async (req) => {
    if (!req.query || !req.query.languageid) {
      throw new Error('invalid-languageid')
    }
    for (const language of localization.languageList) {
      if (language.languageid === req.query.languageid) {
        const activeLanguages = await localization.StorageList.listAll(`${req.appid}/activeLanguages`)
        if (activeLanguages && activeLanguages.length) {
          language.active = activeLanguages.indexOf(language.languageid) > -1
        }
        return language
      }
    }
    throw new Error('invalid-languageid')
  }
}

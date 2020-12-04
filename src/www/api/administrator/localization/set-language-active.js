const localization = require('../../../../../index.js')

module.exports = {
  patch: async (req) => {
    if (!req.query || !req.query.languageid) {
      throw new Error('invalid-languageid')
    }
    if (!localization.languageIndex[req.query.languageid]) {
      throw new Error('invalid-languageid')
    }
    let selectedLanguage
    for (const language of localization.languageList) {
      if (language.languageid === req.query.languageid) {
        selectedLanguage = language
        break
      }
    }
    const languages = await localization.StorageList.listAll(`${req.appid}/activeLanguages`)
    if (languages && languages.length && languages.indexOf(req.query.languageid) > -1) {
      throw new Error('invalid-language')
    }
    await localization.StorageList.add(`${req.appid}/activeLanguages`, req.query.languageid)
    selectedLanguage.active = true
    return selectedLanguage
  }
}

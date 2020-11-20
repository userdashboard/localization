const localization = require('../../../../../index.js')

module.exports = {
  patch: async (req) => {
    if (!req.query || !req.query.languageid) {
      throw new Error('invalid-languageid')
    }
    let selectedLanguage
    for (const language of localization.languageList) {
      if (language.languageid === req.query.languageid) {
        selectedLanguage = language
        break
      }
    }
    if (!selectedLanguage) {
      throw new Error('invalid-languageid')
    }
    const languages = await localization.StorageList.listAll(`${req.appid}/activeLanguages`)
    if (!languages || !languages.length || languages.indexOf(req.query.languageid) === -1) {
      throw new Error('invalid-language')
    }
    await localization.StorageList.remove(`${req.appid}/activeLanguages`, req.query.languageid)
    return selectedLanguage
  }
}

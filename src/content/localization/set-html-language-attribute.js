module.exports = {
  template: (req, _, templateDoc) => {
    let language
    if (global.enableLanguagePreference) {
      language = req.account ? req.account.languageid : null
    }
    language = req.language || language || global.language || 'en'
    if (language === 'en') {
      return
    }
    const htmlTag = templateDoc.getElementsByTagName('html')[0]
    htmlTag.setAttribute('lang', language)
  },
  page: (req, _, pageDoc) => {
    let language
    if (global.enableLanguagePreference) {
      language = req.account ? req.account.languageid : null
    }
    language = req.language || language || global.language || 'en'
    if (language === 'en') {
      return
    }
    const htmlTag = pageDoc.getElementsByTagName('html')[0]
    htmlTag.setAttribute('lang', language)
  }
}

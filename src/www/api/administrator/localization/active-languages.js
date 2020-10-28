const localization = require('../../../../../index.js')

module.exports = {
  get: async () => {
    const languages = await localization.StorageList.listAll('activeLanguages')
    const active = []
    if (languages && languages.length) {
      for (const object of localization.languageList) {
        if (languages.indexOf(object.languageid) > -1) {
          active.push(object)
        }
      }
    }
    return active
  }
}

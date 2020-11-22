const localization = require('../../../../../index.js')

module.exports = {
  get: async (req) => {
    req.query = req.query || {}
    const storage = req.storage || localization
    let languageids
    if (req.query.all) {
      languageids = await storage.StorageList.listAll(`${req.appid}/activeLanguages`)
    } else {
      const offset = req.query.offset ? parseInt(req.query.offset, 10) : 0
      const limit = req.query.limit ? parseInt(req.query.limit, 10) : global.pageSize
      languageids = await storage.StorageList.list(`${req.appid}/activeLanguages`, offset, limit)
    }
    if (!languageids || !languageids.length) {
      return null
    }
    const languages = []
    for (const languageid of languageids) {
      req.query.languageid = languageid
      const language = await global.api.administrator.localization.Language.get(req)
      languages.push(language)
    }
    return languages
  }
}
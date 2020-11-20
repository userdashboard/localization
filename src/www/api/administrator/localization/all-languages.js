const localization = require('../../../../../index.js')

module.exports = {
  get: async (req) => {
    req.query = req.query || {}
    const offset = req.query.offset ? parseInt(req.query.offset, 10) : 0
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : global.pageSize
    const languages = []
    if (req.query.all) {
      for (const i in localization.languageList) {
        req.query.languageid = localization.languageList[i].languageid
        const language = await global.api.administrator.localization.Language.get(req)
        languages.push(language)
      }
      return languages
    }
    console.log('fetching', req.url, offset, limit)
    for (const i in localization.languageList) {
      console.log('offset', offset, 'i', i)
      if (i < offset) {
        continue
      }
      req.query.languageid = localization.languageList[i].languageid
      const language = await global.api.administrator.localization.Language.get(req)
      languages.push(language)
      if (limit && languages.length === limit) {
        break
      }
    }
    return languages
  }
}
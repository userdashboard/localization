const localization = require('../../../../../index.js')

module.exports = {
  patch: async (req) => {
    if (!global.enableLanguagePreference) {
      throw new Error('invalid-language')
    }
    if (!req.query || !req.query.accountid) {
      throw new Error('invalid-accountid')
    }
    const account = await global.api.user.Account.get(req)
    if (!account) {
      throw new Error('invalid-accountid')
    }
    if (!req.body || !req.body.languageid) {
      throw new Error('invalid-languageid')
    }
    const storage = req.storage || localization
    const activeLanguages = await storage.StorageList.listAll(`${req.appid}/activeLanguages`)
    if (!activeLanguages || !activeLanguages.length) {
      if (localization.languageIndex[req.body.languageid]) {
        throw new Error('invalid-language')
      }
      throw new Error('invalid-languageid')
    }
    if (activeLanguages.indexOf(req.body.languageid) === -1) {
      throw new Error('invalid-language')
    }
    await localization.StorageObject.setProperty(`${req.appid}/account/${req.query.accountid}`, 'languageid', req.body.languageid)
    req.account.languageid = req.body.languageid
    return req.account
  }
}

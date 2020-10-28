const localization = require('../../../../../index.js')

module.exports = {
  patch: async (req) => {
    console.log(1)
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
    const activeLanguages = await global.api.user.localization.Languages.get(req)
    console.log('checking', req.account)
    for (const language of activeLanguages) {
      if (language.languageid === req.body.languageid) {
        await localization.StorageObject.setProperty(`${req.appid}/account/${req.query.accountid}`, 'languageid', req.body.languageid)
        req.account.languageid = req.body.languageid
        return req.account
      }
    }
    throw new Error('invalid-language')
  }
}

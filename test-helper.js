/* eslint-env mocha */
global.applicationPath = global.applicationPath || __dirname
const TestHelper = require('@userdashboard/dashboard/test-helper.js')
module.exports = TestHelper
global.testConfiguration.enableLanguagePreference = true
global.testConfiguration.language = undefined

module.exports.setUserLanguage = setUserLanguage
module.exports.setLanguageActive = setLanguageActive
module.exports.setLanguageInactive = setLanguageInactive

async function setUserLanguage (user, languageid) {
  const req = TestHelper.createRequest(`/api/user/localization/set-account-language?accountid=${user.account.accountid}`)
  req.account = user.account
  req.session = user.session
  req.body = {
    languageid
  }
  user.account = await req.patch()
  return user.account
}

async function setLanguageActive (administrator, languageid) {
  const req = TestHelper.createRequest(`/api/administrator/localization/set-language-active?languageid=${languageid}`)
  req.account = administrator.account
  req.session = administrator.session
  return req.patch()
}

async function setLanguageInactive (administrator, languageid) {
  const req = TestHelper.createRequest(`/api/administrator/localization/set-language-inactive?languageid=${languageid}`)
  req.account = administrator.account
  req.session = administrator.session
  return req.patch()
}

/* eslint-env mocha */
const assert = require('assert')
const applyLanguagePreference = require('./apply-translation.js')
const TestHelper = require('../../../test-helper.js')

describe('server/localization/apply-translation', () => {
  it('should return application default', async () => {
    delete (global.language)
    delete (global.enableLanguagePreference)
    const user = await TestHelper.createUser()
    const req = TestHelper.createRequest('/account/change-username')
    delete (req.stripeKey)
    req.account = user.account
    req.session = user.session
    await applyLanguagePreference.after(req)
    assert.strictEqual(req.html, undefined)
  })

  it('should apply configured language', async () => {
    global.language = 'fr'
    const user = await TestHelper.createUser()
    const req = TestHelper.createRequest('/account/change-username')
    delete (req.stripeKey)
    req.account = user.account
    req.session = user.session
    await applyLanguagePreference.after(req)
    assert.notStrictEqual(req.html, undefined)
  })

  it('should apply user-selected language', async () => {
    global.language = 'en'
    global.enableLanguagePreference = true
    const administrator = await TestHelper.createOwner()
    await TestHelper.setLanguageActive(administrator, 'fr')
    const user = await TestHelper.createUser()
    await TestHelper.setUserLanguage(user, 'fr')
    const req = TestHelper.createRequest('/account/change-username')
    delete (req.stripeKey)
    req.account = user.account
    req.session = user.session
    req.language = 'fr'
    await applyLanguagePreference.after(req)
    assert.notStrictEqual(req.html, undefined)
  })
})

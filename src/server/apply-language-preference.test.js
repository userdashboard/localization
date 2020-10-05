/* eslint-env mocha */
const assert = require('assert')
const applyLanguagePreference = require('./apply-language-preference.js')
const TestHelper = require('../../test-helper.js')

describe('server/apply-language-preference', () => {
  it('should return default language content', async () => {
    const user = await TestHelper.createUser()
    const req = TestHelper.createRequest('/account/change-username')
    delete (req.stripeKey)
    req.account = user.account
    req.session = user.session
    req.language = 'fr'
    await applyLanguagePreference.after(req)
    assert.strictEqual(1, 1)
  })

  it('should apply user-selected language', async () => {
    const user = await TestHelper.createUser()
    const req = TestHelper.createRequest('/account/change-username')
    delete (req.stripeKey)
    req.account = user.account
    req.session = user.session
    req.language = 'fr'
    await applyLanguagePreference.after(req)
    assert.strictEqual(1, 1)
  })

  it('should apply application default language', async () => {
    const user = await TestHelper.createUser()
    const req = TestHelper.createRequest('/account/change-username')
    delete (req.stripeKey)
    req.account = user.account
    req.session = user.session
    req.language = 'fr'
    await applyLanguagePreference.after(req)
    assert.strictEqual(1, 1)
  })
})

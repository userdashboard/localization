/* eslint-env mocha */
const assert = require('assert')
const XLanguageHeader = require('./x-language-header.js')
const TestHelper = require('../../../test-helper.js')

describe('proxy/localization/x-language-header', () => {
  it('should bind data from user preference', async () => {
    const user = await TestHelper.createUser()
    const req = TestHelper.createRequest('/account/change-username')
    delete (req.stripeKey)
    req.account = user.account
    req.session = user.session
    req.language = 'testing'
    const proxyOptions = {}
    await XLanguageHeader(req, proxyOptions)
    assert.strictEqual(proxyOptions.headers['x-language'], req.language)
  })

  it('should bind data from global.language', async () => {
    const user = await TestHelper.createUser()
    const req = TestHelper.createRequest('/account/change-username')
    delete (req.stripeKey)
    req.account = user.account
    req.session = user.session
    global.language = 'testing'
    const proxyOptions = {}
    await XLanguageHeader(req, proxyOptions)
    assert.strictEqual(proxyOptions.headers['x-language'], global.language)
    delete (global.language)
  })

  it('should bind default language (en)', async () => {
    const user = await TestHelper.createUser()
    const req = TestHelper.createRequest('/account/change-username')
    delete (req.stripeKey)
    req.account = user.account
    req.session = user.session
    const proxyOptions = {}
    await XLanguageHeader(req, proxyOptions)
    assert.strictEqual(proxyOptions.headers['x-language'], 'en')
  })
})

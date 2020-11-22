/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../../test-helper.js')

describe('/api/user/localization/languages', () => {
  const cachedResponses = {}
  const cachedLanguages = []
  before(async () => {
    const allLanguages = require('../../../../../index.js').languageList
    await TestHelper.setupBeforeEach()
    const administrator = await TestHelper.createOwner()
    for (const language of allLanguages) {
      await TestHelper.setLanguageActive(administrator, language.languageid)
      cachedLanguages.unshift(language.languageid)
      if (cachedLanguages.length > 5) {
        break
      }
    }
    const user = await TestHelper.createUser()
    global.delayDiskWrites = true
    const req1 = TestHelper.createRequest('/api/user/localization/languages?offset=1')
    req1.account = user.account
    req1.session = user.session
    cachedResponses.offset = await req1.get()
    const req2 = TestHelper.createRequest('/api/user/localization/languages?limit=1')
    req2.account = user.account
    req2.session = user.session
    cachedResponses.limit = await req2.get()
    const req3 = TestHelper.createRequest('/api/user/localization/languages?all=true')
    req3.account = user.account
    req3.session = user.session
    cachedResponses.all = await req3.get()
    const req4 = TestHelper.createRequest('/api/user/localization/languages')
    req4.account = user.account
    req4.session = user.session
    req4.filename = __filename
    req4.saveResponse = true
    cachedResponses.returns = await req4.get()
    global.pageSize = 3
    cachedResponses.pageSize = await req4.get()
  })
  describe('receives', () => {
    it('optional querystring offset (integer)', async () => {
      const offset = 1
      const languagesNow = cachedResponses.offset
      for (let i = 0, len = global.pageSize; i < len; i++) {
        assert.strictEqual(languagesNow[i].languageid, cachedLanguages[offset + i])
      }
    })

    it('optional querystring limit (integer)', async () => {
      const limit = 1
      const languagesNow = cachedResponses.limit
      assert.strictEqual(languagesNow.length, limit)
    })

    it('optional querystring all (boolean)', async () => {
      const languagesNow = cachedResponses.all
      assert.strictEqual(languagesNow.length, cachedLanguages.length)
    })
  })

  describe('returns', () => {
    it('array', async () => {
      const languagesNow = cachedResponses.returns
      assert.strictEqual(languagesNow.length, global.pageSize)
    })
  })

  describe('configuration', () => {
    it('environment PAGE_SIZE', async () => {
      global.pageSize = 3
      const accountsNow = cachedResponses.pageSize
      assert.strictEqual(accountsNow.length, global.pageSize)
    })
  })
})

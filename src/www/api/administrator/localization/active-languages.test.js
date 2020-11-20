/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../../test-helper.js')

describe('/api/administrator/localization/active-languages', () => {
  const cachedResponses = {}
  const cachedLanguages = []
  before(async () => {
    await TestHelper.setupBeforeEach()
    const administrator = await TestHelper.createUser()
    global.delayDiskWrites = true
    const activeLanguages = ['af', 'ga', 'it', 'ja', 'ko', 'kn']
    for (let i = 0, len = activeLanguages.length; i < len; i++) {
      await TestHelper.setLanguageActive(administrator, activeLanguages[i])
      cachedLanguages.unshift(activeLanguages[i])
    }
    const req1 = TestHelper.createRequest('/api/administrator/localization/active-languages?offset=1')
    req1.account = administrator.account
    req1.session = administrator.session
    cachedResponses.offset = await req1.get()
    const req2 = TestHelper.createRequest('/api/administrator/localization/active-languages?limit=1')
    req2.account = administrator.account
    req2.session = administrator.session
    cachedResponses.limit = await req2.get()
    const req3 = TestHelper.createRequest('/api/administrator/localization/active-languages?all=true')
    req3.account = administrator.account
    req3.session = administrator.session
    cachedResponses.all = await req3.get()
    const req4 = TestHelper.createRequest('/api/administrator/localization/active-languages')
    req4.account = administrator.account
    req4.session = administrator.session
    req4.filename = __filename
    req4.saveResponse = true
    cachedResponses.returns = await req4.get()
    global.pageSize = 3
    cachedResponses.pageSize = await req4.get()
    console.log(cachedResponses)
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

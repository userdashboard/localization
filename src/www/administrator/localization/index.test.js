/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../test-helper.js')

describe('/administrator/localization', () => {
  describe('exceptions', () => {
    it('should require language enabled', async () => {
      global.enableLanguagePreference = false
      const administrator = await TestHelper.createOwner()
      const req = TestHelper.createRequest('/administrator/localization')
      req.administrator = administrator.administrator
      req.session = administrator.session
      let errorMessage
      try {
        await req.route.api.before(req)
      } catch (error) {
        errorMessage = error.message
      }
      assert.strictEqual(errorMessage, 'language-preference-disabled')
    })
  })

  describe('view', () => {
    it('should present the language table', async () => {
      global.enableLanguagePreference = true
      const administrator = await TestHelper.createOwner()
      await TestHelper.setLanguageActive(administrator, 'fr')
      await TestHelper.setLanguageActive(administrator, 'it')
      const req = TestHelper.createRequest('/administrator/localization')
      req.administrator = administrator.administrator
      req.session = administrator.session
      const result = await req.get()
      const doc = TestHelper.extractDoc(result.html)
      assert.strictEqual(doc.getElementById('languages-table').tag, 'table')
    })
  })
})

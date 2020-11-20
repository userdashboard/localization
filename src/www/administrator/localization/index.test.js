/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../test-helper.js')

describe('/administrator/localization', () => {
  describe('view', () => {
    it('should present the language table', async () => {
      global.enableLanguagePreference = true
      const administrator = await TestHelper.createOwner()
      await TestHelper.setLanguageActive(administrator, 'fr')
      await TestHelper.setLanguageActive(administrator, 'it')
      const req = TestHelper.createRequest('/administrator/localization')
      req.account = administrator.account
      req.session = administrator.session
      req.filename = __filename
      req.screenshots = [
        { hover: '#administrator-menu-container' },
        { click: '/administrator/localization' }
      ]
      const result = await req.get()
      const doc = TestHelper.extractDoc(result.html)
      assert.strictEqual(doc.getElementById('languages-table').tag, 'table')
    })
  })
})

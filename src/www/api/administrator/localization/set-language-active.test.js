/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../../test-helper.js')

describe('/api/administrator/localization/set-language-active', () => {
  describe('exceptions', () => {
    describe('invalid-languageid', () => {
      it('unspecified querystring languageid', async () => {
        const administrator = await TestHelper.createOwner()
        const req = TestHelper.createRequest('/api/administrator/localization/set-language-active')
        req.account = administrator.account
        req.session = administrator.session
        let errorMessage
        try {
          await req.patch()
        } catch (error) {
          errorMessage = error.message
        }
        assert.strictEqual(errorMessage, 'invalid-languageid')
      })

      it('invalid querystring languageid', async () => {
        const administrator = await TestHelper.createOwner()
        const req = TestHelper.createRequest('/api/administrator/localization/set-language-active?languageid=invalid')
        req.account = administrator.account
        req.session = administrator.session
        let errorMessage
        try {
          await req.patch()
        } catch (error) {
          errorMessage = error.message
        }
        assert.strictEqual(errorMessage, 'invalid-languageid')
      })
    })

    describe('invalid-language', () => {
      it('ineligible querystring language is already active', async () => {
        const administrator = await TestHelper.createOwner()
        await TestHelper.setLanguageActive(administrator, 'fr')
        const req = TestHelper.createRequest(`/api/administrator/localization/set-language-active?languageid=fr`)
        req.account = administrator.account
        req.session = administrator.session
        let errorMessage
        try {
          await req.patch(req)
        } catch (error) {
          errorMessage = error.message
        }
        assert.strictEqual(errorMessage, 'invalid-language')
      })
    })
  })

  describe('requires', () => {
    it('querystring languageid is already active', async () => {
      const administrator = await TestHelper.createOwner()
      await TestHelper.setLanguageActive(administrator, 'fr')
      const req = TestHelper.createRequest(`/api/administrator/localization/set-language-active?languageid=fr`)
      req.account = administrator.account
      req.session = administrator.session
      let errorMessage
      try {
        await req.patch(req)
      } catch (error) {
        errorMessage = error.message
      }
      assert.strictEqual(errorMessage, 'invalid-language')
    })
  })

  describe('returns', () => {
    it('object', async () => {
      const administrator = await TestHelper.createOwner()
      const req = TestHelper.createRequest(`/api/administrator/localization/set-language-active?languageid=fr`)
      req.account = administrator.account
      req.session = administrator.session
      req.filename = __filename
      req.saveResponse = true
      const languageNow = await req.patch()
      assert.strictEqual(languageNow.active, true)
    })
  })
})

/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../../test-helper.js')

describe('/api/user/localization/translation', () => {
  describe('exceptions', () => {
    describe('invalid-languageid', () => {
      it('unspecified querystring languageid', async () => {
        const user = await TestHelper.createUser()
        const req = TestHelper.createRequest('/api/user/localization/translation')
        req.account = user.account
        req.session = user.session
        let errorMessage
        try {
          await req.get()
        } catch (error) {
          errorMessage = error.message
        }
        assert.strictEqual(errorMessage, 'invalid-languageid')
      })

      it('invalid querystring languageid', async () => {
        const administrator = await TestHelper.createOwner()
        await TestHelper.setLanguageActive(administrator, 'it')
        const user = await TestHelper.createUser()
        const req = TestHelper.createRequest('/api/user/localization/translation?languageid=invalid')
        req.account = user.account
        req.session = user.session
        let errorMessage
        try {
          await req.get()
        } catch (error) {
          errorMessage = error.message
        }
        assert.strictEqual(errorMessage, 'invalid-languageid')
      })
    })
  })

  describe('returns', () => {
    it('object', async () => {
      const administrator = await TestHelper.createOwner()
      await TestHelper.setLanguageActive(administrator, 'it')
      const user = await TestHelper.createUser()
      const req = TestHelper.createRequest(`/api/user/localization/translation?languageid=it`)
      req.account = user.account
      req.session = user.session
      req.filename = __filename
      req.saveResponse = true
      const translation = await req.get()
      assert.notStrictEqual(translation, undefined)
      assert.notStrictEqual(translation, null)
    })
  })
})

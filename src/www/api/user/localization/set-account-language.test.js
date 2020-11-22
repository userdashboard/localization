/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../../test-helper.js')

describe('/api/user/localization/localization/set-account-language', () => {
  describe('exceptions', () => {
    describe('invalid-accountid', () => {
      it('missing querystring accountid', async () => {
        global.enableLanguagePreference = true
        const user = await TestHelper.createUser()
        const req = TestHelper.createRequest('/api/user/localization/set-account-language')
        req.account = user.account
        req.session = user.session
        req.body = {
          language: 'es'
        }
        let errorMessage
        try {
          await req.patch()
        } catch (error) {
          errorMessage = error.message
        }
        assert.strictEqual(errorMessage, 'invalid-accountid')
      })

      it('invalid querystring accountid', async () => {
        global.enableLanguagePreference = true
        const user = await TestHelper.createUser()
        const req = TestHelper.createRequest('/api/user/localization/set-account-language?accountid=invalid')
        req.account = user.account
        req.session = user.session
        req.body = {
          language: 'es'
        }
        let errorMessage
        try {
          await req.patch()
        } catch (error) {
          errorMessage = error.message
        }
        assert.strictEqual(errorMessage, 'invalid-accountid')
      })
    })

    describe('invalid-account', () => {
      it('ineligible accessing account', async () => {
        global.enableLanguagePreference = true
        const user = await TestHelper.createUser()
        const user2 = await TestHelper.createUser()
        const req = TestHelper.createRequest(`/api/user/localization/set-account-language?accountid=${user2.account.accountid}`)
        req.account = user.account
        req.session = user.session
        req.body = {
          language: 'es'
        }
        let errorMessage
        try {
          await req.patch()
        } catch (error) {
          errorMessage = error.message
        }
        assert.strictEqual(errorMessage, 'invalid-account')
      })
    })

    describe('invalid-languageid', () => {
      it('missing posted languageid', async () => {
        global.enableLanguagePreference = true
        const user = await TestHelper.createUser()
        const req = TestHelper.createRequest(`/api/user/localization/set-account-language?accountid=${user.account.accountid}`)
        req.account = user.account
        req.session = user.session
        req.body = {
          languageid: ''
        }
        let errorMessage
        try {
          await req.patch(req)
        } catch (error) {
          errorMessage = error.message
        }
        assert.strictEqual(errorMessage, 'invalid-languageid')
      })

      it('invalid posted languageid', async () => {
        global.enableLanguagePreference = true
        const user = await TestHelper.createUser()
        const req = TestHelper.createRequest(`/api/user/localization/set-account-language?accountid=${user.account.accountid}`)
        req.account = user.account
        req.session = user.session
        req.body = {
          languageid: 'invalid'
        }
        let errorMessage
        try {
          await req.patch(req)
        } catch (error) {
          errorMessage = error.message
        }
        assert.strictEqual(errorMessage, 'invalid-languageid')
      })
    })

    describe('invalid-language', () => {
      it('inactive posted languageid', async () => {
        global.enableLanguagePreference = true
        const user = await TestHelper.createUser()
        const req = TestHelper.createRequest(`/api/user/localization/set-account-language?accountid=${user.account.accountid}`)
        req.account = user.account
        req.session = user.session
        req.body = {
          languageid: 'fr'
        }
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

  describe('receives', () => {
    it('required posted languageid', async () => {
      global.enableLanguagePreference = true
      const administrator = await TestHelper.createOwner()
      await TestHelper.setLanguageActive(administrator, 'es')
      const user = await TestHelper.createUser()
      assert.strictEqual(user.account.languageid, undefined)
      const req = TestHelper.createRequest(`/api/user/localization/set-account-language?accountid=${user.account.accountid}`)
      req.account = user.account
      req.session = user.session
      req.body = {
        languageid: 'es'
      }
      req.filename = __filename
      req.saveResponse = true
      const account = await req.patch()
      assert.strictEqual(account.languageid, 'es')
    })
  })

  describe('returns', () => {
    it('object', async () => {
      global.enableLanguagePreference = true
      const administrator = await TestHelper.createOwner()
      await TestHelper.setLanguageActive(administrator, 'fr')
      const user = await TestHelper.createUser()
      const req = TestHelper.createRequest(`/api/user/localization/set-account-language?accountid=${user.account.accountid}`)
      req.account = user.account
      req.session = user.session
      req.body = {
        languageid: 'fr'
      }
      req.filename = __filename
      req.saveResponse = true
      const account = await req.patch()
      assert.strictEqual(account.object, 'account')
      assert.strictEqual(account.languageid, 'fr')
    })
  })
})

/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../test-helper.js')

describe('/account/localization', () => {
  describe('exceptions', () => {
    it('should require language enabled', async () => {
      global.enableLanguagePreference = false
      const user = await TestHelper.createUser()
      const req = TestHelper.createRequest('/account/localization')
      req.account = user.account
      req.session = user.session
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
    it('should present the form', async () => {
      global.enableLanguagePreference = true
      const administrator = await TestHelper.createOwner()
      await TestHelper.setLanguageActive(administrator, 'fr')
      await TestHelper.setLanguageActive(administrator, 'it')
      const user = await TestHelper.createUser()
      const req = TestHelper.createRequest('/account/localization')
      req.account = user.account
      req.session = user.session
      const result = await req.get()
      const doc = TestHelper.extractDoc(result.html)
      assert.strictEqual(doc.getElementById('submit-form').tag, 'form')
      assert.strictEqual(doc.getElementById('submit-button').tag, 'button')
    })
  })

  describe('submit', () => {
    it('should change the language (screenshots)', async () => {
      global.enableLanguagePreference = true
      const administrator = await TestHelper.createOwner()
      await TestHelper.setLanguageActive(administrator, 'fr')
      await TestHelper.setLanguageActive(administrator, 'it')
      const user = await TestHelper.createUser()
      const req = TestHelper.createRequest('/account/localization')
      req.account = user.account
      req.session = user.session
      req.body = {
        languageid: 'it'
      }
      req.filename = __filename
      req.screenshots = [
        { hover: '#account-menu-container' },
        { click: '/account/localization' },
        { fill: '#submit-form' }
      ]
      const result = await req.post()
      const doc = TestHelper.extractDoc(result.html)
      const messageContainer = doc.getElementById('message-container')
      const message = messageContainer.child[0]
      assert.strictEqual(message.attr.template, 'success')
    })
  })
})

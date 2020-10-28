/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../test-helper.js')

describe('/account/localization', () => {
  let languages
  before(() => {
    languages = global.languages
  })
  beforeEach(() => {
    global.languages = JSON.parse(JSON.stringify(languages))
    for (const language of global.languages) {
      if (language.languageid === 'es') {
        return
      }
    }
    global.languages.push({ object: 'language', languageid: 'es', name: 'Español' })
  })
  afterEach(() => {
    global.languages = JSON.parse(JSON.stringify(languages))
  })
  describe('exceptions', () => {
    it('should require language enabled', async () => {
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
      const languages = global.languages
      let found = false
      for (const language of languages) {
        if (language.languageid === 'es') {
          found = true
          break
        }
      }
      if (!found) {
        global.languages = JSON.parse(JSON.stringify(languages))
        global.languages.push({ object: 'language', languageid: 'es', name: 'Español' })
      }
      const user = await TestHelper.createUser()
      const req = TestHelper.createRequest('/account/localization')
      req.account = user.account
      req.session = user.session
      req.body = {
        language: 'es'
      }
      req.filename = __filename
      req.screenshots = [
        { hover: '#account-menu-container' },
        { click: '/account' },
        { click: '/account/localization' },
        { fill: '#submit-form' }
      ]
      const result = await req.post()
      const doc = TestHelper.extractDoc(result.html)
      const messageContainer = doc.getElementById('message-container')
      const message = messageContainer.child[0]
      assert.strictEqual(message.attr.template, 'success')
      global.languages = JSON.parse(JSON.stringify(languages))
    })
  })
})

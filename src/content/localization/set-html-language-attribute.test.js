/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../test-helper.js')
const SetHTMLLanguageAttribute = require('./set-html-language-attribute.js')
const dashboard = require('@userdashboard/dashboard')

describe('content/localization/set-html-language-attribute', () => {
  describe('template', () => {
    it('should not change if unspecified', async () => {
      const user = await TestHelper.createUser()
      const req = TestHelper.createRequest('/account')
      req.account = user.account
      req.session = user.session
      const response = await req.get()
      const templateDoc = dashboard.HTML.parse(response.html)
      await SetHTMLLanguageAttribute.template(req, {}, templateDoc)
      assert.strictEqual(templateDoc.toString().indexOf('html lang="en"') > -1, true)
    })

    it('should match global language setting', async () => {
      global.language = 'fr'
      const user = await TestHelper.createUser()
      const req = TestHelper.createRequest('/account')
      req.account = user.account
      req.session = user.session
      const response = await req.get()
      const templateDoc = dashboard.HTML.parse(response.html)
      await SetHTMLLanguageAttribute.template(req, {}, templateDoc)
      assert.strictEqual(templateDoc.toString().indexOf('html lang="fr"') > -1, true)
    })

    it('should match user language setting', async () => {
      global.enableLanguagePreference = true
      const administrator = await TestHelper.createOwner()
      await TestHelper.setLanguageActive(administrator, 'fr')
      const user = await TestHelper.createUser()
      await TestHelper.setUserLanguage(user, 'fr')
      const req = TestHelper.createRequest('/account')
      req.account = user.account
      req.session = user.session
      const response = await req.get()
      const templateDoc = dashboard.HTML.parse(response.html)
      await SetHTMLLanguageAttribute.template(req, {}, templateDoc)
      assert.strictEqual(templateDoc.toString().indexOf('html lang="fr"') > -1, true)
    })

    it('should match request language setting', async () => {
      global.enableLanguagePreference = true
      const administrator = await TestHelper.createOwner()
      await TestHelper.setLanguageActive(administrator, 'fr')
      await TestHelper.setLanguageActive(administrator, 'it')
      const user = await TestHelper.createUser()
      await TestHelper.setUserLanguage(user, 'fr')
      const req = TestHelper.createRequest('/account')
      req.account = user.account
      req.session = user.session
      req.language = 'it'
      const response = await req.get()
      const templateDoc = dashboard.HTML.parse(response.html)
      await SetHTMLLanguageAttribute.template(req, {}, templateDoc)
      assert.strictEqual(templateDoc.toString().indexOf('html lang="it"') > -1, true)
    })
  })

  describe('page', () => {
    it('should not change if unspecified', async () => {
      const user = await TestHelper.createUser()
      const req = TestHelper.createRequest('/account')
      req.account = user.account
      req.session = user.session
      const response = await req.get()
      const pageDoc = TestHelper.extractDoc(response.html)
      await SetHTMLLanguageAttribute.page(req, {}, pageDoc)
      assert.strictEqual(pageDoc.toString().indexOf('html lang="en"') > -1, true)
    })

    it('should match global language setting', async () => {
      global.language = 'fr'
      const user = await TestHelper.createUser()
      const req = TestHelper.createRequest('/account')
      req.account = user.account
      req.session = user.session
      const response = await req.get()
      const pageDoc = TestHelper.extractDoc(response.html)
      await SetHTMLLanguageAttribute.page(req, {}, pageDoc)
      assert.strictEqual(pageDoc.toString().indexOf('html lang="fr"') > -1, true)
    })

    it('should match user language setting', async () => {
      global.enableLanguagePreference = true
      const administrator = await TestHelper.createOwner()
      await TestHelper.setLanguageActive(administrator, 'fr')
      const user = await TestHelper.createUser()
      await TestHelper.setUserLanguage(user, 'fr')
      const req = TestHelper.createRequest('/account')
      req.account = user.account
      req.session = user.session
      const response = await req.get()
      const pageDoc = TestHelper.extractDoc(response.html)
      await SetHTMLLanguageAttribute.page(req, {}, pageDoc)
      assert.strictEqual(pageDoc.toString().indexOf('html lang="fr"') > -1, true)
    })

    it('should match request language setting', async () => {
      global.enableLanguagePreference = true
      const administrator = await TestHelper.createOwner()
      await TestHelper.setLanguageActive(administrator, 'fr')
      await TestHelper.setLanguageActive(administrator, 'it')
      const user = await TestHelper.createUser()
      await TestHelper.setUserLanguage(user, 'fr')
      const req = TestHelper.createRequest('/account')
      req.account = user.account
      req.session = user.session
      req.language = 'it'
      const response = await req.get()
      const pageDoc = TestHelper.extractDoc(response.html)
      await SetHTMLLanguageAttribute.page(req, {}, pageDoc)
      assert.strictEqual(pageDoc.toString().indexOf('html lang="it"') > -1, true)
    })
  })
})

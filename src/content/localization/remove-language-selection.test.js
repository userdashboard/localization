/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../test-helper.js')
const RemoveLanguageSelection = require('./remove-language-selection.js')
const dashboard = require('@userdashboard/dashboard')

describe('content/localization/remove-language-selection', () => {
  describe('template', () => {
    it('should remove language option by default', async () => {
      delete (global.enableLanguagePreference)
      const user = await TestHelper.createUser()
      const req = TestHelper.createRequest('/account')
      req.account = user.account
      req.session = user.session
      const response = await req.get()
      const templateDoc = dashboard.HTML.parse(response.html)
      await RemoveLanguageSelection.template(req, {}, templateDoc)
      assert.strictEqual(templateDoc.toString().indexOf('/account/localization'), -1)
    })

    it('should remove language option if disallowed', async () => {
      global.enableLanguagePreference = false
      const user = await TestHelper.createUser()
      const req = TestHelper.createRequest('/account')
      req.account = user.account
      req.session = user.session
      const response = await req.get()
      const templateDoc = dashboard.HTML.parse(response.html)
      await RemoveLanguageSelection.template(req, {}, templateDoc)
      assert.strictEqual(templateDoc.toString().indexOf('/account/localization'), -1)
    })

    it('should present language option', async () => {
      global.enableLanguagePreference = true
      const user = await TestHelper.createUser()
      const req = TestHelper.createRequest('/account')
      req.account = user.account
      req.session = user.session
      const response = await req.get()
      const templateDoc = dashboard.HTML.parse(response.html)
      await RemoveLanguageSelection.template(req, {}, templateDoc)
      assert.strictEqual(templateDoc.toString().indexOf('/account/localization') > -1, true)
    })
  })
})

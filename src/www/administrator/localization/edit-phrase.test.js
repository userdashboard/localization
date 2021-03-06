/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../test-helper.js')

describe('/administrator/localization/edit-phrase', () => {
  describe('before', () => {
    it('should bind data to req', async () => {
      const administrator = await TestHelper.createOwner()
      const req = TestHelper.createRequest('/administrator/localization/edit-phrase?languageid=fr&text=Account')
      req.account = administrator.account
      req.session = administrator.session
      await req.route.api.before(req)
      assert.strictEqual(req.data.language.languageid, 'fr')
    })
  })

  describe('view', () => {
    it('should present the form', async () => {
      const administrator = await TestHelper.createOwner()
      const req = TestHelper.createRequest('/administrator/localization/edit-phrase?languageid=fr&text=Account')
      req.account = administrator.account
      req.session = administrator.session
      const result = await req.get()
      const doc = TestHelper.extractDoc(result.html)
      assert.strictEqual(doc.getElementById('submit-form').tag, 'form')
      assert.strictEqual(doc.getElementById('submit-button').tag, 'button')
    })
  })

  describe('submit', () => {
    it('should create phrase corrections (screenshots)', async () => {
      const administrator = await TestHelper.createOwner()
      const req = TestHelper.createRequest('/administrator/localization/edit-phrase?languageid=fr&text=Account')
      req.account = administrator.account
      req.session = administrator.session
      req.filename = __filename
      req.body = {
        correction: 'test',
        'instance-1': true,
        'instance-2': false
      }
      req.screenshots = [
        { hover: '#administrator-menu-container' },
        { click: '/administrator/localization' },
        { click: '/administrator/localization/language?languageid=fr' },
        { click: '/administrator/localization/edit-phrase?text=Account&languageid=fr' },
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

/* eslint-env mocha */
const assert = require('assert')
const properties = [
  { camelCase: 'language', raw: 'LANGUAGE', description: 'Default language', value: 'fr', default: 'en', valueDescription: 'String' },
  { camelCase: 'enableLanguagePreference', raw: 'ENABLE_LANGUAGE_PREFERENCE', description: 'Enable user language selection', value: 'true', noDefaultValue: true, valueDescription: 'Boolean' }
]

describe('index', () => {
  afterEach(() => {
    delete (require.cache[require.resolve('./index.js')])
    require('./index.js').setup(global.applicationPath)
  })
  after(() => {
    delete (require.cache[require.resolve('./index.js')])
    require('./index.js').setup(global.applicationPath)
  })
  for (const property of properties) {
    describe(property.raw, () => {
      describe(property.description, () => {
        if (!property.noDefaultValue) {
          it('default ' + (property.default || property.defaultDescription || 'unset'), async () => {
            delete (process.env[property.raw])
            delete (require.cache[require.resolve('./index.js')])
            require('./index.js')
            delete (require.cache[require.resolve('./index.js')])
            assert.strictEqual((global[property.camelCase] || '').toString().trim(), property.default.toString())
          })
        }
        it(property.valueDescription, async () => {
          process.env[property.raw] = property.value
          delete (require.cache[require.resolve('./index.js')])
          global.subscriptionWebhookEndPointSecret = false
          require('./index.js')
          delete (require.cache[require.resolve('./index.js')])
          assert.strictEqual(global[property.camelCase].toString(), property.value)
        })
      })
      delete (require.cache[require.resolve('./index.js')])
      require('./index.js').setup(global.applicationPath)
    })
  }
})

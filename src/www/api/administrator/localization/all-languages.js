const localization = require('../../../../../index.js')

let cached
module.exports = {
  get: async (req) => {
    cached = cached || JSON.stringify(localization.languageList)
    return JSON.parse(cached)
  }
}

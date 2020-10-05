const localization = require('../../../../../index.js')

let cached
module.exports = {
  get: async (req) => {
    cached = cached || JSON.stringify(localization.languages)
    return JSON.parse(cached)
  }
}

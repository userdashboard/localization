let cached
module.exports = {
  get: async (req) => {
    cached = cached || JSON.stringify(global.languageList)
    return JSON.parse(cached)
  }
}

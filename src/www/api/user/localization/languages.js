let cached
module.exports = {
  get: async (req) => {
    cached = cached || JSON.stringify(global.languages)
    return JSON.parse(cached)
  }
}

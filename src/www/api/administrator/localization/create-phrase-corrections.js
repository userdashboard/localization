const localization = require('../../../../../index.js')

module.exports = {
  post: async (req) => {
    if (!req.query || !req.query.languageid) {
      throw new Error('invalid-languageid')
    }
    if (!req.query.text) {
      throw new Error('invalid-text')
    }
    const translation = await global.api.administrator.localization.Translation.get(req)
    let phrase
    for (const text in translation) {
      if (text !== req.query.text) {
        continue
      }
      phrase = translation[text]
      break
    }
    if (!phrase) {
      throw new Error('invalid-text')
    }
    const corrections = {
      [req.query.text]: []
    }
    let i = 0
    while (true) {
      if (i === phrase.html.length) {
        break
      }
      const existingValue = phrase.corrections ? phrase.corrections[i] : undefined
      const correction = req.body[`instance-${i}`] ? req.body.correction : existingValue
      corrections[req.query.text][i] = correction || ''
      i++
    }
    console.log('writing corrections', corrections, phrase)
    const object = await localization.Storage.write(`corrections/${req.query.languageid}`, corrections)
    console.log('the object', object)
    return object
  }
}

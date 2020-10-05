const fs = require('fs')
const locale = process.argv[2]
const path = require('path')
const translationFilePath = path.join(__dirname, `translations-cache-${locale}.json`)

module.exports = async (original, translation) => {
  const translatedPhrases = Object.keys(translation)
  for (const phrase of translatedPhrases) {
    let found = false
    for (const object of original) {
      found = object.text === phrase
      if (found) {
        break
      }
    }
    if (!found) {
      console.log('remove unused phrase', phrase)
      delete (translation[phrase])
    }
  }
  fs.writeFileSync(translationFilePath, JSON.stringify(translation, null, '  '))
}

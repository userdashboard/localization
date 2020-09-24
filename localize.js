(async () => {
  const createTextManifest = require('./create-text-manifest.js')
  const original = await createTextManifest()
  const translateText = require('./translate-text.js')
  console.log('translating', process.argv[2], process.argv[3])

  let translation
  while (!translation) {
    try {
      translation = await translateText(original)
    } catch (error) {
      console.log(error)
    }
    if (!translation) {
      console.log('no translation')
      return process.exit()
    }
  }
  try {
    const applyTranslation = require('./apply-translation.js')
    applyTranslation(translation)
  } catch (error) {
    return process.exit()
  }
})()

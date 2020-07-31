(async () => {
  const createTextManifest = require('./create-text-manifest.js')
  const original = await createTextManifest()
  const translateText = require('./translate-text.js')
  console.log('translating', process.argv[2])
  let translation
  while (!translation) {
    try {
      translation = await translateText(original)
    } catch (error) {
    }
    if (!translation) {
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

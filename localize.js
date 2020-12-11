(async () => {
  const createTextManifest = require('./create-text-manifest.js')
  const cleanTranslationCache = require('./clean-translation-cache.js')
  const translateText = require('./translate-text.js')
  const original = await createTextManifest()
  let translation
  while (!translation) {
    try {
      translation = await translateText(original)
    } catch (error) {
      console.log('an error ocurred', error)
    }
  }
  try {
    await cleanTranslationCache(original, translation)
  } catch (error) {
    console.log('error cleaning cache', error)
  }
})()

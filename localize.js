(async () => {
  const createTextManifest = require('./create-text-manifest.js')
  const cleanTranslationCache = require('./clean-translation-cache.js')
  const translateText = require('./translate-text.js')
  console.log('translating', process.argv[2])
  console.log('extracting text')
  const original = await createTextManifest()
  let translation
  while (!translation) {
    try {
      console.log('translating text')
      translation = await translateText(original)
    } catch (error) {
      console.log('an error ocurred', error)
    }
  }
  try {
    console.log('cleaning cache')
    await cleanTranslationCache(original, translation)
  } catch (error) {
    console.log('error cleaning cache', error)
  }
})()

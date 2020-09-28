const childProcess = require('child_process')
const fs = require('fs')
const locale = process.argv[2]
const path = require('path')
const translationFilePath = path.join(__dirname, `translations-cache-${locale}.json`)

module.exports = async (translation) => {
  console.log('translating', Object.keys(translation))
  const htmlCache = {}
  for (const phrase in translation) {
    for (const i in translation[phrase].file) {
      const file = translation[phrase].file[i]
      const module = translation[phrase].module[i]
      const languageSubstitutedPath = file.replace('/src/', `/languages/${locale}/`)
      const languageSubstitutedFile = path.join(process.argv[3], module, languageSubstitutedPath)
      const originalFilePath = path.join(process.argv[3], module, file)
      htmlCache[languageSubstitutedFile] = htmlCache[languageSubstitutedFile] || fs.readFileSync(originalFilePath).toString()
    }
  }
  for (const phrase in translation) {
    for (const i in translation[phrase].file) {
      const file = translation[phrase].file[i]
      const oldHTML = translation[phrase].html[i]
      const module = translation[phrase].module[i]
      let newText = translation[phrase].translation
      if (!newText || newText === phrase) {
        continue
      }
      const newHTML = oldHTML.replace(phrase, newText)
      if (newHTML === oldHTML) {
        continue
      }      
      const languageSubstitutedPath = file.replace('/src/', `/languages/${locale}/`)
      const languageSubstitutedFile = path.join(process.argv[3], module, languageSubstitutedPath)
      let rawHTML = htmlCache[languageSubstitutedFile]
      // direct match on the tag
      if (rawHTML.indexOf(oldHTML) > -1) {
        rawHTML = rawHTML.replace(oldHTML, newHTML)
      } else if (rawHTML.indexOf(` translate="yes">${phrase}<`) > -1) {
        //  translate="yes">the text<
        rawHTML = rawHTML.split(` translate="yes">${phrase}<`).join(` translate="yes">${newText}<`)
      } else if (rawHTML.indexOf(` translate="yes">${phrase} $`) > -1) {
        //  translate="yes">the text ${variable}
        rawHTML = rawHTML.split(` translate="yes">${phrase} $`).join(` translate="yes">${newText} $`)
      } else if (rawHTML.indexOf(phrase) > -1) {
        rawHTML = rawHTML.replace(`${phrase}\n`, `${newText}\n`)
      }
      htmlCache[languageSubstitutedFile] = rawHTML
    }
  }
  for (const filePath in htmlCache) {
    const folderPath = filePath.substring(0, filePath.lastIndexOf('/'))
    childProcess.execSync(`mkdir -p ${folderPath}`)
    fs.writeFileSync(filePath, htmlCache[filePath])
  }
}
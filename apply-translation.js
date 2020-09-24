const childProcess = require('child_process')
const fs = require('fs')
const locale = process.argv[2]
const path = require('path')

module.exports = async (translation) => {
  const htmlCache = {}
  const remainders = []
  for (const phrase in translation) {
    for (const i in translation[phrase].file) {
      const file = translation[phrase].file[i]
      const oldTag = translation[phrase].html[i]
      let newText = translation[phrase].translation
      if (!newText) {
        newText = phrase
      }
      if (!newText) {
        continue
      }
      const newTag = oldTag.replace(phrase, newText)
      if (newTag === oldTag) {
        console.log('huh tags are the same', locale, newTag)
        continue
      }
      const filePath = path.join(process.argv[3], file)
      if (!htmlCache[file] && !fs.existsSync(filePath)) {
        continue
      }
      let rawHTML = htmlCache[file] = htmlCache[file] || fs.readFileSync(filePath).toString()
      // direct match on the tag
      if (rawHTML.indexOf(oldTag) > -1) {
        rawHTML = rawHTML.replace(oldTag, newTag)
      } else if (rawHTML.indexOf(` translate="yes">${phrase}<`) > -1) {
        //  translate="yes">the text<
        rawHTML = rawHTML.split(` translate="yes">${phrase}<`).join(` translate="yes">${newText}<`)
      } else if (rawHTML.indexOf(` translate="yes">${phrase} $`) > -1) {
        //  translate="yes">the text ${variable}
        rawHTML = rawHTML.split(` translate="yes">${phrase} $`).join(` translate="yes">${newText} $`)
      } else {
        remainders.push(phrase)
        continue
      }
      htmlCache[file] = rawHTML
    }
  }
  for (const phrase of remainders) {
    for (const i in translation[phrase].file) {
      const file = translation[phrase].file[i]
      const newText = translation[phrase].translation
      if (!newText) {
        continue
      }
      const filePath = path.join(process.argv[3], file)
      if (!fs.existsSync(filePath)) {
        continue
      }
      let rawHTML = htmlCache[file] = htmlCache[file] || fs.readFileSync(filePath).toString()
      rawHTML = rawHTML.split(phrase).join(newText)
      htmlCache[file] = rawHTML
    }
  }
  for (const file in htmlCache) {
    const rawHTML = htmlCache[file]
    const newFile = file.replace('/src/', `/languages/${locale}/`)
    const fullNewFile = path.join(process.argv[3], newFile)
    const newFilePath = newFile.substring(0, newFile.lastIndexOf('/'))
    const fullNewFilePath = path.join(process.argv[3], newFilePath)
    childProcess.execSync(`mkdir -p ${fullNewFilePath}`)
    childProcess.execSync(`mkdir -p ${fullNewFilePath}`)
    fs.writeFileSync(fullNewFile, rawHTML)
  }
}

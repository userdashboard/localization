const childProcess = require('child_process')
const fs = require('fs')
const locale = process.argv[2]
const path = require('path')
const util = require('util')
const cacheFile = path.join(__dirname, `translations-cache-${locale}.json`)
let translations
if (fs.existsSync(cacheFile)) {
  translations = JSON.parse(fs.readFileSync(cacheFile).toString())
} else {
  translations = {}
}
module.exports = async (original) => {
  for (const data of original) {
    if (!translations[data.text]) {
      translations[data.text] = data
    } else {
      translations[data.text].file = data.file
      translations[data.text].html = data.html
      translations[data.text].module = data.module
    }
  }
  const lines = []
  for (const phrase in translations) {
    const data = translations[phrase]
    if (!data.translation) {
      lines.push(data.text)
    }
  }
  if (!lines.length) {
    fs.writeFileSync(`./translations-cache-${locale}.json`, JSON.stringify(translations, null, '  '))
    return translations
  }
  let retries1 = 0
  let retries2 = 0
  while (true) {
    if (!lines.length) {
      break
    }
    const chunk = []
    const originals = []
    const line = lines.pop()
    let formatted = line
    if (formatted.indexOf('Stripe') > -1) {
      formatted = formatted.split('Stripe').join('S_T_R_I_P_E')
    }
    if (formatted.indexOf('Connect') > -1) {
      formatted = formatted.split('Connect').join('C_O_N_N_E_C_T')
    }
    chunk.push(formatted)
    originals.push(line)
    const stdout = await fetch(locale, chunk)
    if (!stdout || !stdout.length) {
      retries1++
      if (retries1 === 20) {
        fs.writeFileSync(`./translations-cache-${locale}.json`, JSON.stringify(translations, null, '  '))
        return translations
      }
      await wait()
      continue
    } else {
      retries1 = 0
    }
    console.log('fetching', locale, lines.length)
    const returnedLines = stdout.split('\\n')
    if (returnedLines.length !== chunk.length) {
      retries2++
      if (retries2 === 20) {
        fs.writeFileSync(`./translations-cache-${locale}.json`, JSON.stringify(translations, null, '  '))
        return translations
      }
      await wait()
      continue
    } else {
      retries2 = 0
    }
    for (const i in chunk) {
      const translatedLine = returnedLines[i]
      if (!translatedLine) {
        continue
      }
      let formatted = translatedLine
      if (formatted.indexOf('S_T_R_I_P_E') > -1) {
        formatted = formatted.split('S_T_R_I_P_E').join('Stripe')
      }
      if (formatted.indexOf('C_O_N_N_E_C_T') > -1) {
        formatted = formatted.split('C_O_N_N_E_C_T').join('Connect')
      }
      translations[originals[i]].translation = formatted
    }
    if (!lines.length) {
      break
    }
    await wait()
  }
  fs.writeFileSync(`./translations-cache-${locale}.json`, JSON.stringify(translations, null, '  '))
  return translations
}

const fetch = util.promisify((locale, chunk, callback) => {
  return childProcess.exec(`trans -brief -e google :${locale} "${chunk.join('\n')}"`, (error, stdout) => {
    if (error) {
      return callback()
    }
    if (!stdout || !stdout.length) {
      return callback()
    }
    return callback(null, stdout.toString().trim())
  })
})

const wait = util.promisify((callback) => {
  return setTimeout(callback, 5000)
})

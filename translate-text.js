const childProcess = require('child_process')
const fs = require('fs')
const locale = process.argv[2]
const util = require('util')
let translations
if (fs.existsSync(`./translations-cache-${locale}.json`)) {
  translations = require(`./translations-cache-${locale}.json`)
} else {
  translations = {}
}

module.exports = async (original) => {
  const lines = []
  for (const data of original) {
    if (translations[data.text] && translations[data.text].translation) {
      continue
    }
    if (!data.text.length) {
      throw new Error('what is this data ' + JSON.stringify(data))
    }
    lines.push(data.text)
    translations[data.text] = data
  }
  if (!lines.length) {
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
    console.log('translating', locale, lines.length, chunk)
    const stdout = await fetch(locale, chunk)
    if (!stdout || !stdout.length) {
      retries1++
      if (retries1 === 20) {
        console.log('abandoning', locale)
        fs.writeFileSync(`./translations-cache-${locale}.json`, JSON.stringify(translations, null, '  '))
        return process.exit()
      }
      await wait()
      continue
    } else {
      retries1 = 0
    }
    const returnedLines = stdout.split('\\n')
    if (returnedLines.length !== chunk.length) {
      console.log('lines don\'t match', chunk.length + 'vs' + returnedLines.length, 'retries', retries2)
      retries2++
      if (retries2 === 20) {
        console.log('too many retries', chunk, 'returned', returnedLines)
        fs.writeFileSync(`./translations-cache-${locale}.json`, JSON.stringify(translations, null, '  '))
        return process.exit()
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
    console.log('trans result', error, locale, stdout, chunk)
    if (error) {
      console.log(error)
      return callback()
    }
    if (!stdout || !stdout.length) {
      return callback()
    }
    return callback(null, stdout.toString().trim())
  })
})

const wait = util.promisify((callback) => {
  console.log('waiting...')
  return setTimeout(callback, 20000)
})

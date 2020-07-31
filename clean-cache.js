const fs = require('fs')
const locale = process.argv[2]
const oldPath = process.argv[3]
const newPath = process.argv[4]

const cache = require(`./translations-cache-${locale}.json`)
for (const phrase in cache) {
  const cacheData = cache[phrase]
  const splicing = []
  for (const i in cacheData.file) {
    let file = cacheData.file[i]
    if (file.startsWith(oldPath)) {
      file = newPath + file.substring(oldPath.length)
      cacheData.file[i] = file
    } else {
      splicing.push(i)
    }
  }
  splicing.reverse()
  for (const i of splicing) {
    cacheData.file.splice(i, 1)
    cacheData.html.splice(i, 1)
  }
}
fs.writeFileSync(`./translations-cache-${locale}.json`, JSON.stringify(cache, null, '  '))

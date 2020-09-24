const fs = require('fs')
const path = require('path')
const locale = process.argv[2]
const newPath = process.argv[3]
const cacheFile = path.join(__dirname, `translations-cache-${locale}.json`)
let cache
if (fs.existsSync(cacheFile)) {
  cache = JSON.parse(fs.readFileSync(cacheFile).toString())
} else {
  cache = {}
}

for (const phrase in cache) {
  const cacheData = cache[phrase]
  for (const i in cacheData.file) {
    let file = cacheData.file[i]
    const srcIndex = file.indexOf('/src')
    if (srcIndex > -1) {
      file = file.substring(srcIndex)
      cacheData.file[i] = file
    } 
  }
}
fs.writeFileSync(`./translations-cache-${locale}.json`, JSON.stringify(cache, null, '  '))

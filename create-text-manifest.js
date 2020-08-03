const childProcess = require('child_process')
const fs = require('fs')
const dashboardPath = process.argv[3] || './project'
let HTML
const htmlPath1 = childProcess.execSync('find /tmp/project -type f -name html.js')
if (fs.existsSync(htmlPath1)) {
  HTML = require(htmlPath1)
} else {
  const htmlPath2 = childProcess.execSync('find ~/ -name -type f html.js')
  HTML = require(htmlPath2)
}
const util = require('util')
const translatingTags = []
const translatingTagsIndex = {}

const scanFiles = util.promisify((callback) => {
  let files = []
  if (process.argv[3]) {
    const stdout = childProcess.execSync(`find ${dashboardPath}/src -type f -name "*.html"`)
    files = files.concat(stdout.toString().split('\n'))
  } else {
    for (const project of ['dashboard', 'organizations', 'stripe-subscriptions', 'stripe-connect']) {
      const stdout = childProcess.execSync(`find ${dashboardPath}/${project}/src -type f -name "*.html"`)
      files = files.concat(stdout.toString().split('\n'))
    }
  }
  return callback(null, files)
})

function scanElement (element, file, addedHTMLTags) {
  if (element && element.attr && element.attr.translate === 'yes') {
    let text
    if (element.child && element.child.length) {
      for (const child of element.child) {
        if (child.text) {
          text = child.text.trim()
        }
      }
    }
    if (text.indexOf('${') > -1) {
      text = text.substring(0, text.indexOf('${'))
    }
    if (text.endsWith('\\n')) {
      text = text.substring(0, text.length - 2)
    }
    text = text.trim()
    if (translatingTagsIndex[text]) {
      translatingTagsIndex[text].file.push(file)
      translatingTagsIndex[text].html.push(element.toString())
    } else {
      translatingTagsIndex[text] = {
        file: [file],
        html: [element.toString()],
        text,
        addedHTMLTags
      }
      translatingTags.push(translatingTagsIndex[text])
    }
  }
  if (!element || !element.child || !element.child.length) {
    return
  }
  for (const child of element.child) {
    scanElement(child, file, addedHTMLTags)
  }
}

module.exports = async () => {
  const files = await scanFiles()
  for (const filePath of files) {
    if (!filePath.endsWith('.html')) {
      continue
    }
    let rawHTML = fs.readFileSync(filePath).toString()
    if (!rawHTML || !rawHTML.length) {
      continue
    }
    let addedHTMLTags = false
    if (rawHTML.indexOf('<html') === -1) {
      rawHTML = `<html>${rawHTML}</html>`
      addedHTMLTags = true
    }
    const doc = HTML.parse(rawHTML)
    scanElement(doc, filePath)
    const templates = doc.getElementsByTagName('template')
    if (templates && templates.length) {
      for (const template of templates) {
        scanElement(template.child, filePath, addedHTMLTags)
      }
    }
  }
  fs.writeFileSync('./text-manifest.json', JSON.stringify(translatingTags, null, '  '))
  return translatingTags
}

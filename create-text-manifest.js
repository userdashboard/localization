const childProcess = require('child_process')
const path = require('path')
const fs = require('fs')
const HTML = require('./project/dashboard/node_modules/server-html/index.js')
const util = require('util')
const translatingTags = []
const translatingTagsIndex = {}

const scanFiles = util.promisify((callback) => {
  let files = []
  for (const project of ['dashboard', 'organizations', 'stripe-subscriptions', 'stripe-connect']) {
    const stdout = childProcess.execSync(`find ./project/${project}/src -type f -name "*.html"`)
    files = files.concat(stdout.toString().split('\n'))
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
  for (const file of files) {
    if (!file.endsWith('.html')) {
      continue
    }
    const filePath = path.join(__dirname, file)
    let rawHTML = fs.readFileSync(filePath).toString()
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
